# 创建一个场景

> 为了对three.js有一个大致的了解, 本节将从创建一个带有小方块的场景开始.

## 初始准备

three.js只是一个js库,因此因在创建一个页面并在页面中使用它.首先需要下载[three.js](https://threejs.org/build/three.js),然后将其放到项目文件夹下,并在HTML文件中引用它. 作为简单的开始, html,js,css放在同一文件夹下即可

<!-- tabs:start -->
#### **index.html**
[html](step01.html ":include :type=code")
#### **index.js**
[js](step01.js ":include")
#### **index.css**
[css](step01.css ":include")
<!-- tabs:end -->

## 创建场景


实际上使用Three.js创建任何场景时,需要三个东西:场景(scene), 摄像机(camera), 渲染器(renderer).
<!-- tabs:start -->
#### **index.html**
[html](step02.html ":include :type=code")
#### **index.js**
[js](step02.js ":include")
#### **index.css**
[css](step02.css ":include")
<!-- tabs:end -->

目前仍然没有任何输出,因为开没有实际渲染任何东西,需要调用renderer.render方法.

## 渲染场景

通常在anmimate loop中调用渲染方法,使用一种名requestAnimationFrame()方法比setInterval要好,在离开页面后不会继续执行.
<!-- tabs:start -->
#### **index.html**
[html](step03.html ":include :type=code")
#### **index.js**
[js](step03.js ":include")
#### **index.css**
[css](step03.css ":include")
#### **Output**
[Output](step03.html ":include")
<!-- tabs:end -->
