# 注解

## 注解的本质

Annotation （注解） 是 Java5 开始引入的新特性，可以看作是一种特殊的注释，主要用于修饰类、方法或者变量。

注解本质是一个继承了Annotation 的特殊接口：

```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.SOURCE)
public @interface Override {

}

public interface Override extends Annotation{

}
```

注解只有被解析之后才会生效，常见的解析方法有两种：
* 编译期直接扫描 ：编译器在编译 Java 代码的时候扫描对应的注解并处理，比如某个方法使用@Override 注解，编译器在编译的时候就会检测当前的方法是否重写了父类对应的方法。
* 运行期通过反射处理 ：像框架中自带的注解(比如 Spring 框架的 @Value 、@Component)都是通过反射来进行处理的。

## 



