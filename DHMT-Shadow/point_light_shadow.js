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

// Create a point light with shadows
const pointLight = new THREE.PointLight(0xffffff, 10);
pointLight.position.set(1, 2, 1);
pointLight.castShadow = true;
scene.add(pointLight);

// Create a visual marker for the point light
const lightSphereGeometry = new THREE.SphereGeometry(0.03, 16, 16);
const lightSphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const lightSphere = new THREE.Mesh(lightSphereGeometry, lightSphereMaterial);
lightSphere.position.copy(pointLight.position);
scene.add(lightSphere);

// Create and position the ground
const groundGeometry = new THREE.PlaneGeometry(10, 10);
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

    // Update the visual marker's position to match the point light
    lightSphere.position.copy(pointLight.position);

    renderer.render(scene, camera);
};

animate();
