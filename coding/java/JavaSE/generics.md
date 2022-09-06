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

## 在什么地方使用了泛型

* 自定义接口通用返回结果 CommonResult<T> 通过参数 T 可根据具体的返回类型动态指定结果的数据类型
* 构建集合工具类

