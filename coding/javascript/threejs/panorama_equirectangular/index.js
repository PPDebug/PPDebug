import * as THREE from "three";
import { GLTFLoader } from '/plugins/three/examples/jsm/loaders/GLTFLoader.js';

import WebGL from "/plugins/three/examples/jsm/capabilities/WebGL.js";
import Stats from "/plugins/three/examples/jsm/libs/stats.module.js";
import {GUI} from "/plugins/three/examples/jsm/libs/lil-gui.module.min.js";

// 定义全局变量
let scene, renderer, camera, stats;

let isUserInteracting = false,
    onPointerDownMouseX = 0, onPointerDownMouseY = 0,
    lon = 0, onPointerDownLon = 0,
    lat = 0, onPointerDownLat = 0,
    phi = 0, theta = 0;

const texturePath = "/_media/texture/old_room.jpg";

init();
animate();

function init() {

    const container = document.getElementById("container");

    camera = new THREE.PerspectiveCamera(
        45,
        window.innerHeight / window.innerHeight,
        1,
        1000
    );

    scene = new THREE.Scene();

    const geometry = new THREE.SphereGeometry(500, 60, 40);
    // 沿x轴翻转几何体，使所有的面指向内部
    geometry.scale(-1, 1, 1);

    const texture = new THREE.TextureLoader().load(texturePath);
    const material = new THREE.MeshBasicMaterial({map:texture});

    const mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    container.style.touchAction = "none";
    
    container.addEventListener("pointerdown", onPointerDown);

    document.addEventListener("wheel", onDocumentMouseWheel);
    
    window.addEventListener("resize", onWindowResize);

}

function animate() {
    requestAnimationFrame(animate);
    update();
}

function update() {
    if (isUserInteracting === false) {
        lon += 0.1;
    }
    lat = Math.max(-85, Math.min(lat));
    phi = THREE.MathUtils.degToRad(90 - lat);
    theta = THREE.MathUtils.degToRad(lon);

    const x = 500 * Math.sin(phi) * Math.cos(theta);
    const y = 500 * Math.cos(phi);
    const z = 500 * Math.sin(phi) * Math.sin(theta);
    
    camera.lookAt(x, y, z);
    renderer.render(scene, camera);
}

function onPointerDown(event){
    if ( event.isPrimary === false ) return;

    isUserInteracting = true;

    onPointerDownMouseX = event.clientX;
    onPointerDownMouseY = event.clientY;

    onPointerDownLon = lon;
    onPointerDownLat = lat;

    document.addEventListener( 'pointermove', onPointerMove );
    document.addEventListener( 'pointerup', onPointerUp );
}

function onDocumentMouseWheel(event){
    const fov = camera.fov + event.deltaY * 0.05;

    camera.fov = THREE.MathUtils.clamp( fov, 10, 75 );

    camera.updateProjectionMatrix();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onPointerMove(event){
    if (event.isPrimary===false) return;
    lon = (onPointerDownMouseX - event.clientX) * 0.1 + onPointerDownLon;
    lat = (event.clientY - onPointerDownMouseX) * 0.1 + onPointerDownLat;
}

function onPointerUp(event) {
    if (event.isPrimary ===false) return;
    isUserInteracting = false;
    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerup", onPointerUp);
}