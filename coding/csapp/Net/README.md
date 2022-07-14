# 网络编程

## 客户端服务端编程模型

## 网络

## 全球IP因特网

### IP地址

```c
struct in_address {
    uint32_t s_addr; /* Address in network byte order(big-endian) */
}
```

### 因特网域名

* 一级域名、二级域名、三级域名

* HOST.txt

* DNS  

### 因特网连接

套接字： 地址 + 端口

## 套接字接口

套接字接口(socket interface)是一组接口，他们和Unix I/O 结合起来，用于创建网络应用。
### 套接字地址结构
从Linux程序二角度来看，套接字就是一个有相应的=描述符的打开文件。

```c
struct sockaddr_in {
    uint16_t    sin_family; Protocol family(always AF_INET)
    uint16_t    sin_port; /* Prot number in network byte order */
    struct in_addr sin_addr; /* IP address in network byte order */
    unsigned char sin_zero[8]; /* Pad to sizeof(struct sockaddr) */
}

struct sockaddr {
    uint16_t sa_family; /* Protocal family */
    char sa_data[14] /* Address data */
}
```

### socket函数

客户端和服务端使用socket函数来创建一个套接字描述符(socket descrtiption)

```c 
#include <sys/types.h>
#include <sys/socket.h>

int socket(int domain, int type, int portocal);
```

`clientfd = sockect(AF_INEF, SOCK_STREAM, 0);`
socket函数返回的clientfd描述符仅是部分打开的，还不能用于读写。

### connect 函数

客户端调用connect函数来建立和服务器的来连接
```c 
#include <sys/socket.h>
int connect(int clientfd, const struct sockaddr* addr, socklen_t addrlen);
```

### bind函数
bind函数告诉内核将addr中服务器套接字地址和套接字描述符sockfd联系起来
```c
#include <sys/socket.h>
int bind(int sockfd, const struct sockaddr* addr, socklen_t addrlen);
```


### listen函数
默认情况下，内核会认为socket函数创建的描述符对应于主动套接字(active socket)，它存在与一个连接的客户端。服务器调用listen函数告诉内核，描述符是被服务器而不是客户端使用的。
```c
#include <sys/socket.h>
int listen(int sockfd, int backlog);
```


### accept函数
服务通过调用accept函数来等待来自客户端的连接请求。
```c
#include <sys/socket.h>
int accept(int listenfd, const struct sockaddr* addr, int* addrlen);
```

### 主机和服务的转换

1. getaddrinfo函数
2. getnameinfo函数

### 套接字接口辅助函数

1. open_clientfd
2. open_listenfd

### echo客户端和服务器的实例

## Web服务器

### Web基础

1. HTTP: （Hypertext Transfer Protocal，超文本传输协议）
2. FTP: 文件检索服务
3. HTML：Hypertext Markup Language， 超文本编辑语言

### Web内容

MIME: (Multipurpose Internet Mail Extensions)
|MIME类型|描述|
|:--:|:--:|
|text/html|HTML页面|
|text/plain|无格式文档|
|application/postscript|Postscript文档|
|image/gif|GIF格式编码的二进制图像|
|image/png|PNG格式的二进制图像|
|iamge/jpeg|JPEG格式编码的二进制图像|

### HTTP事务

```bash
> telnet www.aol.com 80
> GET / HTTP/1.1

```
1. HTTP请求
2. HTTP响应

### 服务动态内容

1. 客户端如何将程序参数传递给服务器
?分隔多个文件， &分隔多个参数，空格使用%20代替
2. 服务器如何将参数传递给子进程
通过设置环境变量来传递参数
比如服务器收到请求`GET /cgi-bin/adder?15000&213 HTTP1.1`

调用fork创建一个子进程，并调用execve在子进程上下文执行/cgi-bin/adder程序，在调用execve之前，子进程将CGI环境变量QUERY——STRING设置为`15000&213`，adder程序可一使用getenv函数来引用它

3. 服务器如何将其他信息传递给子进程

CGI定义的大量的其他环境变量，一个CGI程序在运行时可以设置这些环境变量

4. 子进程将他的输出发送到哪里
CGI程序直接将内容发送到标准输出，不过在子进程加载前通过dup2函数将标准输出重定向到和客户端相关联的已连接描述符

## Tiny Web服务器


