---
layout: post
title:  处理并发之一：LINUX Epoll机制介绍
keywords: 并发， I/O多路复用
categories : [c]
tags : [c++, concurrent]
---

Epoll可是当前在Linux下开发大规模并发网络程序的热门人选，Epoll 在Linux2.6内核中正式引入，和select相似，其实都I/O多路复用技术而已，并没有什么神秘的。

其实在Linux下设计并发网络程序，向来不缺少方法，比如典型的Apache模型（Process Per Connection，简称PPC），TPC（Thread Per Connection）模型，以及select模型和poll模型，那为何还要再引入Epoll这个东东呢？那还是有得说说的…

##2. 常用模型的缺点

如果不摆出来其他模型的缺点，怎么能对比出Epoll的优点呢。

###2.1 PPC/TPC模型

这两种模型思想类似，就是让每一个到来的连接一边自己做事去，别再来烦我。只是PPC是为它开了一个进程，而TPC开了一个线程。可是别烦我是有代价的，它要时间和空间啊，连接多了之后，那么多的进程/线程切换，这开销就上来了；因此这类模型能接受的最大连接数都不会高，一般在几百个左右。

###2.2 select模型

1. 最大并发数限制，因为一个进程所打开的FD（文件描述符）是有限制的，由FD_SETSIZE设置，默认值是1024/2048，因此Select模型的最大并发数就被相应限制了。自己改改这个FD_SETSIZE？想法虽好，可是先看看下面吧…

2. 效率问题，select每次调用都会线性扫描全部的FD集合，这样效率就会呈现线性下降，把FD_SETSIZE改大的后果就是，大家都慢慢来，什么？都超时了？？！！

3. 内核/用户空间 内存拷贝问题，如何让内核把FD消息通知给用户空间呢？在这个问题上select采取了内存拷贝方法。

###2.3 poll模型

基本上效率和select是相同的，select缺点的2和3它都没有改掉。

##3.Epoll的提升

把其他模型逐个批判了一下，再来看看Epoll的改进之处吧，其实把select的缺点反过来那就是Epoll的优点了。

3.1. Epoll没有最大并发连接的限制，上限是最大可以打开文件的数目，这个数字一般远大于2048, 一般来说这个数目和系统内存关系很大，具体数目可以cat /proc/sys/fs/file-max察看。

3.2. 效率提升，Epoll最大的优点就在于它只管你“活跃”的连接，而跟连接总数无关，因此在实际的网络环境中，Epoll的效率就会远远高于select和poll。

3.3. 内存拷贝，Epoll在这点上使用了“共享内存”，这个内存拷贝也省略了。


##4. Epoll为什么高效

Epoll的高效和其数据结构的设计是密不可分的，这个下面就会提到。

首先回忆一下select模型，当有I/O事件到来时，select通知应用程序有事件到了快去处理，而应用程序必须轮询所有的FD集合，测试每个FD是否有事件发生，并处理事件；代码像下面这样：



    int res = select(maxfd+1, &readfds, NULL, NULL, 120);
    if(res > 0)
    
    {
        for(int i = 0; i < MAX_CONNECTION; i++)
        {
            if(FD_ISSET(allConnection[i],&readfds))
            {
                handleEvent(allConnection[i]);
            }
        }
    }
    // if(res == 0) handle timeout, res < 0 handle error


Epoll不仅会告诉应用程序有I/0事件到来，还会告诉应用程序相关的信息，这些信息是应用程序填充的，因此根据这些信息应用程序就能直接定位到事件，而不必遍历整个FD集合。

    intres = epoll_wait(epfd, events, 20, 120);
    
    for(int i = 0; i < res;i++)
    {
        handleEvent(events[n]);
    }

##5. Epoll关键数据结构

前面提到Epoll速度快和其数据结构密不可分，其关键数据结构就是：

    struct epoll_event {
    
        __uint32_t events;      // Epoll events
    
        epoll_data_t data;      // User datavariable
    
    };

    typedef union epoll_data {
    
        void *ptr;
    
       int fd;
    
        __uint32_t u32;
    
        __uint64_t u64;
    
    } epoll_data_t;

