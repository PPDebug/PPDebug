# Javascript

## 了解闭包（closures）如何工作
```javascript
function a(v) {
    const foo = v;
    return function() {
        return foo;
    }
}

const f = a(123);
const g = a(456);
console.log(f()); // 123
console.log(g()); // 456
```
函数`a`每次调用都会创建一个新的函数，新函数封存变量`foo`

## 理解`this`的工作原理
<!-- tabs:start -->
#### **直接调用⚪**
```javascript
somefunction(a, b, c);
```
this 为 null

#### **点操作符🟢**
```javascript
someobject.somefunction(a, b, c);
```
this 为 someobject

#### **回调函数❎**
```javascript
const callback = someobject.somefunction;
loader.load(callback);
```
this 为 null

#### **回调函数✅**
```javascript
const callback = someobject.somefunction.bind(someobject);
loader.load(callback);
```
this 为 someobject
<!-- tabs:end -->

## ES新特性

### var 已经被弃用，使用const和let

### 使用`for(elem of collection)`取代`for(elem in collection`
```javascript
for (const [key, value] of Object.entries(someObject)) {
    console.log(key, vaule);
}
```

### 使用forEach, map和filter

### 使用解构赋值
假设有一个对象`const dims = {width:300, height:150}`

<!-- tabs:start -->
#### **老代码🟡**
```javascript
const width = dims.width;
const height = dims.height;
```
#### **新代码🟢**
```javascript
const {width, height} = dims;
```
<!-- tabs:end -->

### 使用对象声明简写

<!-- tabs:start -->
#### **老代码🟡**
```javascript
 const width = 300;
 const height = 150;
 const obj = {
   width: width,
   height: height,
   area: function() {
     return this.width * this.height
   },
 };
```
#### **新代码🟢**
```javascript
 const width = 300;
 const height = 150;
 const obj = {
   width,
   height,
   area() {
     return this.width * this.height;
   },
 };
```
<!-- tabs:end -->

### 使用扩展运算符`...`

<!-- tabs:start -->
#### **变长参数🔸**
```javascript
 function log(className, ...args) {
   const elem = document.createElement('div');
   elem.className = className;
   elem.textContent = [...args].join(' ');
   document.body.appendChild(elem);
 }
```
#### **数组拆解🔸**
```javascript
const position = [1, 2, 3];
somemesh.position.set(...position);
```
<!-- tabs:end -->

### 使用`class`

### getters和setters

### 使用箭头函数
回调函数和promise使用箭头函数非常有用
```javascript
loader.load((texture) => {
  // use textrue
});
```
箭头函数会绑定`this`，是以下代码的简写
```javascript
(function(args) {/* code */}).bind(this))
```

### Promises以及async/await
Promises改善异步代码的处理，Async/await改善promise的使用

### 使用模板字符串\`str\`
模板字符串是使用反引号代替引号的字符串。
```javascript
const foo = `this is a template literal`;
```
特点：
* 可以多行
    ```
    const foo = `this
    is
    a
    template
    literal`;
    const bar = "this\nis\na\ntemplate\nliteral";
    ```
* 可以使用\$\{javascript表达式\}
    ```javascript
    const r = 192;
    const g = 255;
    const b = 64;
    const rgbCSSColor = `rgb(${r},${g},${b})`;
    ```

## Javacript代码风格

变量名、函数名、方法名是小驼峰；
构造函数、类名是大驼峰。

## 链式运算
[https://juejin.cn/post/7036569099010310174](https://juejin.cn/post/7036569099010310174)




