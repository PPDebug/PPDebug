# web布局

## CSS常用布局

### 什么是布局
布局包含两个含义：
* 尺寸
* 定位

> **CSS布局:** 通过CSS去拾取网页中的元素，并且控制他们相对普通文档流、周边元素、父容器甚至浏览器窗口的位置。覆盖默认的布局
### 普通文档流
> 盒子模型，普通文档流：从左到由，从上到下

### 块级元素、行内元素

* 块级元素: 独占一行，可以设置宽高
* 行内元素: 同行，宽高由内容确定
* 行内块级元素: 同行，可以设置宽高

## flex布局

### 什么是flex
* flex是flexbox的缩写，意为弹性伸缩。
* 一维的布局模型
* 任何一个容器都可以指定为flex布局
### flex容器

### 常用属性
容器上的属性
* flex-direction: 方向
* flex-wrap: 是否换行
* flex-flow
元素上的属性
* flex-basis
* flex-grow: 充满时
* flex-shrink： 溢出时
* flex
元素对齐
* align-items
* justify-content
### 为什么使用flex
* 在元素外部处理空间分布
* 让元素自己处理空间分布
### flex的使用场景
* 导航 (display: flex)
* 拆分导航 (justify-content: space-between)
* 元素居中 (align-item: center; justify-content: center)
* 绝对底部 （为正文内容添加 flex-grow: 1）

## CSS定位
定位能够把一个元素从他原本正常的布局流中应该在的位置移动到另一个位置

### 定位
Position:
* static
* relative
* absolute
* fixed
* sticky

### 浮动
> 浮动是一个全局属性，一次设置对之后的所有元素都有效。
不推荐使用，尽量使用flex布局

## 响应式布局
>  响应式设计不是指某项单独的技术，它是描述web设计的一种方式
### 设置meta标签
```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
```
设置meta标签，使用设备的初始宽度作为试图的宽度，并且禁止缩放。
### 媒体查询
之后的css会覆盖之前的，所以顺序很重要。
```css
@media screen and (max-width: 1024px) {
    .media {
        backgroud-color: red;
    }
}
@media screen and (max-width: 720px) {
    .media {
        backgroud-color: green;
    }
}
```
针对项目是考虑移动端为主还是pc端为主，样式的优先顺序会不同。
移动端优先使用min-width，PC端优先使用max-width。
### 长度单位的合理使用

* rem(font size of the root element， 相对字体元素)
* 百分比(相对父元素)
* 视口单位(vh, vw, vmin, vmax， 相对窗口大小)

一些建议：
* 移动端屏幕的rem
* 占满宽度的元素%优于vw(视口高度会包括滚动条)
* 占满高度的元素vh优于%
