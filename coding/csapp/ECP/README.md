# 异常控制流

## 系统调用错误处理

> Unix系统级函数出错时会返回-1， 并设置全局变量errno来表示什么出错了。

```c
  pid_t pid = fork();
  if(pid<0) {
    fprintf(stderr, "fork error: %s\n", strerror(errno));
    exit(0);
  }
```
需要依赖头文件`<sys/types.h>`和`<errno.h>`

良好的编程习惯是始终使用错误检查。

## 进程控制

### 获取进程ID

```C
pid_t getpid(void);
pid_t getppid(void);

```
`pid_t`在`<sys/typed.h>`中定义为`int`

### 创建和终止进程

进程处于以下状态：
* 运行：进程要么在CPU上执行，要么在等待被调度
* 停止：进程的执行被挂起(suspended),且不会被调度。进程停止可能是收到以下信号之一：SIGSTOP, SIGTSTP, SIGTTIN, SIGTTOU, 而处于停止状态的进程收到SIGCONT信号会再次运行。
* 终止：进程永远的停止.原因：收到终止信号，从主程序返回，调用exit函数。

```c
#include <stdlib.h>
void exit(int status);
```
通过fork创建进程
```c
pid_t fork(void);
```
新创建的进程得到与父进程用户级虚拟地址相同的副本，包括代码和数据段、堆、共享库以及用户栈，以及打开的文件描述符相同的副本，唯一的区别是PID.

fork()函数只被调用一次，但会返回两次值，在父进程中返回创建的进程id，在子进程中返回零。

<!-- tabs:start -->
#### **代码**
```c
#include <stdio.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <errno.h>

int main(void) {
  pid_t pid;
  int x = 1;

  pid = fork();
  
  if(pid == 0) {
    printf("child: x=%d\n", ++x);
    exit(0);
  }
  fprintf(stdout, "fork %s, child pid=%d\n", strerror(errno), pid);
  printf("parent: x=%d\n", --x);

  return 0;
}
```
#### **输出**
```bash
fork Success, child pid=156
parent: x=0
child: x=2
```
<!-- tabs:end -->

猜测以下代码的输出是什么
<!-- tabs:start -->
#### **代码**
```c
#include <stdio.h>
#include <sys/types.h>

int main(void) {
  fork();
  fork();
  printf("hello world!\n");
  exit(0);
}
```
#### **输出**
```bash
hello world!
hello world!
hello world!
hello world!
```
<!-- tabs:end -->

### 回收子进程

当进程种植时，内核并不会立即将其从系统中清除，而是保存在一种已终止的状态，等待其父进程回收，一个终止了但还未回收的进程称为**僵死进程**。

父进程终止了，系统会将**孤儿进程**的养父设置为init进程，其pid=1.

```c
pid_t waitpid(pid_t pid, int * statusp, int options);

```
1. 等待集合(pid):
* pid>0: 该子进程
* pid<0: 所有的子进程

2. 默认行为(options)：
* WNOHANG: 立即返回,未终止或停止返回为0, 
* WUNTRACED: 挂起调用程序，直到有一个等待集合中的一个正在运行的进程变成已终止或被停止。
* WCONTINUED: 挂起调用程序，直到有一个等待集合中的一个正在运行的进程变成已终止或一个已停止的进程收到SIGCONT信号重新执行。
* WNOHANG | WUNTRACED: 利用位运算组合，立即返回，未终止或停止返回0，有终止对应进程pid

3. 检查已回收子进程的退出状态(statusp)：
* WIFEXITED(status):子进程通过exit或return正常终止返回为真
* WEXITSTATUS(status):返回一个正常终止的子进程的退出状态。
* WIFSIGNALED(status):子进程因为未捕获的信号终止，返回真。
* WTERMISIG(status):返回导致进程终止的信号的编号
* WIFSTOPPED(status): 对应子进程的当前是停止的则返回真。
* WSTOPSIG(status): 返回引起子进程停止的信号的编号
* WIFCONTINUED(status): 如果子进程收到SIGCONT信号重新运行，则返回真。
4. 错误条件
* 没有子进程： waitpid返回-1，errno设置为ECHILD，
* waitpid被一个函数中断，则返回-1，errno设置为EINTR
5. wait函数
waitpid的简写版本
```c
pid_t wait(int *statusp);
```
等价于`waitpid(-1, statusp, 0)`
成功返回pid，错误返回-1

