# JavaFX属性

## 颜色（Color）

* RGB
```java
Color.rgb(200, 100, 0);
```
* 颜色名称
```java
Color.BEIGE;
```

* alpha通道
```java
new Color(0,0,1,1.0);
```

* HSB颜色
```java
Color.hsb(270, 1.0, 1.0, 1.0);
```

* Web颜色

```java
Color.web("#0076a3");
```

## 渐变颜色

要在JavaFX中创建渐变颜色，需要设置五个属性值。如下:

* 设置开始起点的第一个停止颜色。将
* 终点设置为终止停止颜色。
* 设置proportional属性以指定是使用标准屏幕坐标还是单位平方坐标。
* 将循环方法设置为使用三个枚举：NO_CYCLE，REFLECT或REPEAT。
* 设置停止颜色数组。

* 线性渐变(LinearGradient)
```java
Stop[] stops = new  Stop[]{
        new Stop(0, Color.BLACK),
        new Stop(1, Color.RED)
};
LinearGradient lg = new LinearGradient(0, 0, 1, 0,  true, CycleMethod.NO_CYCLE, stops);

Rectangle rectangle = new Rectangle(0, 0, 100, 100);
rectangle.setFill(lg);
root.getChildren().add(rectangle);
```
* 径向渐变(RadialGradient)
```java
RadialGradient rg = new RadialGradient(
        0, // focusAngle
        0.1, // focusDistance
        100, // centerX
        100, // centerY
        20, // radius
        false, // proportional
        CycleMethod.NO_CYCLE, // cycleMethod
        new Stop(0, Color.RED),
        new Stop(1, Color.BLACK)
);
Circle ball = new Circle(100, 100, 20);
ball.setFill(rg);
root.getChildren().add(ball);
```
## 属性的类型


属性类都在包javax.beans.property.*包命名空间空间中：
* SimpleBoolenProperty
* ReadOnlyBooleanWrapper
* SimpleintegerProperty
* ReadOnlyintegerWrapper
* SimpleDoubleProperty
* ReadOnlyDoubleWrapper
* SimpleStringProperty
* ReadOnlyStringWSrapper

有两种类型

* 读写(Read/Write)
```java
StringProperty password = new SimpleStringProperty("original password");
password.set("new password");
System.out.println(password.get());
```
* 只读(Read-Only)
```java
ReadOnlyStringWrapper password = new ReadOnlyStringWrapper("original password");
ReadOnlyStringProperty readOnlyPassword = password.getReadOnlyProperty();
```

## JavaFX JavaBean

当基于Swing的应用程序时，使用getter和setter创建JavaBean.
```java
package online.pengpeng.hellojavafx;
import javafx.beans.property.ReadOnlyStringProperty;
import javafx.beans.property.ReadOnlyStringWrapper;
import javafx.beans.property.SimpleStringProperty;
import javafx.beans.property.StringProperty;
public class User {
    private final static String USERNAME_PROP_NAME = "name";
    private final ReadOnlyStringWrapper userName;
    private final static String PASSWORD_PROP_NAME = "PASSWORD";
    private final StringProperty password;

    public User() {
        userName = new ReadOnlyStringWrapper(this, USERNAME_PROP_NAME, "fake name");
        password = new SimpleStringProperty(this, PASSWORD_PROP_NAME, "");
    }

    public final String getUserName() {
        return userName.get();
    }

    public ReadOnlyStringProperty userNameProperty() {
        return userName.getReadOnlyProperty();
    }

    public final String getPassword() {
        return password.get();
    }

    public final void setPassword(String password) {
        this.password.set(password);
    }

    public StringProperty passwordProperty(){
        return password;
    }
}

```

## 属性更改事件
JavaFX属性对象包含一个addListener()方法,接受两种类型的功能接口：changeListener和invalidationListener。所有的JavaFX对象都实现了ObservableValue和Observable接口.
```java
package online.pengpeng.hellojavafx.starting;
import javafx.beans.property.SimpleIntegerProperty;
import javafx.beans.value.ChangeListener;
import javafx.beans.value.ObservableValue;
public class ChangeListenerDemo {

    public static void main(String[] args) {
        SimpleIntegerProperty xProperty = new SimpleIntegerProperty(0);

        // 通过匿名类添加 change listener
        xProperty.addListener(new ChangeListener<Number>() {
            @Override
            public void changed(ObservableValue<? extends Number> observableValue, Number oldValue, Number newValue) {
                System.out.println("anonymous change listener:");
                System.out.println("Old value: " + oldValue);
                System.out.println("new Value: " + newValue);
            }
        });

        // 通过lambda表达式添加change listener
        xProperty.addListener((ObservableValue<? extends Number> ov, Number oldValue, Number newValue)-> {
            System.out.println("lambda change listener");
            System.out.println("Old value: " + oldValue);
            System.out.println("new Value: " + newValue);
        });

        xProperty.set(1);
        xProperty.set(2);
    }
}

```

