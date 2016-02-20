---
layout:     post
title:      值得推荐的C/C++框架和库
keywords:   c/c++, openSource
category:   c/c++
description: Webbench是一个在linux下使用的非常简单的网站压测工具。它使用fork()模拟多个客户端同时访问我们设定的URL，测试网站在压力下工作的性能，最多可以模拟3万个并发连接去测试网站的负载能力。Webbench使用C语言编写, 代码实在太简洁，源码加起来不到600行。
tags:		[C, C++, OpenSource, 框架, 开源]
---

* 目录
{:toc}

## 值得学习的C语言开源项目 ##


**Libev**
 

libev是一个开源的事件驱动库，基于epoll，kqueue等OS提供的基础设施。其以高效出名，它可以将IO事件，定时器，和信号统一起来，统一放在事件处理这一套框架下处理。基于Reactor模式，效率较高，并且代码精简（4.15版本8000多行），是学习事件驱动编程的很好的资源。

下载链接：[http://software.schmorp.de/pkg/libev.html](http://software.schmorp.de/pkg/libev.html)

**Memcached**


Memcached 是一个高性能的分布式内存对象缓存系统，用于动态Web应用以减轻数据库负载。它通过在内存中缓存数据和对象来减少读取数据库的次数，从而提供动态数据库驱动网站的速度。Memcached 基于一个存储键/值对的 hashmap。Memcached-1.4.7的代码量还是可以接受的，只有10K行左右。

下载地址：[http://memcached.org/](http://memcached.org/)

**Redis**


Redis 是一个使用 C 语言写成的，开源的 key-value 数据库。Redis支持的操作和数据类型比Memcached要多，现在主要用于缓存，支持主从同步机制，Redis的学习可以参考<<Redis设计与实现>>一书。

下载地址：[http://redis.io/](http://redis.io/)

**Webbench**

Webbench是一个在linux下使用的非常简单的网站压测工具。它使用fork()模拟多个客户端同时访问我们设定的URL，测试网站在压力下工作的性能，最多可以模拟3万个并发连接去测试网站的负载能力。Webbench使用C语言编写, 代码实在太简洁，源码加起来不到600行。

下载链接：[https://github.com/LippiOuYang/WebBenchl](https://github.com/LippiOuYang/WebBench)

**APR（Apache Portable Runtime）**


这是由 Apache 社区维护的 C 开源库，主要提供操作系统相关的功能（文件系统、进程、线程、用户、IPC）。此外还提供了一些网络相关的功能。

APR 原先是 Apache Web 服务器的一个组成部分，后来独立出来，成为一个单独的开源项目。
主页：[https://apr.apache.org](https://apr.apache.org/)

**Tinyhttpd**
 

tinyhttpd是一个超轻量型Http Server，使用C语言开发，全部代码只有502行(包括注释)，附带一个简单的Client，可以通过阅读这段代码理解一个 Http Server 的本质。

下载链接：[https://github.com/LippiOuYang/Tinyhttpd](https://github.com/LippiOuYang/Tinyhttpd)

**cJSON**
 

cJSON是C语言中的一个JSON编解码器，非常轻量级，C文件只有500多行，速度也非常理想。

cJSON也存在几个弱点，虽然功能不是非常强大，但cJSON的小身板和速度是最值得赞赏的。其代码被非常好地维护着，结构也简单易懂，可以作为一个非常好的C语言项目进行学习。

项目主页:[http://sourceforge.net/projects/cjson/](http://sourceforge.net/projects/cjson/
)

**CMockery**


cmockery是google发布的用于C单元测试的一个轻量级的框架。它很小巧，对其他开源包没有依赖，对被测试代码侵入性小。cmockery的源代码行数不到3K，你阅读一下will_return和mock的源代码就一目了然了。

主要特点：

- 免费且开源，google提供技术支持；
- 轻量级的框架，使测试更加快速简单；
- 避免使用复杂的编译器特性，对老版本的编译器来讲，兼容性好;
- 并不强制要求待测代码必须依赖C99标准，这一特性对许多嵌入式系统的开发很有用

下载链接：[http://code.google.com/p/cmockery/downloads/list](http://code.google.com/p/cmockery/downloads/list)



**Lua**
 

Lua很棒，Lua是巴西人发明的，这些都令我不爽，但是还不至于脸红，最多眼红。

让我脸红的是Lua的源代码，百分之一百的ANSI C，一点都不掺杂。在任何支持ANSI C编译器的平台上都可以轻松编译通过。我试过，真是一点废话都没有。Lua的代码数量足够小，5.1.4仅仅1.5W行，去掉空白行和注释估计能到1W行。

下载地址：[http://www.lua.org/](http://www.lua.org/)

**SQLite**
 

SQLite是一个开源的嵌入式关系数据库，实现自包容、零配置、支持事务的SQL数据库引擎。 其特点是高度便携、使用方便、结构紧凑、高效、可靠。足够小，大致3万行C代码，250K。

 下载地址：http://www.sqlite.org/ 。

**UNIX v6**
 

UNIX V6 的内核源代码包括设备驱动程序在内 约有1 万行，这个数量的源代码，初学者是能够充分理解的。有一种说法是一个人所能理解的代码量上限为1 万行，UNIX V6的内核源代码从数量上看正好在这个范围之内。看到这里，大家是不是也有“如果只有1万行的话没准儿我也能学会”的想法呢？

另一方面，最近的操作系统，例如Linux 最新版的内核源代码据说超过了1000 万行。就算不是初学者，想完全理解全部代码基本上也是不可能的。

下载地址：[http://minnie.tuhs.org/cgi-bin/utree.pl?file=V6](http://minnie.tuhs.org/cgi-bin/utree.pl?file=V6)

**NETBSD**


NetBSD是一个免费的，具有高度移植性的 UNIX-like 操作系统，是现行可移植平台最多的操作系统，可以在许多平台上执行，从 64bit alpha 服务器到手持设备和嵌入式设备。NetBSD计划的口号是：”Of course it runs NetBSD”。它设计简洁，代码规范，拥有众多先进特性，使得它在业界和学术界广受好评。由于简洁的设计和先进的特征，使得它在生产和研究方面，都有卓越的表现，而且它也有受使用者支持的完整的源代码。许多程序都可以很容易地通过NetBSD Packages Collection获得。

下载地址：[http://www.netbsd.org/](http://www.netbsd.org/)


## C++ 资源大全 ##

<p>关于 C++ 框架、库和资源的一些汇总列表，内容包括：标准库、Web应用框架、人工智能、数据库、图片处理、机器学习、日志、代码分析等。</p>
<p>&nbsp;</p>
<h3>标准库</h3>
<p>C++标准库，包括了STL容器，算法和函数等。</p>
<ul>
<li><a href="http://en.wikipedia.org/wiki/C%2B%2B_Standard_Library" target="_blank">C++ Standard Library</a>：是一系列类和函数的集合，使用核心语言编写，也是C++ISO自身标准的一部分。</li>
<li><a href="http://en.wikipedia.org/wiki/Standard_Template_Library" target="_blank">Standard Template Library</a>：标准模板库</li>
<li><a href="http://en.wikipedia.org/wiki/C_POSIX_library" target="_blank">C POSIX library</a> ： POSIX系统的C标准库规范</li>
<li><a href="https://github.com/cplusplus" target="_blank">ISO C++ Standards Committee</a> ：C++标准委员会</li>
</ul>
<p>&nbsp;</p>
<h3>框架</h3>
<p>C++通用框架和库</p>
<ul>
<li><a href="http://stdcxx.apache.org/" target="_blank">Apache C++ Standard Library</a>：是一系列算法，容器，迭代器和其他基本组件的集合</li>
<li><a href="http://stlab.adobe.com/" target="_blank">ASL</a> ：Adobe源代码库提供了同行的评审和可移植的C++源代码库。</li>
<li><a href="https://github.com/boostorg" target="_blank">Boost</a> ：大量通用C++库的集合。</li>
<li><a href="https://github.com/bloomberg/bde" target="_blank">BDE</a> ：来自于彭博资讯实验室的开发环境。</li>
<li><a href="http://libcinder.org/" target="_blank">Cinder</a>：提供专业品质创造性编码的开源开发社区。</li>
<li><a href="http://ryan.gulix.cl/fossil.cgi/cxxomfort/" target="_blank">Cxxomfort</a>：轻量级的，只包含头文件的库，将C++ 11的一些新特性移植到C++03中。</li>
<li><a href="http://dlib.net/" target="_blank">Dlib</a>：使用契约式编程和现代C++科技设计的通用的跨平台的C++库。</li>
<li><a href="https://github.com/paulhodge/EASTL" target="_blank">EASTL</a> ：EA-STL公共部分</li>
<li><a href="https://github.com/sumeetchhetri/ffead-cpp" target="_blank">ffead-cpp</a> ：企业应用程序开发框架</li>
<li><a href="https://github.com/facebook/folly" target="_blank">Folly</a>：由Facebook开发和使用的开源C++库</li>
<li><a href="https://github.com/julianstorer/JUCE" target="_blank">JUCE</a> ：包罗万象的C++类库，用于开发跨平台软件</li>
<li><a href="https://github.com/facebook/libphenom" target="_blank">libPhenom</a>：用于构建高性能和高度可扩展性系统的事件框架。</li>
<li><a href="https://github.com/sourcey/libsourcey" target="_blank">LibSourcey</a> ：用于实时的视频流和高性能网络应用程序的C++11 evented IO</li>
<li><a href="https://github.com/koanlogic/libu" target="_blank">LibU</a> ： C语言写的多平台工具库</li>
<li><a href="http://loki-lib.sourceforge.net/" target="_blank">Loki</a> ：C++库的设计，包括常见的设计模式和习语的实现。</li>
<li><a href="https://code.google.com/p/mili/" target="_blank">MiLi</a> ：只含头文件的小型C++库</li>
<li><a href="http://www.openframeworks.cc/" target="_blank">openFrameworks</a> ：开发C++工具包，用于创意性编码。</li>
<li><a href="http://qt-project.org/" target="_blank">Qt</a> ：跨平台的应用程序和用户界面框架</li>
<li><a href="http://code.google.com/p/reason/" target="_blank">Reason</a> ：跨平台的框架，使开发者能够更容易地使用Java，.Net和Python，同时也满足了他们对C++性能和优势的需求。</li>
<li><a href="http://root.cern.ch/" target="_blank">ROOT</a> ：具备所有功能的一系列面向对象的框架，能够非常高效地处理和分析大量的数据，为欧洲原子能研究机构所用。</li>
<li><a href="http://www.stlport.org/" target="_blank">STLport</a>：是STL具有代表性的版本</li>
<li><a href="http://stxxl.sourceforge.net/" target="_blank">STXXL</a>：用于额外的大型数据集的标准模板库。</li>
<li><a href="http://www.ultimatepp.org/" target="_blank">Ultimate++</a> ：C++跨平台快速应用程序开发框架</li>
<li><a href="http://sourceforge.net/projects/wtl/" target="_blank">Windows Template Library</a>：用于开发Windows应用程序和UI组件的C++库</li>
<li><a href="https://github.com/jll63/yomm11" target="_blank">Yomm11</a> ：C++11的开放multi-methods.</li>
</ul>
<p>&nbsp;</p>
<h3>人工智能</h3>
<ul>
<li><a href="https://github.com/aigamedev/btsk" target="_blank">btsk</a> ：游戏行为树启动器工具</li>
<li><a href="http://eodev.sourceforge.net/" target="_blank">Evolving Objects</a>：基于模板的，ANSI C++演化计算库，能够帮助你非常快速地编写出自己的随机优化算法。</li>
<li><a href="https://github.com/andrometa/neu" target="_blank">Neu</a>：C++11框架，编程语言集，用于创建人工智能应用程序的多用途软件系统。</li>
</ul>
<p>&nbsp;</p>
<h3>异步事件循环</h3>
<ul>
<li><a href="http://think-async.com/" target="_blank">Boost.Asio</a>：用于网络和底层I/O编程的跨平台的C++库。</li>
<li><a href="http://libev.schmorp.de/" target="_blank">libev</a> ：功能齐全，高性能的时间循环，轻微地仿效libevent，但是不再像libevent一样有局限性，也修复了它的一些bug。</li>
<li><a href="http://libevent.org/" target="_blank">libevent</a> ：事件通知库</li>
<li><a href="https://github.com/joyent/libuv" target="_blank">libuv</a> ：跨平台异步I/O。</li>
</ul>
<p>&nbsp;</p>
<h3>音频</h3>
<p>音频，声音，音乐，数字化音乐库</p>
<ul>
<li><a href="http://www.fmod.org/" target="_blank">FMOD</a> ：易于使用的跨平台的音频引擎和音频内容的游戏创作工具。</li>
<li><a href="https://github.com/micknoise/Maximilian" target="_blank">Maximilian</a> ：C++音频和音乐数字信号处理库</li>
<li><a href="http://www.openal.org/" target="_blank">OpenAL</a> ：开源音频库&#8212;跨平台的音频API</li>
<li><a href="http://opus-codec.org/" target="_blank">Opus</a>：一个完全开放的，免版税的，高度通用的音频编解码器</li>
<li><a href="http://www.speex.org/" target="_blank">Speex</a>：免费编解码器，为Opus所废弃</li>
<li><a href="https://github.com/TonicAudio/Tonic" target="_blank">Tonic</a>： C++易用和高效的音频合成</li>
<li><a href="http://xiph.org/vorbis/" target="_blank">Vorbis</a>： Ogg Vorbis是一种完全开放的，非专有的，免版税的通用压缩音频格式。</li>
</ul>
<p>&nbsp;</p>
<h3>生态学</h3>
<p>生物信息，基因组学和生物技术</p>
<ul>
<li><a href="http://molpopgen.github.io/libsequence/" target="_blank">libsequence</a>：用于表示和分析群体遗传学数据的C++库。</li>
<li><a href="http://www.seqan.de/" target="_blank">SeqAn</a>：专注于生物数据序列分析的算法和数据结构。</li>
<li><a href="https://github.com/ekg/vcflib" target="_blank">Vcflib</a> ：用于解析和处理VCF文件的C++库</li>
<li><a href="https://github.com/jewmanchue/wham" target="_blank">Wham</a>：直接把联想测试应用到BAM文件的基因结构变异。</li>
</ul>
<p>&nbsp;</p>
<h3>压缩</h3>
<p>压缩和归档库</p>
<ul>
<li><a href="http://www.bzip.org/" target="_blank">bzip2</a>：一个完全免费，免费专利和高质量的数据压缩</li>
<li><a href="https://bitbucket.org/attila_afra/doboz/overview" target="_blank">doboz</a>：能够快速解压缩的压缩库</li>
<li><a href="https://icculus.org/physfs/" target="_blank">PhysicsFS</a>：对各种归档提供抽象访问的库，主要用于视频游戏，设计灵感部分来自于Quake3的文件子系统。</li>
<li><a href="https://projects.kde.org/projects/frameworks/karchive" target="_blank">KArchive</a>：用于创建，读写和操作文件档案（例如zip和 tar）的库，它通过QIODevice的一系列子类，使用gzip格式，提供了透明的压缩和解压缩的数据。</li>
<li><a href="https://code.google.com/p/lz4/" target="_blank">LZ4</a> ：非常快速的压缩算法</li>
<li><a href="https://code.google.com/p/lzham/" target="_blank">LZHAM</a> ：无损压缩数据库，压缩比率跟LZMA接近，但是解压缩速度却要快得多。</li>
<li><a href="http://www.7-zip.org/sdk.html" target="_blank">LZMA</a> ：7z格式默认和通用的压缩方法。</li>
<li><a href="http://www.matcode.com/lzmat.htm" target="_blank">LZMAT</a> ：及其快速的实时无损数据压缩库</li>
<li><a href="https://code.google.com/p/miniz/" target="_blank">miniz</a>：单一的C源文件，紧缩/膨胀压缩库，使用zlib兼容API，ZIP归档读写，PNG写方式。</li>
<li><a href="https://github.com/nmoinvaz/minizip" target="_blank">Minizip</a>：Zlib最新bug修复，支持PKWARE磁盘跨越，AES加密和IO缓冲。</li>
<li><a href="https://code.google.com/p/snappy/" target="_blank">Snappy</a> ：快速压缩和解压缩</li>
<li><a href="http://zlib.net/" target="_blank">ZLib</a> ：非常紧凑的数据流压缩库</li>
<li><a href="http://zziplib.sourceforge.net/" target="_blank">ZZIPlib</a>：提供ZIP归档的读权限。</li>
</ul>
<p>&nbsp;</p>
<h3>并发性</h3>
<p>并发执行和多线程</p>
<ul>
<li><a href="https://github.com/kylelutz/compute" target="_blank">Boost.Compute</a> ：用于OpenCL的C++GPU计算库</li>
<li><a href="https://github.com/HSA-Libraries/Bolt" target="_blank">Bolt</a> ：针对GPU进行优化的C++模板库</li>
<li><a href="https://github.com/schlangster/cpp.react" target="_blank">C++React</a> ：用于C++11的反应性编程库</li>
<li><a href="https://www.threadingbuildingblocks.org/" target="_blank">Intel TBB</a> ：Intel线程构件块</li>
<li><a href="https://github.com/libclsph/libclsph" target="_blank">Libclsph</a>：基于OpenCL的GPU加速SPH流体仿真库</li>
<li><a href="https://www.khronos.org/opencl/" target="_blank">OpenCL</a> ：并行编程的异构系统的开放标准</li>
<li><a href="http://openmp.org/" target="_blank">OpenMP</a>：OpenMP API</li>
<li><a href="http://thrust.github.io/" target="_blank">Thrust</a> ：类似于C++标准模板库的并行算法库</li>
<li><a href="https://github.com/STEllAR-GROUP/hpx/" target="_blank">HPX</a> ：用于任何规模的并行和分布式应用程序的通用C++运行时系统</li>
<li><a href="https://github.com/ddemidov/vexcl" target="_blank">VexCL</a> ：用于OpenCL/CUDA 的C++向量表达式模板库。</li>
</ul>
<p>&nbsp;</p>
<h3>容器</h3>
<ul>
<li><a href="https://code.google.com/p/cpp-btree/" target="_blank">C++ B-tree</a> ：基于B树数据结构，实现命令内存容器的模板库</li>
<li><a href="https://github.com/goossaert/hashmap" target="_blank">Hashmaps</a>： C++中开放寻址哈希表算法的实现</li>
</ul>
<p>&nbsp;</p>
<h3>密码学</h3>
<ul>
<li><a href="http://bcrypt.sourceforge.net/" target="_blank">Bcrypt</a> ：一个跨平台的文件加密工具，加密文件可以移植到所有可支持的操作系统和处理器中。</li>
<li><a href="https://github.com/fffaraz/awesome-cpp/blob/master" target="_blank">BeeCrypt</a>：</li>
<li><a href="http://botan.randombit.net/" target="_blank">Botan</a>： C++加密库</li>
<li><a href="http://www.cryptopp.com/" target="_blank">Crypto++</a>：一个有关加密方案的免费的C++库</li>
<li><a href="https://www.gnupg.org/" target="_blank">GnuPG</a>： OpenPGP标准的完整实现</li>
<li><a href="http://www.gnutls.org/" target="_blank">GnuTLS</a> ：实现了SSL，TLS和DTLS协议的安全通信库</li>
<li><a href="http://www.gnu.org/software/libgcrypt/" target="_blank">Libgcrypt</a></li>
<li><a href="https://github.com/fffaraz/awesome-cpp/blob/master" target="_blank">libmcrypt</a></li>
<li><a href="http://www.libressl.org/" target="_blank">LibreSSL</a>：免费的SSL/TLS协议，属于2014 OpenSSL的一个分支</li>
<li><a href="https://github.com/libtom/libtomcrypt" target="_blank">LibTomCrypt</a>：一个非常全面的，模块化的，可移植的加密工具</li>
<li><a href="https://github.com/jedisct1/libsodium" target="_blank">libsodium</a>：基于NaCI的加密库，固执己见，容易使用</li>
<li><a href="http://www.lysator.liu.se/~nisse/nettle/" target="_blank">Nettle</a> 底层的加密库</li>
<li><a href="http://www.openssl.org/" target="_blank">OpenSSL</a> ： 一个强大的，商用的，功能齐全的，开放源代码的加密库。</li>
<li><a href="https://github.com/kokke/tiny-AES128-C" target="_blank">Tiny AES128 in C</a> ：用C实现的一个小巧，可移植的实现了AES128ESB的加密算法</li>
</ul>
<p>&nbsp;</p>
<h3>数据库</h3>
<p>数据库，SQL服务器，ODBC驱动程序和工具</p>
<ul>
<li><a href="https://github.com/paulftw/hiberlite" target="_blank">hiberlite</a> ：用于Sqlite3的C++对象关系映射</li>
<li><a href="https://github.com/redis/hiredis" target="_blank">Hiredis</a>： 用于Redis数据库的很简单的C客户端库</li>
<li><a href="https://github.com/google/leveldb" target="_blank">LevelDB</a>： 快速键值存储库</li>
<li><a href="http://symas.com/mdb/" target="_blank">LMDB</a>：符合数据库四大基本元素的嵌入键值存储</li>
<li><a href="http://www.tangentsoft.net/mysql++/" target="_blank">MySQL++</a>：封装了MySql的C API的C++ 包装器</li>
<li><a href="https://github.com/facebook/rocksdb" target="_blank">RocksDB</a>：来自Facebook的嵌入键值的快速存储</li>
<li><a href="http://www.sqlite.org/" target="_blank">SQLite</a>：一个完全嵌入式的，功能齐全的关系数据库，只有几百KB，可以正确包含到你的项目中。</li>
</ul>
<p>&nbsp;</p>
<h3>调试</h3>
<p>调试库， 内存和资源泄露检测，单元测试</p>
<ul>
<li><a href="http://www.boost.org/doc/libs/master/libs/test/doc/html/index.html" target="_blank">Boost.Test</a>：Boost测试库</li>
<li><a href="https://github.com/philsquared/Catch" target="_blank">Catch</a>：一个很时尚的，C++原生的框架，只包含头文件，用于单元测试，测试驱动开发和行为驱动开发。</li>
<li><a href="http://www.freedesktop.org/wiki/Software/cppunit/" target="_blank">CppUnit</a>：由JUnit移植过来的C++测试框架</li>
<li><a href="http://www.cmake.org/cmake/help/v2.8.8/ctest.html" target="_blank">CTest</a>：CMake测试驱动程序</li>
<li><a href="http://code.google.com/p/googletest/" target="_blank">googletest</a>：谷歌C++测试框架</li>
<li><a href="https://github.com/deplinenoise/ig-debugheap" target="_blank">ig-debugheap</a>：用于跟踪内存错误的多平台调试堆</li>
<li><a href="https://github.com/zorgnax/libtap" target="_blank">libtap</a>：用C语言编写测试</li>
<li><a href="http://www.almostinfinite.com/memtrack.html" target="_blank">MemTrack</a> —用于C++跟踪内存分配</li>
<li><a href="https://bitbucket.org/jonasmeyer/microprofile/overview" target="_blank">microprofile</a>- 跨平台的网络试图分析器</li>
<li><a href="http://www.jera.com/techinfo/jtns/jtn002.html" target="_blank">minUnit</a> ：使用C写的迷你单元测试框架，只使用了两个宏</li>
<li><a href="https://github.com/Celtoys/Remotery" target="_blank">Remotery</a>：用于web视图的单一C文件分析器</li>
<li><a href="http://unittest-cpp.sourceforge.net/" target="_blank">UnitTest++</a>：轻量级的C++单元测试框架</li>
</ul>
<p>&nbsp;</p>
<h3>游戏引擎</h3>
<ul>
<li><a href="http://www.cocos2d-x.org/" target="_blank">Cocos2d-x</a> ：一个跨平台框架，用于构建2D游戏，互动图书，演示和其他图形应用程序。</li>
<li><a href="http://gritengine.com/" target="_blank">Grit</a> ：社区项目，用于构建一个免费的游戏引擎，实现开放的世界3D游戏。</li>
<li><a href="http://irrlicht.sourceforge.net/" target="_blank">Irrlicht</a> ：C++语言编写的开源高性能的实时#D引擎</li>
<li><a href="http://polycode.org/" target="_blank">Polycode</a>：C++实现的用于创建游戏的开源框架（与Lua绑定）。</li>
</ul>
<p>&nbsp;</p>
<h3>图形用户界面</h3>
<ul>
<li><a href="http://cegui.org.uk/" target="_blank">CEGUI</a> ： 很灵活的跨平台GUI库</li>
<li><a href="http://www.fltk.org/index.php" target="_blank">FLTK</a> ：快速，轻量级的跨平台的C++GUI工具包。</li>
<li><a href="http://www.gtk.org/" target="_blank">GTK+</a>： 用于创建图形用户界面的跨平台工具包</li>
<li><a href="http://www.gtkmm.org/en/" target="_blank">gtkmm</a> ：用于受欢迎的GUI库GTK+的官方C++接口。</li>
<li><a href="https://github.com/ocornut/imgui" target="_blank">imgui</a>：拥有最小依赖关系的立即模式图形用户界面</li>
<li><a href="http://librocket.com/" target="_blank">libRocket</a> ：<a href="http://librocket.com/" target="_blank">libRocket</a> 是一个C++ HTML/CSS 游戏接口中间件</li>
<li><a href="http://mygui.info/" target="_blank">MyGUI</a> ：快速，灵活，简单的GUI</li>
<li><a href="http://invisible-island.net/ncurses/" target="_blank">Ncurses</a>：终端用户界面</li>
<li><a href="http://qcustomplot.com/" target="_blank">QCustomPlot</a> ：没有更多依赖关系的Qt绘图控件</li>
<li><a href="http://qwt.sourceforge.net/" target="_blank">Qwt</a> ：用户与技术应用的Qt 控件</li>
<li><a href="http://qwtplot3d.sourceforge.net/" target="_blank">QwtPlot3D</a> ：功能丰富的基于Qt/OpenGL的C++编程库，本质上提供了一群3D控件</li>
<li><a href="https://github.com/Twolewis/OtterUI" target="_blank">OtterUI</a> ：<a href="https://github.com/Twolewis/OtterUI" target="_blank">OtterUI</a> 是用于嵌入式系统和互动娱乐软件的用户界面开发解决方案</li>
<li><a href="http://pdcurses.sourceforge.net/" target="_blank">PDCurses</a> 包含源代码和预编译库的公共图形函数库</li>
<li><a href="http://wxwidgets.org/" target="_blank">wxWidgets</a> C++库，允许开发人员使用一个代码库可以为widows， Mac OS X，Linux和其他平台创建应用程序</li>
</ul>
<p>&nbsp;</p>
<h3>图形</h3>
<ul>
<li><a href="https://github.com/bkaradzic/bgfx" target="_blank">bgfx</a>：跨平台的渲染库</li>
<li><a href="http://www.cairographics.org/" target="_blank">Cairo</a>：支持多种输出设备的2D图形库</li>
<li><a href="https://github.com/horde3d/Horde3D" target="_blank">Horde3D</a> 一个小型的3D渲染和动画引擎</li>
<li><a href="https://github.com/mosra/magnum" target="_blank">magnum</a> C++11和OpenGL 2D/3D 图形引擎</li>
<li><a href="http://www.ogre3d.org/" target="_blank">Ogre 3D</a> 用C++编写的一个面向场景，实时，灵活的3D渲染引擎（并非游戏引擎）</li>
<li><a href="http://www.openscenegraph.org/" target="_blank">OpenSceneGraph</a> 具有高性能的开源3D图形工具包</li>
<li><a href="http://www.panda3d.org/" target="_blank">Panda3D</a> 用于3D渲染和游戏开发的框架，用Python和C++编写。</li>
<li><a href="https://github.com/google/skia" target="_blank">Skia</a> 用于绘制文字，图形和图像的完整的2D图形库</li>
<li><a href="https://github.com/urho3d/Urho3D" target="_blank">urho3d</a> 跨平台的渲染和游戏引擎。</li>
</ul>
<p>&nbsp;</p>
<h3>图像处理</h3>
<ul>
<li><a href="http://www.boost.org/doc/libs/1_56_0/libs/gil/doc/index.html" target="_blank">Boost.GIL</a>：通用图像库</li>
<li><a href="http://cimg.sourceforge.net/" target="_blank">CImg</a> ：用于图像处理的小型开源C++工具包</li>
<li><a href="http://www.xdp.it/cximage.htm" target="_blank">CxImage</a> ：用于加载，保存，显示和转换的图像处理和转换库，可以处理的图片格式包括 BMP, JPEG, GIF, PNG, TIFF, MNG, ICO, PCX, TGA, WMF, WBMP, JBG, J2K。</li>
<li><a href="http://freeimage.sourceforge.net/" target="_blank">FreeImage</a> ：开源库，支持现在多媒体应用所需的通用图片格式和其他格式。</li>
<li><a href="http://gdcm.sourceforge.net/wiki/index.php/Main_Page" target="_blank">GDCM</a>：Grassroots DICOM 库</li>
<li><a href="http://www.itk.org/" target="_blank">ITK</a>：跨平台的开源图像分析系统</li>
<li><a href="http://www.imagemagick.org/script/api.php" target="_blank">Magick++</a>：ImageMagick程序的C++接口</li>
<li><a href="http://www.imagemagick.org/script/api.php" target="_blank">MagickWnd</a>：ImageMagick程序的C++接口</li>
<li><a href="http://opencv.org/" target="_blank">OpenCV</a> ： 开源计算机视觉类库</li>
<li><a href="https://code.google.com/p/tesseract-ocr/" target="_blank">tesseract-ocr</a>：OCR引擎</li>
<li><a href="https://github.com/ukoethe/vigra" target="_blank">VIGRA</a> ：用于图像分析通用C++计算机视觉库</li>
<li><a href="http://www.vtk.org/" target="_blank">VTK</a> ：用于3D计算机图形学，图像处理和可视化的开源免费软件系统。</li>
</ul>
<p>&nbsp;</p>
<h3>国际化</h3>
<ul>
<li><a href="http://www.gnu.org/software/gettext/" target="_blank">gettext</a> ：GNU `gettext&#8217;</li>
<li><a href="http://site.icu-project.org/" target="_blank">IBM ICU</a>：提供Unicode 和全球化支持的C、C++ 和Java库</li>
<li><a href="http://www.gnu.org/software/libiconv/" target="_blank">libiconv</a> ：用于不同字符编码之间的编码转换库</li>
</ul>
<p>&nbsp;</p>
<h3>Jason</h3>
<ul>
<li><a href="https://github.com/cesanta/frozen" target="_blank">frozen</a> ： C/C++的Jason解析生成器</li>
<li><a href="https://github.com/akheron/jansson" target="_blank">Jansson</a> ：进行编解码和处理Jason数据的C语言库</li>
<li><a href="https://github.com/chrismanning/jbson" target="_blank">jbson</a> ：C++14中构建和迭代BSON data,和Json 文档的库</li>
<li><a href="https://github.com/jeaye/jeayeson" target="_blank">JeayeSON</a>：非常健全的C++ JSON库，只包含头文件</li>
<li><a href="https://github.com/hjiang/jsonxx" target="_blank">JSON++</a> ： C++ JSON 解析器</li>
<li><a href="https://github.com/udp/json-parser" target="_blank">json-parser</a>：用可移植的ANSI C编写的JSON解析器，占用内存非常少</li>
<li><a href="https://github.com/dropbox/json11" target="_blank">json11</a> ：一个迷你的C++11 JSON库</li>
<li><a href="https://github.com/amir-s/jute" target="_blank">jute</a> ：非常简单的C++ JSON解析器</li>
<li><a href="https://github.com/vincenthz/libjson" target="_blank">ibjson</a>：C语言中的JSON解析和打印库，很容易和任何模型集成。</li>
<li><a href="http://sourceforge.net/projects/libjson/" target="_blank">libjson</a>：轻量级的JSON库</li>
<li><a href="https://github.com/kazuho/picojson" target="_blank">PicoJSON</a>：C++中JSON解析序列化，只包含头文件</li>
<li><a href="https://github.com/gaudecker/qt-json" target="_blank">qt-json</a> ：用于JSON数据和 QVariant层次间的相互解析的简单类</li>
<li><a href="https://github.com/flavio/qjson" target="_blank">QJson</a>：将JSON数据映射到QVariant对象的基于Qt的库</li>
<li><a href="https://github.com/miloyip/rapidjson" target="_blank">RapidJSON</a>： 用于C++的快速JSON 解析生成器，包含SAX和DOM两种风格的API</li>
<li><a href="https://github.com/lloyd/yajl" target="_blank">YAJL</a> ：C语言中快速流JSON解析库</li>
</ul>
<p>&nbsp;</p>
<h3>日志</h3>
<ul>
<li><a href="http://www.boost.org/doc/libs/1_56_0/libs/log/doc/html/index.html" target="_blank">Boost.Log</a> ：设计非常模块化，并且具有扩展性</li>
<li><a href="https://github.com/easylogging/easyloggingpp" target="_blank">easyloggingpp</a>：C++日志库，只包含单一的头文件。</li>
<li><a href="http://log4cpp.sourceforge.net/" target="_blank">Log4cpp</a> ：一系列C++类库，灵活添加日志到文件，系统日志，IDSA和其他地方。</li>
<li><a href="http://www.templog.org/" target="_blank">templog</a>：轻量级C++库，可以添加日志到你的C++应用程序中</li>
</ul>
<p>&nbsp;</p>
<h3>机器学习</h3>
<ul>
<li><a href="https://github.com/BVLC/caffe" target="_blank">Caffe</a> ：快速的神经网络框架</li>
<li><a href="https://github.com/liuliu/ccv" target="_blank">CCV</a> ：以C语言为核心的现代计算机视觉库</li>
<li><a href="http://www.mlpack.org/" target="_blank">mlpack</a> ：可扩展的C++机器学习库</li>
<li><a href="https://github.com/Itseez/opencv" target="_blank">OpenCV</a>：开源计算机视觉库</li>
<li><a href="https://github.com/GHamrouni/Recommender" target="_blank">Recommender</a>：使用协同过滤进行产品推荐/建议的C语言库。</li>
<li><a href="https://github.com/shogun-toolbox/shogun" target="_blank">SHOGUN</a>：Shogun 机器学习工具</li>
<li><a href="https://code.google.com/p/sofia-ml/" target="_blank">sofia-ml</a> ：用于机器学习的快速增量算法套件</li>
</ul>
<p>&nbsp;</p>
<h3>数学</h3>
<ul>
<li><a href="http://arma.sourceforge.net/" target="_blank">Armadillo</a> ：高质量的C++线性代数库，速度和易用性做到了很好的平衡。语法和MatlAB很相似</li>
<li><a href="https://code.google.com/p/blaze-lib/" target="_blank">blaze</a>：高性能的C++数学库，用于密集和稀疏算法。</li>
<li><a href="http://ceres-solver.org/" target="_blank">ceres-solver</a> ：来自谷歌的C++库，用于建模和解决大型复杂非线性最小平方问题。</li>
<li><a href="http://www.cgal.org/" target="_blank">CGal</a>： 高效，可靠的集合算法集合</li>
<li><a href="http://cmldev.net/" target="_blank">cml</a> ：用于游戏和图形的免费C++数学库</li>
<li><a href="http://eigen.tuxfamily.org/" target="_blank">Eigen</a> ：高级C++模板头文件库，包括线性代数，矩阵，向量操作，数值解决和其他相关的算法。</li>
<li><a href="http://ggt.sourceforge.net/" target="_blank">GMTL</a>：数学图形模板库是一组广泛实现基本图形的工具。</li>
<li><a href="https://gmplib.org/" target="_blank">GMP</a>：用于个高精度计算的C/C++库，处理有符号整数，有理数和浮点数。</li>
</ul>
<p>&nbsp;</p>
<h3>多媒体</h3>
<ul>
<li><a href="http://gstreamer.freedesktop.org/" target="_blank">GStreamer</a> ：构建媒体处理组件图形的库</li>
<li><a href="http://www.live555.com/liveMedia/" target="_blank">LIVE555 Streaming Media</a> ：使用开放标准协议(RTP/RTCP, RTSP, SIP) 的多媒体流库</li>
<li><a href="https://wiki.videolan.org/LibVLC" target="_blank">libVLC</a> ：libVLC (VLC SDK)媒体框架</li>
<li><a href="https://github.com/wang-bin/QtAV" target="_blank">QtAv</a>：基于Qt和FFmpeg的多媒体播放框架，能够帮助你轻而易举地编写出一个播放器</li>
<li><a href="http://www.libsdl.org/" target="_blank">SDL</a> ：简单直控媒体层</li>
<li><a href="http://www.sfml-dev.org/" target="_blank">SFML</a> ：快速，简单的多媒体库</li>
</ul>
<p>&nbsp;</p>
<h3>网络</h3>
<ul>
<li><a href="http://www.cs.wustl.edu/~schmidt/ACE.html" target="_blank">ACE</a>：C++面向对象网络变成工具包</li>
<li><a href="http://think-async.com/" target="_blank">Boost.Asio</a>：用于网络和底层I/O编程的跨平台的C++库</li>
<li><a href="http://casablanca.codeplex.com/" target="_blank">Casablanca</a>：C++ REST SDK</li>
<li><a href="http://cpp-netlib.org/" target="_blank">cpp-netlib</a>：高级网络编程的开源库集合</li>
<li><a href="https://github.com/rxi/dyad" target="_blank">Dyad.c</a>：C语言的异步网络</li>
<li><a href="http://curl.haxx.se/libcurl/" target="_blank">libcurl</a> :多协议文件传输库</li>
<li><a href="https://github.com/cesanta/mongoose" target="_blank">Mongoose</a><span style="text-decoration: underline;">：</span>非常轻量级的网络服务器</li>
<li><a href="https://github.com/chenshuo/muduo" target="_blank">Muduo</a> ：用于Linux多线程服务器的C++非阻塞网络库</li>
<li><a href="https://github.com/cesanta/net_skeleton" target="_blank">net_skeleton</a> ：C/C++的TCP 客户端/服务器库</li>
<li><a href="https://github.com/riolet/nope.c" target="_blank">nope.c</a> ：基于C语言的超轻型软件平台，用于可扩展的服务器端和网络应用。 对于C编程人员，可以考虑node.js</li>
<li><a href="https://github.com/davidmoreno/onion" target="_blank">Onion</a> :C语言HTTP服务器库，其设计为轻量级，易使用。</li>
<li><a href="https://github.com/pocoproject" target="_blank">POCO</a>：用于构建网络和基于互联网应用程序的C++类库，可以运行在桌面，服务器，移动和嵌入式系统。</li>
<li><a href="https://github.com/OculusVR/RakNet" target="_blank">RakNet</a>：为游戏开发人员提供的跨平台的开源C++网络引擎。</li>
<li><a href="https://github.com/vinipsmaker/tufao" target="_blank">Tuf o</a> ：用于Qt之上的C++构建的异步Web框架。</li>
<li><a href="https://github.com/zaphoyd/websocketpp" target="_blank">WebSocket++</a> ：基于C++/Boost Aiso的websocket 客户端/服务器库</li>
<li><a href="http://zeromq.org/" target="_blank">ZeroMQ</a> ：高速，模块化的异步通信库</li>
</ul>
<p>&nbsp;</p>
<h3>物理学</h3>
<p>动力学仿真引擎</p>
<ul>
<li><a href="https://code.google.com/p/box2d/" target="_blank">Box2D</a>：2D的游戏物理引擎。</li>
<li><a href="https://github.com/bulletphysics/bullet3" target="_blank">Bullet</a> ：3D的游戏物理引擎。</li>
<li><a href="https://github.com/slembcke/Chipmunk2D" target="_blank">Chipmunk</a> ：快速，轻量级的2D游戏物理库</li>
<li><a href="https://github.com/google/liquidfun" target="_blank">LiquidFun</a>：2D的游戏物理引擎</li>
<li><a href="http://www.ode.org/" target="_blank">ODE</a> ：开放动力学引擎-开源，高性能库，模拟刚体动力学。</li>
<li><a href="https://github.com/vanderlin/ofxBox2d" target="_blank">ofxBox2d</a>：Box2D开源框架包装器。</li>
<li><a href="https://github.com/simbody/simbody" target="_blank">Simbody</a> ：高性能C++多体动力学/物理库，模拟关节生物力学和机械系统，像车辆，机器人和人体骨骼。</li>
</ul>
<p>&nbsp;</p>
<h3>机器人学</h3>
<ul>
<li><a href="http://moos-ivp.org/" target="_blank">MOOS-IvP</a> ：一组开源C++模块，提供机器人平台的自主权，尤其是自主的海洋车辆。</li>
<li><a href="http://www.mrpt.org/" target="_blank">MRPT</a>：移动机器人编程工具包</li>
<li><a href="https://github.com/PointCloudLibrary/pcl" target="_blank">PCL</a> ：点云库是一个独立的，大规模的开放项目，用于2D/3D图像和点云处理。</li>
<li><a href="http://www.roboticslibrary.org/" target="_blank">Robotics Library (RL)</a>： 一个独立的C++库，包括机器人动力学，运动规划和控制。</li>
<li><a href="http://www.robwork.dk/jrobwork/" target="_blank">RobWork</a>：一组C++库的集合，用于机器人系统的仿真和控制。</li>
<li><a href="http://wiki.ros.org/" target="_blank">ROS</a> ：机器人操作系统，提供了一些库和工具帮助软件开发人员创建机器人应用程序。</li>
</ul>
<p>&nbsp;</p>
<h3>科学计算</h3>
<ul>
<li><a href="http://www.fftw.org/" target="_blank">FFTW</a> :用一维或者多维计算DFT的C语言库。</li>
<li><a href="http://www.gnu.org/software/gsl/" target="_blank">GSL</a>：GNU科学库。</li>
</ul>
<p>&nbsp;</p>
<h3>脚本</h3>
<ul>
<li><a href="https://github.com/ChaiScript/ChaiScript/" target="_blank">ChaiScript</a> ：用于C++的易于使用的嵌入式脚本语言。</li>
<li><a href="http://www.lua.org/" target="_blank">Lua</a> ：用于配置文件和基本应用程序脚本的小型快速脚本引擎。</li>
<li><a href="https://github.com/dafrito/luacxx" target="_blank">luacxx</a>：用于创建Lua绑定的C++ 11 API</li>
<li><a href="http://www.swig.org/" target="_blank">SWIG</a> ：一个可以让你的C++代码链接到JavaScript，Perl，PHP，Python，Tcl和Ruby的包装器/接口生成器</li>
<li><a href="https://github.com/cesanta/v7" target="_blank">V7</a>：嵌入式的JavaScript 引擎。</li>
<li><a href="http://code.google.com/p/v8/" target="_blank">V8</a> ：谷歌的快速JavaScript引擎，可以被嵌入到任何C++应用程序中。</li>
</ul>
<p>&nbsp;</p>
<h3>序列化</h3>
<ul>
<li><a href="http://kentonv.github.io/capnproto/" target="_blank">Cap&#8217;n Proto</a> ：快速数据交换格式和RPC系统。</li>
<li><a href="https://github.com/USCiLab/cereal" target="_blank">cereal</a> ：C++11 序列化库</li>
<li><a href="https://github.com/google/flatbuffers" target="_blank">FlatBuffers</a> ：内存高效的序列化库</li>
<li><a href="https://github.com/msgpack/msgpack-c" target="_blank">MessagePack</a> ：C/C++的高效二进制序列化库，例如 JSON</li>
<li><a href="http://code.google.com/p/protobuf/" target="_blank">protobuf</a> ：协议缓冲，谷歌的数据交换格式。</li>
<li><a href="https://github.com/protobuf-c/protobuf-c" target="_blank">protobuf-c</a> ：C语言的协议缓冲实现</li>
<li><a href="https://github.com/real-logic/simple-binary-encoding" target="_blank">SimpleBinaryEncoding</a>：用于低延迟应用程序的对二进制格式的应用程序信息的编码和解码。</li>
<li><a href="https://thrift.apache.org/" target="_blank">Thrift</a> ：高效的跨语言IPC/RPC，用于C++，Java，Python，PHP，C#和其它多种语言中，最初由Twitter开发。</li>
</ul>
<p>&nbsp;</p>
<h3>视频</h3>
<ul>
<li><a href="http://www.webmproject.org/code/" target="_blank">libvpx</a> ：VP8/VP9编码解码SDK</li>
<li><a href="https://www.ffmpeg.org/" target="_blank">FFmpeg</a> ：一个完整的，跨平台的解决方案，用于记录，转换视频和音频流。</li>
<li><a href="https://github.com/strukturag/libde265" target="_blank">libde265</a> ：开放的h.265视频编解码器的实现。</li>
<li><a href="https://github.com/cisco/openh264" target="_blank">OpenH264</a>：开源H.364 编解码器。</li>
<li><a href="http://www.theora.org/" target="_blank">Theora</a> ：免费开源的视频压缩格式。</li>
</ul>
<p>&nbsp;</p>
<h3>虚拟机</h3>
<ul>
<li><a href="https://github.com/tekknolagi/carp" target="_blank">CarpVM</a>：C中有趣的VM，让我们一起来看看这个。</li>
<li><a href="https://github.com/micropython/micropython" target="_blank">MicroPython</a> ：旨在实现单片机上Python3.x的实现</li>
<li><a href="https://github.com/jakogut/tinyvm" target="_blank">TinyVM</a>：用纯粹的ANSI C编写的小型，快速，轻量级的虚拟机。</li>
</ul>
<p>&nbsp;</p>
<h3>Web应用框架</h3>
<ul>
<li><a href="https://github.com/bel2125/civetweb" target="_blank">Civetweb</a> ：提供易于使用，强大的，C/C++嵌入式Web服务器，带有可选的CGI，SSL和Lua支持。</li>
<li><a href="http://cppcms.com/" target="_blank">CppCMS</a> ：免费高性能的Web开发框架（不是 CMS）.</li>
<li><a href="https://github.com/ipkn/crow" target="_blank">Crow</a> ：一个C++微型web框架（灵感来自于Python Flask）</li>
<li><a href="https://kore.io/" target="_blank">Kore</a> :使用C语言开发的用于web应用程序的超快速和灵活的web服务器/框架。</li>
<li><a href="http://www.coralbits.com/libonion/" target="_blank">libOnion</a>：轻量级的库，帮助你使用C编程语言创建web服务器。</li>
<li><a href="https://github.com/jlaine/qdjango/" target="_blank">QDjango</a>：使用C++编写的，基于Qt库的web框架，试图效仿Django API，因此得此名。</li>
<li><a href="http://www.webtoolkit.eu/wt" target="_blank">Wt</a> ：开发Web应用的C++库。</li>
</ul>
<p>&nbsp;</p>
<h3>XML</h3>
<p>XML就是个垃圾，xml的解析很烦人，对于计算机它也是个灾难。这种糟糕的东西完全没有存在的理由了。-Linus Torvalds</p>
<ul>
<li><a href="http://www.libexpat.org/" target="_blank">Expat</a> ：用C语言编写的xml解析库</li>
<li><a href="http://xmlsoft.org/" target="_blank">Libxml2</a> ：Gnome的xml C解析器和工具包</li>
<li><a href="http://libxmlplusplus.sourceforge.net/" target="_blank">libxml++</a> ：C++的xml解析器</li>
<li><a href="http://pugixml.org/" target="_blank">PugiXML</a> ：用于C++的，支持XPath的轻量级，简单快速的XML解析器。</li>
<li><a href="http://rapidxml.sourceforge.net/" target="_blank">RapidXml</a> ：试图创建最快速的XML解析器，同时保持易用性，可移植性和合理的W3C兼容性。</li>
<li><a href="http://sourceforge.net/projects/tinyxml/" target="_blank">TinyXML</a> ：简单小型的C++XML解析器，可以很容易地集成到其它项目中。</li>
<li><a href="https://github.com/leethomason/tinyxml2" target="_blank">TinyXML2</a>：简单快速的C++CML解析器，可以很容易集成到其它项目中。</li>
<li><a href="https://code.google.com/p/ticpp/" target="_blank">TinyXML++</a>：TinyXML的一个全新的接口，使用了C++的许多许多优势，模板，异常和更好的异常处理。</li>
<li><a href="http://xerces.apache.org/xerces-c/" target="_blank">Xerces-C++</a> ：用可移植的C++的子集编写的XML验证解析器。</li>
</ul>
<p>&nbsp;</p>
<h3>多项混杂</h3>
<p>一些有用的库或者工具，但是不适合上面的分类，或者还没有分类。</p>
<ul>
<li><a href="https://github.com/cppformat/cppformat" target="_blank">C++ Format</a> ：C++的小型，安全和快速格式化库</li>
<li><a href="https://code.google.com/p/casacore/" target="_blank">casacore</a> ：从aips++ 派生的一系列C++核心库</li>
<li><a href="https://github.com/louisdx/cxx-prettyprint" target="_blank">cxx-prettyprint</a>：用于C++容器的打印库</li>
<li><a href="http://www.dynaforms.com/" target="_blank">DynaPDF</a> ：易于使用的PDF生成库</li>
<li><a href="https://github.com/leafsr/gcc-poison" target="_blank">gcc-poison</a> ：帮助开发人员禁止应用程序中的不安全的C/C++函数的简单的头文件。</li>
<li><a href="http://code.google.com/p/googlemock/" target="_blank">googlemock</a>：编写和使用C++模拟类的库</li>
<li><a href="https://github.com/joyent/http-parser" target="_blank">HTTP Parser</a> ：C的http请求/响应解析器</li>
<li><a href="https://github.com/anrieff/libcpuid" target="_blank">libcpuid</a> ：用于x86 CPU检测盒特征提取的小型C库</li>
<li><a href="https://github.com/avati/libevil" target="_blank">libevil</a> ：许可证管理器</li>
<li><a href="http://www.libusb.org/" target="_blank">libusb</a>：允许移动访问USB设备的通用USB库</li>
<li><a href="http://pcre.org/" target="_blank">PCRE</a>：正则表达式C库，灵感来自于Perl中正则表达式的功能。</li>
<li><a href="http://www.deltavsoft.com/" target="_blank">Remote Call Framework</a> ：C++的进程间通信框架。</li>
<li><a href="http://scintilla.org/" target="_blank">Scintilla</a> ：开源的代码编辑控件</li>
<li><a href="https://github.com/wjwwood/serial" target="_blank">Serial Communication Library</a> ：C++语言编写的跨平台，串口库。</li>
<li><a href="https://github.com/antirez/sds" target="_blank">SDS</a>：C的简单动态字符串库</li>
<li><a href="https://github.com/cesanta/sldr" target="_blank">SLDR</a> ：超轻的DNS解析器</li>
<li><a href="https://github.com/cesanta/slre" target="_blank">SLRE</a>： 超轻的正则表达式库</li>
<li><a href="https://github.com/rtv/Stage" target="_blank">Stage</a> ：移动机器人模拟器</li>
<li><a href="https://code.google.com/p/vartypes/" target="_blank">VarTypes</a>：C++/Qt4功能丰富，面向对象的管理变量的框架。</li>
<li><a href="http://zbar.sourceforge.net/" target="_blank">ZBar</a>：‘条形码扫描器’库，可以扫描照片，图片和视频流中的条形码，并返回结果。</li>
<li><a href="https://github.com/VerbalExpressions/CppVerbalExpressions" target="_blank">CppVerbalExpressions</a> ：易于使用的C++正则表达式</li>
<li><a href="https://github.com/VerbalExpressions/QtVerbalExpressions" target="_blank">QtVerbalExpressions</a>：基于C++ VerbalExpressions 库的Qt库</li>
<li><a href="https://github.com/CopernicaMarketingSoftware/PHP-CPP" target="_blank">PHP-CPP</a>：使用C++来构建PHP扩展的库</li>
<li><a href="http://bstring.sourceforge.net/" target="_blank">Better String</a> ：C的另一个字符串库，功能更丰富，但是没有缓冲溢出问题，还包含了一个C++包装器。</li>
</ul>
<p>&nbsp;</p>
<h3>软件</h3>
<p>用于创建开发环境的软件</p>
<h3>编译器</h3>
<p>C/C++编译器列表</p>
<ul>
<li><a href="http://clang.llvm.org/" target="_blank">Clang</a> :由苹果公司开发的</li>
<li><a href="https://gcc.gnu.org/" target="_blank">GCC</a>：GNU编译器集合</li>
<li><a href="https://software.intel.com/en-us/c-compilers" target="_blank">Intel C++ Compiler</a> ：由英特尔公司开发</li>
<li><a href="http://llvm.org/" target="_blank">LLVM</a> ：模块化和可重用编译器和工具链技术的集合</li>
<li><a href="http://msdn.microsoft.com/en-us/vstudio/hh386302.aspx" target="_blank">Microsoft Visual C++</a> ：MSVC，由微软公司开发</li>
<li><a href="http://www.openwatcom.org/index.php/Main_Page" target="_blank">Open WatCom</a> ：Watcom，C，C++和Fortran交叉编译器和工具</li>
<li><a href="http://bellard.org/tcc/" target="_blank">TCC</a> ：轻量级的C语言编译器</li>
</ul>
<p>&nbsp;</p>
<h3>在线编译器</h3>
<p>在线C/C++编译器列表</p>
<ul>
<li><a href="http://codepad.org/" target="_blank">codepad</a> ：在线编译器/解释器，一个简单的协作工具</li>
<li><a href="http://codetwist.com/" target="_blank">CodeTwist</a>：一个简单的在线编译器/解释器，你可以粘贴的C,C++或者Java代码，在线执行并查看结果</li>
<li><a href="http://coliru.stacked-crooked.com/" target="_blank">coliru</a> ：在线编译器/shell， 支持各种C++编译器</li>
<li><a href="http://gcc.godbolt.org/" target="_blank">Compiler Explorer</a>：交互式编译器，可以进行汇编输出</li>
<li><a href="http://www.compileonline.com/compile_cpp11_online.php" target="_blank">CompileOnline</a>：Linux上在线编译和执行C++程序</li>
<li><a href="http://ideone.com/" target="_blank">Ideone</a> ：一个在线编译器和调试工具，允许你在线编译源代码并执行，支持60多种编程语言。</li>
</ul>
<p>&nbsp;</p>
<h3>调试器</h3>
<p>C/C++调试器列表</p>
<ul>
<li><a href="http://en.wikipedia.org/wiki/Comparison_of_debuggers" target="_blank">Comparison of debuggers</a> ：来自维基百科的调试器列表</li>
<li><a href="https://www.gnu.org/software/gdb" target="_blank">GDB</a> ：GNU调试器</li>
<li><a href="http://valgrind.org/" target="_blank">Valgrind</a>：内存调试，内存泄露检测，性能分析工具。</li>
</ul>
<p>&nbsp;</p>
<h3>集成开发环境（IDE）</h3>
<p>C/C++集成开发环境列表</p>
<ul>
<li><a href="http://www.jetbrains.com/objc/" target="_blank">AppCode</a> ：构建与JetBrains’ IntelliJ IDEA 平台上的用于Objective-C，C,C++，Java和Java开发的集成开发环境</li>
<li><a href="http://www.jetbrains.com/clion/" target="_blank">CLion</a>：来自JetBrains的跨平台的C/C++的集成开发环境</li>
<li><a href="http://www.codeblocks.org/" target="_blank">Code::Blocks</a> ：免费C，C++和Fortran的集成开发环境</li>
<li><a href="http://codelite.org/" target="_blank">CodeLite</a> ：另一个跨平台的免费的C/C++集成开发环境</li>
<li><a href="http://sourceforge.net/projects/orwelldevcpp/" target="_blank">Dev-C++</a>：可移植的C/C++/C++11集成开发环境</li>
<li><a href="http://www.eclipse.org/cdt/" target="_blank">Eclipse CDT</a>：基于Eclipse平台的功能齐全的C和C++集成开发环境</li>
<li><a href="http://www.geany.org/" target="_blank">Geany</a> ：轻量级的快速，跨平台的集成开发环境。</li>
<li><a href="http://www-03.ibm.com/software/products/en/visgen" target="_blank">IBM VisualAge</a> ：来自IBM的家庭计算机集成开发环境。</li>
<li><a href="https://github.com/Sarcasm/irony-mode" target="_blank">Irony-mode</a>：由libclang驱动的用于Emacs的C/C++微模式</li>
<li><a href="https://www.kdevelop.org/" target="_blank">KDevelop</a>：免费开源集成开发环境</li>
<li><a href="http://www.visualstudio.com/" target="_blank">Microsoft Visual Studio</a> ：来自微软的集成开发环境</li>
<li><a href="https://netbeans.org/" target="_blank">NetBeans</a> ：主要用于Java开发的的集成开发环境，也支持其他语言，尤其是PHP，C/C++和HTML5。</li>
<li><a href="http://qt-project.org/" target="_blank">Qt Creator</a>：跨平台的C++，Javascript和QML集成开发环境，也是Qt SDK的一部分。</li>
<li><a href="https://github.com/Andersbakken/rtags" target="_blank">rtags</a>：C/C++的客户端服务器索引，用于 跟基于clang的emacs的集成</li>
<li><a href="https://developer.apple.com/xcode/" target="_blank">Xcode</a> ：由苹果公司开发</li>
<li><a href="https://valloric.github.io/YouCompleteMe/" target="_blank">YouCompleteMe</a>：一个用于Vim的根据你敲的代码快速模糊搜索并进行代码补全的引擎。</li>
</ul>
<p>&nbsp;</p>
<h3>构建系统</h3>
<ul>
<li><a href="https://github.com/rizsotto/Bear" target="_blank">Bear</a> ：用于为clang工具生成编译数据库的工具</li>
<li><a href="https://www.biicode.com/" target="_blank">Biicode</a>：基于文件的简单依赖管理器。</li>
<li><a href="http://www.cmake.org/" target="_blank">CMake</a> ：跨平台的免费开源软件用于管理软件使用独立编译的方法进行构建的过程。</li>
<li><a href="https://github.com/iauns/cpm" target="_blank">CPM</a>：基于CMake和Git的C++包管理器</li>
<li><a href="http://www.fastbuild.org/docs/home.html" target="_blank">FASTBuild</a>：高性能，开源的构建系统，支持高度可扩展性的编译，缓冲和网络分布。</li>
<li><a href="http://martine.github.io/ninja/" target="_blank">Ninja</a> ：专注于速度的小型构建系统</li>
<li><a href="http://www.scons.org/" target="_blank">Scons</a> ：使用Python scipt 配置的软件构建工具</li>
<li><a href="https://github.com/deplinenoise/tundra" target="_blank">tundra</a> ：高性能的代码构建系统，甚至对于非常大型的软件项目，也能提供最好的增量构建次数。</li>
<li><a href="http://gittup.org/tup/" target="_blank">tup</a>：基于文件的构建系统，用于后台监控变化的文件。</li>
</ul>
<p>&nbsp;</p>
<h3>静态代码分析</h3>
<p>提高质量，减少瑕疵的代码分析工具列表</p>
<ul>
<li><a href="http://cppcheck.sourceforge.net/" target="_blank">Cppcheck</a> ：静态C/C++代码分析工具</li>
<li><a href="https://code.google.com/p/include-what-you-use/" target="_blank">include-what-you-use</a> ：使用clang进行代码分析的工具，可以#include在C和C++文件中。</li>
<li><a href="http://oclint.org/" target="_blank">OCLint</a> ：用于C，C++和Objective-C的静态源代码分析工具，用于提高质量，减少瑕疵。</li>
<li><a href="http://clang-analyzer.llvm.org/index.html" target="_blank">Clang Static Analyzer</a>：查找C，C++和Objective-C程序bug的源代码分析工具</li>
<li><a href="http://en.wikipedia.org/wiki/List_of_tools_for_static_code_analysis#C.2FC.2B.2B" target="_blank">List of tools for static code analysis</a> ：来自维基百科的静态代码分析工具列表</li>
</ul>


感谢平凡之路和fffaraz 的整理，转载请注明出处。
