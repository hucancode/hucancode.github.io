import * as THREE from "three";
import anime from "animejs";
import { loadModel, wait } from "$lib/utils.js";

let warrior, animator;
let hemiLight, backLight;
let isWaitingForResource = false;
let loading = true;
let waitingScene = null;
const clock = new THREE.Clock();
const POSITION_Y = -18;
const SCALE = 15;
const FIRST_LOAD_DELAY = 250;
const BACK_LIGHT_INTENSITY = 1500;
const PRECOMPILE_SHADER = true;

let warriorParams = {
  y: -50,
  scale: 1,
};

function setupLights() {
  hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0);
  // hemiLight.add( new THREE.Mesh( new THREE.SphereGeometry( 1, 16, 8 ), new THREE.MeshBasicMaterial( { color: 0x0400ff } ) ) );
  hemiLight.position.set(0, POSITION_Y + 30, 0);
  backLight = new THREE.PointLight(0xffffff, 0);
  // backLight.add( new THREE.Mesh( new THREE.SphereGeometry( 1, 16, 8 ), new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
  backLight.position.set(0, POSITION_Y + 30, -10);
}

async function makeWarrior(scene, camera, renderer) {
  warrior = await loadModel("warrior.glb");
  animator = new THREE.AnimationMixer(warrior.scene);
  if (PRECOMPILE_SHADER) {
    console.log("Precompiling shader...");
    warrior.scene.position.set(0, 0, 0);
    warrior.scene.scale.set(SCALE, SCALE, SCALE);
    scene.add(warrior.scene);
    scene.add(hemiLight);
    scene.add(backLight);
    renderer.compile(scene, camera);
    scene.remove(warrior.scene);
    scene.remove(hemiLight);
    scene.remove(backLight);
  }
  warrior.scene.scale.set(0, 0, 0);
  warrior.scene.position.set(0, -50, 0);
  // warrior.scene.scale.set(1, 1, 1);
  if (isWaitingForResource) {
    animateWarriorIn(waitingScene);
  }
}

function playIntro() {
  if (!animator) {
    return;
  }
  animator.stopAllAction();
  animator.removeEventListener("finished", returnToIdle);
  const animation = fadeToAction("intro", 0.0);
  animation.clampWhenFinished = true;
  animation.setLoop(THREE.LoopOnce);
  animator.addEventListener("finished", returnToIdle);
}

async function playAction(callback) {
  if (!animator) {
    return;
  }
  animator.stopAllAction();
  if (!callback) {
    callback = returnToIdle;
  }
  animator.removeEventListener("finished", callback);
  const ACTIONS = ["jump", "jump_lick"];
  const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
  const animation = fadeToAction(action, 0.0);
  animation.clampWhenFinished = true;
  animation.setLoop(THREE.LoopOnce);
  animator.addEventListener("finished", callback);
}

function init(scene, camera, renderer) {
  setupLights();
  makeWarrior(scene, camera, renderer);
}

async function animateWarriorIn(scene) {
  if (!warrior || !warrior.scene) {
    isWaitingForResource = true;
    waitingScene = scene;
    return;
  }
  isWaitingForResource = false;
  warriorParams.y = POSITION_Y - 50;
  warriorParams.scale = 0;
  scene.add(warrior.scene);
  if (loading) {
    await wait(FIRST_LOAD_DELAY);
    loading = false;
  }
  anime.remove(warriorParams);
  anime({
    targets: warriorParams,
    y: POSITION_Y,
    scale: SCALE * 0.3,
    duration: 500,
    easing: "easeInQuad",
    update: () => {
      warrior.scene.position.set(0, warriorParams.y, 0);
      warrior.scene.scale.set(warriorParams.scale, SCALE, warriorParams.scale);
    },
    complete: () => {
      anime({
        targets: warriorParams,
        scale: SCALE,
        duration: 1000,
        update: () => {
          warrior.scene.scale.set(
            warriorParams.scale,
            SCALE,
            warriorParams.scale
          );
        },
      });
      playIntro();
    },
  });
}

function animateLightIn(scene) {
  if (!hemiLight || !backLight) {
    return;
  }
  anime.remove(hemiLight);
  anime.remove(backLight);
  anime({
    targets: hemiLight,
    intensity: 1.2,
    delay: 300,
    duration: 1000,
    begin: () => {
      scene.add(hemiLight);
    },
  });
  anime({
    targets: backLight,
    intensity: BACK_LIGHT_INTENSITY,
    delay: 800,
    duration: 2000,
    begin: () => {
      scene.add(backLight);
    },
  });
}

function animateWarriorOut(scene) {
  if (!warrior || !warrior.scene) {
    return;
  }
  playAction();
  anime.remove(warriorParams);
  anime({
    targets: warriorParams,
    y: POSITION_Y + 50,
    scale: 0,
    duration: 1000,
    easing: "easeInElastic",
    update: () => {
      update();
      warrior.scene.position.set(0, warriorParams.y, 0);
      warrior.scene.scale.set(warriorParams.scale, SCALE, warriorParams.scale);
    },
    complete: () => {
      scene.remove(warrior.scene);
    },
  });
}

function animateLightOut(scene) {
  if (!hemiLight || !backLight) {
    return;
  }
  anime.remove(hemiLight);
  anime.remove(backLight);
  anime({
    targets: hemiLight,
    intensity: 0,
    duration: 1000,
    complete: () => {
      scene.remove(hemiLight);
    },
  });
  anime({
    targets: backLight,
    intensity: 0,
    duration: 2000,
    complete: () => {
      scene.remove(backLight);
    },
  });
}

function enter(scene, camera) {
  animateWarriorIn(scene);
  animateLightIn(scene);
}

function leave(scene) {
  animateLightOut(scene);
  animateWarriorOut(scene);
}

function update() {
  const delta = clock.getDelta();
  if (animator && !loading) {
    animator.update(delta);
  }
}

async function returnToIdle() {
  if (!animator) {
    return;
  }
  animator.removeEventListener("finished", returnToIdle);
  fadeToAction("idle", 0.25);
}

function fadeToAction(name, duration) {
  if (!animator) {
    return;
  }
  const animation = animator.clipAction(
    warrior.animations.find((e) => e.name === name)
  );
  if (!animation) {
    return;
  }
  return animation.reset().fadeIn(duration).play();
}

export { init, enter, update, leave };
