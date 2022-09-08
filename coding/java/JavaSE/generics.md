# 泛型

## 什么是泛型？有什么作用？

Java 泛型（Generics） 是 JDK 5 中引入的一个新特性。使用泛型参数，可以增强代码的可读性以及稳定性。

编译器可以对泛型参数进行检测，并且通过泛型参数可以指定传入的对象类型。比如 ArrayList<Persion> persons = new ArrayList<Persion>() 这行代码就指明了该 ArrayList 对象只能传入 Persion 对象，如果传入其他类型的对象就会报错。

原生 List 返回类型是 Object ，需要手动转换类型才能使用，使用泛型后编译器自动转换。


## 泛型的使用方式有哪几种？
<!-- tabs:start -->
#### **泛型类**
```java
//此处T可以随便写为任意标识，常见的如T、E、K、V等形式的参数常用于表示泛型
//在实例化泛型类时，必须指定T的具体类型
public class Generic<T>{

    private T key;

    public Generic(T key) {
        this.key = key;
    }

    public T getKey(){
        return key;
    }
}
```
实例化泛型类
```java
Generic<Integer> genericInteger = new Generic<Integer>(123456);
```
#### **泛型接口**
```java
public interface Generator<T> {
    public T method();
}
```
实现泛型接口(不指定类型)
```java
class GeneratorImpl<T> implements Generator<T>{
    @Override
    public T method() {
        return null;
    }
}
```
实现泛型接口(指定类型)
```java
class GeneratorImpl implements Generator<String>{
    @Override
    public String method() {
        return "hello";
    }
}
```
#### **泛型方法**
```java
public static < E > void printArray( E[] inputArray )
{
        for ( E element : inputArray ){
            System.out.printf( "%s ", element );
        }
        System.out.println();
}
```
使用
```java
// 创建不同类型数组： Integer, Double 和 Character
Integer[] intArray = { 1, 2, 3 };
String[] stringArray = { "Hello", "World" };
printArray( intArray  );
printArray( stringArray  );
```
> public static < E > void printArray( E[] inputArray ) 一般被称为静态泛型方法;在 java 中泛型只是一个占位符，必须在传递类型后才能使用。类在实例化时才能真正的传递类型参数，由于静态方法的加载先于类的实例化，也就是说类中的泛型还没有传递真正的类型参数，静态的方法的加载就已经完成了，所以静态泛型方法是没有办法使用类上声明的泛型的。只能使用自己声明的<E>

<!-- tabs:end -->

## 泛型擦除

<!-- tabs:start -->

#### **Demo.java**

使用List的泛型，指定Integer
```java
import java.util.ArrayList;
import java.util.List;

public class Demo {
    public static void main(String[] args) {
        List<Integer> list = new ArrayList<>();
        list.add(1);
    }
}
```

#### **Demo.jad**

1. 使用javac将.java文件编译成.class文件
2. 使用jad工具反编译得到源代码，可见其中是没有泛型信息的。
```java
// Decompiled by Jad v1.5.8g. Copyright 2001 Pavel Kouznetsov.
// Jad home page: http://www.kpdus.com/jad.html
// Decompiler options: packimports(3) 
// Source File Name:   Demo.java
import java.util.ArrayList;
import java.util.List;
public class Demo{
    public Demo(){
    }
    public static void main(String args[]){
        ArrayList arraylist = new ArrayList();
        arraylist.add(Integer.valueOf(1));
    }
}
```
<!-- tabs:end -->

## 泛型擦除的范围

<!-- tabs:start -->
#### **抽象类定义泛型**
```java
import java.lang.reflect.ParameterizedType;

public abstract class BaseDao<T> {
    public BaseDao() {
        Class clazz = this.getClass();
        ParameterizedType pt = (ParameterizedType) clazz.getGenericSuperclass();
        clazz = (Class) pt.getActualTypeArguments()[0];
        System.out.println(clazz);
    }
}
```
#### **实现类**
1. User.java作为泛型的指定目标
```java
public class User{
    
}
```
2. UserDaoImpl.java指定泛型为User
```java
public class UserDaoImpl extends BaseDao<User> {
}
```
3. UserDaoGeneric.java未指定泛型
```java
public class UserDaoGeneric<T> extends BaseDao<T> {
}
```
#### **执行结果**
**Main.class执行程序**
```java
public class Main {
    public static void main(String[] args) {
        // 指定了具体类型
        BaseDao<User> userDao1 = new UserDaoImpl();
        // 未指定具体类型
        BaseDao<User> userDao2 = new UserDaoGeneric<User>();
    }
}
```
**执行结果**
```shell
class User
Exception in thread "main" java.lang.ClassCastException: sun.reflect.generics.reflectiveObjects.TypeVariableImpl cannot be cast to java.lang.Class
        at BaseDao.<init>(BaseDao.java:7)   
        at UserDaoGeneric.<init>(UserDaoGeneric.java:1)
        at Main.main(Main.java:6)
```
可见未指定具体类型使泛型的确获取不到泛型类型，但如果实现类指定了具体类型，就可以获取泛型类型，信息保留在class文件中。

**javap 查看**

`javap -p -v UserDaoImpl.class`

可以看见在第五行中的确是有`User`类型存在的。
```shell
Classfile /D:/blog-docsify/test/java/generics/genericErase/UserDaoImpl.class
  Last modified 2022-9-8; size 227 bytes
  MD5 checksum 896fce760d4daa63baf27969e8e153bb
  Compiled from "UserDaoImpl.java"
public class UserDaoImpl extends BaseDao<User>
  minor version: 0
  major version: 52
  flags: ACC_PUBLIC, ACC_SUPER
Constant pool:
   #1 = Methodref          #3.#12         // BaseDao."<init>":()V
   #2 = Class              #13            // UserDaoImpl
   #3 = Class              #14            // BaseDao
   #4 = Utf8               <init>
   #5 = Utf8               ()V
   #6 = Utf8               Code
   #7 = Utf8               LineNumberTable
   #8 = Utf8               Signature
   #9 = Utf8               LBaseDao<LUser;>;
  #10 = Utf8               SourceFile
  #11 = Utf8               UserDaoImpl.java
  #12 = NameAndType        #4:#5          // "<init>":()V
  #13 = Utf8               UserDaoImpl
  #14 = Utf8               BaseDao
{
  public UserDaoImpl();
    descriptor: ()V
    flags: ACC_PUBLIC
    Code:
      stack=1, locals=1, args_size=1
         0: aload_0
         1: invokespecial #1                  // Method BaseDao."<init>":()V
         4: return
      LineNumberTable:
        line 1: 0
}
Signature: #9                           // LBaseDao<LUser;>;
SourceFile: "UserDaoImpl.java"

``` 
<!-- tabs:end -->

## 在什么地方使用了泛型

* 自定义接口通用返回结果 CommonResult<T> 通过参数 T 可根据具体的返回类型动态指定结果的数据类型
* 构建集合工具类