结构体epoll_event 被用于注册所感兴趣的事件和回传所发生待处理的事件. 
其中epoll_data 联合体用来保存触发事件的某个文件描述符相关的数据. 
例如一个client连接到服务器，服务器通过调用accept函数可以得到于这个client对应的socket文件描述符，可以把这文件描述符赋给epoll_data的fd字段以便后面的读写操作在这个文件描述符上进行。epoll_event 结构体的events字段是表示感兴趣的事件和被触发的事件可能的取值为： 

 - EPOLLIN ：表示对应的文件描述符可以读；
 - EPOLLOUT：表示对应的文件描述符可以写；
 - EPOLLPRI：表示对应的文件描述符有紧急的数据可读
 - EPOLLERR：表示对应的文件描述符发生错误；
 - EPOLLHUP：表示对应的文件描述符被挂断；
 - EPOLLET：表示对应的文件描述符有事件发生；

**ET和LT模式**
LT(level triggered)是缺省的工作方式，并且同时支持block和no-block socket.在这种做法中，内核告诉你一个文件描述符是否就绪了，然后你可以对这个就绪的fd进行IO操作。如果你不作任何操作，内核还是会继续通知你的，所以，这种模式编程出错误可能性要小一点。传统的select/poll都是这种模型的代表。

ET (edge-triggered)是高速工作方式，只支持no-block socket。在这种模式下，当描述符从未就绪变为就绪时，内核通过epoll告诉你。然后它会假设你知道文件描述符已经就绪，并且不会再为那个文件描述符发送更多的就绪通知，直到你做了某些操作导致那个文件描述符不再为就绪状态了（比如，你在发送，接收或者接收请求，或者发送接收的数据少于一定量时导致了一个EWOULDBLOCK 错误）。但是请注意，如果一直不对这个fd作IO操作（从而导致它再次变成未就绪），内核不会发送更多的通知(only once)，不过在TCP协议中，ET模式的加速效用仍需要更多的benchmark确认。
ET和LT的区别在于LT事件不会丢弃，而是只要读buffer里面有数据可以让用户读，则不断的通知你。而ET则只在事件发生之时通知。可以简单理解为LT是水平触发，而ET则为边缘触发。
ET模式仅当状态发生变化的时候才获得通知,这里所谓的状态的变化并不包括缓冲区中还有未处理的数据,也就是说,如果要采用ET模式,需要一直read/write直到出错为止,很多人反映为什么采用ET模式只接收了一部分数据就再也得不到通知了,大多因为这样;而LT模式是只要有数据没有处理就会一直通知下去的.

##6. 使用Epoll

既然Epoll相比select这么好，那么用起来如何呢？会不会很繁琐啊…先看看下面的三个函数吧，就知道Epoll的易用了。

    int epoll_create(int size);

生成一个Epoll专用的文件描述符，其实是申请一个内核空间，用来存放你想关注的socket fd上是否发生以及发生了什么事件。size就是你在这个Epoll fd上能关注的最大socket fd数，大小自定，只要内存足够。

    int epoll_ctl(int epfd, int op, int fd, struct epoll_event *event);

epoll的事件注册函数，它不同与select()是在监听事件时告诉内核要监听什么类型的事件，而是在这里先注册要监听的事件类型。第一个参数是epoll_create()的返回值，第二个参数表示动作，用三个宏来表示：

 - EPOLL_CTL_ADD：注册新的fd到epfd中；
 - EPOLL_CTL_MOD：修改已经注册的fd的监听事件；
 - EPOLL_CTL_DEL：从epfd中删除一个fd；

第三个参数是需要监听的fd，第四个参数是告诉内核需要监听什么事

    int epoll_wait(int epfd,struct epoll_event * events,int maxevents,int timeout);

等待I/O事件的发生；参数说明：

 - epfd:由epoll_create() 生成的Epoll专用的文件描述符；
 - epoll_event:用于回传代处理事件的数组；
 - maxevents:每次能处理的事件数；
 - timeout:等待I/O事件发生的超时值；
 - 返回发生事件数。


----------


----------