changListener和invalidationListener的区别：
* changeListener可以获取Observable的旧值和新值
* invaliddationListener只获取Observable对象


## JavaFX绑定
JavaFX绑定同步两个值：当依赖变量更改时，其他变量更改。


绑定策略有三种：
* JavaBean 上的双向绑定
* 与Fluent API绑定
* 使用javafx.bean.binging定义绑定对象进行低级绑定

### 双向绑定
* 绑定相同类型
* 同步两侧的值
* 两个属性必须都是可读写的
```java
package online.pengpeng.hellojavafx.starting;
import javafx.beans.property.SimpleStringProperty;
import javafx.beans.property.StringProperty;
public class BindingDemo {
    public static void main(String[] args) {
        User contact = new User("Jame", "Bind");
        StringProperty fname = new SimpleStringProperty();
        fname.bindBidirectional(contact.firstNameProperty());
        System.out.println("firstNameProperty = " + contact.firstNameProperty().get());
        System.out.println("fname = " + fname.get());

        contact.firstNameProperty().set("new value");
        System.out.println("firstNameProperty = " + contact.firstNameProperty().get());
        System.out.println("fname = " + fname.get());

        fname.set("新绑定值");
        System.out.println("firstNameProperty = " + contact.firstNameProperty().get());
        System.out.println("fname = " + fname.get());
    }
}
class User {

    private final SimpleStringProperty firstName = new SimpleStringProperty();
    private final SimpleStringProperty lastName = new SimpleStringProperty();

    public User(String fn, String ln) {
        firstName.setValue(fn);
        lastName.setValue(ln);
    }

    public final String getFirstName() {
        return firstName.getValue();
    }

    public StringProperty firstNameProperty() {
        return firstName;
    }

    public final void setFirstName(String firstName) {
        this.firstName.setValue(firstName);
    }

    public final String getLastName() {
        return lastName.getValue();
    }

    public StringProperty lastNameProperty() {
        return lastName;
    }

    public final void setLastName(String lastName) {
        this.lastName.setValue(lastName);
    }
}
```

### 高级别绑定
* multipy()
* divide()
* substract()
* isEqualTo()

可以连写如`width().multiply(height()).divide(2)`

```java
System.out.println("\nadvanced Binding");
IntegerProperty width = new SimpleIntegerProperty(10);
IntegerProperty height = new SimpleIntegerProperty(10);
NumberBinding area = width.multiply(height);
System.out.println(area.getValue());

width.set(20);
System.out.println(area.getValue());
```

### 低级别绑定
```java
System.out.println("\nlow level Binding");
DoubleProperty v1 = new SimpleDoubleProperty(10);
DoubleProperty v2 = new SimpleDoubleProperty(10);
DoubleBinding result = new DoubleBinding() {
    // init
    {
        super.bind(v1, v2);
    }
    @Override
    protected double computeValue() {
        return v1.get() * v2.get();
    }
};
System.out.println(result.get());

v2.set(5);
System.out.println(result.get());
```

### UI控件与域模型之间的绑定