几个例子
<!-- tabs:start -->
#### **例1**
```c
#include <stdio.h>
#include <sys/types.h>
#include <wait.h>
#include <errno.h>

int main(void) {
  pid_t pid;
  int status;

  if (waitpid(-1, NULL, WNOHANG) ==-1 ) {
    fprintf(stdout, "waitpid error: %s\n", strerror(errno));
}
  
  pid = fork();
  if (pid==0) {
    printf("child working\n");
    sleep(3);
    exit(0);
  }

  printf("if child didn't finish, WNOHANG will return %d\n", waitpid(pid, NULL, WNOHANG));
  
  printf("parent waiting...\n");
  waitpid(pid, status, WUNTRACED);
  if (WIFEXITED(status)==1){
    printf("child process finished success\n");
  }
  printf("parent finished\n");
}
```
输出：
```bash
waitpid error: No child processes
if child didn't finish, WNOHANG will return 0
parent waiting...
child working
child process finished success
parent finished
```
#### **例2**
不按照顺序回收子进程
```c
#include <stdio.h>
#include <sys/types.h>
#include <wait.h>
#include <errno.h>

#define N 5

int main(void) {
  pid_t pid;
  int status, i;

  // create children
  for (i=0;i<N;i++) {
    if ((pid=fork()) == 0) {
      // children's behavior
      exit(100+i);
    }
  }

  while((pid=waitpid(-1, &status, 0))> 0) {
    if (WIFEXITED(status)) {
      printf("child %d terminated normally with exit status=%d\n", pid, WEXITSTATUS(status));
    } else {
      printf("child %d terminated abnormally", pid);
    }
  }

  if (errno != ECHILD) {
    fprintf(stderr, "waitpid error: %s\n", strerror(errno));
  }
}

```
输出：
```bash
child 939 terminated normally with exit status=102
child 940 terminated normally with exit status=103
child 941 terminated normally with exit status=104
child 937 terminated normally with exit status=100
child 938 terminated normally with exit status=101
``` 
#### **例3**
按照创建顺序回收子进程
```c
#include <stdio.h>
#include <sys/types.h>
#include <wait.h>
#include <errno.h>

#define N 5

int main(void) {
  pid_t pid[N], retpid;
  int status, i;

  // create children
  for (i=0;i<N;i++) {
    if ((pid[i]=fork()) == 0) {
      // children's behavior
      exit(100+i);
    }
  }

  i=0;
  while((retpid=waitpid(pid[i++], &status, 0))> 0) {
    if (WIFEXITED(status)) {
      printf("child %d terminated normally with exit status=%d\n", retpid, WEXITSTATUS(status));
    } else {
      printf("child %d terminated abnormally", retpid);
    }
  }

  if (errno != ECHILD) {
    fprintf(stderr, "waitpid error: %s\n", strerror(errno));
  }
}
```
输出：
```bash
child 875 terminated normally with exit status=100
child 876 terminated normally with exit status=101
child 877 terminated normally with exit status=102
child 878 terminated normally with exit status=103
child 879 terminated normally with exit status=104
```
<!-- tabs:end -->

### 进程休眠

sleep函数让一个进程挂起一段时间。
```c
unsigned int sleep(umnsigned int secs);
```
返回剩余的休眠数(可能由于信号而提前结束休眠)

pause函数让调用函数休眠，知道该进程获得一个信号。
```c
int pause(void);
```

### 加载并运行程序

