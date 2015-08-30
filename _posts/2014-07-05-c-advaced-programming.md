---
layout:     post
title:      C语言高级编程指南
keywords:   C
categories: [c, programming]
tags:	    [c, programming]
---


**整形溢出和提升**

大部分 C 程序员都以为基本的整形操作都是安全的其实不然,看下面这个例子,
你觉得输出结果是什么:

    int main(int argc, char** argv) {
        long i = -1;
    
        if (i < sizeof(i)) {
             printf("OK\n");
        }
        else {
             printf("error\n");
        }
    
        return 0;
    }
当一个变量转换成无符号整形时,i的值不再是-1,而是 size_t的最大值,因
为sizeof操作返回的是一个 size_t类型的无符号数。
在C99/C11标准里写道:

> "If the operand that has unsigned integer type has rank greater or
> equal to the rank of the type of the other operand, then the operand
> with signed integer type is converted to the type of the operand with
> unsigned integer type."

在C标准里面 size_t至少是一个 16 位的无符号整数,对于给定的架构 size_t 一般对应long,所以sizeof（int）和size_t至少相等,这就带来了可移植性的问题,C标准没有定义 short, int,long,longlong的大小,只是说明了他们的最小长度,对于 x86_64 架构,long在Linux下是64位,而在64位Windows下是32位。一般的方法是采用固定长度的类型比如定义在C99头文件stdint.h中的uint16_t,int32_t,uint_least16_t,uint_fast16_t等。


如果 int可以表示原始类型的所有值,那么这个操作数会转换成 int,否则
他会转换成 unsigned int。下面这个函数在 32 位平台返回 65536,但是在 16 位系统返回 0。

    uint32_t sum()
    {
        uint16_t a = 65535;
        uint16_t b = 1;
        return a+b;
    }

对于char 类型到底是 signed 还是 unsigned 取决于硬件架构和操作系统,通常
由特定平台的 ABI(Application Binary Interface) 指定,如果是 signed char,下面的代码输出-128 和-127,否则输出 128,129(x86 架构)。

    char c = 128;
    char d = 129;
    printf("%d,%d\n",c,d);


----------
##内存管理和分配

malloc 函数分配制定字节大小的内存,对象未被初始化,如果 size 是 0 取
决与系统实现。malloc(0)返回一个空指针或者 unique pointer,如果 size 是表达式的运算结果,确保没有整形溢出。

> “If the size of the space requested is 0, the behavior is
> implementation- defined: the value returned shall be either a null
> pointer or a unique pointer.”

    size_t computed_size;
    
    if (elem_size && num > SIZE_MAX / elem_size) {
        errno = ENOMEM;
        err(1, "overflow");
    }
    
    computed_size = elem_size*num;
    
malloc不会给分配的内存初始化，如果要对新分配的内存初始化，可以用calloc代替malloc,一般情况下给序列分配相等大小的元素时,用calloc来代替用表达式计算大小,calloc 会把内存初始化为 0。

realloc 用来对已经分配内存的对象改变大小,如果新的 size 更大,额外的空间
没 有 被 初 始 化 , 如 果 提 供 给 realloc 的 指 针 是 空 指 针 , realloc 就 等 效 于malloc,如果原指针非空而 new size是0,结果依赖于操作系统的具体实现。

> “In case of failure realloc shall return NULL and leave provided memory
> object intact. Thus it is important not only to check for integer
> overflow of size argument, but also to correctly handle object size if
> realloc fails.”

下面这段代码可以带你领会malloc,calloc，realloc,free的用法：

    #include <stdio.h>
    #include <stdint.h>
    #include <malloc.h>
    #include <errno.h>
    
    #define VECTOR_OK            0
    #define VECTOR_NULL_ERROR    1
    #define VECTOR_SIZE_ERROR    2
    #define VECTOR_ALLOC_ERROR   3
    
    struct vector {
        int *data;
        size_t size;
    };
    
    int create_vector(struct vector *vc, size_t num) {
    
        if (vc == NULL) {
            return VECTOR_NULL_ERROR;
        }
    
        vc->data = 0;
        vc->size = 0;
    
        /* check for integer and SIZE_MAX overflow */
        if (num == 0 || SIZE_MAX / num < sizeof(int)) {
            errno = ENOMEM;
            return VECTOR_SIZE_ERROR;
        }
    
        vc->data = calloc(num, sizeof(int));
    
        /* calloc faild */
        if (vc->data == NULL) {
            return VECTOR_ALLOC_ERROR;
        }
    
        vc->size = num * sizeof(int);
        return VECTOR_OK;
    }
    
    int grow_vector(struct vector *vc) {
    
        void *newptr = 0;
        size_t newsize;
    
        if (vc == NULL) {
            return VECTOR_NULL_ERROR;
        }
    
    
        /* check for integer and SIZE_MAX overflow */
        if (vc->size == 0 || SIZE_MAX / 2 < vc->size) {
            errno = ENOMEM;
            return VECTOR_SIZE_ERROR;
        }
    
        newsize = vc->size * 2;
    
        newptr = realloc(vc->data, newsize);
    
        /* realloc faild; vector stays intact size was not changed */
        if (newptr == NULL) {
            return VECTOR_ALLOC_ERROR;
        }
    
        /* upon success; update new address and size */
        vc->data = newptr;
        vc->size = newsize;
        return VECTOR_OK;
    }


