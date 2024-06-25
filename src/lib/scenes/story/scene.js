import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let renderer, canvas;
export let scene, camera, controls;

export function init(element) {
  canvas = element;
  const w = canvas.clientWidth;
  const h = canvas.clientHeight; //w * ASPECT_RATIO;
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(w, h);
  if (scene != null) {
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    rebuildOrbitControl();
    return;
  }
  setupCamera(w, h);
  setupLights();
  window.addEventListener("resize", onWindowResize);
}

function setupLights() {
  const ambientLight = new THREE.AmbientLight(0x003973);
  const hemiLight = new THREE.HemisphereLight(0x999999, 0x000000, 1);
  hemiLight.intensity = 1.5;
  const dynamicLight = new THREE.PointLight(0xffffff);
  // dynamicLight.add(
  //   new THREE.Mesh(
  //     new THREE.SphereGeometry(2, 16, 8),
  //     new THREE.MeshBasicMaterial({ color: 0xffffff })
  //   )
  // );
  hemiLight.position.set(0, 30, 0);
  dynamicLight.position.set(0, 25, 0);
  scene.add(ambientLight);
  scene.add(hemiLight);
  scene.add(dynamicLight);
}

function onWindowResize() {
  if (!canvas) {
    return;
  }
  canvas.style = "";
  const w = canvas.clientWidth;
  const h = canvas.clientHeight; //w * ASPECT_RATIO;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}

function setupCamera(w, h) {
  camera = new THREE.PerspectiveCamera(45, w / h, 1, 2000);
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, 50, 100);
  camera.position.set(40, 40, 40);
  camera.lookAt(0, 0, 0);
  rebuildOrbitControl();
}

function rebuildOrbitControl() {
  if (!renderer || !renderer.domElement || !camera) {
    return;
  }
  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  //controls.enablePan = false;
  controls.minDistance = 40; // the minimum distance the camera must have from center
  controls.maxDistance = 100; // the maximum distance the camera must have from center
  //controls.update();
  controls.maxPolarAngle = controls.minPolarAngle = Math.PI * 0.25;
  //controls.enableRotate = true;
  controls.autoRotate = true;
  controls.enableZoom = false;
}

export function destroy() {
  renderer.dispose();
}

export function render() {
  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
  if (controls) {
    controls.update();
  }
}
