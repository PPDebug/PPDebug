# AQS & ReentrantLock

> AbstractQueuedSynchronizer

## 公平锁和非公平锁

公平锁：在竞争条件下，先达到临界区的线程一定比后达到临界区的线程更快的获得锁。

非公平锁：先到达临界区的线程未必比后达到临界区的线程更快的获得锁。

相当于阻塞的阻塞的线程放在一个先入先出的队列里。公平与非公平的区别就是线程进入同步代码块是先尝试获取锁，还是直接加入队列。

synchronized锁就是非公平锁。

## AQS

> AQS是用来实现锁的一个框架，AQS定义了模板，具体实现由各个子类完成。内部实现的关键就是维护了一个先进先出的队列以及state状态变量，先进先出队列存储的载体叫做Node节点，该节点标识着当前的状态值、是独占还是共享模式以及它的前驱和后继节点等等信息。

基于AQS的实现：
- ReentrantLock
- ReentrantReadWeiteLock
- CountDownLatch
- Semaphore

## ReentrantLock的加锁解锁过程

### 加锁

当线程CAS获取锁失败，将当前线程入队列，把前驱节点状态设置为SIGNAL状态，并将自己挂起。

### 解锁

把state置0，唤醒头结点下一个合法的节点，被唤醒的节点线程自然就会去获取锁

Node 中节点的状态有4种，分别是：CANCELLED(1)、SIGNAL(-1)、CONDITION(-2)、PROPAGATE(-3)和0；
在ReentrantLock解锁的时候，会判断节点的状态是否小于0，小于等于0才说明需要被唤醒。