----------

##避免重大错误


 1. 使用未初始化的变量，
 C语言要求所有变量在使用之前要初始化，使用未初始化的变量会造成为定义的行为，这和C++不同，C++保证所有变量在使用之前都得到初始化，Java**尽量保证**变量使用前的得到初始化，如类基本数据成员会被初始化为默认值。
  
 2. free错误
对空指针调用 free,对不是由 malloc family 函数分配的指针调用 free,或者对
已经调用 free 的指针再次调用 free。
一开始初始化指针为NULL可以减少错误,GCC和Clang编译器有-Wuninitialized 选项来对未初始化的变量显示警告信息,另外不要将同一个指针用于静态变量和动态变量。


>     char *ptr = NULL;
>     void nullfree(void **pptr) {
>         void *ptr = *pptr;
>         assert(ptr != NULL)
>         free(ptr);
>         *pptr = NULL;
>     }

3.对空指针解引用，数组越界访问

对NULL指针或者free'd内存解引用，数组越界访问，是很明显的错误，为了消除这种错误，一般的做法就是增加数组越界检查的功能，比如Java里的array就有下标检查的功能，但是这样会带来严重的性能代价，我们要修改ABI（application binary interface），让每个指针都跟随着它的范围信息，在数值计算中cost is terrible。

4.违反类型规则

把int×指针cast成float×，然后对它解引用，在C里面会引发undefined behavior，C规定这种类型的转换需要使用memset，C++里面有个reinterpret_cast函数用于无关类型之间的转换，reinterpret_cast <new_type> (expression)


----------

##防止内存泄漏

内存泄漏发生在程序不再使用的动态内存没有得到释放，这需要我们掌握动态分配对象的作用域，尤其是什么时候该调用free来释放内存，常用的集中方法如下：

 1. 在程序启动的时候分配
 在程序启动的时候分配需要的heap memory，程序退出时把释放的任务交给操作系统，这种方法一般适用于程序运行后马上退出的那种。

 2. 使用变长数组（VLA）
 如果你需要一块变长大小的空间并且作用域在函数中，变长数组可以帮到你，但是也有一个限制，一个函数中的变长数组内存大小一般不超过几百字节，这个数字C标准没有明确的定义，最好是把内存分配到栈上，在栈上允许分配的最大VLA内存是SIZE_MAX，掌握目标平台的栈大小可以有效的防止栈溢出。

 3. 使用引用计数
 引用计数是一个很好的管理内存的方法，特别是当你不希望自己定义的对象被复制时，每一次赋值把引用计数加1,每次失去引用就把引用计数减1,当引用计数等于0时，以为的对象已经不再需要了，我们需要释放对象占用的内存，由于C不提供自动的析构函数，我们必须手动释放内存，看一个例子：

        #include <stdlib.h>
        #include <stdint.h>
        
        #define MAX_REF_OBJ 100
        #define RC_ERROR -1
        
        struct mem_obj_t{
            void *ptr;
            uint16_t count;
        };
        
        static struct mem_obj_t references[MAX_REF_OBJ];
        static uint16_t reference_count = 0;
        
        /* create memory object and return handle */
        uint16_t create(size_t size){
        
            if (reference_count >= MAX_REF_OBJ)
                return RC_ERROR;

        if (size){
          void *ptr = calloc(1, size);

        if (ptr != NULL){
            references[reference_count].ptr = ptr;
            references[reference_count].count = 0;
            return reference_count++;
                        }
                }
    
            return RC_ERROR;
        }
            
            
        /* get memory object and increment reference counter */
        void* retain(uint16_t handle){
    
        if(handle < reference_count && handle >= 0){
            references[handle].count++;
            return references[handle].ptr;
            } else {
                return NULL;
            }
        }
        
        /* decrement reference counter */
        void release(uint16_t handle){
        printf("release\n");
    
        if(handle < reference_count && handle >= 0){
            struct mem_obj_t *object = &references[handle];
    
            if (object->count <= 1){
                printf("released\n");
            free(object->ptr);
            reference_count--;
        } else {
            printf("decremented\n");
            object->count--;
                }
             }
        }