##测试程序
首先对服务端和客户端做下说明：
我想实现的是客户端和服务端并发的程序，客户端通过配置并发数，说明有多少个用户去连接服务端。
客户端会发送消息："Client: i send message Hello Server!”，其中i表示哪一个客户端；收到消息："Recv Server Msg Content:%s\n"。
例如：
发送：Client: 1 send message "Hello Server!"
接收：Recv Derver Msg Content:Hello, client fd: 6
服务端收到后给客户端回复消息："Hello, client fd: i"，其中i表示服务端接收的fd,用户区别是哪一个客户端。接收客户端消息："Terminal Received Msg Content:%s\n"
例如：
发送：Hello, client fd: 6
接收：Terminal Received Msg Content:Client: 1 send message "Hello Server!"
备注：这里在接收到消息后，直接打印出消息，如果需要对消息进行处理（如果消息处理比较占用时间，不能立即返回，可以将该消息放入一个队列中，然后开启一个线程从队列中取消息进行处理，这样的话不会因为消息处理而阻塞epoll）。libenent好像对这种有2中处理方式，一个就是回调，要求回调函数，不占用太多的时间，基本能立即返回，另一种好像也是一个队列实现的，这个还需要研究。
服务端代码说明：
服务端在绑定监听后，开启了一个线程，用于负责接收客户端连接，加入到epoll中，这样只要accept到客户端的连接，就将其add EPOLLIN到epoll中，然后进入循环调用epoll_wait，监听到读事件，接收数据，并将事件修改为EPOLLOUT；反之监听到写事件，发送数据，并将事件修改为EPOLLIN。
**服务器代码：**

    //cepollserver.h  
    #ifndef  C_EPOLL_SERVER_H  
    #define  C_EPOLL_SERVER_H  
      
    #include <sys/epoll.h>  
    #include <sys/socket.h>  
    #include <netinet/in.h>  
    #include <fcntl.h>  
    #include <arpa/inet.h>  
    #include <stdio.h>  
    #include <stdlib.h>  
    #include <iostream>  
    #include <pthread.h>  
      
    #define _MAX_SOCKFD_COUNT 65535  
      
    class CEpollServer  
    {  
            public:  
                    CEpollServer();  
                    ~CEpollServer();  
      
                    bool InitServer(const char* chIp, int iPort);  
                    void Listen();  
                    static void ListenThread( void* lpVoid );  
                    void Run();  
      
            private:  
                    int        m_iEpollFd;  
                    int        m_isock;  
                    pthread_t       m_ListenThreadId;// 监听线程句柄  
      
    };  
      
    #endif  
    
       #include "cepollserver.h"  
      
    using namespace std;  
      
    CEpollServer::CEpollServer()  
    {  
    }  
      
    CEpollServer::~CEpollServer()  
    {  
        close(m_isock);  
    }  
      
    bool CEpollServer::InitServer(const char* pIp, int iPort)  
    {  
        m_iEpollFd = epoll_create(_MAX_SOCKFD_COUNT);  
      
        //设置非阻塞模式  
        int opts = O_NONBLOCK;  
        if(fcntl(m_iEpollFd,F_SETFL,opts)<0)  
        {  
            printf("设置非阻塞模式失败!\n");  
            return false;  
        }  
      
        m_isock = socket(AF_INET,SOCK_STREAM,0);  
        if ( 0 > m_isock )  
        {  
            printf("socket error!\n");  
            return false;  
    　　}  
    　　  
    　　sockaddr_in listen_addr;  
    　　    listen_addr.sin_family=AF_INET;  
    　　    listen_addr.sin_port=htons ( iPort );  
    　　    listen_addr.sin_addr.s_addr=htonl(INADDR_ANY);  
    　　    listen_addr.sin_addr.s_addr=inet_addr(pIp);  
    　　  
    　　    int ireuseadd_on = 1;//支持端口复用  
    　　    setsockopt(m_isock, SOL_SOCKET, SO_REUSEADDR, &ireuseadd_on, sizeof(ireuseadd_on) );  
    　　  
    　　    if ( bind ( m_isock, ( sockaddr * ) &listen_addr,sizeof ( listen_addr ) ) !=0 )  
    　　    {  
    　　        printf("bind error\n");  
    　　        return false;  
    　　    }  
    　　  
    　　    if ( listen ( m_isock, 20) <0 )  
    　　    {  
    　　        printf("listen error!\n");  
    　　        return false;  
    　　    }  
    　　    else  
    　　    {  
    　　        printf("服务端监听中...\n");  
    　　    }  
    　　  
    　　    // 监听线程，此线程负责接收客户端连接，加入到epoll中  
    　　    if ( pthread_create( &m_ListenThreadId, 0, ( void * ( * ) ( void * ) ) ListenThread, this ) != 0 )  
    　　    {  
    　　        printf("Server 监听线程创建失败!!!");  
    　　        return false;  
    　　    }  
    　　}  
    　　// 监听线程  
    　　void CEpollServer::ListenThread( void* lpVoid )  
    　　{  
    　　    CEpollServer *pTerminalServer = (CEpollServer*)lpVoid;  
    　　    sockaddr_in remote_addr;  
    　　    int len = sizeof (remote_addr);  
    　　    while ( true )  
    　　    {  
    　　        int client_socket = accept (pTerminalServer->m_isock, ( sockaddr * ) &remote_addr,(socklen_t*)&len );  
    　　        if ( client_socket < 0 )  
    　　        {  
    　　            printf("Server Accept失败!, client_socket: %d\n", client_socket);  
    　　            continue;  
    　　        }  
    　　        else  
    　　        {  
    　　            struct epoll_event    ev;  
    　　            ev.events = EPOLLIN | EPOLLERR | EPOLLHUP;  
    　　            ev.data.fd = client_socket;     //记录socket句柄  
    　　            epoll_ctl(pTerminalServer->m_iEpollFd, EPOLL_CTL_ADD, client_socket, &ev);  
    　　        }  
    　　    }  
    　　}  
    　　  
    　　void CEpollServer::Run()  
    　　{  
    　　    while ( true )  
    　　    {  
    　　        struct epoll_event    events[_MAX_SOCKFD_COUNT];  
    　　        int nfds = epoll_wait( m_iEpollFd, events,  _MAX_SOCKFD_COUNT, -1 );  
    　　        for (int i = 0; i < nfds; i++)  
    　　        {  
    　　            int client_socket = events[i].data.fd;  
    　　            char buffer[1024];//每次收发的字节数小于1024字节  
    　　            memset(buffer, 0, 1024);  
    　　            if (events[i].events & EPOLLIN)//监听到读事件，接收数据  
    　　            {  
    　　                int rev_size = recv(events[i].data.fd,buffer, 1024,0);  
    　　                if( rev_size <= 0 )  
    　　                {  
    　　                    cout << "recv error: recv size: " << rev_size << endl;  
    　　                    struct epoll_event event_del;  
    　　                    event_del.data.fd = events[i].data.fd;  
    　　                    event_del.events = 0;  
    　　                    epoll_ctl(m_iEpollFd, EPOLL_CTL_DEL, event_del.data.fd, &event_del);  
    　　                }  
    　　                else  
    　　                {  
    　　                    printf("Terminal Received Msg Content:%s\n",buffer);  
    　　                    struct epoll_event    ev;  
    　　                    ev.events = EPOLLOUT | EPOLLERR | EPOLLHUP;  
    　　                    ev.data.fd = client_socket;     //记录socket句柄  
    　　                    epoll_ctl(m_iEpollFd, EPOLL_CTL_MOD, client_socket, &ev);  
    　　                }  
    　　            }  
    　　else if(events[i].events & EPOLLOUT)//监听到写事件，发送数据  
    　　            {  
    　　                char sendbuff[1024];  
    　　                sprintf(sendbuff, "Hello, client fd: %d\n", client_socket);  
    　　                int sendsize = send(client_socket, sendbuff, strlen(sendbuff)+1, MSG_NOSIGNAL);  
    　　                if(sendsize <= 0)  
    　　                {  
    　　                    struct epoll_event event_del;  
    　　                    event_del.data.fd = events[i].data.fd;  
    　　                    event_del.events = 0;  
    　　                    epoll_ctl(m_iEpollFd, EPOLL_CTL_DEL, event_del.data.fd, &event_del);  
    　　                }  
    　　                else  
    　　                {  
    　　                    printf("Server reply msg ok! buffer: %s\n", sendbuff);  
    　　                    struct epoll_event    ev;  
    　　                    ev.events = EPOLLIN | EPOLLERR | EPOLLHUP;  
    　　                    ev.data.fd = client_socket;     //记录socket句柄  
    　　                    epoll_ctl(m_iEpollFd, EPOLL_CTL_MOD, client_socket, &ev);  
    　　                }  
    　　            }  
    　　            else  
    　　            {  
    　　                cout << "EPOLL ERROR\n" <<endl;  
    　　                epoll_ctl(m_iEpollFd, EPOLL_CTL_DEL, events[i].data.fd, &events[i]);  
    　　            }  
    　　        }  
    　　    }  
    　　}  

