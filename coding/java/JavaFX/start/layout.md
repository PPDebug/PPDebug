# JavaFX布局

## FlowPane
FlowPane是一个容器。它在一行上排列连续的子组件，并且如果当前行填满了以后，则自动将子组件向下推到下一行。

```java
package online.pengpeng.hellojavafx.starting;

import javafx.application.Application;
import javafx.geometry.Insets;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.CheckBox;
import javafx.scene.control.RadioButton;
import javafx.scene.control.TextField;
import javafx.scene.image.Image;
import javafx.scene.layout.FlowPane;
import javafx.stage.Stage;

import java.io.IOException;

public class FlowPaneDemo extends Application {
    @Override
    public void start(Stage stage) throws IOException {
        FlowPane root = new FlowPane();
        root.setHgap(10);
        root.setVgap(20);
        root.setPadding(new Insets(15, 15, 15, 15));
        Scene scene = new Scene(root, 550, 250);

        // Button1
        Button button1 = new Button("Button1");
        root.getChildren().add(button1);

        // Button2
        Button button2 = new Button("Button2");
        button2.setPrefSize(100, 100);
        root.getChildren().add(button2);

        // TextField
        TextField textField = new TextField("Text Field");
        textField.setPrefWidth(110);
        root.getChildren().add(textField);

        // CheckBox
        CheckBox checkBox = new CheckBox("Check Box");
        root.getChildren().add(checkBox);

        // RadioButton
        RadioButton radioButton = new RadioButton("Radio Button");
        root.getChildren().add(radioButton);

        stage.setTitle("Learning JavaFX");
        stage.getIcons().add(new Image("https://avatars.githubusercontent.com/u/72385054?s=400&u=b0cccb4685877a4282e90c131b0720b1b82b50a8&v=4"));
        stage.setScene(scene);
        stage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
```

## HBOx
HBox布局类将JavaFX子节点放在水平行中。 新的子节点附加到右侧的末尾。默认情况下，HBox布局尊重子节点的首选宽度和高度。当父节点不可调整大小时，例如Group节点，HBox的行高度设置为子节点的最大首选高度。
默认情况下，每个子节点与左上(Pos.TOP_LEFT)位置对齐。
我们可以通过编程方式改变HBox的布局约束，例如边框，填充，边距，间距和对齐。
当处理不可缩放的子节点(如Shape节点)时，父节点会考虑Shape的矩形边界(ParentInBounds)的宽度和高度。
当处理诸如TextField控件之类可调整大小的节点时，父节点计算TextField水平增长的可用空间。
要在HBox中水平增长UI控件，请使用静态HBox.setHgrow()方法。

### 设置HBox内元素填充HBox剩余空间
```java
package online.pengpeng.hellojavafx.starting;

import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.TextField;
import javafx.scene.image.Image;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Priority;
import javafx.scene.paint.Color;
import javafx.stage.Stage;

public class HBoxDemo extends Application {
    @Override
    public void start(Stage stage) throws Exception {
        HBox hbox = new HBox();
        TextField textField = new TextField();
        hbox.getChildren().add(textField);
        HBox.setHgrow(textField, Priority.ALWAYS); // 根据HBox可用空间填充子元素

        Scene scene = new Scene(hbox, 320, 112, Color.rgb(0, 0, 0));
        stage.setTitle("Learning JavaFX");
        stage.getIcons().add(new Image("https://avatars.githubusercontent.com/u/72385054?s=400&u=b0cccb4685877a4282e90c131b0720b1b82b50a8&v=4"));
        stage.setScene(scene);
        stage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}

```
### 设置HBox约束
```java
package online.pengpeng.hellojavafx.starting;

import javafx.application.Application;
import javafx.geometry.Insets;
import javafx.scene.Group;
import javafx.scene.Scene;
import javafx.scene.image.Image;
import javafx.scene.layout.HBox;
import javafx.scene.shape.Rectangle;
import javafx.stage.Stage;

public class HBoxDemo extends Application {
    @Override
    public void start(Stage stage) throws Exception {

        Group root = new Group();

        HBox hbox = new HBox(5); // 5 pixels between child nodes
        hbox.setPadding(new Insets(1)); // 1 pixels padding between child nodes


        Rectangle r1 = new Rectangle(10, 10);
        Rectangle r2 = new Rectangle(20, 100);
        Rectangle r3 = new Rectangle(50, 20);
        Rectangle r4 = new Rectangle(20, 50);

        HBox.setMargin(r1, new Insets(2, 2, 2, 2));

        hbox.getChildren().addAll(r1, r2, r3, r4);
        root.getChildren().add(hbox);

        Scene scene = new Scene(root, 320, 250);
        stage.setTitle("Learning JavaFX");
        stage.getIcons().add(new Image("https://avatars.githubusercontent.com/u/72385054?s=400&u=b0cccb4685877a4282e90c131b0720b1b82b50a8&v=4"));
        stage.setScene(scene);
        stage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}

```
### 设置HBox首选宽度
```java
package online.pengpeng.hellojavafx.starting;

import javafx.application.Application;
import javafx.geometry.Insets;
import javafx.scene.Group;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.image.Image;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Priority;
import javafx.scene.shape.Rectangle;
import javafx.stage.Stage;

public class HBoxDemo extends Application {
    @Override
    public void start(Stage stage) throws Exception {

        Group root = new Group();

        HBox hbox = new HBox();
        Button button1 = new Button("Add               ");
        Button button2 = new Button("Remove   ");
        HBox.setHgrow(button1, Priority.ALWAYS);
        HBox.setHgrow(button2, Priority.ALWAYS);
        button1.setMaxWidth(Double.MAX_VALUE);
        button2.setMaxWidth(Double.MAX_VALUE);

        hbox.setPrefWidth(400); // 设置HBox首选宽度

        hbox.getChildren().addAll(button1, button2);
        root.getChildren().add(hbox);

        Scene scene = new Scene(root, 320, 250);
        stage.setTitle("Learning JavaFX");
        stage.getIcons().add(new Image("https://avatars.githubusercontent.com/u/72385054?s=400&u=b0cccb4685877a4282e90c131b0720b1b82b50a8&v=4"));
        stage.setScene(scene);
        stage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}

```

