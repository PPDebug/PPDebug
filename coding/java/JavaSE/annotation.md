# 注解

## 注解的本质

Annotation （注解） 是 Java5 开始引入的新特性，可以看作是一种特殊的注释，主要用于修饰类、方法或者变量。可以在编译、类加载、运行时被读取、并执行相应的处理。

注解本质是一个继承了Annotation 的特殊接口：

```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.SOURCE)
public @interface Override {

}

public interface Override extends Annotation{

}
```

Java中三个元注解(定义注解的注解)为: @Docuemnt, @Target, @Retention,其中@Document自如其意，表示是否出现在Javadoc文档中。

## @Target
用于设置该注解的修饰对象，即可以在那些位置使用该注解，这些位置的可选择在一个枚举类型ElementType中：
```java
public enum ElementType {
    /** Class, interface (including annotation type), or enum declaration */
    TYPE,

    /** Field declaration (includes enum constants) */
    FIELD,

    /** Method declaration */
    METHOD,

    /** Formal parameter declaration */
    PARAMETER,

    /** Constructor declaration */
    CONSTRUCTOR,

    /** Local variable declaration */
    LOCAL_VARIABLE,

    /** Annotation type declaration */
    ANNOTATION_TYPE,

    /** Package declaration */
    PACKAGE,

    /**
     * Type parameter declaration
     *
     * @since 1.8
     */
    TYPE_PARAMETER,

    /**
     * Use of a type
     *
     * @since 1.8
     */
    TYPE_USE
}

```
## @Retention
Rentention注解用来表明注解的生命周期，即该注解可以存活什么时期，是源代码、编译、还是运行，对应RetentionPolicy中不同类型
```java
public enum RetentionPolicy {
    /**
     * Annotations are to be discarded by the compiler.
     */
    SOURCE,

    /**
     * Annotations are to be recorded in the class file by the compiler
     * but need not be retained by the VM at run time.  This is the default
     * behavior.
     */
    CLASS,

    /**
     * Annotations are to be recorded in the class file by the compiler and
     * retained by the VM at run time, so they may be read reflectively.
     *
     * @see java.lang.reflect.AnnotatedElement
     */
    RUNTIME
}
```


## 注解的解析

注解只有被解析之后才会生效，常见的解析方法有两种：
* 编译期直接扫描 ：编译器在编译 Java 代码的时候扫描对应的注解并处理，比如某个方法使用@Override 注解，编译器在编译的时候就会检测当前的方法是否重写了父类对应的方法。
* 运行期通过反射处理 ：像框架中自带的注解(比如 Spring 框架的 @Value 、@Component)都是通过反射来进行处理的。

只有RUNTIME级别的注解才能利用反射来获取进行对应处理，所以一般框架中的注解都是RUNTIME级别的(运行时解析)。

当然，SOURCE级别的注释虽然不会存活到编译之后，但是同样可以对程序的行为进行影响(编译时解析)，比如一个相当流行的包lombok(更具体的是包+插件), 其中@Data注解可以自动生成getter,setter，这是通过了一个Pluggable Annotation Processing API(插件式注解处理器)来实现的。

每个存在的注解处理器都会对AST(抽象语法树)进行一轮修改。

lombok插件的执行过程如下(不考虑其他注解处理器):
1. javac对源代码进行分析，生成一个抽象语法树(AST)，
2. 调用实现了**「JSR 269 API」**的lombok的程序，
3. lombok程序遍历语法树，遇到带有@Data注解的语法树，就在该语法树上添加getter和setter节点，
4. javac使用修改后的抽象语法树生成字节码文件，此时.class文件中不存在@Data注解，但具有getter和setter




