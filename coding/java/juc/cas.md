# CAS

> Compare and swap: 比较并交换
> 
> 由CPU指令提供支持: `cmpxchg`

## CAS的操作

相比一般的符合操作store(address, value)，即将address所在空间赋值为value，
CAS操作含有三个操作是cas(old, address, new)，分别为：
* 原始值old
* 内存地址address
* 要修改的值new

CAS的执行过程：
* 假设原始值old跟内存地址对应的值相等，那么就将内存address处赋值为new
* 假设原始值old跟内存地址对应的值不相等，要么重试，要么就放弃更新。

CAS通过比较原始值的方式可以确保当多个线程去对一个共享变量赋值出现竞争时，只会有一个成功。

## CAS的使用

<!-- tabs:start -->
#### **未使用CAS: ++**

多个线程同时对一个共享变量使用++，会导致累加结果小于预期的数

[具有竞争的共享变量++](./code/RaceIncrement.java ":include :type=code")

输出结果(每次不一样)
```shell
99772
```


#### **使用CAS: AtomicInteger**

通过使用AtomicInteger的`incrementAndGet()`来保证操作的完整性。

[AtomicIntegerIncrement](./code/AtomicIntegerIncrement.java ":include :type=code")

输出结果
```shell
100000
```

<!-- tabs:end -->

## CAS的使用场景

CAS是乐观锁的一种是实现方式，即当我们确定竞争的操作很快就会完成时，可以使用CAS操作来修改共享变量，会比只让一个线程运行的synchronized的悲观锁高效。

相反，如果

## CAS的ABA问题
多个线程访问共享变量V，变量初始值为A。
* cpu时间片给1号线程，使用cas(A，V, new),想将共享变量的值改为new, 还未执行，时间片切换，
* cpu时间片给2号线程，使用cas(A, V, B)，执行成功，V的值变为B，cpu时间再次切换
* cpu时间片给2号线程，执行cas（B,V,A)，也成功了，所以V值又变回A
* 此时1号线程继续执行，将V的值改为new。

解决ABA问题，只需要加上一个版本号即可，比对内存值+版本号是否一致。

在现在的JUC包下可以看见, 就是带有版本号的四个参数了
```java
public final native boolean compareAndSwapInt(Object var1, long var2, int var4, int var5);
```

## LongAdder对象比AtomicLong性能好的原因

AtomicLong做累加的时候实际上就是多个线程操作统一共享资源，高并发的时候只有一个线程成功，竞争比较剧烈。

LongAdder根据将线程hash分成不同的cell，每个cell相当于一个AtomicLong，对LongAdder加一实际上是将对应的cell加1，读取时是读取所有cell的值然后累加计算实际值。同时由于使用了@contened注解来解决伪共享，甚至可以比直接使用long累加还要快。

[LongAdder理解参考](https://zhuanlan.zhihu.com/p/45489739)



