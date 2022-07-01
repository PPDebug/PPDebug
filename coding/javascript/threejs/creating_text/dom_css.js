// 场景
const scene = new THREE.Scene();

// 摄像机
const camera = new THREE.PerspectiveCamera( 
    45, // 感受野(field of view, FOV)
    window.innerWidth / window.innerHeight, // 横纵比(aspect ratio) 
    1, // 近剪切面
    500 // 远剪切面
    );
camera.position.z = 100;

// 渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

// 将渲染器渲染结果输出到页面上, renderer使用canvas元素来展现渲染结果
document.body.appendChild(renderer.domElement);

// 创建蓝色的线条材质
const material = new THREE.LineBasicMaterial(
    {color: 0x0000ff}
);
// 创建点
const points = [];
points.push(new THREE.Vector3(-10, 0, 0));
points.push(new THREE.Vector3(0, 10, 0));
points.push(new THREE.Vector3(10, 0, 0));
// 创建几何体(这个集合体不闭合)
const geometry = new THREE.BufferGeometry().setFromPoints(points);

// 网格包含几何体和材质,可以添加到场景中
const line = new THREE.Line(geometry, material);
scene.add(line);

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
