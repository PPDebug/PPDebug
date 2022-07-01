# WebGL的兼容性检查

[引用文件](https://github.com/mrdoob/three.js/blob/master/examples/jsm/capabilities/WebGL.js)

```javascript
if (WebGL.isWebGLAvailable()) {
    // Initiate function or other initializations here
    animate();
} else {
    const warning = WebGL.getWebGLErrorMessage();
    document.getElementById('container').appendChild(warning);
}
```

<!-- tabs:start -->
#### **index.html**
[html](index.html ":include :type=code")
#### **index.js**
[js](index.js ":include")
#### **index.css**
[css](index.css ":include")
#### **Output**
[Output](index.html ":include")
<!-- tabs:end -->


