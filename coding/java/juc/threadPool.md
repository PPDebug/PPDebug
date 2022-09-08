# Java线程池

## 为什么需要线程池

HotSpot JVM的线程模型是一对一映射的内核线程
，即Java中每次创建以及回收线程都会去内核创建以及回收，而创建和销毁线程是需要花费时间和资源的，应该减少线程的创建和销毁，线程池就是为了提高现成的复用性以及固定线程的数量。

## 创建线程池

线程池不允许使用 Executors 去创建，而是通过 ThreadPoolExecutor 的方式，这
样的处理方式让写的同学更加明确线程池的运行规则，规避资源耗尽的风险。

说明：Executors 返回的线程池对象的弊端如下： 
1.   FixedThreadPool 和 SingleThreadPool： 
  允许的请求队列长度为 Integer.MAX_VALUE，可能会堆积大量的请求，从而导致 OOM。 
2.   CachedThreadPool： 
  允许的创建线程数量为 Integer.MAX_VALUE，可能会创建大量的线程，从而导致 OOM

## ctl变量

ctl参数的用高3位表示线程池的状态，低29位来表示线程的数量。

线程池的状态：

```java
private final AtomicInteger ctl = new AtomicInteger(ctlOf(RUNNING, 0));
private static final int COUNT_BITS = Integer.SIZE - 3;
private static final int CAPACITY   = (1 << COUNT_BITS) - 1;

// runState is stored in the high-order bits
private static final int RUNNING    = -1 << COUNT_BITS;
private static final int SHUTDOWN   =  0 << COUNT_BITS;
private static final int STOP       =  1 << COUNT_BITS;
private static final int TIDYING    =  2 << COUNT_BITS;
private static final int TERMINATED =  3 << COUNT_BITS;
```

## ThreadPoolExecutor的参数
```java
/**
Creates a new ThreadPoolExecutor with the given initial parameters.
Params:
- corePoolSize – the number of threads to keep in the pool, even if they are idle, unless allowCoreThreadTimeOut is set 
- maximumPoolSize – the maximum number of threads to allow in the pool 
- keepAliveTime – when the number of threads is greater than the core, this is the maximum time that excess idle threads will wait for new tasks before terminating. 
- unit – the time unit for the keepAliveTime argument workQueue – the queue to use for holding tasks before they are executed. This queue will hold only the Runnable tasks submitted by the execute method. 
- threadFactory – the factory to use when the executor creates a new thread 
- handler – the handler to use when execution is blocked because the thread bounds and queue capacities are reached
Throws:
IllegalArgumentException – if one of the following holds: 
- corePoolSize < 0 
- keepAliveTime < 0 
- maximumPoolSize <= 0 
- maximumPoolSize < corePoolSize
NullPointerException – if workQueue or threadFactory or handler is null
*/
public ThreadPoolExecutor(int corePoolSize,
                              int maximumPoolSize,
                              long keepAliveTime,
                              TimeUnit unit,
                              BlockingQueue<Runnable> workQueue,
                              ThreadFactory threadFactory,
                              RejectedExecutionHandler handler)
```

## 拒绝策略
> 拒绝策略就是当调用execute(Runnable aommand)时，如果executor处于shutdown或容量已经满了的时候执行拒绝策略。
默认拒绝策略为Abortpolicy.
```java
private static final RejectedExecutionHandler defaultHandler =
        new AbortPolicy();
```
拒绝策略有以下几种：
*  `CallerRunsPolicy`: 直接在执行方法的调用线程中运行被拒绝的任务，除非执行程序已关闭，在这种情况下，任务将被丢弃。
* `AbortPolicy`: 抛出 RejectedExecutionException异常
* `DiscardPolicy`： 默默丢弃，啥也不干
* `DiscardOldestPolicy`: 拒绝任务的处理程序，丢弃最旧的未处理请求，然后重试执行，除非执行程序被关闭，在这种情况下任务被丢弃。