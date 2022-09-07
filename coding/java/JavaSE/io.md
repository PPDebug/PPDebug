# I/O 

## 什么是序列化、什么是反序列化

* 序列化： 将数据结构或对象转换成二进制字节流的过程
* 反序列化：将在序列化过程中所生成的二进制字节流转换成数据结构或者对象的过程

## Java 序列化中如果有些字段不想进行序列化

对于不想进行序列化的变量，使用 transient 关键字修饰。

transient 关键字的作用是：阻止实例中那些用此关键字修饰的的变量序列化；当对象被反序列化时，被 transient 修饰的变量值不会被持久化和恢复。

transient 还有几点注意：
* transient 只能修饰变量，不能修饰类和方法。
* transient 修饰的变量，在反序列化后变量值将会被置成类型的默认值。例如，如果是修饰 int 类型，那么反序列后结果就是 0。
* static 变量因为不属于任何对象(Object)，所以无论有没有 transient 关键字修饰，均不会被序列化。

## 获取键盘输入常用的方式

<!-- tabs:start -->
#### **Scaner**
```java
Scanner input = new Scanner(System.in);
String s  = input.nextLine();
input.close();
```

#### **Reader**
```java
BufferedReader input = new BufferedReader(new InputStreamReader(System.in));
String s = input.readLine();
```
<!-- tabs:end -->

## Java中IO流分为几种
* 按照流的流向分：输入流和输出流；
* 按照操作单元划分：字节流和字符流；
* 按照角色划分：节点流和处理流；

## 流的选择
如果我们不知道编码类型就很容易出现乱码问题。如果音频文件、图片等媒体文件用字节流比较好，如果涉及到字符的话使用字符流比较好。 


## 阻塞IO/非阻塞IO
我们知道数据的读取分为两个阶段：内核准备数据-> 数据从内核空间复制到用户空间

阻塞IO其实就是当发起系统IO调用后必须一直等待直到两阶段都执行完毕。

非阻塞IO其实就是当内核在准备数据时，系统IO调用直接返回错误值，应用程序可以先干会儿其他事(或者是轮询的方式尝试读取其它数据)，隔一会儿再重试。

可见阻塞IO和非阻塞的区别是内核准备数据时，用户进程是否必须等待(不能干其他事)来判断的。

## 同步IO/异步IO

同步和异步主要是IO响应的通知方式不同。

同步IO是用户进程去尝试获取IO是否就绪，即数据准备阶段是否完成，可以是阻塞式的，也可以是非阻塞式的。

异步IO是用户进程发起一个异步IO操作，然后完全不管，知道内核将数据处理完成后通过信号来通知用户进程。

* [Java NIO](/coding/java/JavaSE/nio.md)

## IO多路复用

> linux系统为例

Linux对文件的操作实际上就是通过文件描述符(fd)来进行的。IO多路服用就是通过一个线程监听多个文件描述符，一旦某个文件描述符准备就绪，就去通知程序做相应的处理。这种通知方式并不能加快单个链接的处理速度，但是可以处理更多的连接。

在Linux下复用模型有select,poll和epoll

### select

select基于轮询机制。

select 通过设置和检车存放fd标志位的数据结构(位图，设置为1表示监听该文件描述符)来进行下一步处理。

select处理的数量有限，其最大大小有FD_SETSIZE宏定义，其大小是1024或2048取决于不同机器的宏的定义。

select对文件描述符的查看是线性扫描，即轮询。每次扫描会查看所有的文件描述符，将准备好了的文件描述符子集返回。

```C
int select (int n, fd_set *fdset, NULL, NULL, NULL);

`
select函数会一直阻塞直到描述符集合fd_set中至少一个描述符准备好可以读了，该函数执行完成后会将等待描述符集合fd_set指向其子集ready_set，然后再遍历描述符集合选出ready_set置为一的执行文件读取操作。

### poll方法

和select类似，只是描述符fd集合的方式不同，poll使用pollfd结构体的数组(大小=监听文件描述符的数量 * sizeof(pollfd))而不是select的fd_set位图(大小固定1024或2048)。
```c
struct pollfd {
    int fd;
    short events;
    short revents;
}
```
包含大量文件描述符的数组被整体复制与用户态和内核的地址空间之间，因此开销随文件描述符数目增加而线性增加。

### epoll

epoll模型修改主动轮询为被动通知，当有事件发生时，被动接受通知。
epoll同样使用没有使用位图而是使用自定义结构体epoll_event，因此没有也没有最大处理数限制。
简单理解就是epoll将就绪的文件描述符专门维护了一一块空间，每次就从就序列表中拿就好了，不再对所有的文件描述符进行遍历。

[百科-epoll](https://baike.quark.cn/c/lemma/24723122334864#/index)

## 零拷贝

>目的： 提高读写性能
* [zero copy](https://zhuanlan.zhihu.com/p/362499466)
* [mmap](https://zhuanlan.zhihu.com/p/348586130)


