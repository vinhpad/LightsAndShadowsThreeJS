import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

// Create a renderer with shadow mapping enabled
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;
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

// Create and position the ground
const groundGeometry = new THREE.PlaneGeometry(30, 30);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -1;
ground.receiveShadow = true;
scene.add(ground);

// Create a spot light with shadows
const spotLight = new THREE.SpotLight(0xeeeeee, 50);
spotLight.position.set(1, 2, 1);
spotLight.distance = 20;
spotLight.castShadow = true;
spotLight.angle = Math.PI * 0.15;
spotLight.penumbra = 0.4;
spotLight.shadow.mapSize.width = 512;
spotLight.shadow.mapSize.height = 512;
scene.add(spotLight);
spotLight.target.position.set(0, 0, 0);
scene.add(spotLight.target);
const helper = new THREE.SpotLightHelper(spotLight);
scene.add(helper);

// Set up the render loop
const animate = () => {
  requestAnimationFrame(animate);

  // Update the controls
  controls.update();

  // Rotate the cube
  cube.rotation.x += 0.005;
  cube.rotation.y += 0.005;
  cube.rotation.z += 0.005;

  renderer.render(scene, camera);
};

animate();