```java
package online.pengpeng.hellojavafx.starting;

import javafx.application.Application;
import javafx.application.Platform;
import javafx.beans.property.*;
import javafx.scene.Group;
import javafx.scene.Scene;
import javafx.scene.control.PasswordField;
import javafx.scene.image.Image;
import javafx.scene.layout.VBox;
import javafx.scene.text.Text;
import javafx.stage.Stage;

import java.io.*;

public class UIDomain extends Application {

    public static void main(String[] args) {
        launch(args);
    }

    private final static String MY_PASS = "passwd";
    private final static BooleanProperty accessGranted = new SimpleBooleanProperty(false);

    @Override
    public void start(Stage stage) {
        UserDomain user = new UserDomain();
        Group root = new Group();
        Scene scene = new Scene(root, 320, 100);

        Text userName = new Text("123");
        userName.textProperty().bind(user.userNameProperty());

        PasswordField passwordField = new PasswordField();
        passwordField.setPromptText("password");
        user.passwordProperty().bind(passwordField.textProperty());

        passwordField.setOnAction((actionEvent)-> {
            if (accessGranted.get()) {
                System.out.println("granted access:" + user.getUserName());
                System.out.println("password: " + user.getPassword());
                Platform.exit();
            } else {
                stage.setTitle("no access");
            }
        });

        passwordField.textProperty().addListener((obs, ov, nv) -> {
            boolean granted = passwordField.getText().equals(MY_PASS);
            accessGranted.set(granted);
            if (granted) {
                stage.setTitle("");
            }
        });
        VBox formLayout = new VBox(4);
        formLayout.getChildren().addAll(passwordField);
//        formLayout.getChildren().addAll(userName, passwordField); // javaFX使用Text报错
        formLayout.setLayoutX(12);
        formLayout.setLayoutY(12);

        root.getChildren().addAll(formLayout);

        stage.setTitle("UI与域模型绑定");
        // 测试当前运行环境
        try {
            Process process = Runtime.getRuntime().exec("cmd /c dir");
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream(), "GBK"));
            String line = "";
            while((line= reader.readLine()) != null){
                System.out.println(line);
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        stage.getIcons().add(new Image("https://avatars.githubusercontent.com/u/72385054?s=400&u=b0cccb4685877a4282e90c131b0720b1b82b50a8&v=4"));
        stage.setScene(scene);
        stage.show();
    }
}

class UserDomain {
    private final ReadOnlyStringWrapper userName;
    private final StringProperty password;
    public UserDomain() {
        userName = new ReadOnlyStringWrapper(this, "userName", "ABC");
        password = new SimpleStringProperty(this, "password", "");
    }

    public final String getUserName() {
        return userName.get();
    }
    public ReadOnlyStringProperty userNameProperty() {
        return userName.getReadOnlyProperty();
    }

    public final String getPassword() {
        return password.get();
    }
    public StringProperty passwordProperty() {
        return password;
    }
}


```

## JavaFX集合
JavaFX中的集合由javafx.collections包定义
* 接口：
    * ObservableList:允许跟踪更改的列表
    * ListChangeListener: 接受更改通知的接口
    * ObservaleMap: 允许跟踪更改的映射
    * MapChangeListener: 从ObservaleMap接受更改通知的接口

* 类：
    * FXCollections: 使用程序类映射到java.util.Collections
    * ListChangeListener.Change: 表示对ObservableList所做的更改 
    * MapChangeListener.Change:表示对ObservableMap所做的更改

```java
package online.pengpeng.hellojavafx.starting;

import javafx.beans.Observable;
import javafx.collections.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author pengpeng
 * @date 2022/7/2
 */
public class CollectionsDemo {
    public static void main(String[] args) {
        // 1. ObservableList
        List<String> list = new ArrayList<>();
        ObservableList<String> observableList = FXCollections.observableList(list);
        observableList.addListener((ListChangeListener<String>) (change)-> {
            System.out.println("List modified!");
        });
        observableList.add("item one");
        list.add("item two"); //对用原生集合的操作不会引发监听事件, 但是数据时只有一份
        System.out.println("Size: " + observableList.size());

        // 2. ObservableMap
        Map<String, String> map = new HashMap<>();
        ObservableMap<String, String> observableMap = FXCollections.observableMap(map);
        observableMap.addListener((MapChangeListener<String, String>) (change)->{
            System.out.println("Map changed!");
        });
        observableMap.put("key1", "value1");
        observableMap.remove("key1");
        observableMap.remove("key1");// 没有实际删除不会触发

        // 3. getInfo from ListChangeListener.Change
        List<String> list2 = new ArrayList<>();
        ObservableList<String> observableList2 = FXCollections.observableList(list2);
        observableList2.addListener((ListChangeListener<String>) (change)-> {
            System.out.println("List2 modified!");
            while(change.next()) {
                System.out.println("Was added? " + change.wasAdded());
                System.out.println("Was removed? " + change.wasRemoved());
                System.out.println("Was replaced? " + change.wasReplaced());
                System.out.println("Was permutated? " + change.wasPermutated());
            }
        });
        observableList2.add("item one");
        list2.add("item two"); //对用原生集合的操作不会引发监听事件, 但是数据时只有一份
        System.out.println("Size: " + observableList2.size());
    }
}

```
结果
```bash
List modified!
Size: 2
Map changed!
Map changed!
List2 modified!
Was added? true
Was removed? false
Was replaced? false
Was permutated? false
Size: 2
```