```c
int exeve(const char *filename, const char *args[], const char *envp[]);
```
成功不返回，错误返回-1。
正常情况下，fork调用一次，返回两次。而execve调用一次返回零次，错误时会返回。
之后会将控制转到`int main(int argc, char *argv[], char *envp[])`
* argc 是argv条目的数目
* argv是argv[]参数数组中的第一个条目
* envp是envp[]环境数组中的第一个条目

操作环境数组
```c 
char *getenv(const char *name);
int setenv(const char *name, const char *newvalue, int overwrite);
void unsetenv(const char* name);
```

**练一练**
<!-- tabs:start -->
#### **要求**
编写一个myecho函数，打印命令行参数和环境变量。
```bash
> ./myecho args1 args2
Commandline arguments:
  argv[0]: myecho
  argv[1]: args1
  args[2]: args2
Enviroment variables: 
  envp[0]: PWD=/user0/peng/csapp
  envp[1]: USER=peng
  ...
  envp[n]: HOME=/user0/peng

```
#### **参考**
```c
#include <stdio.h>
#include <sys/types.h>
#include <wait.h>
#include <errno.h>
#include <unistd.h>


int main(int argc, const char *argv[], const char *envp[] ) {
  //  environ equal to envp
  // extern char **environ;
  // printf("environ: %d, envp: %d", environ, envp);

  int i;
  
  printf("Commandline arguments:\n");
  for (i=0;i<argc;i++) {
    printf("  argv[%d]: %s\n", i, argv[i]);
  }

  printf("Enviroment variables: \n");
  i = 0;
  while(envp[i]!=NULL) {
    printf("  envp[%d]: %s\n", i, envp[i++]);
  }
}

```
<!-- tabs:end -->

### 利用fork和execve运行程序
一个简单的main程序，打印一个命令提示符，等待用户在stdin上输入命令，然后对这个命令求值。
<!-- tabs:start -->
#### **main**
```c
#include <stdio.h>
#include <sys/types.h>
#include <wait.h>
#include <errno.h>

#define MAXLINE 128

void eval(char *cmdline);
int parseline(char *buf, char **argv);
int builtin_command(char **argv);

int main(void) {
  char cmdline[MAXLINE];
  while(1) {
    printf(">");
    fgets(cmdline, MAXLINE, stdin);
    if (feof(stdin)){
      exit(0);
    }
    eval(cmdline);
  }
}
```
#### **eval**
```c
void eval(char *cmdline) {
  char *argv[MAXARGS];
  char buf[MAXLINE];
  int bg;
  pid_t pid;
  extern char **environ;

  strcpy(buf, cmdline);
  bg = parseline(buf, argv);
  if(argv[0]==NULL) // ignore empty line
    return ;

  if (!builtin_command(argv)) {
    if ((pid=fork())==0) {
      if (execve(argv[0], argv, environ) < 0) {
        printf("%s: Command not found. \n", argv[0]);
        exit(0);
      }
    }
    // parent waits for foreground job to terminate
    if (!bg) {
      int status;
      if (waitpid(pid, &status, 0) < 0) {
        fprintf(stderr, "waitfg: waitpid error: %s", strerror(errno));
      }
    }
    else {
      printf("%d %s", pid, cmdline);
    }
  }  
  return;
}
```
#### **parseline**
```c
int parseline(char *buf, char **argv) {
  char *delim;
  int argc;
  int bg;
  buf[strlen(buf)-1] = ' '; //replace trailing '\n' with space
  while(*buf && (*buf==' ')) // ignore leading space
    buf++;

  argc = 0;
  while(delim=strchr(buf, ' ')) {
    argv[argc++] = buf;
    *delim = '\0';
    buf = delim + 1;
    while(*buf && (*buf==' ')) // ignore leading space
    buf++;
  }

  argv[argc] = NULL;
  if (argc==0) return 1;

  // should the job run in the background?
  if ((bg=(*argv[argc-1]=='&'))!=0) {
    argv[--argc] = NULL;
  }
  return bg;
}
```
#### **builtin_command**
```c
int builtin_command(char** argv) {
  if (!strcmp(argv[0], "quit")) //quit
    exit(0);
  if (!strcmp(argv[0], "&")) // ignore signleton &
    return 1;
  return 0; // not a builtin command
}
```
<!-- tabs:end -->
## 信号