C++标准库有个auto_ptr智能指针，能够自动释放指针所指对象的内存，C++ boost库有个boost：：shared_ptr智能指针，内置引用计数，支持拷贝和赋值，看下面这个例子：

>  
"Objects of shared_ptr types have the ability of taking ownership of a pointer and share that ownership: once they take ownership, the group of owners of a pointer become responsible for its deletion when the last one of them releases that ownership."


    #include <boost/smart_ptr.hpp>
    #include <iostream>
    int main()
    {
        // Basic useage
        boost::shared_ptr<int> p1(new int(10));
        std::cout << "ref count of p1: " << p1.use_count() << std::endl;
        boost::shared_ptr<int> p2(p1); // or p2 = p1;
        std::cout << "ref count of p1: " << p1.use_count() << std::endl;
        *p1 = 999;
        std::cout << "*p2: " << *p2 << std::endl;
        p2.reset();
        std::cout << "ref count of p1: " << p1.use_count() << std::endl;
        return 0;
    }



 4.内存池，有利于减少内存碎片，看下面这个例子：

    #include <stdlib.h>
    #include <stdint.h>
    
    struct mem_pool_t{
    void* ptr;//指向内存池起始地址
    size_t size;//内存池大小
    size_t used;//已用内存大小
    };
    
    //create memory pool
    struct mem_pool_t* create_pool(size_t size){
    mem_pool_t* pool=calloc(1,sizeof(struct men_pool_t));
    if(pool!=NULL){
    void* mem=calloc(1,size);
    if(mem!=NULL){
    pool->ptr=mem;
    pool->size=size;
    pool->used=0;
    return pool;
            }
        }
    return NULL;
    }
    
    //allocate memory from pool
    void* pool_alloc(mem_pool_t* pool,size_t size){
    if(pool=NULL)
        return NULL;
    size_t bytes_left=pool->size-pool->used;
    if(size&&size<=bytes_left){
        void* mem=pool->ptr+pool->used;
        pool->used+=size;
        return mem;
        }
    return NULL；
    }
    
    ／／release memory of the pool
    void pool_free(mem_pool_t* pool){
    if(pool!=NULL){
    free(pool->ptr);
    free(pool);
     }
    }
    
 5.垃圾回收机制
 引用计数采用的方法是当内存不再需要时得到手动释放，垃圾回收发生在内存分配失败或者内存到达一定的水位（watermarks），实现垃圾回收最简单的一个算法是MARK AND SWEEP算法，该算法的思路是遍历所有动态分配对象的内存，标记那些还能继续使用的，回收那些没有被标记的内存。
    Java采用的垃圾回收机制就更复杂了，思路也是回收那些不再使用的内存，JAVA的垃圾回收和C++的析构函数又不一样，C++保证对象在使用之前得到初始化，对象超出作用域之后内存得到释放，而JAVA不能保证对象一定被析构。 


----------

##指针和数组

我们一般的概念里指针和数组名是可互换的，但是在编译器里他们被不同的对待，当我们说一个对象或者表达式具有某种类型的时候我们一般是说这个对象是个左值（lvalue），当对象不是const的时候，左值是可以修改的，比如对象是复制操作符的左参数，而数组名是一个const左值，指向地一个元素的const指针，所以你不能给数组名赋值或者意图改变数组名，如果表达式是数组类型，数组名通常转换成指向地一个元素的指针。

但是也有例外，什么情况下数组名不是一个指针呢？
1.当它是sizeof操作符的操作数时，返回数组占的内存字节数
2.当它是取地址操作&的操作数时，返回一个数组的地址

看下面这个例子：

    short a[] = {1,2,3};
    short *pa;
    short (*px)[];
    
    void init(){
        pa = a;
        px = &a;
    
        printf("a:%p; pa:%p; px:%p\n", a, pa, px);
    
        printf("a[1]:%i; pa[1]:%i (*px)[1]:%i\n", a[1], pa[1],(*px)[1]);
    }
    
a是一个short类型数组，pa是一个指向short类型的指针，px呢？
px是一个指向数组类型的指针，在a被赋值给pa之前，他的值被转换成一个指向数组第一个元素的指针，下面那个a却没有转换，因为遇到的是&操作符。
数组下标a[1]等价于*(a+1),和p[1]一样，也指向*(p+1)，但是两者还是有区别的，a是一个数组，它实际上存储的是第一个元素的地址，所以数组a是用来定位第一个元素的，而pa不一样，它就是一个指针，不是用来定位的。
再比如：

    int a[10];
    int b[10];
    int *a;
    c=&a[0];//c是指向数组a地一个元素的指针
    c=a;//a自动转换成指向第一个元素的指针，实际上是指针拷贝
    b=a;//非法的，你不能用赋值符把一个数组的所有元素赋给另一个数组
    a=c;//非法的，你不能修改const指针的值
