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

codingpython codein 面试指南，这是


## BIO & NIO
[NIO回显服务](https://blog.csdn.net/smith789/article/details/104377386) 