### 信号术语

* 发送信号：内核通过更新目的进程的上下文，发送一个信号给目的进程。发送信号的原因：1. 内核检测到一个系统事件，比如除零错误或者子进程终止，2. 一个进程调用了kill函数。
* 接受信号：当目的进程被内核强迫以某种方式对信号的发送做出反应时，它就接受了信号。进程可以忽略、终止或者执行一个信号处理程序的用户层函数。
* 待处理信号(pending singal)：一个发出而3没有被接受的信号叫做待处理信号(pending signal)。在任何时候，一种信号至多只有一个对处理信号，多余的信号不会排队，只是被丢弃。

一个待处理的信号最多只能被接受一次，内核为每个进程在pending位向量中维护着待处理信号的集合，同时在blocked位向量中维持着被阻塞的信号集合。只要传送了以恶类型为k的信号，内核就会设置pending中的第k位，而只要接受了一个类型为k的信号，内核就会清除pending中的第k位。

### 发送信号
Unix系统发送信号的机制大多数基于进程组(process group)
* 进程组：

  每个进程都只属于一个进程组，进程组ID是一个正整数。
  ```c 
  pid_t getpgrp(void);
  ```
  默认的，一个子进程和它的父进程属于同一进程组，一个进程可以通过setpgid来改变自己或其他进程的进程组
  ```c 
  int setpgid(pid_t pid, pid_t pgid);
  ```
  如果pid为0，则以当前进程id作为pid，如果pgid为0，则以pid为pgid

* /bin/kill程序

  可以向指定进程发送任意信号
  ```bash
  linux> /bin/kill -9 15213
  ```
  可以向指定进程组发送任意信号，pid未负数表示pgid
  ```bash
  linux> /bin/kill -9 -15213
  ```
* 从键盘发送信号

  Unix shell使用作业(job)来表示对一条命令行求值二创建的进程，在任何时候，至多只有一个前台作业或多个后台作业。
  `linux> ls | sort`会创建一个有两个后天进程组成的前台作业，连个进程通过Unix管道连接起来。

  在键盘上输入Ctrl+C会发送一个SIGINT信号到前台进程组中的每个进程，默认情况下会终止前台进程
  Ctrl+Z会发送一个SIGSTP信号到前台进程中的每个进程，默认行为是停止（挂起）前台作业。

* kill函数发送信号

  ```c  
  #include <signal.h>
  int kill(pid_t pid, int sig);
  ```
  示例程序
  ```c
  #include <stdio.h>
  #include <sys/types.h>
  #include <wait.h>
  #include <errno.h>
  #include <unistd.h>
  #include <signal.h>

  int main(void) {
    pid_t pid;
    if ((pid=fork())==0) {
      pause(); // Wait for a signal to arrive;
      printf("control should never reach here!\n");
      exit(0);
    }

    kill(pid, SIGKILL);
    exit(0);
  }

  ```
* alarm发送信号

  alarm向自己发送SIGALRM信号

  ```c
  unsigned int alarm(unsignd int secs);
  ```
  返回前一次闹钟的剩余秒数，若以前没有设定闹钟，则返回0

### 接受消息

接受信号的时机：当内核把进程从内核模式切换到用户模式时。
行为： 检查该进程未被阻塞的待处理信号集合(pending&~blocked),如果为空，则执行I<sub>next</sub>,否则选择一个信号执行信号处理程序：
 * 进程终止
 * 进程终止并转储内存
 * 进程停止知被SIGCONT信号重启
 * 进程忽略该信号

