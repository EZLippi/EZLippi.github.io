---
layout:     post
title:      C++各种类型转换总结
keywords:   type casting
category:   algorithm 
tags:[type casting,类型转换]
---


C风格的强制类型转换(Type Cast)很简单，不管什么类型的转换统统是：
TYPE b = (TYPE)a。
JAVA里短类型和可以自动转换成长类型比如
float f1=2.5f;
double f2=f1;//f1可以自动安全的向上转型

C++风格的类型转换提供了4种类型转换操作符来应对不同场合的应用。

 1. const_cast，字面上理解就是去const属性。
 2. static_cast，命名上理解是静态类型转换。如int转换成char。
 3. dynamic_cast，命名上理解是动态类型转换。如子类和父类之间的多态类型转换。
 4. reinterpret_cast，仅仅重新解释类型，但没有进行二进制的转换。**

4种类型转换的格式，如：TYPE B = static_cast(TYPE)(a)。

const_cast
----------

去掉类型的const或volatile属性。


    1 struct SA {
    2 int i;
    3 };
    4 const SA ra;
    5 //ra.i = 10; //直接修改const类型，编译错误
    6 SA &rb = const_cast<SA&>(ra);
    7 rb.i =10;

static_cast
-----------

类似于C风格的强制转换。无条件转换，静态类型转换，发生在**编译期**。用于：

 1. 基类和子类之间转换
    
    其中子类指针转换成父类指针是安全的；但父类指针转换成子类指针是不安全的。(基类和子类之间的动态类型转换建议用dynamic_cast)
 2. 基本数据类型转换
    
    enum, struct, int, char,float等。static_cast不能进行无关类型（如非基类和子类）指针之间的转换。
 3. 把空指针转换成目标类型的空指针。
 
 4. 把任何类型的表达式转换成void类型。
 
 5. static_cast不能去掉类型的const、volitale属性(用const_cast)。

  

 

    > class CBase {};
    class CDerived: public CBase {};
    CBase * a = newCBase;
    CDerived * b = static_cast<CDerived *>(a);

注意：static_cast 转换时并不进行运行时安全检查，所以是非安全的，很容易出问题。因此 C++ 引入 dynamic_cast 来处理安全转型。
dynamic_cast
------------

有条件转换，动态类型转换，**运行时**类型安全检查(转换失败返回NULL)：

 1. 安全的基类和子类之间转换。
 2. 必须要有虚函数。
 3. 相同基类不同子类之间的交叉转换。但结果是NULL。


    

>  1class BaseClass {  
2 public:  
3 int m_iNum;  
4 virtualvoid foo(){};
> //基类必须有虚函数。保持多tai特性才能使用dynamic_cast  
5 };  
6   
7 class DerivedClass:
>public BaseClass {  
8 public:  
9 char*m_szName[100]; 
10 void bar(){};
11 }; 
12  
13 BaseClass* pb =new DerivedClass(); 
14 DerivedClass *pd1 =
>static_cast<DerivedClass *>(pb); //子类->父类，静态类型转换，正确但不推荐 
15DerivedClass *pd2 = dynamic_cast<DerivedClass *>(pb);//子类->父类，动态类型转换，正确 
16 
17 BaseClass* pb2 =new BaseClass(); 
18 DerivedClass *pd21 = static_cast<DerivedClass *>(pb2);
//父类->子类，静态类型转换，危险！访问子类m_szName成员越界 
19 DerivedClass *pd22 =dynamic_cast<DerivedClass *>(pb2); //父类->子类，动态类型转换，安全的。结果是NULL

reinterpret_cast
----------------

reinterpret_cast运算符是用来处理**无关类型之间的转换**；它会产生一个新的值，这个值会有与原始参数（expressoin）有**完全相同的比特位**。

[IBM的C++指南][1]里倒是明确告诉了我们reinterpret_cast应该在什么地方用来作为转换运算符：

 1. 从指针类型到一个足够大的整数类型
 2. 从整数类型或者枚举类型到指针类型
 3. 从一个指向函数的指针到另一个不同类型的指向函数的指针
 4. 从一个指向对象的指针到另一个不同类型的指向对象的指针
 5. 从一个指向类函数成员的指针到另一个指向不同类型的函数成员的指针
 6. 从一个指向类数据成员的指针到另一个指向不同类型的数据成员的指针

  

>   1 int doSomething(){return0;};
>     2 typedef void(*FuncPtr)(); //FuncPtr is 一个指向函数的指针，该函数没有参数，返回值类型为 void
>     3 FuncPtr funcPtrArray[10]; //10个FuncPtrs指针的数组 让我们假设你希望（因为某些莫名其妙的原因）把一个指向下面函数的指针存入funcPtrArray数组：
>     4 
>     5 funcPtrArray[0] =&doSomething;// 编译错误！类型不匹配，reinterpret_cast可以让编译器以你的方法去看待它们：funcPtrArray
>     6 funcPtrArray[0] = reinterpret_cast<FuncPtr>(&doSomething); //不同函数指针类型之间进行转换

    
 

参考文献：
-----

 1. [http://www.cplusplus.com/doc/tutorial/typecasting/](http://www.cplusplus.com/doc/tutorial/typecasting/)
 2. [IBM C++指南](http://publib.boulder.ibm.com/infocenter/compbgpl/v9v111/index.jsp?topic=/com.ibm.xlcpp9.bg.doc/language_ref/keyword_reinterpret_cast.htm)
 

  [1]: http://publib.boulder.ibm.com/infocenter/compbgpl/v9v111/index.jsp?topic=/com.ibm.xlcpp9.bg.doc/language_ref/keyword_reinterpret_cast.htm
