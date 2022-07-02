# JavaFX 的项目结构

通常使用Maven进行包管理，有时也会使用其他的。
因此只关注src中结构:
```bash
tree src /f 

└─main
    ├─java
    │  │  module-info.java
    │  │
    │  └─online
    │      └─pengpeng
    │          └─hellojavafx
    │                  HelloApplication.java
    │                  HelloController.java
    │
    └─resources
        └─online
            └─pengpeng
                └─hellojavafx
                        hello-view.fxml
```

JavaFX中主要有以下几个元素：
* Stage: 舞台，是应用程序窗口
* Scene: 场景
* Container:  容器, 可用于嵌套结构
* Layout: 布局，设计样式
* Control: 控件，用于交互

<!-- tabs:start -->
#### **HelloApplication**
```java
package online.pengpeng.hellojavafx;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.stage.Stage;

import java.io.IOException;

public class HelloApplication extends Application {
    @Override
    public void start(Stage stage) throws IOException {
        FXMLLoader fxmlLoader = new FXMLLoader(HelloApplication.class.getResource("hello-view.fxml"));
        Scene scene = new Scene(fxmlLoader.load(), 320, 240);
        stage.setTitle("Hello!");
        stage.setScene(scene);
        stage.show();
    }

    public static void main(String[] args) {
        launch();
    }
}
```
#### **HelloController**
```java
package online.pengpeng.hellojavafx;

import javafx.fxml.FXML;
import javafx.scene.control.Label;

public class HelloController {
    @FXML
    private Label welcomeText;

    @FXML
    protected void onHelloButtonClick() {
        welcomeText.setText("Welcome to JavaFX Application!");
    }
}
```
#### **hello-view.fxml**
```xml
<?xml version="1.0" encoding="UTF-8"?>

<?import javafx.geometry.Insets?>
<?import javafx.scene.control.Label?>
<?import javafx.scene.layout.VBox?>

<?import javafx.scene.control.Button?>
<VBox alignment="CENTER" spacing="20.0" xmlns:fx="http://javafx.com/fxml"
      fx:controller="online.pengpeng.hellojavafx.HelloController">
    <padding>
        <Insets bottom="20.0" left="20.0" right="20.0" top="20.0"/>
    </padding>

    <Label fx:id="welcomeText"/>
    <Button text="Hello!" onAction="#onHelloButtonClick"/>
</VBox>

```
<!-- tabs:end -->
