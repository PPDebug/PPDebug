# Java引用

## 强引用(Reference)
- 正常new 对象出来的引用
```java
Object reference = new Object();
```
- 只要对象没有被置为null，在GC时就不会被回收。

## 软引用(SoftReference)

- 继承SoftReference实现

- 如果内存充足，只被软引用指向的对象不会被回收，如果内存不做，只被软引用指向的对象会被回收。

## 弱引用(WeakReference)

- 继承WeakReference实现

- 只要发生GC，只被弱引用指向的对象就会被回收。

## 虚引用(PhantomReference)

- 对是否回收对象不起作用
- 主要是用来跟踪垃圾回收的状态，当回收时通过引用队列做些[通知类]工作。