**客户端代码：**
说明：测试是两个并发进行测试，每一个客户端都是一个长连接。代码中在连接服务器（ConnectToServer）时将用户ID和socketid关联起来。用户ID和socketid是一一对应的关系。

        #ifndef _DEFINE_EPOLLCLIENT_H_  
        #define _DEFINE_EPOLLCLIENT_H_  
        #define _MAX_SOCKFD_COUNT 65535  
          
        #include<iostream>  
        #include <sys/epoll.h>  
        #include <sys/socket.h>  
        #include <netinet/in.h>  
        #include <fcntl.h>  
        #include <arpa/inet.h>  
        #include <errno.h>  
        #include <sys/ioctl.h>  
        #include <sys/time.h>  
        #include <string>  
          
        using namespace std;  
          
        /** 
         * @brief 用户状态 
         */  
        typedef enum _EPOLL_USER_STATUS_EM  
        {  
                FREE = 0,  
                CONNECT_OK = 1,//连接成功  
                SEND_OK = 2,//发送成功  
                RECV_OK = 3,//接收成功  
        }EPOLL_USER_STATUS_EM;  
          
        /*@brief 
         *@CEpollClient class 用户状态结构体 
         */  
        struct UserStatus  
        {  
                EPOLL_USER_STATUS_EM iUserStatus;//用户状态  
                int iSockFd;//用户状态关联的socketfd  
                char cSendbuff[1024];//发送的数据内容  
                int iBuffLen;//发送数据内容的长度  
                unsigned int uEpollEvents;//Epoll events  
        };  
          
        class CEpollClient  
        {  
                public:  
          
                        /** 
                         * @brief 
                         * 函数名:CEpollClient 
                         * 描述:构造函数 
                         * @param [in] iUserCount  
                         * @param [in] pIP IP地址 
                         * @param [in] iPort 端口号 
                         * @return 无返回 
                         */  
                        CEpollClient(int iUserCount, const char* pIP, int iPort);  
          
        /** 
                         * @brief 
                         * 函数名:CEpollClient 
                         * 描述:析构函数 
                         * @return 无返回 
                         */  
                        ~CEpollClient();  
          
                        /** 
                         * @brief 
                         * 函数名:RunFun 
                         * 描述:对外提供的接口，运行epoll类 
                         * @return 无返回值 
                         */  
                        int RunFun();  
          
                private:  
          
                        /** 
                         * @brief 
                         * 函数名:ConnectToServer 
                         * 描述:连接到服务器 
                         * @param [in] iUserId 用户ID 
                         * @param [in] pServerIp 连接的服务器IP 
                         * @param [in] uServerPort 连接的服务器端口号 
                         * @return 成功返回socketfd,失败返回的socketfd为-1 
                         */  
                        int ConnectToServer(int iUserId,const char *pServerIp,unsigned short uServerPort);  
          
        /** 
                         * @brief 
                         * 函数名:SendToServerData 
                         * 描述:给服务器发送用户(iUserId)的数据 
                         * @param [in] iUserId 用户ID 
                         * @return 成功返回发送数据长度 
                         */  
                        int SendToServerData(int iUserId);  
          
                        /** 
                         * @brief 
                         * 函数名:RecvFromServer 
                         * 描述:接收用户回复消息 
                         * @param [in] iUserId 用户ID 
                         * @param [in] pRecvBuff 接收的数据内容 
                         * @param [in] iBuffLen 接收的数据长度 
                         * @return 成功返回接收的数据长度，失败返回长度为-1 
                         */  
                        int RecvFromServer(int iUserid,char *pRecvBuff,int iBuffLen);  
          
                        /** 
                         * @brief 
                         * 函数名:CloseUser 
                         * 描述:关闭用户 
                         * @param [in] iUserId 用户ID 
                         * @return 成功返回true 
                         */  
                        bool CloseUser(int iUserId);  
          
        /** 
                         * @brief 
                         * 函数名:DelEpoll 
                         * 描述:删除epoll事件 
                         * @param [in] iSockFd socket FD 
                         * @return 成功返回true 
                         */  
                        bool DelEpoll(int iSockFd);  
                private:  
          
                        int    m_iUserCount;//用户数量；  
                        struct UserStatus *m_pAllUserStatus;//用户状态数组  
                        int    m_iEpollFd;//需要创建epollfd  
                        int    m_iSockFd_UserId[_MAX_SOCKFD_COUNT];//将用户ID和socketid关联起来  
                        int    m_iPort;//端口号  
                        char   m_ip[100];//IP地址  
        };  
          
        #endif  
        #include "cepollclient.h"  
      
    CEpollClient::CEpollClient(int iUserCount, const char* pIP, int iPort)  
    {  
        strcpy(m_ip, pIP);  
        m_iPort = iPort;  
        m_iUserCount = iUserCount;  
        m_iEpollFd = epoll_create(_MAX_SOCKFD_COUNT);  
        m_pAllUserStatus = (struct UserStatus*)malloc(iUserCount*sizeof(struct UserStatus));  
        for(int iuserid=0; iuserid<iUserCount ; iuserid++)  
        {  
            m_pAllUserStatus[iuserid].iUserStatus = FREE;  
            sprintf(m_pAllUserStatus[iuserid].cSendbuff, "Client: %d send message \"Hello Server!\"\r\n", iuserid);  
            m_pAllUserStatus[iuserid].iBuffLen = strlen(m_pAllUserStatus[iuserid].cSendbuff) + 1;  
            m_pAllUserStatus[iuserid].iSockFd = -1;  
        }  
        memset(m_iSockFd_UserId, 0xFF, sizeof(m_iSockFd_UserId));  
    }  
      
    CEpollClient::~CEpollClient()  
    {  
        free(m_pAllUserStatus);  
    }  
    int CEpollClient::ConnectToServer(int iUserId,const char *pServerIp,unsigned short uServerPort)  
    {  
        if( (m_pAllUserStatus[iUserId].iSockFd = socket(AF_INET,SOCK_STREAM,0) ) < 0 )  
        {  
            cout <<"[CEpollClient error]: init socket fail, reason is:"<<strerror(errno)<<",errno is:"<<errno<<endl;  
            m_pAllUserStatus[iUserId].iSockFd = -1;  
            return  m_pAllUserStatus[iUserId].iSockFd;  
        }  
      
        struct sockaddr_in addr;  
        bzero(&addr, sizeof(addr));  
        addr.sin_family = AF_INET;  
        addr.sin_port = htons(uServerPort);  
        addr.sin_addr.s_addr = inet_addr(pServerIp);  
      
        int ireuseadd_on = 1;//支持端口复用  
        setsockopt(m_pAllUserStatus[iUserId].iSockFd, SOL_SOCKET, SO_REUSEADDR, &ireuseadd_on, sizeof(ireuseadd_on));  
      
        unsigned long ul = 1;  
        ioctl(m_pAllUserStatus[iUserId].iSockFd, FIONBIO, &ul); //设置为非阻塞模式  
      
        connect(m_pAllUserStatus[iUserId].iSockFd, (const sockaddr*)&addr, sizeof(addr));  
        m_pAllUserStatus[iUserId].iUserStatus = CONNECT_OK;  
        m_pAllUserStatus[iUserId].iSockFd = m_pAllUserStatus[iUserId].iSockFd;  
      
        return m_pAllUserStatus[iUserId].iSockFd;  
    }  
    int CEpollClient::SendToServerData(int iUserId)  
    {  
        sleep(1);//此处控制发送频率，避免狂打日志，正常使用中需要去掉  
        int isendsize = -1;  
        if( CONNECT_OK == m_pAllUserStatus[iUserId].iUserStatus || RECV_OK == m_pAllUserStatus[iUserId].iUserStatus)  
        {  
            isendsize = send(m_pAllUserStatus[iUserId].iSockFd, m_pAllUserStatus[iUserId].cSendbuff, m_pAllUserStatus[iUserId  
    ].iBuffLen, MSG_NOSIGNAL);  
            if(isendsize < 0)  
            {  
                cout <<"[CEpollClient error]: SendToServerData, send fail, reason is:"<<strerror(errno)<<",errno is:"<<errno<  
    <endl;  
            }  
            else  
            {  
                printf("[CEpollClient info]: iUserId: %d Send Msg Content:%s\n", iUserId, m_pAllUserStatus[iUserId].cSendbuff  
    );  
                m_pAllUserStatus[iUserId].iUserStatus = SEND_OK;  
            }  
        }  
        return isendsize;  
    }  
    int CEpollClient::RecvFromServer(int iUserId,char *pRecvBuff,int iBuffLen)  
    {  
        int irecvsize = -1;  
        if(SEND_OK == m_pAllUserStatus[iUserId].iUserStatus)  
        {  
            irecvsize = recv(m_pAllUserStatus[iUserId].iSockFd, pRecvBuff, iBuffLen, 0);  
            if(0 > irecvsize)  
            {  
                cout <<"[CEpollClient error]: iUserId: " << iUserId << "RecvFromServer, recv fail, reason is:"<<strerror(errn  
    o)<<",errno is:"<<errno<<endl;  
            }  
            else if(0 == irecvsize)  
            {  
                cout <<"[warning:] iUserId: "<< iUserId << "RecvFromServer, STB收到数据为0，表示对方断开连接,irecvsize:"<<ire  
    cvsize<<",iSockFd:"<< m_pAllUserStatus[iUserId].iSockFd << endl;  
            }  
            else  
            {  
                printf("Recv Server Msg Content:%s\n", pRecvBuff);  
                m_pAllUserStatus[iUserId].iUserStatus = RECV_OK;  
            }  
        }  
        return irecvsize;  
    }  
      
    bool CEpollClient::CloseUser(int iUserId)  
    {  
        close(m_pAllUserStatus[iUserId].iSockFd);  
        m_pAllUserStatus[iUserId].iUserStatus = FREE;  
        m_pAllUserStatus[iUserId].iSockFd = -1;  
        return true;  
    }  
          
    int CEpollClient::RunFun()  
    {  
        int isocketfd = -1;  
        for(int iuserid=0; iuserid<m_iUserCount; iuserid++)  
        {  
            struct epoll_event event;  
            isocketfd = ConnectToServer(iuserid, m_ip, m_iPort);  
            if(isocketfd < 0)  
                cout <<"[CEpollClient error]: RunFun, connect fail" <<endl;  
            m_iSockFd_UserId[isocketfd] = iuserid;//将用户ID和socketid关联起来  
      
            event.data.fd = isocketfd;  
            event.events = EPOLLIN|EPOLLOUT|EPOLLERR|EPOLLHUP;  
      
            m_pAllUserStatus[iuserid].uEpollEvents = event.events;  
            epoll_ctl(m_iEpollFd, EPOLL_CTL_ADD, event.data.fd, &event);  
    　　}  
    　　while(1)  
    　　    {  
    　　        struct epoll_event events[_MAX_SOCKFD_COUNT];  
    　　        char buffer[1024];  
    　　        memset(buffer,0,1024);  
    　　        int nfds = epoll_wait(m_iEpollFd, events, _MAX_SOCKFD_COUNT, 100 );//等待epoll事件的产生  
    　　        for (int ifd=0; ifd<nfds; ifd++)//处理所发生的所有事件  
    　　        {  
    　　            struct epoll_event event_nfds;  
    　　            int iclientsockfd = events[ifd].data.fd;  
    　　            cout << "events[ifd].data.fd: " << events[ifd].data.fd << endl;  
    　　            int iuserid = m_iSockFd_UserId[iclientsockfd];//根据socketfd得到用户ID  
    　　            if( events[ifd].events & EPOLLOUT )  
    　　            {  
    　　                int iret = SendToServerData(iuserid);  
    　　                if( 0 < iret )  
    　　                {  
    　　                    event_nfds.events = EPOLLIN|EPOLLERR|EPOLLHUP;  
    　　                    event_nfds.data.fd = iclientsockfd;  
    　　                    epoll_ctl(m_iEpollFd, EPOLL_CTL_MOD, event_nfds.data.fd, &event_nfds);  
    　　                }  
    　　                else  
    　　                {  
    　　                    cout <<"[CEpollClient error:] EpollWait, SendToServerData fail, send iret:"<<iret<<",iuserid:"<<iuser  
    　　id<<",fd:"<<events[ifd].data.fd<<endl;  
    　　                    DelEpoll(events[ifd].data.fd);  
    　　                    CloseUser(iuserid);  
    　　                }  
    　　            }  
    　　else if( events[ifd].events & EPOLLIN )//监听到读事件，接收数据  
    　　            {  
    　　                int ilen = RecvFromServer(iuserid, buffer, 1024);  
    　　                if(0 > ilen)  
    　　                {  
    　　                    cout <<"[CEpollClient error]: RunFun, recv fail, reason is:"<<strerror(errno)<<",errno is:"<<errno<<e  
    　　ndl;  
    　　                    DelEpoll(events[ifd].data.fd);  
    　　                    CloseUser(iuserid);  
    　　                }  
    　　                else if(0 == ilen)  
    　　                {  
    　　                    cout <<"[CEpollClient warning:] server disconnect,ilen:"<<ilen<<",iuserid:"<<iuserid<<",fd:"<<events[  
    　　ifd].data.fd<<endl;  
    　　                    DelEpoll(events[ifd].data.fd);  
    　　                    CloseUser(iuserid);  
    　　                }  
    　　                else  
    　　                {  
    　　                    m_iSockFd_UserId[iclientsockfd] = iuserid;//将socketfd和用户ID关联起来  
    　　                    event_nfds.data.fd = iclientsockfd;  
    　　                    event_nfds.events = EPOLLOUT|EPOLLERR|EPOLLHUP;  
    　　                    epoll_ctl(m_iEpollFd, EPOLL_CTL_MOD, event_nfds.data.fd, &event_nfds);  
    　　                }  
    　　            }  
    　　            else  
    　　            {  
    　　                cout <<"[CEpollClient error:] other epoll error"<<endl;  
    　　                DelEpoll(events[ifd].data.fd);  
    　　                CloseUser(iuserid);  
    　　            }  
    　　        }  
    　　}  
    　　}  
    　　  
    　　bool CEpollClient::DelEpoll(int iSockFd)  
    　　{  
    　　    bool bret = false;  
    　　    struct epoll_event event_del;  
    　　    if(0 < iSockFd)  
    　　    {  
    　　        event_del.data.fd = iSockFd;  
    　　        event_del.events = 0;  
    　　        if( 0 == epoll_ctl(m_iEpollFd, EPOLL_CTL_DEL, event_del.data.fd, &event_del) )  
    　　        {  
    　　            bret = true;  
    　　        }  
    　　        else  
    　　        {  
    　　            cout <<"[SimulateStb error:] DelEpoll,epoll_ctl error,iSockFd:"<<iSockFd<<endl;  
    　　        }  
    　　        m_iSockFd_UserId[iSockFd] = -1;  
    　　    }  
    　　    else  
    　　    {  
    　　        bret = true;  
    　　  
    　　    }  
    　　    return bret;  
    　　}  
    　　
服务器主程序：

    #include <iostream>  
    #include "cepollserver.h"  
      
    using namespace std;  
      
    int main()  
    {  
            CEpollServer  theApp;  
            theApp.InitServer("127.0.0.1", 8000);  
            theApp.Run();  
      
            return 0;  
    }  

客户端主程序：

        　#include "cepollclient.h"  
      
    int main(int argc, char *argv[])  
    {  
            CEpollClient *pCEpollClient = new CEpollClient(2, "127.0.0.1", 8000);  
            if(NULL == pCEpollClient)  
            {  
                    cout<<"[epollclient error]:main init"<<"Init CEpollClient fail"<<endl;  
            }  
      
            pCEpollClient->RunFun();  
      
            if(NULL != pCEpollClient)  
            {  
                    delete pCEpollClient;  
                    pCEpollClient = NULL;  
            }  
      
            return 0;  
    }  
