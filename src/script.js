import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const doorTexture = {
  alpha: textureLoader.load('/textures/door/alpha.jpg'),
  ambientOcclusion: textureLoader.load('/textures/door/ambientOcclusion.jpg'),
  color: textureLoader.load('/textures/door/color.jpg'),
  height: textureLoader.load('/textures/door/height.jpg'),
  metalness: textureLoader.load('/textures/door/metalness.jpg'),
  normal: textureLoader.load('/textures/door/normal.jpg'),
  roughness: textureLoader.load('/textures/door/roughness.jpg'),
};
const wallTexture = {
  ambientOcclusion: textureLoader.load('/textures/bricks/ambientOcclusion.jpg'),
  color: textureLoader.load('/textures/bricks/color.jpg'),
  normal: textureLoader.load('/textures/bricks/normal.jpg'),
  roughness: textureLoader.load('/textures/bricks/roughness.jpg'),
};
const grassTexture = {
  ambientOcclusion: textureLoader.load('/textures/grass/ambientOcclusion.jpg'),
  color: textureLoader.load('/textures/grass/color.jpg'),
  normal: textureLoader.load('/textures/grass/normal.jpg'),
  roughness: textureLoader.load('/textures/grass/roughness.jpg'),
};

grassTexture.ambientOcclusion.repeat.set(8, 8);
grassTexture.color.repeat.set(8, 8);
grassTexture.normal.repeat.set(8, 8);
grassTexture.roughness.repeat.set(8, 8);

grassTexture.ambientOcclusion.wrapS = THREE.RepeatWrapping;
grassTexture.color.wrapS = THREE.RepeatWrapping;
grassTexture.normal.wrapS = THREE.RepeatWrapping;
grassTexture.roughness.wrapS = THREE.RepeatWrapping;
grassTexture.ambientOcclusion.wrapT = THREE.RepeatWrapping;
grassTexture.color.wrapT = THREE.RepeatWrapping;
grassTexture.normal.wrapT = THREE.RepeatWrapping;
grassTexture.roughness.wrapT = THREE.RepeatWrapping;

/**
 * House
 */
// Group
const house = new THREE.Group();

// Walls
const wallSizes = {
  width: 5,
  height: 2.5,
  depth: 5,
};
const walls = new THREE.Mesh(
  new THREE.BoxBufferGeometry(
    wallSizes.width,
    wallSizes.height,
    wallSizes.depth
  ),
  new THREE.MeshStandardMaterial({
    map: wallTexture.color,
    aoMap: wallTexture.ambientOcclusion,
    normalMap: wallTexture.normal,
    roughnessMap: wallTexture.roughness,
  })
);
walls.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
);
walls.position.y = wallSizes.height / 2;

// Roof
const roof = new THREE.Mesh(
  new THREE.ConeBufferGeometry(wallSizes.width, 1.5, 4),
  new THREE.MeshStandardMaterial({ color: 0xb35f45 })
);
roof.position.y = wallSizes.height + 0.75;
roof.rotation.y = Math.PI * 0.25;

//Door
const door = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(2, 2, 50, 50),
  new THREE.MeshStandardMaterial({
    map: doorTexture.color,
    transparent: true,
    alphaMap: doorTexture.alpha,
    aoMap: doorTexture.ambientOcclusion,
    displacementMap: doorTexture.height,
    displacementScale: 0.1,
    normalMap: doorTexture.normal,
    metalnessMap: doorTexture.metalness,
    roughnessMap: doorTexture.roughness,
  })
);
door.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);
door.position.y = 1;
door.position.z = wallSizes.depth / 2 + 0.01;

//Bushes
const bushGeometry = new THREE.SphereBufferGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: 0x89c854 });
const bushProperties = [
  {
    scale: 0.5,
    positionX: 1.2,
    positionY: 0.2,
    positionZ: 3,
  },
  {
    scale: 0.25,
    positionX: 1.6,
    positionY: 0.1,
    positionZ: 3.1,
  },
  {
    scale: 0.4,
    positionX: -1.2,
    positionY: 0.1,
    positionZ: 3.2,
  },
  {
    scale: 0.15,
    positionX: -1.4,
    positionY: 0.05,
    positionZ: 3.6,
  },
];

for (let i = 0; i < bushProperties.length; i++) {
  const bush = new THREE.Mesh(bushGeometry, bushMaterial);
  bush.scale.set(
    bushProperties[i].scale,
    bushProperties[i].scale,
    bushProperties[i].scale
  );
  bush.position.set(
    bushProperties[i].positionX,
    bushProperties[i].positionY,
    bushProperties[i].positionZ
  );
  house.add(bush);
}

// Graves
const graves = new THREE.Group();
const graveGeometry = new THREE.BoxBufferGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: 0xb2b6b1 });
for (let i = 0; i < 35; i++) {
  const angle = Math.random() * (Math.PI * 2);
  const radius = 4 + Math.random() * 5;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  grave.position.set(x, 0, z);
  grave.rotation.y = Math.random() - 0.5;
  grave.rotation.z = (Math.random() - 0.5) * 0.1;
  graves.add(grave);
}

// Add to scene
house.add(walls, roof, door);
scene.add(house, graves);

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    map: grassTexture.color,
    aoMap: grassTexture.ambientOcclusion,
    normalMap: grassTexture.normal,
    roughnessMap: grassTexture.roughness,
  })
);
floor.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
);
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
scene.add(floor);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xb9d5ff, 0.12);
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight(0xb9d5ff, 0.12);
moonLight.position.set(4, 5, -2);
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001);
gui.add(moonLight.position, 'x').min(-5).max(5).step(0.001);
gui.add(moonLight.position, 'y').min(-5).max(5).step(0.001);
gui.add(moonLight.position, 'z').min(-5).max(5).step(0.001);
scene.add(moonLight);

// Door light
const doorLight = new THREE.PointLight(0xff7d46, 1.5, 10);
doorLight.position.set(0, wallSizes.height, 3);
scene.add(doorLight);

// Fog
const fog = new THREE.Fog(0x262837, 5, 15);
scene.fog = fog;

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x262837);

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