大多数信号所对应的默认行为可以通过重写signal方法来覆盖，但是SIGSTOP和SIGKILL不可以。
```c 
typedef void (*sighandler_t)(int);
sighandler_t signal(int signum, sighandler_t handler);
```

handler有以下几种方式：
* SIG_IGN: 忽略信号
* SIG_DEF: 回复默认
* 信号处理程序，自定义函数地址，调用信号处理程序称为捕获信号，执行信号处理程序称为处理信号。

实例：捕获Ctr+C的SIGINT信号；
```c
#include <stdio.h>
#include <sys/types.h>
#include <wait.h>
#include <errno.h>
#include <unistd.h>
#include <signal.h>

void sigint_handler(int sig) {
  printf("Caught SIGINT!\n");
  exit(0);
}

int main(void) {
  if (signal(SIGINT, sigint_handler) == SIG_ERR) {
    fprintf(stderr, "signal error: %s\n", strerror(errno));
  }

  pause();

  return 0;
}
```

### 阻塞和解除阻塞信号

* 隐式阻塞机制：内核默认阻塞任何当前处理程序正在处理信号类型的待处理型号。
* 显式阻塞机制：通过sigprocmask及其辅助函数明确阻塞或接触阻塞选定的信号。
```c 
int sigprocmask(int how, const sigset_t *set, sigset_t *oldset);
int sigemptyset(sigset_t *set);
int sigfillset(sigset_t *set);
int sigaddset(sigset_t *set, int signum);
int sigdelset(sigset_t *set, int signum);
int sigismember(const sigsety_t *setm, int signum);
```

函数sigprocmask的how参数有决定以下几种行为：
* SIG_BLOCK: 把set中的信号添加到blocked中,blocked = blocked | set
* SIG_BLOCK: 删除set中的信号, blocked = blocked & ~set;
* SIG_SETMASK: block=set;
如果oldset非空，那么blocked之间的值保存在oldset中。

示例：使用sigprocmask来阻塞接受SIGINT信号
```c 
sigset_t mask, pre_mask;
sigemptyset(&mask);
sigaddset(&mask, SIGINT);

sigprocmask(SIG_BLOCK, &mask, &pre_mask);
/**
* Code region that will not be interrupted  by SIGINT
 */
sigprocmask(SIG_SETMASK, &prev_mask, NULL);

```

### 编写信号处理程序

信号处理程序有以下特点：
* 处理程序与主程序并发运行，共享同样的全局变量，因此可能与主程序和其他处理程序相互干扰。
* 如何以及何时接受信号的规则常常有违人的直觉。
* 不同的系统有不同的信号处理语义。

#### 安全的信号处理的一些基本原则：
* G0:
  处理程序要尽可能简单。
* G1:
  在处理程序中只调用异步信号安全的函数.及要么是可重入的（例如只访问局部变量），要么不能被信号处理程序中断。非异步安全的函数包括: printf, sprintf, malloc, exit， 编写信号处理程序中产生输出唯一安全的方法是使用write函数。
* G2:
  保存和恢复errno。许多linux异步信号安全的函数都会在出返回时设置errno，在处理函数中调用这样的函数可能会干扰主程序中其它依赖于errno的部分，所以需要在进入处理程序时将errno保存在一个局部变量中，处理程序返回时恢复它。只有在处理程序有返回时才需要这样做，以_exit终止则不需要。
* G3:
  对共享全局数据结构的访问，需要阻塞所有信号来对其保护
* G4:
  用valatile关键字声明全局变量，告诉编辑器永远不要缓存这个变量。
* G5:
  使用sig_atomic_t生命标志来保证对读或写是原子性的。（但类似flag=flag+10这种不能保证，因为这其实是多条指令）

#### 正确的信号处理

未处理的信号是不排队的，因为pending位向量中每种类型的信号只对应有一位，所以每种类型最多只能有一个未处理的信号。关键思想就是如果存在一个未处理的信号就表明至少有一个信号到达了。

