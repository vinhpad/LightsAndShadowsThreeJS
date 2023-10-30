import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let camera, scene, renderer, bulbLight, spotLight, bulbMat, hemiLight, stats;
let ballMat, cubeMat, floorMat;
let spotLightHelper, pointLightHelper;
let previousShadowMap = false;

let params;

init();
animate();

function init() {

	const container = document.getElementById('container');

	stats = new Stats();
	container.appendChild(stats.dom);


	camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
	camera.position.x = - 4;
	camera.position.z = 4;
	camera.position.y = 2;

	scene = new THREE.Scene();

	spotLight = new THREE.SpotLight(0xffee88);
	spotLight.position.set(0.25, 3, 0.25);
	spotLight.angle = Math.PI / 3;
	spotLight.penumbra = 0.4;
	spotLight.decay = 2;
	spotLight.distance = 0;

	spotLight.castShadow = true;
	spotLight.power = 300;
	scene.add(spotLight);

	spotLightHelper = new THREE.SpotLightHelper(spotLight);
	scene.add(spotLightHelper);

	const bulbGeometry = new THREE.SphereGeometry(0.02, 16, 8);
	bulbLight = new THREE.PointLight(0xffee88, 1, 100, 2);

	bulbMat = new THREE.MeshStandardMaterial({
		emissive: 0xffffee,
		emissiveIntensity: 1,
		color: 0x000000
	});
	bulbLight.add(new THREE.Mesh(bulbGeometry, bulbMat));
	bulbLight.position.set(0, 2, 0);
	bulbLight.castShadow = true;
	bulbLight.power = 300;
	scene.add(bulbLight);

	const sphereSize = 0.4;
	pointLightHelper = new THREE.PointLightHelper(bulbLight, sphereSize);
	scene.add(pointLightHelper);

	hemiLight = new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 0.02);
	scene.add(hemiLight);

	floorMat = new THREE.MeshStandardMaterial({
		roughness: 0.8,
		color: 0xffffff,
		metalness: 0.2,
		bumpScale: 1
	});


	cubeMat = new THREE.MeshStandardMaterial({
		roughness: 0.7,
		color: 0xffffff,
		bumpScale: 1,
		metalness: 0.2
	});


	ballMat = new THREE.MeshStandardMaterial({
		color: 0xffffff,
		roughness: 0.5,
		metalness: 1.0
	});

	const floorGeometry = new THREE.PlaneGeometry(20, 20);
	const floorMesh = new THREE.Mesh(floorGeometry, floorMat);
	floorMesh.receiveShadow = true;
	floorMesh.rotation.x = - Math.PI / 2.0;
	scene.add(floorMesh);

	const ballGeometry = new THREE.SphereGeometry(0.25, 32, 32);
	const ballMesh = new THREE.Mesh(ballGeometry, ballMat);
	ballMesh.position.set(1, 0.25, 1);
	ballMesh.rotation.y = Math.PI;
	ballMesh.castShadow = true;
	scene.add(ballMesh);

	const boxGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
	const boxMesh = new THREE.Mesh(boxGeometry, cubeMat);
	boxMesh.position.set(- 0.5, 0.5, - 1);
	boxMesh.castShadow = true;
	scene.add(boxMesh);

	const boxMesh2 = new THREE.Mesh(boxGeometry, cubeMat);
	boxMesh2.position.set(0, 0.25, - 5);
	boxMesh2.castShadow = true;
	scene.add(boxMesh2);

	const boxMesh3 = new THREE.Mesh(boxGeometry, cubeMat);
	boxMesh3.position.set(7, 0.25, 0);
	boxMesh3.castShadow = true;
	scene.add(boxMesh3);


	renderer = new THREE.WebGLRenderer();
	renderer.shadowMap.enabled = true;
	renderer.toneMapping = THREE.ReinhardToneMapping;
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	container.appendChild(renderer.domElement);


	const controls = new OrbitControls(camera, renderer.domElement);
	controls.minDistance = 1;
	controls.maxDistance = 20;

	window.addEventListener('resize', onWindowResize);

	params = {
		shadows: true,
		exposure: 0.68,
		bulbPower: bulbLight.power,
		spotPower: spotLight.power,
		angle: spotLight.angle,
		penumbra: spotLight.penumbra,
		hemiIrradiance: hemiLight.intensity,
	};


	const gui = new GUI();

	gui.add(params, 'hemiIrradiance', 0, 5);
	gui.add(params, 'bulbPower', 0, 2000);
	gui.add(params, "spotPower", 0, 2000);
	gui.add(params, 'angle', 0, Math.PI / 3);
	gui.add(params, "penumbra", 0, 1);
	gui.add(params, 'exposure', 0, 1);
	gui.add(params, 'shadows');
	gui.open();

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

}

//

function animate() {
	requestAnimationFrame(animate);
	render();
}

function render() {

	renderer.toneMappingExposure = Math.pow(params.exposure, 5.0); // to allow for very bright scenes.
	renderer.shadowMap.enabled = params.shadows;
	bulbLight.castShadow = params.shadows;
	spotLight.castShadow = params.shadows;

	if (params.shadows !== previousShadowMap) {

		ballMat.needsUpdate = true;
		cubeMat.needsUpdate = true;
		floorMat.needsUpdate = true;
		previousShadowMap = params.shadows;

	}

	bulbLight.power = params.bulbPower;
	spotLight.power = params.spotPower;
	spotLight.angle = params.angle;
	spotLight.penumbra = params.penumbra;
	bulbMat.emissiveIntensity = bulbLight.intensity / Math.pow(0.02, 2.0); // convert from intensity to irradiance at bulb surface

	hemiLight.intensity = params.hemiIrradiance;
	const time = Date.now() * 0.0005;

	bulbLight.position.y = Math.cos(time) * 0.75 + 1.25;

	spotLight.position.x = Math.cos(time) * 0.75;
	spotLight.position.z = Math.sin(time) * 0.75;

	spotLightHelper.update()

	renderer.render(scene, camera);

	stats.update();

}