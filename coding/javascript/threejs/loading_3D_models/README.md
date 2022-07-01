# 加载3D模型

3D模型的地址有很多,每种格式有不同的目的,用途和各自的优势.Three.js支持多种导入工具,但有些导入工具可能比较难以使用,官方推荐使用glTF格式(GL Transmission Format),这种格式传输效率高.可以包括网格,材质,纹理,皮肤,骨骼,变形目标,动画,灯光和摄像机.

3D模型下载地址: [Sketchfab](https://sketchfab.com/models?features=downloadable&sort_by=-likeCount&type=models)

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

实际上，加载完模型后可能并没有输出任何东西，这可能是因为模型大小设置不恰当导致的，需要设置得恰当。