我们模拟一个简单的引用：父进程创建一些自己子进程，父进程必须回收子进程以避免在系统中留下僵死进程，需要父进程调用wait/waitpid来回收。

<!-- tabs:start -->
#### **错误版本**
```c 
#include <stdio.h>
#include <sys/types.h>
#include <wait.h>
#include <errno.h>
#include <unistd.h>
#include <signal.h>


void handler1(int sig) {
  int olderrno = errno;
  if(waitpid(-1, NULL, 0) < 0)
    write(STDOUT_FILENO, "waitpid error\n", 14);
  write(STDOUT_FILENO, "Handler reaped child\n", 21);
  sleep(1);
  _exit(0);
}

int main(void) {
  int i, n;
  char buf[1>>16];
  if (signal(SIGCHLD, handler1)==SIG_ERR) {
    fprintf(stderr, "waitpid error: %s\n", strerror(errno));
  }

  for(i=0;i<3;i++) {
    if(fork()==0) {
      printf("Hello form child %d\n", (int)getpid());
      exit(0);
    }
  }

  if ((n=read(STDIN_FILENO, buf, sizeof(buf))) < 0) {
    fprintf(stderr, "read error: %s\n", strerror(errno));
  }

  printf("Parent processing input\n");
  while(1)
    ;

  return 0;
}

```
#### **正确版本**
```c 
#include <stdio.h>
#include <sys/types.h>
#include <wait.h>
#include <errno.h>
#include <unistd.h>
#include <signal.h>


void handler1(int sig) {
  int olderrno = errno;
  while(waitpid(-1, NULL, 0) > 0) {
  write(STDOUT_FILENO, "Handler reaped child\n", 21);
  }
  if(errno!= ECHILD) {
    write(STDOUT_FILENO, "waitpid error\n", 14);
  }
  sleep(1);
  _exit(0);
}

int main(void) {
  int i, n;
  char buf[1>>16];
  if (signal(SIGCHLD, handler1)==SIG_ERR) {
    fprintf(stderr, "waitpid error: %s\n", strerror(errno));
  }

  for(i=0;i<3;i++) {
    if(fork()==0) {
      printf("Hello form child %d\n", (int)getpid());
      exit(0);
    }
  }

  if ((n=read(STDIN_FILENO, buf, sizeof(buf))) < 0) {
    fprintf(stderr, "read error: %s\n", strerror(errno));
  }

  printf("Parent processing input\n");
  while(1)
    ;

  return 0;
}

```
<!-- tabs:end -->

#### 可以移植的信号处理

Unix的信号处理函数的一个缺陷在于不同的系统有着不同的信号处理语义：
* signal函数下的语义不同，有些老的Unix系统在信号处理程序被程序捕获之后九九把对信号的反应恢复到默认值，在这些系统上，每次运行后，处理程序必须调用signal函数，显示的重新设置自己。
* 系统调用可被中断，像read、write、和accept这样的系统调用会潜在的阻塞进程一段较长的时间，称为慢速系统调用。老式的系统上被中断的系统调用在信号处理程序返回后将不会继续执行，需要手动的重启。

解决方法： Posix标准定义的sigaction函数，允许用户在设置信号处理程序时，明确指定他们想要的信号处理语义。
```c 
#include <signal.h>
int sigaction(int signum, struct sigaction *act, struct sigaction *oldact);
```
这个函数比较复杂，一般情况下会使用其包装函数Signal函数:
定义如下:
```c
handler_t *Signal(int signum, handler_t *handler) {
  struct sigaction action, oldaction;
  action.sa_handler = handler;
  sigemptyset(&action.sa_mask);
  action,sa_flag = SA_RESTART;

  if (sigaction(signum, &action, &olaction) < 0) {
    write(STDOUT_FILENO, "signal error\n", 14);
  }

  return (old_action.sa_handler);
}
```
Signal函数具有以下特点：
* 只有这个处理程序当前正在处理的那种类型的信号被阻塞。
* 和所有信号视线一样，信号不会排队。
* 只要可能，被中断的系统调用会自动重启。
* 一旦设置了信号处理程序，他就会一直保持，直到Signal带着handler参数为SIG_IGN或者SIG_DFL被调用。

