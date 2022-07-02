# JavaFX 形状

JavaFX使用屏幕空间坐标，即左上角为(0, 0)向右为X轴，向下为Y轴。

JavaFX中的场景图形对象都是Shape类的派生类。

## 线条(Line)

绘制线条利用Line类
可以使用有参构造或无参构造函数,以下两种方式是一致的:
1. 使用函数传参
```java
Line line = new Line(0.0f, 0.0f, 100.0f, 100.0f);
```
2. 使用set传参
```java
    Line line = new Line();
    line.setStartX(0.0f);
    line.setStartY(0.0f);
    line.setEndX(100.0f);
    line.setEndY(100.0f);
```

设置线条属性,包括笔触颜色，笔触宽度和线帽，或者线的破折号样式.
```java
    line.setStroke(Color.RED);
    line.setStrokeWidth(10);
    line.setStrokeLineCap(StrokeLineCap.BUTT);

    line.getStrokeDashArray().addAll(15d, 5d, 15d, 15d, 20d);
    line.setStrokeDashOffset(10);

    box.getChildren().add(line);

```


完整代码
```java
package online.pengpeng.hellojavafx;
import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.layout.VBox;
import javafx.scene.paint.Color;
import javafx.scene.shape.Line;
import javafx.scene.shape.StrokeLineCap;
import javafx.stage.Stage;
import java.io.IOException;
public class HelloApplication extends Application {
    @Override
    public void start(Stage stage) throws IOException {
        VBox box = new VBox();
        Scene scene = new Scene(box, 320, 240);
        scene.setFill(null);

        // 1. 构造方法传递参数
        Line line = new Line(0.0f, 0.0f, 100.0f, 100.0f);

        // 2. set传递参数
//        Line line = new Line();
//        line.setStartX(0.0f);
//        line.setStartY(0.0f);
//        line.setEndX(100.0f);
//        line.setEndY(100.0f);

        line.setStroke(Color.RED);
        line.setStrokeWidth(10);
        line.setStrokeLineCap(StrokeLineCap.BUTT);

        line.getStrokeDashArray().addAll(15d, 5d, 15d, 15d, 20d);
        line.setStrokeDashOffset(10);

        box.getChildren().add(line);

        stage.setTitle("draw line!");
        stage.setScene(scene);
        stage.show();
    }

    public static void main(String[] args) {
        launch();
    }
}
```

## 矩形(Rectangle) 
```java
// 矩形
Rectangle rectangle = new Rectangle(125, 35, 150, 50);
// 设置圆角
rectangle.setArcHeight(15);
rectangle.setArcWidth(15);
// 设置边框颜色
rectangle.setStroke(Color.GREEN);
rectangle.setStrokeWidth(3);
root.getChildren().add(rectangle);
```

## 椭圆(Ellipse)
```java
Ellipse ellipse = new Ellipse(350, 60, 50, 25);
root.getChildren().add(ellipse);
```

## 路径(Path)
```java
// 路径
Path path = new Path();
path.getElements().add(new MoveTo(10, 110));
path.getElements().add(new LineTo(25, 150));
path.getElements().add(new QuadCurveTo(50, 100, 75, 150));
path.getElements().add(new CubicCurveTo(80, 100, 90, 250,100, 200));
path.getElements().add(new HLineTo(50));
path.getElements().add(new VLineTo(150));
root.getChildren().add(path);
```

## 形状操作


所有的形状对象可以子啊两个成型区域之间执行几何操作，例如减法、相交和并集。

```java
// 图形相减
Ellipse bigCircle = new Ellipse(190, 150, 40, 30);
bigCircle.setStrokeWidth(3);
bigCircle.setStroke(Color.BLACK);
bigCircle.setFill(Color.WHITE);
Ellipse smallCircle = new Ellipse(190, 150, 30, 20);
Shape shape = Path.subtract(bigCircle, smallCircle);
shape.setStrokeWidth(1);
shape.setStroke(Color.BLACK);
shape.setFill(Color.rgb(255, 200, 0));
root.getChildren().add(shape);
```

