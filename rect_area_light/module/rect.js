import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

let renderer, scene, camera;
let stats, meshKnot;
let rotation;
let params;
let rectLight1, rectLight2, rectLight3;
let helper1, helper2, helper3;
init();

function init() {

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animation);
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 5, - 15);

    scene = new THREE.Scene();

    RectAreaLightUniformsLib.init();

    rectLight1 = new THREE.RectAreaLight(0xff0000, 5, 4, 10);
    rectLight1.position.set(- 5, 5, 5);
    scene.add(rectLight1);

    rectLight2 = new THREE.RectAreaLight(0x00ff00, 5, 4, 10);
    rectLight2.position.set(0, 5, 5);
    scene.add(rectLight2);

    rectLight3 = new THREE.RectAreaLight(0x0000ff, 5, 4, 10);
    rectLight3.position.set(5, 5, 5);
    scene.add(rectLight3);

    helper1 = new RectAreaLightHelper(rectLight1);
    helper2 = new RectAreaLightHelper(rectLight2);
    helper3 = new RectAreaLightHelper(rectLight3);

    scene.add(helper1);
    scene.add(helper2);
    scene.add(helper3);


    const geoFloor = new THREE.BoxGeometry(2000, 0.1, 2000);
    const matStdFloor = new THREE.MeshStandardMaterial({ color: 0xbcbcbc, roughness: 0.1, metalness: 0 });
    const mshStdFloor = new THREE.Mesh(geoFloor, matStdFloor);
    scene.add(mshStdFloor);

    const geoKnot = new THREE.TorusKnotGeometry(1.5, 0.5, 200, 16);
    const matKnot = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0, metalness: 0 });
    meshKnot = new THREE.Mesh(geoKnot, matKnot);
    meshKnot.position.set(0, 5, 0);
    scene.add(meshKnot);

    const axesHelper = new THREE.AxesHelper(100);
    scene.add(axesHelper);

    params = {
        rotateX: rectLight1.rotation.x,
        rotateY: rectLight1.rotation.y,
        rotateZ: rectLight1.rotation.z,
        posX: 0,
        posY: 0,
        posZ: 0,
        helpers: true,
    }

    const gui = new GUI();

    //gui.setSize(400, 400);

    gui.add(params, "rotateX", -180, 180);
    gui.add(params, "rotateY", -180, 180);
    gui.add(params, "rotateZ", -180, 180);
    gui.add(params, "posX", -10, 10);
    gui.add(params, "posY", -10, 10);
    gui.add(params, "posZ", -10, 10);
    gui.add(params, "helpers").onChange( function ( val ) {
        helper1.visible = val;
        helper2.visible = val;
        helper3.visible = val;
    } );

    gui.open();


    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(meshKnot.position);
    controls.update();

    //
    window.addEventListener('resize', onWindowResize);

    stats = new Stats();
    document.body.appendChild(stats.dom);

}

function onWindowResize() {

    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = (window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();

}

function animation(time) {

    meshKnot.rotation.y = time / 1000;

    rectLight1.rotation.x = params.rotateX / 180 * Math.PI
    rectLight1.rotation.y = params.rotateY / 180 * Math.PI
    rectLight1.rotation.z = params.rotateZ / 180 * Math.PI

    rectLight3.lookAt(params.posX, params.posY, params.posZ);

        renderer.render(scene, camera);

    stats.update();
}
