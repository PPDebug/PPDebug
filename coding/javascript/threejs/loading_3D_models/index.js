import * as THREE from "three";
import { GLTFLoader } from '/plugins/three/examples/jsm/loaders/GLTFLoader.js';
// import "/plugins/three/build/Three.js";
// import "/plugins/three/examples/js/loaders/GLTFLoader.js";

import WebGL from "/plugins/three/examples/jsm/capabilities/WebGL.js";

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

//创建一个loader
const loader = new GLTFLoader();
const modelPath = "/_media/model/gltf/cute_dog/scene.gltf";
loader.load(
    modelPath, 
    function(gltf){ // 加载成功的处理逻辑
        gltf.scene.scale.set(20, 20, 20);
        gltf.scene.rotateY(Math.PI/6);
        scene.add(gltf.scene);
        console.log("loaded success", gltf.scene);
    },
    function(xhr) { // 加载过程中调用
        console.log((xhr.loaded / xhr.total * 100) + "% loaded" );
    },
    function(error) { // 加载失败的回调函数
        console.log(error);
    }
);

if (WebGL.isWebGLAvailable()) {
    // init
    animate();
} else {
    const warning = WebGL.getWebGLErrorMessage();
    document.bodyd.appendChild(warning);
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
