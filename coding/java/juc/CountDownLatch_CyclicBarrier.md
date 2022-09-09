# CountDownLatch & CyclicBarrier

> 
> 使用场景(线程同步)：有五十个任务，在五十个任务完成之后才能执行下一个函数，假设每个任务都可以使用单独的线程处理。
>
>线程同步的工具，都可以等待线程完成之后，才去执行某些操作。

## CountDownLatch和CyclicBarrier的区别

主要的区别就是CountDownLatch只能使用一次，而CyclicBarrier可以重复使用。

CountDownLatch允许一个或多个线程一直等待，知道线程完成它们的操作，一般是主线程调用await()方法用于等待初始化线程完成某些初始化任务，然后往下执行。

CyclicBarrier任务线程自己调用await()方法，一般是几个线程完成各自阶段性运算后等待所有线程完成同一阶段运算后再执行下一步计算方法。

## 使用示例

<!-- tabs:start -->
#### **CountDownLatch**
[CountDownLatchTest](./code/CountDownLatchTest.java ":include :type=code")
#### **CyclicBarrier**
[CyclicBarrierTest](./code/CyclicBarrierTest.java ":include :type=code")
<!-- tabs:end -->

## 实现方式

两者都是基于AQS实现的，只是实现方式有所不同:

在实例化`CountDownLatch`时，传入的值其实就会赋值给AQS的关键变量`state`，执行`countDown`方法是，其实是利用CAS将state减一，执行`await`方法其实就是判断state是否为0，不为0，就加入到队列中，将该线程阻塞掉(除了头节点)，头节点会一直自选等待state为0，当state为零时，头节点把剩余在队列中阻塞的节点一并唤醒。

CyclicBarrier是借助ReentrantLock加上Condition等待唤醒的功能实现的。在构建CyclicBarrier时，传入的值会复赋值给内部维护变量count，同时在parties变量备份，这是可以复用的关键。每次调用await会将count-1，是直接调用ReentrantLock的lock然后再改变count，如果count不为0，则添加到condition队列中，如果count等于0，则把节点从condition队列添加至AQS的队列中进行全部唤醒，并且将parties的值重新复制给count，实现复用。