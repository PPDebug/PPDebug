# ThreadLocal

> 提供了线程局部变量，每个线程都可以通过set/get这个局部变量进行操作，不会和其他线程的局部变量进行冲突，实现了线程的数据隔离。


## ThreadLocal的使用场景

1. 将ThreadLocal装载SimpleDateFormat解决线程不安全问题
2. Spring中的保证每个线程拥有独立的数据库链接也是使用的ThreadLocal装载起来的一个Map类型(可能存在多数据源，key:datasource, value:connection)，保同一个线程获取一个Connection对象，从而保证一次事务的所有操作在同一个数据库连接上。

## ThreadLocal的原理

通过ThreadLocal的set/get方法来对其实现做大致了解：
```java
public void set(T value) {
    Thread t = Thread.currentThread();
    ThreadLocalMap map = getMap(t);
    if (map != null)
        map.set(this, value);
    else
        createMap(t, value);
}

public T get() {
    Thread t = Thread.currentThread();
    ThreadLocalMap map = getMap(t);
    if (map != null) {
        ThreadLocalMap.Entry e = map.getEntry(this);
        if (e != null) {
            @SuppressWarnings("unchecked")
            T result = (T)e.value;
            return result;
        }
    }
    return setInitialValue();
}
```
可以发现ThreadLocal对数据的存取都是通过ThreadLocal变量的引用作为key来操作ThreadLocalMap的.

而ThreadLocalMap是存储(数据在堆上，强引用在Thread上)在线程Thread实例对象上的：
```java
// ThreadLocal.java lines:232(jdk1.8)
ThreadLocalMap getMap(Thread t) {
    return t.threadLocals;
}
```
```java
// Thread.java lines:182(jdk1.8)
ThreadLocal.ThreadLocalMap threadLocals = null;
```

## ThreadLocalMap

>定义在ThreadLocal的静态内部类
>
> 基于Entry实现
> 
> 用途：Thread的一个成员变量，用来维护一个Thread对象中的多个ThreadLocal变量的值。

它具有已下几个成员变量：
```java
/**
    * The initial capacity -- MUST be a power of two.
    */
private static final int INITIAL_CAPACITY = 16;

/**
    * The table, resized as necessary.
    * table.length MUST always be a power of two.
    */
private Entry[] table;

/**
    * The number of entries in the table.
    */
private int size = 0;

/**
    * The next size value at which to resize.
    */
private int threshold; // Default to 0
```
其中初始大小、当前大小、重设大小阈值都是常见属性，只有Entry是存储key-value的关键：
```java
static class Entry extends WeakReference<ThreadLocal<?>> {
    /** The value associated with this ThreadLocal. */
    Object value;

    Entry(ThreadLocal<?> k, Object v) {
        super(k);
        value = v;
    }
}
```
Entry实现了WeakReference，这意味着，当只存在Entry的引用，<del>value对象会在GC时被回收</del>弱引用不能保证value被回收，只能保证在垃圾回收时没有调用remove()的ThreadLocal对应的entry中key置为null，实际的value的回收是set或get时遇到key==null时自动进行的。

在这里不探究ThreadLocalMap 的table的扩容、哈希碰撞的处理等问题，简单看一个getEntry方法
```java
private Entry getEntry(ThreadLocal<?> key) {
    int i = key.threadLocalHashCode & (table.length - 1);
    Entry e = table[i];
    if (e != null && e.get() == key)
        return e;
    els
        return getEntryAfterMiss(key, i, e);
}
```
这部分代码很简单，通过哈希算法和table大小计算预期位置，如果该位置正好匹配，直接返回Entry(或者是null不存在，或者是由于碰撞移位了，需要交由getEntryAfterMiss()方法处理，这里不过多阐述)

## ThreadLocal的内存泄露

ThreadLocal内存泄露指的是：ThreadLocal变量不再使用或指向了其他值(比如在循环中`ThreadLocal tl = new ThreadLocal(); tl.set(1);`)，ThreadLocalMap中对应的Entry项没有了实际意义，相当于野指针，但仍然有ThreadRef -> Thread ->
ThreadLocalMap -> Entry table[i] -> .value这条引用一直存在导致内存泄露。

可见，ThreadLocal内存泄露的三个条件：
1. ThreadLocal指向其他值
2. 原始ThreadLocal指向的entry没有被释放
2. 当前线程没有结束

常见情况就是: web应用利用线程池处理请求时每次创建一个ThreadLocal对象来使用

解决办法：在结束ThreadLocal是使用时，调用remove即可(remove函数会将entry的key设置为null，然后由ThreadLocalMap的内部逻辑负责清除对应entry)。

实际上，ThreadLocal的泄露问题是由于Entry含有局部变量造成的，哪怕将键值设置为null，其value仍是可达的，value生命周期的结束是在get/set时检测到key==null，才会将value设置为null，然后删除entry。

因此，内存泄露的时间是设置ThreadLocal为null，到下一次set/get函数检测到key==null。

因此，如果程序忘记将entry的key设为null，即没有调用remove()方法，同时不停的创建新ThreadLocal，entry项将始终留在内存中，造成内存泄露。

## 为什么要使用弱引用

使用弱引用可以参考ThreadLocalMap中remove()方法的实现：
```java
private void remove(ThreadLocal<?> key) {
        Entry[] tab = table;
        int len = tab.length;
        int i = key.threadLocalHashCode & (len-1);
        for (Entry e = tab[i];
                e != null;
                e = tab[i = nextIndex(i, len)]) {
            if (e.get() == key) {
                e.clear();
                expungeStaleEntry(i);
                return;
            }
        }
    }
```
其实就是在entry table找到对应的entry，然后clear()，clear是父类弱引用定义的方法，实际上就是`this.referent = null;`，相当于将key设置为null，上面所说的entry table 中entry的删除就是在set和get时通过判断key==null来实现的，所以说，通过使用weakReference相当于在GC时自动调用一下remove()方法，作为一种后备吧。

## 必须回收自定义的ThreadLocal变量

这是阿里巴巴规范上的

如果不显示的回收ThreadLocal对象。那么entry中的key一直不为null，导致entry无法被回收，直到下一次GC保底的将ThreadLocal设置为null，才能够进行对应entry的回收工作，同时set时也会导致hash碰撞加剧，相反手动调用remove方法，运气好的或可以在下一次set时就遇到key为null，然后就可以清除了。


<!-- 内存占用加剧，直到发生FULL GC，利用weakReference的机制来清除。这样的程序虽然可以运行，但是会频繁触发FULL GC，影响性能。 -->