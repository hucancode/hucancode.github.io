import * as THREE from "three";
import anime from "animejs";
import { Flow } from "$lib/three/modifiers/CurveModifier.js";
import { loadModelStatic } from "$lib/utils.js";

import {
  TAIJI_VERTEX_SHADER,
  TAIJI_FRAGMENT_SHADER,
  BACKGROUND_VERTEX_SHADER,
  BACKGROUND_FRAGMENT_SHADER,
  BAGUA_VERTEX_SHADER,
  BAGUA_FRAGMENT_SHADER,
} from "./taiji-shaders";

let scene, camera, renderer, controls;
let taiji;
let bagua;
let background;
const clock = new THREE.Clock();
var time = 0;

const TAIJI_ROTATION_CIRCLE = 23000;
const BAGUA_ROTATION_CIRCLE = 43000;

function makeBackground() {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0.0 },
    },
    vertexShader: BACKGROUND_VERTEX_SHADER,
    fragmentShader: BACKGROUND_FRAGMENT_SHADER,
  });
  material.clipping = true;
  material.transparent = true;
  const geometry = new THREE.PlaneGeometry(18, 18);
  const ret = new THREE.Mesh(geometry, material);
  ret.rotation.x = -Math.PI / 2;
  ret.position.y = -2;
  return ret;
}

function makeTaiji() {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      alpha: { value: 1.0 },
      color1: { value: new THREE.Color(1, 1, 1) },
      color2: { value: new THREE.Color(0, 0, 0) },
    },
    vertexShader: TAIJI_VERTEX_SHADER,
    fragmentShader: TAIJI_FRAGMENT_SHADER,
  });
  material.clipping = true;
  material.transparent = true;
  const geometry = new THREE.PlaneGeometry(1, 1);
  const ret = new THREE.Mesh(geometry, material);
  ret.scale.x = ret.scale.y = 9;
  ret.rotation.x = -Math.PI / 2;
  return ret;
}

function makeBagua() {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      alpha: { value: 1.0 },
    },
    vertexShader: BAGUA_VERTEX_SHADER,
    fragmentShader: BAGUA_FRAGMENT_SHADER,
  });
  material.clipping = true;
  material.transparent = true;
  const geometry = new THREE.PlaneGeometry(35, 35);
  const ret = new THREE.Mesh(geometry, material);
  ret.scale.x = ret.scale.y = 1;
  ret.rotation.x = -Math.PI / 2;
  ret.position.y = -0.01;
  return ret;
}

function setupObject() {
  // const axesHelper = new THREE.AxesHelper(5);
  // scene.add(axesHelper);
  taiji = makeTaiji();
  taiji.material.uniforms.alpha.value = 0.9;
  scene.add(taiji);
  bagua = makeBagua();
  scene.add(bagua);
  background = makeBackground();
  scene.add(background);
  anime({
    targets: taiji.rotation,
    z: Math.PI * 2,
    duration: TAIJI_ROTATION_CIRCLE,
    easing: "linear",
    loop: true,
  });
}


function render() {
  time += clock.getDelta();
  if (background) {
    background.material.uniforms.time.value = time * 4;
  }
  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
  if (controls) {
    controls.update();
  }
}
function playAnimation() {
  const particle = makeTaiji();
  particle.scale.x = particle.scale.y = 6;
  particle.position.y = 10;
  // use HSL to guaranteed 2 colors has acceptable contrast
  particle.material.uniforms.color1.value.setHSL(
    Math.random(),
    Math.random(),
    Math.random() * 0.2 + 0.8
  );
  particle.material.uniforms.color2.value.setHSL(
    Math.random(),
    Math.random(),
    Math.random() * 0.2
  );
  const animation = anime.timeline({
    duration: 1500,
    easing: "easeOutExpo",
    complete: () => {
      particle.removeFromParent();
    },
  });
  animation
    .add(
      {
        targets: particle.rotation,
        z: Math.PI * 6,
      },
      0
    )
    .add(
      {
        targets: particle.position,
        y: Math.random(), // avoid z-fighting
      },
      0
    )
    .add(
      {
        targets: particle.scale,
        easing: "easeInOutQuad",
        x: 22,
        y: 22,
      },
      400
    )
    .add(
      {
        targets: particle.material.uniforms.alpha,
        easing: "easeInOutQuad",
        value: 0,
      },
      100
    );
  scene.add(particle);
  animation.play();
}

export { CANVAS_ID, init, destroy, render, playAnimation };