## VBox
VBox布局将子节点堆叠在垂直列中。新添加的子节点被放置在上一个子节点的下面。默认情况下，VBox尊重子节点的首选宽度和高度。
当父节点不可调整大小时，例如Group节点，最大垂直列的宽度基于具有最大优选宽度的节点。默认情况下，每个子节点与左上(Pos.TOP_LEFT)位置对齐。

```java
package online.pengpeng.hellojavafx.starting;

import javafx.application.Application;
import javafx.geometry.Insets;
import javafx.scene.Group;
import javafx.scene.Scene;
import javafx.scene.image.Image;
import javafx.scene.layout.VBox;
import javafx.scene.shape.Rectangle;
import javafx.stage.Stage;

public class VBoxDemo extends Application {
    @Override
    public void start(Stage stage) throws Exception {
        Group root = new Group();

        VBox vbox = new VBox(5);// 5 pixel between child nodes
        vbox.setPadding(new Insets(5));

        Rectangle r1 = new Rectangle(10, 10);
        Rectangle r2 = new Rectangle(20, 100);
        Rectangle r3 = new Rectangle(50, 20);
        Rectangle r4 = new Rectangle(20, 50);

        VBox.setMargin(r1, new Insets(2, 2, 2, 2));

        vbox.getChildren().addAll(r1, r2, r3, r4);
        root.getChildren().add(vbox);

        Scene scene = new Scene(root, 300, 250);
        stage.setTitle("Learning JavaFX");
        stage.getIcons().add(new Image("https://avatars.githubusercontent.com/u/72385054?s=400&u=b0cccb4685877a4282e90c131b0720b1b82b50a8&v=4"));
        stage.setScene(scene);
        stage.show();

    }

    public static void main(String[] args) {
        launch(args);
    }
}

```

## BorderPane
BorderPane布局顶部，底部，左，右或中心区域中的子节点。每个区域只能有一个节点。BorderPane的顶部和底部区域允许可调整大小的节点占用所有可用宽度。左边界区域和右边界区域占据顶部和底部边界之间的可用垂直空间。
默认情况下，所有边界区域尊重子节点的首选宽度和高度。放置在顶部，底部，左侧，右侧和中心区域中的节点的默认对齐方式如下：

* 顶部: Pos.TOP_LEFT
* 底部: Pos.BOTTOM_LEFT
* 左侧: Pos.TOP_LEFT
* 右侧: Pos.TOP_RIGHT
* 中心: Pos.CENTER

### 基本布局
```java
package online.pengpeng.hellojavafx.starting;

import javafx.application.Application;
import javafx.geometry.Insets;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.image.Image;
import javafx.scene.layout.BorderPane;
import javafx.stage.Stage;

/**
 * @author pengpeng
 * @date 2022/7/3
 */
public class BorderPaneDemo extends Application {
    @Override
    public void start(Stage stage) throws Exception {

        BorderPane borderPane = new BorderPane();
        borderPane.setPadding(new Insets(10, 20, 10, 20));

        Button btnTop = new Button("Top");
        borderPane.setTop(btnTop);

        Button btnLeft = new Button("Left");
        borderPane.setLeft(btnLeft);

        Button btnCenter = new Button("Center");
        borderPane.setCenter(btnCenter);

        Button btnRight = new Button("Right");
        borderPane.setRight(btnRight);

        Button btnBottom = new Button("Bottom");
        borderPane.setBottom(btnBottom);

        Scene scene = new Scene(borderPane, 300, 250);
        stage.setTitle("Learning JavaFX");
        stage.getIcons().add(new Image("https://avatars.githubusercontent.com/u/72385054?s=400&u=b0cccb4685877a4282e90c131b0720b1b82b50a8&v=4"));
        stage.setScene(scene);
        stage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}

```