### 同步流以避免讨厌的并发错误

### 显示的等待信号

## 非本地调转(nonlocal jump)
非本地调转使用户级异常控制形式，它提供了一种直接从一个函数转移到另一个当前正在执行函数(即已经在栈中),而不需要经过正常的调用-返回序列。
通过setjump, 和longjump函数来提供。
```c
#include <setjmp.h>
int setjmp(jmp_buf, env);
int signsetjmp(sigjmp_buf, int savesigs);
```

setjmp在env缓冲区中保存当前调用环境，以供以后的longjmp使用，并返回0。调用环境包括程序计数器，栈指针和通用目的寄存器。setjmp返回的值不能被赋值给变量，不过可以安全的在switch或条件测试语句的测试中。
```c 
#include <setjmp.h>
void longjmp(jmp_buf env, int retval);
void siglongjmp(sigjmp_buf env, int retval);
```
longjmp函数从env缓冲区恢复调用环境，然后触发一个从最近一次初始化env的setjmp调用的返回。然后setjmp返回，并带有非零的retval。setjmp只调用一次，但返回多次；longjmp只调用一次，但从不返回。
<!-- tabs:start -->
#### **示例一**
**直接跳出函数嵌套**
```c
#include <stdio.h>
#include <setjmp.h>

jmp_buf buf;
int error1 = 0;
int error2 = 1;
void foo(void), bar(void);

int main(void) {
  switch(setjmp(buf)) {
    case 0:
      foo();
      break;
    case 1: 
      printf("Detected an error1 condition in foo\n");
      break;
    case 2: 
      printf("Detected an error2 condition in foo\n");
      break;
    default: 
      printf("Unknown error condition in foo\n");
  }
  exit(0);
}

void foo(void) {
  if (error1) {
    longjmp(buf, 1);
  }
  bar();
  printf("do something 1\n");
}

void bar(void) {
  if (error2) {
    longjmp(buf, 2);
  }
  printf("do something 2\n");
}

```
```bash
Detected an error2 condition in foo
```
#### **示例二**
**一个无法使用ctrl + C关闭的程序**
```c
#include <stdio.h>
#include <setjmp.h>
#include <signal.h>

jmp_buf buf;
void handler(int sig) {
  siglongjmp(buf, 1);
}

int main(void) {
  if (!sigsetjmp(buf, 1)) {
    signal(SIGINT, handler);
    printf("starting\n");
  }else {
    printf("restarting\n");
  }
  while(1) {
    sleep(1);
    printf("processing...\n");
  }
  exit(0);
}

```

```bash
starting
processing...
processing...
processing...
^Crestarting
processing...
processing...
processing...
^Crestarting
processing...
processing...
processing...
```
<!-- tabs:end -->

> C++和Java中的异常机制是较高层次的,是C语言的setjmp和longjmp函数的更加结构化的版本,可以把try和catch字句当作类似与setjmp函数,相似的throw语句就类似于longjmp函数.

## 操作进程的工具

* STRACE: 打印一个正在运行的程序和它的子进程调用的每个系统调用的轨迹. [参考博客](https://blog.csdn.net/qq_26323323/article/details/124368395#:~:text=strace%E5%B8%B8%E7%94%A8,%E5%92%8C%E6%89%80%E6%8E%A5%E6%94%B6%E7%9A%84%E4%BF%A1%E5%8F%B7%E3%80%82)
* PS: 列出当前系统中的进程(包括僵死进程)
* TOP: 打印出关于当前进程资源使用的信息
* PMAP: 显示进程的内存映射.
* /proc: 一个虚拟文件系统,以ASCII文本格式输出大量内核数据结构的内容,用户程序可以读取这些内容, 比如输入`cat /proc/loadavg`







