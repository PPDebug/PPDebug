# 并发编程

使用应用级并发的应用程序称为并发程序(concurent program)。现代操作系统提供三种基本的构造并发程序的方法：
1. 进程：每个控制流都是一个进程，由内核来调度和维护。因为进程有独立的虚拟空间地址，想要与其他流通信，控制流必须使用显示二进程间通信机制(Interprocess communication, IPC)机制。
2. I/O多路复用：应用程序在一个进程的上下文中显示的调用他们自己的逻辑，逻辑流被模型化为状态机，数据到达文件描述符后，主进程显示的从一个状态转换到另一个状态。因为程序是一个单独的进程，所以所有的流都共享同一地址空间。
3. 线程：线程是运行在一个单一进程上下文中的逻辑流，由内核进行调度，线程可以被认为是前两种方式的混合体。】

## 基于进程的并发

基于fork,exec,waitpid实现.

关键点：
* 需要一个SIGCHLD处理程序来回收僵尸(zombie)进程
* 父进程必须关闭各自的connfd已连接描述符，避免内存泄露
* 子进程应当关闭listenfd监听描述符,并在逻辑处理完成之后关闭connfd已连接描述符(这个不强制要求，如果逻辑处理完成之后就退出，则无需手动关闭，内核会帮助关闭)。

父子进程共享文件表但不共享进程空间，因此一个进程不可能覆盖另一个进程的虚拟空间，但同时它们必须使用显示的IPC(进程间通信，包括管道，先进先出FIFO，系统V共享内存，系统V信号量)机制，这也导致它们比较慢。


## 基于I/O多路复用的并发

```c
#include <sys/select.h>

int select (int n, fd_set *fdset, NULL, NULL, NULL);

FD_ZERO(fd_set *fdset);
FD_CLR(int fd, fd_set *fdset);
FD_SET(int fd, fd_set *fdset);
FD_ISSET(int fd, fd_set *fdset);
```

描述符集合fd_set是一个位向量
```tex
b_(n-1),···,b_1, b_0
```

select函数会一直阻塞直到描述符集合fd_set中至少一个描述符准备好可以读了。同时，该函数执行完成后会将等待描述符集合fd_set指向其子集，准备好集合(ready set),因此在每次调用时select时都需要更新读集合。

现代高性能服务器使用的都是基于I/O多路复用的事件驱动的编程方式，因为它有明显的性能优势。

但基于事件的设计的一个重要缺点是不能充分利用多核处理器。

## 基于线程的并发

线程(thread)是运行在进程上下文中的逻辑流。线程由内核自动调度，每个线程都有它自己的线程上下文(thread context)，包括唯一的线程ID(Thread ID, TID)、栈、栈指针、程序计数器、通用目的寄存器和条件码。所有运行在一个进程里的线程共享该进程的整个虚拟地址虚拟地址空间。

基于线程的逻辑流结合基于进程于进程的和基于i/o的多路复用的流的特性，同进程一样，线程由内核自动调度，并且在内核中通过一个整数ID来识别线程。

每个进程开始生命周期时都是单一线程，称为主线程(main thread)，主线程可以创建对等线程(peer thread)，从这个时间点开始，两个线程就并发地运行。

线程的上下文切换要比进程的上下文切换快得多，因为上下文要小得多。

对等(线程)池的概念的而主要影响是：一个线程可以杀死它的任何对等线程，或者等待它的任意对等线程终止。另外，每个对等线程都能读写相同的共享数据。
### Posix线程
Posix线程是最早的线程标准接口， pthread定义了大约60个函数，允许程序创建、杀死和回收线程。
```c
#include <stdio.h>
#include <pthread.h>

void *thread(void *vargp);

int main(void) {
  pthread_t tid;
  pthread_create(&tid, NULL, thread, NULL);
  pthread_join(tid, NULL);
  exit(0);
}

void *thread(void* vargp) {
  printf("Hello, world!\n");
  return NULL;
}
```

##3 创建线程

线程通过调用pthread_create来创建其他线程
```c 
#include <pthread.h>
typedef void* (func)(void *);

int pthread_create(pthread_t *tid, pthread_attr_t *attr, func *f, void *arg);
```
当pthread_create返回时，参数tid包含新创建线程的ID,新线程可以通过调用othread_self函数来获取它的自己的线程ID
```c
#include <pthread.h>
pthread_t pthread_self(void);
```

### 终止线程
1. 当前执行的线程返回时，该线程隐式终止(正常结束)
2. 通过调用pthread_exit函数，线程会显示终止。如果主线程调用pthread_exit，它会等待其他对等线程终止，然后再终止主线程和震哥进程，返回值为thread_return `void pthread_exit(void* thread_return)`
3. 某个对等线程调用Linux的exit函数，该函数终止进程以及所有与该进程相关的线程。
4. 一个对等线程通过线程ID作为参数调用pthread_cancel函数来终止指定线程`int pthread_cancel(pthread_t tid)`


### 回收已终止线程的资源

线程通过`int pthread_join(pthread_t tid, void **thread_return)`函数等待其他线程终止。pthread_join函数会阻塞，直到线程tid终止，将线程例程返回的通用(void*)指针赋值为thread_return指向的位置，然后回收已终止线程占用的所有内存资源。

### 分离线程
线程是两种模式：
* 可结合的(joinable): 可以被其他线程回收和杀死，在被其他线程回收之前，内存资源(例如栈)是不释放的。
* 分离的(detached)：不能被其他线程回收或杀死，内存资源在终止时由系统自动释放。

默认情况下线程被创建成可结合的，为了避免内存泄露，每个可结合的线程都必须别其他线程显示地回收，或者通过调用pthread_detach函数被分离。

> Web服务器每次收到Web浏览器的连接请求是都创建uige新的对等线程，每个线程的逻辑基本独立，没有必要显示等待每个对等线程终止，因此这种线程应该分离自身。

### 初始化线程

pthread_once函数能够初始化与线程例程相关的状态。
```c
#include <pthread.h>
pthread_once once_control = PTHREAD_ONCE_INIT;
int p_thread_once(pthread_once *once_control, void (*init_routune)(void));
```
```c
#include <stdio.h>
#include <pthread.h>
#define N 2

static void init_routine(void) {
  printf("Thread-%u init\n", pthread_self());
}

void *thread(void *vargp);

int main(void) {
  int i;
  pthread_t tids[N];
  
  for(i=0; i<N; i++) {
    pthread_create(&tids[i], NULL, thread, NULL);
  }
  printf("exec time unknown\n");
  for(i=0; i<N; i++) {
    pthread_join(tids[i], NULL);
  }
  printf("last exec\n"); 
  exit(0);
}

void *thread(void* vargp) {
  static pthread_once_t once = PTHREAD_ONCE_INIT;
  pthread_once(&once, init_routine);
  printf("Thread-%u do something!\n", pthread_self());
  return NULL;
}
```