### BorderPane绑定Group大小
```java
package online.pengpeng.hellojavafx.starting;

import javafx.application.Application;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.scene.Group;
import javafx.scene.Scene;
import javafx.scene.control.Menu;
import javafx.scene.control.MenuBar;
import javafx.scene.control.MenuItem;
import javafx.scene.image.Image;
import javafx.scene.layout.BorderPane;
import javafx.stage.Stage;

/**
 * @author pengpeng
 * @date 2022/7/3
 */
public class BorderPaneDemo extends Application {
    @Override
    public void start(Stage stage) throws Exception {

        Group root = new Group();
        Scene scene = new Scene(root, 300, 250);

        MenuBar menuBar = new MenuBar();
        EventHandler<ActionEvent> action = (ActionEvent event)->{
            MenuItem mItem = (MenuItem) event.getSource();
            String side = mItem.getText();
            if ("left".equalsIgnoreCase(side)) {
                System.out.println("left");
            } else if ("right".equalsIgnoreCase(side)) {
                System.out.println("right");
            } else if ("top".equalsIgnoreCase(side)) {
                System.out.println("top");
            } else if ("bottom".equalsIgnoreCase(side)) {
                System.out.println("bottom");
            }
        };

        Menu menu = new Menu("Direction");

        MenuItem left = new MenuItem("Left");
        left.setOnAction(action);
        menu.getItems().add(left);

        MenuItem right = new MenuItem("right");
        right.setOnAction(action);
        menu.getItems().add(right);

        MenuItem top = new MenuItem("top");
        top.setOnAction(action);
        menu.getItems().add(top);

        MenuItem bottom = new MenuItem("bottom");
        bottom.setOnAction(action);
        menu.getItems().add(bottom);

        menuBar.getMenus().add(menu);

        BorderPane borderPane = new BorderPane();
        borderPane.prefHeightProperty().bind(scene.heightProperty());
        borderPane.prefWidthProperty().bind(scene.widthProperty());

        borderPane.setTop(menuBar);
        root.getChildren().add(borderPane);

        stage.setTitle("Learning JavaFX");
        stage.getIcons().add(new Image("https://avatars.githubusercontent.com/u/72385054?s=400&u=b0cccb4685877a4282e90c131b0720b1b82b50a8&v=4"));
        stage.setScene(scene);
        stage.show();
    }
    public static void main(String[] args) {
        launch(args);
    }
}

```

## GridPane

GridPane通常用于布局：第一列上的只读标签的输入表单和第二列上的输入字段。
GridPane可以在行，列或单元格级别指定约束。

```java
package online.pengpeng.hellojavafx.starting;

import javafx.application.Application;
import javafx.geometry.HPos;
import javafx.geometry.Insets;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;
import javafx.scene.image.Image;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.ColumnConstraints;
import javafx.scene.layout.GridPane;
import javafx.scene.layout.Priority;
import javafx.scene.paint.Color;
import javafx.stage.Stage;

public class GridPaneDemo extends Application {
    @Override
    public void start(Stage stage) throws Exception {
        BorderPane root = new BorderPane();
        Scene scene = new Scene(root, 380, 150, Color.WHITE);

        GridPane gridPane = new GridPane();
        gridPane.setPadding(new Insets(5));
        gridPane.setHgap(5);
        gridPane.setVgap(5);

        ColumnConstraints column1 = new ColumnConstraints(100);
        ColumnConstraints column2 = new ColumnConstraints(50, 150, 300);
        column2.setHgrow(Priority.ALWAYS);
        gridPane.getColumnConstraints().addAll(column1, column2);

        Label fNameLbl = new Label("First Name");
        TextField fNameFld = new TextField();
        Label lNameLbl = new Label("Last Name");
        TextField lNameFld = new TextField();

        Button saveButton = new Button("Save");

        GridPane.setHalignment(fNameLbl, HPos.RIGHT);
        gridPane.add(fNameLbl, 0, 0);

        GridPane.setHalignment(lNameLbl, HPos.RIGHT);
        gridPane.add(lNameLbl, 0, 1);

        GridPane.setHalignment(fNameFld, HPos.LEFT);
        gridPane.add(fNameFld, 1, 0);

        GridPane.setHalignment(lNameFld, HPos.LEFT);
        gridPane.add(lNameFld, 1, 1);

        GridPane.setHalignment(saveButton, HPos.RIGHT);
        gridPane.add(saveButton, 1, 2);

        root.setCenter(gridPane);

        stage.setTitle("Learning JavaFX");
        stage.getIcons().add(new Image("https://avatars.githubusercontent.com/u/72385054?s=400&u=b0cccb4685877a4282e90c131b0720b1b82b50a8&v=4"));
        stage.setScene(scene);
        stage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}

```



