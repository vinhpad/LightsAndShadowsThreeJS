import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Create a renderer with shadow mapping enabled
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap
document.body.appendChild(renderer.domElement);

// Create OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);

// Create a cube that casts and receives shadows
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
cube.castShadow = true;
cube.receiveShadow = true;
scene.add(cube);

// Create other cube that casts and receives shadows
const geometry2 = new THREE.BoxGeometry();
const material2 = new THREE.MeshStandardMaterial({ color: 0x0000ff });
const cube2 = new THREE.Mesh(geometry2, material2);
cube2.position.set(3, 0, 3)
cube2.castShadow = true;
cube2.receiveShadow = true;
scene.add(cube2);

// Create a direction light with shadows
const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(-1, 2, -1);
directionalLight.castShadow = true;
scene.add(directionalLight)
directionalLight.target.position.set(0, 0, 0)
scene.add(directionalLight.target)
const helper = new THREE.DirectionalLightHelper(directionalLight);
scene.add(helper);

// Create and position the ground
const groundGeometry = new THREE.PlaneGeometry(15, 15);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -1;
ground.receiveShadow = true;
scene.add(ground);

// Set up the render loop
const animate = () => {
    requestAnimationFrame(animate);

    // Update the controls
    controls.update();

    // Rotate the cube
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    cube.rotation.z += 0.01;

    renderer.render(scene, camera);
};

animate();
