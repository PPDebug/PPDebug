// 场景
const scene = new THREE.Scene();

// 摄像机
const camera = new THREE.PerspectiveCamera( 
    75, // 感受野(field of view, FOV)
    window.innerWidth / window.innerHeight, // 横纵比(aspect ratio) 
    0.1, // 近剪切面
    1000 // 远剪切面
    );

// 渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

// 将渲染器渲染结果输出到页面上, renderer使用canvas元素来展现渲染结果
document.body.appendChild(renderer.domElement);

// 添加小方块
// BoxGeometry包含了方块所需的点和面
const geometry = new THREE.BoxGeometry(1, 1, 1);
// 使用材质来给物体上色
const material = new THREE.MeshBasicMaterial(
    {color: 0x00ff00}
);
// 网格包含几何体和材质,可以添加到场景中
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

animate();

function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}
