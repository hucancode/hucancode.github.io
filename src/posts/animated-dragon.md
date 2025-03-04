---
title: Creating a 3D Dynamic Dragon with Three.js
excerpt: I'll walk you through the process of creating a dynamic dragon scene using Three.js
date: 2024-06-27
cover: /blog/post/animated-dragon/10024398.png
categories:
  - 3d
  - threejs
---

## What we will be creating today

In this blog post, I'll walk you through the process of creating a dynamic dragon scene using Three.js. We'll cover how to set up the scene, load models, create animations, and add lighting effects. Additionally, we'll dive into an ingenious trick to animate any static 3D model along a curve path using data textures.

Here is a preview of what we will be creating in this tutorial

<div style="width: 100%;text-align: center;">
    <video autoplay loop controls muted>
    <source src="/blog/post/animated-dragon/dragon-600-20s.webm" type="video/webm" >
    </video>
</div>

## Prerequisites

- Basic knowledge of JavaScript
- Some basic usage of Three.js library

## Setting Up the Scene

The first step is to set up the basic components of our 3D scene: the scene itself, the camera, and the renderer.
These are pretty basic Three.js codes, I will not go too much into details here.

Initializing scene

```js
import { Scene, AmbientLight, PointLight } from "three";

let scene, camera, renderer;

function buildScene() {
  scene = new Scene();
  setupLightning();
}

function setupLightning() {
  ambientLight = new AmbientLight(0x003973);
  scene.add(ambientLight);
  dynamicLight = new PointLight(0xffffff, 5, 0, 0.2);
  scene.add(dynamicLight);
}
```

Setting up camera

```js
import { PerspectiveCamera } from "three";

function setupCamera(w, h) {
  camera = new PerspectiveCamera(45, w / h, 1, 2000);
  camera.position.set(0, 20, 200);
  camera.lookAt(scene.position);
}
```

Setting up renderer

```js
import { WebGLRenderer } from "three";
function init() {
  let canvas = document.getElementById("dragon");
  let w = canvas.clientWidth;
  let h = canvas.clientHeight;
  renderer = new WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(w, h);
  addEventListener("resize", onWindowResize);
  buildScene();
  setupCamera(w, h);
}
```

### Loading and Animating the Dragon Model

To load the dragon model, we use a utility function `loadModelStatic`. We then create a flow object to animate the dragon along a curved path.

```js
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { Flow } from "three/addons/modifiers/CurveModifier.js";
import { CatmullRomCurve3, Vector3 } from "three";

let model, dragon, curve;

export function loadModel(url) {
  const loader = new GLTFLoader();
  loader.setPath("/assets/gltf/");
  return new Promise((resolve, reject) => {
    loader.load(url, (gltf) => resolve(gltf), null, reject);
  });
}

export async function loadModelStatic(url) {
  const gltf = await loadModel(url);
  return gltf.scene;
}

async function buildScene() {
  scene = new Scene();
  model = await loadModelStatic("dragon.glb");
}

function makeDragon() {
  if (!model) return;

  const points = Array.from({ length: 20 }, () => ({
    x: Math.random() * 80 - 40,
    y: Math.random() * 80 - 40,
    z: Math.random() * 160 - 80,
  }));

  curve = new CatmullRomCurve3(points.map((p) => new Vector3(p.x, p.y, p.z)));
  curve.curveType = "centripetal";
  curve.closed = true;

  dragon = new Flow(model);
  dragon.updateCurve(0, curve);
  scene.add(dragon.object3D);
}
```

The makeDragon function creates a set of random points to form a curved path and uses the Flow class to animate the dragon model along this path.

### Animating Models Along a Curve Using Data Textures

Here's where the magic happens. The `CurveModifier.js` contains a clever trick to animate any static 3D model along a curve path by transferring curve data from the CPU to the GPU via a data texture.

<details>

<summary>CurveModifier.js</summary>

```js
// Original src: https://github.com/zz85/threejs-path-flow
const CHANNELS = 4;
const TEXTURE_WIDTH = 1024;
const TEXTURE_HEIGHT = 4;

import {
  DataTexture,
  DataUtils,
  RGBAFormat,
  HalfFloatType,
  RepeatWrapping,
  Mesh,
  InstancedMesh,
  LinearFilter,
  DynamicDrawUsage,
  Matrix4,
} from "three";

/**
 * Make a new DataTexture to store the descriptions of the curves.
 *
 * @param { number } numberOfCurves the number of curves needed to be described by this texture.
 */
export function initSplineTexture(numberOfCurves = 1) {
  const dataArray = new Uint16Array(
    TEXTURE_WIDTH * TEXTURE_HEIGHT * numberOfCurves * CHANNELS,
  );
  const dataTexture = new DataTexture(
    dataArray,
    TEXTURE_WIDTH,
    TEXTURE_HEIGHT * numberOfCurves,
    RGBAFormat,
    HalfFloatType,
  );

  dataTexture.wrapS = RepeatWrapping;
  dataTexture.wrapY = RepeatWrapping;
  dataTexture.magFilter = LinearFilter;
  dataTexture.minFilter = LinearFilter;
  dataTexture.needsUpdate = true;

  return dataTexture;
}

/**
 * Write the curve description to the data texture
 *
 * @param { DataTexture } texture The DataTexture to write to
 * @param { Curve } splineCurve The curve to describe
 * @param { number } offset Which curve slot to write to
 */
export function updateSplineTexture(texture, splineCurve, offset = 0) {
  const numberOfPoints = Math.floor(TEXTURE_WIDTH * (TEXTURE_HEIGHT / 4));
  splineCurve.arcLengthDivisions = numberOfPoints / 2;
  splineCurve.updateArcLengths();
  const points = splineCurve.getSpacedPoints(numberOfPoints);
  const frenetFrames = splineCurve.computeFrenetFrames(numberOfPoints, true);

  for (let i = 0; i < numberOfPoints; i++) {
    const rowOffset = Math.floor(i / TEXTURE_WIDTH);
    const rowIndex = i % TEXTURE_WIDTH;

    let pt = points[i];
    setTextureValue(
      texture,
      rowIndex,
      pt.x,
      pt.y,
      pt.z,
      0 + rowOffset + TEXTURE_HEIGHT * offset,
    );
    pt = frenetFrames.tangents[i];
    setTextureValue(
      texture,
      rowIndex,
      pt.x,
      pt.y,
      pt.z,
      1 + rowOffset + TEXTURE_HEIGHT * offset,
    );
    pt = frenetFrames.normals[i];
    setTextureValue(
      texture,
      rowIndex,
      pt.x,
      pt.y,
      pt.z,
      2 + rowOffset + TEXTURE_HEIGHT * offset,
    );
    pt = frenetFrames.binormals[i];
    setTextureValue(
      texture,
      rowIndex,
      pt.x,
      pt.y,
      pt.z,
      3 + rowOffset + TEXTURE_HEIGHT * offset,
    );
  }

  texture.needsUpdate = true;
}

function setTextureValue(texture, index, x, y, z, o) {
  const image = texture.image;
  const { data } = image;
  const i = CHANNELS * TEXTURE_WIDTH * o; // Row Offset
  data[index * CHANNELS + i + 0] = DataUtils.toHalfFloat(x);
  data[index * CHANNELS + i + 1] = DataUtils.toHalfFloat(y);
  data[index * CHANNELS + i + 2] = DataUtils.toHalfFloat(z);
  data[index * CHANNELS + i + 3] = DataUtils.toHalfFloat(1);
}

/**
 * Create a new set of uniforms for describing the curve modifier
 *
 * @param { DataTexture } Texture which holds the curve description
 */
export function getUniforms(splineTexture) {
  const uniforms = {
    spineTexture: { value: splineTexture },
    pathOffset: { type: "f", value: 0 }, // time of path curve
    pathSegment: { type: "f", value: 1 }, // fractional length of path
    spineOffset: { type: "f", value: 161 },
    spineLength: { type: "f", value: 400 },
    flow: { type: "i", value: 1 },
  };
  return uniforms;
}

export function modifyShader(material, uniforms, numberOfCurves = 1) {
  if (material.__ok) return;
  material.__ok = true;

  material.onBeforeCompile = (shader) => {
    if (shader.__modified) return;
    shader.__modified = true;

    Object.assign(shader.uniforms, uniforms);

    const vertexShader = `
		uniform sampler2D spineTexture;
		uniform float pathOffset;
		uniform float pathSegment;
		uniform float spineOffset;
		uniform float spineLength;
		uniform int flow;

		float textureLayers = ${TEXTURE_HEIGHT * numberOfCurves}.;
		float textureStacks = ${TEXTURE_HEIGHT / 4}.;

		${shader.vertexShader}
		`
      // chunk import moved in front of modified shader below
      .replace("#include <beginnormal_vertex>", "")

      // vec3 transformedNormal declaration overriden below
      .replace("#include <defaultnormal_vertex>", "")

      // vec3 transformed declaration overriden below
      .replace("#include <begin_vertex>", "")

      // shader override
      .replace(
        /void\s*main\s*\(\)\s*\{/,
        `
void main() {
#include <beginnormal_vertex>

vec4 worldPos = modelMatrix * vec4(position, 1.);

bool bend = flow > 0;
float xWeight = bend ? 0. : 1.;

#ifdef USE_INSTANCING
float pathOffsetFromInstanceMatrix = instanceMatrix[3][2];
float spineLengthFromInstanceMatrix = instanceMatrix[3][0];
float spinePortion = bend ? (worldPos.x + spineOffset) / spineLengthFromInstanceMatrix : 0.;
float mt = (spinePortion * pathSegment + pathOffset + pathOffsetFromInstanceMatrix)*textureStacks;
#else
float spinePortion = bend ? (worldPos.x + spineOffset) / spineLength : 0.;
float mt = (spinePortion * pathSegment + pathOffset)*textureStacks;
#endif

mt = mod(mt, textureStacks);
float rowOffset = floor(mt);

#ifdef USE_INSTANCING
rowOffset += instanceMatrix[3][1] * ${TEXTURE_HEIGHT}.;
#endif

vec3 spinePos = texture2D(spineTexture, vec2(mt, (0. + rowOffset + 0.5) / textureLayers)).xyz;
vec3 a =        texture2D(spineTexture, vec2(mt, (1. + rowOffset + 0.5) / textureLayers)).xyz;
vec3 b =        texture2D(spineTexture, vec2(mt, (2. + rowOffset + 0.5) / textureLayers)).xyz;
vec3 c =        texture2D(spineTexture, vec2(mt, (3. + rowOffset + 0.5) / textureLayers)).xyz;
mat3 basis = mat3(a, b, c);

vec3 transformed = basis
	* vec3(worldPos.x * xWeight, worldPos.y * 1., worldPos.z * 1.)
	+ spinePos;

vec3 transformedNormal = normalMatrix * (basis * objectNormal);
			`,
      )
      .replace(
        "#include <project_vertex>",
        `vec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0 );
				gl_Position = projectionMatrix * mvPosition;`,
      );

    shader.vertexShader = vertexShader;
  };
}

/**
 * A helper class for making meshes bend aroudn curves
 */
export class Flow {
  /**
   * @param {Mesh} mesh The mesh to clone and modify to bend around the curve
   * @param {number} numberOfCurves The amount of space that should preallocated for additional curves
   */
  constructor(mesh, numberOfCurves = 1) {
    const obj3D = mesh.clone();
    const splineTexure = initSplineTexture(numberOfCurves);
    const uniforms = getUniforms(splineTexure);
    obj3D.traverse(function (child) {
      if (child instanceof Mesh || child instanceof InstancedMesh) {
        if (Array.isArray(child.material)) {
          const materials = [];

          for (const material of child.material) {
            const newMaterial = material.clone();
            modifyShader(newMaterial, uniforms, numberOfCurves);
            materials.push(newMaterial);
          }

          child.material = materials;
        } else {
          child.material = child.material.clone();
          modifyShader(child.material, uniforms, numberOfCurves);
        }
      }
    });

    this.curveArray = new Array(numberOfCurves);
    this.curveLengthArray = new Array(numberOfCurves);

    this.object3D = obj3D;
    this.splineTexure = splineTexure;
    this.uniforms = uniforms;
  }

  updateCurve(index, curve) {
    if (index >= this.curveArray.length)
      throw Error("Index out of range for Flow");
    const curveLength = curve.getLength();
    this.uniforms.spineLength.value = curveLength;
    this.curveLengthArray[index] = curveLength;
    this.curveArray[index] = curve;
    updateSplineTexture(this.splineTexure, curve, index);
  }

  moveAlongCurve(amount) {
    this.uniforms.pathOffset.value += amount;
  }
}
const matrix = new Matrix4();

/**
 * A helper class for creating instanced versions of flow, where the instances are placed on the curve.
 */
export class InstancedFlow extends Flow {
  /**
   *
   * @param {number} count The number of instanced elements
   * @param {number} curveCount The number of curves to preallocate for
   * @param {Geometry} geometry The geometry to use for the instanced mesh
   * @param {Material} material The material to use for the instanced mesh
   */
  constructor(count, curveCount, geometry, material) {
    const mesh = new InstancedMesh(geometry, material, count);
    mesh.instanceMatrix.setUsage(DynamicDrawUsage);
    mesh.frustumCulled = false;
    super(mesh, curveCount);

    this.offsets = new Array(count).fill(0);
    this.whichCurve = new Array(count).fill(0);
  }

  /**
   * The extra information about which curve and curve position is stored in the translation components of the matrix for the instanced objects
   * This writes that information to the matrix and marks it as needing update.
   *
   * @param {number} index of the instanced element to update
   */
  writeChanges(index) {
    matrix.makeTranslation(
      this.curveLengthArray[this.whichCurve[index]],
      this.whichCurve[index],
      this.offsets[index],
    );
    this.object3D.setMatrixAt(index, matrix);
    this.object3D.instanceMatrix.needsUpdate = true;
  }

  /**
   * Move an individual element along the curve by a specific amount
   *
   * @param {number} index Which element to update
   * @param {number} offset Move by how much
   */
  moveIndividualAlongCurve(index, offset) {
    this.offsets[index] += offset;
    this.writeChanges(index);
  }

  /**
   * Select which curve to use for an element
   *
   * @param {number} index the index of the instanced element to update
   * @param {number} curveNo the index of the curve it should use
   */
  setCurve(index, curveNo) {
    if (isNaN(curveNo))
      throw Error("curve index being set is Not a Number (NaN)");
    this.whichCurve[index] = curveNo;
    this.writeChanges(index);
  }
}
```

</details>

This script uses data textures to transfer curve information to the GPU, allowing for smooth and efficient animation of models along curves.

## Final code

You can check out the final result at [here](/dragon)

The full implementation is as follow

<details>
<summary>dragon.js</summary>

```js
import { Flow } from "three/addons/modifiers/CurveModifier.js";
import { loadModelStatic } from "$lib/utils.js";
import {
  AmbientLight,
  CatmullRomCurve3,
  Clock,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  SphereGeometry,
  Vector3,
  WebGLRenderer,
} from "three";

let scene, camera, renderer, model;
let dragons = [];
let curves = [];
const clock = new Clock();
var time = 0;
let dynamicLight, ambientLight;
const CANVAS_ID = "dragon";
const ASPECT_RATIO = 0.75;

function getCurrentDragonCount() {
  return dragons.length;
}

async function buildScene() {
  scene = new Scene();
  model = await loadModelStatic("dragon.glb");
}
function setupCamera(w, h) {
  camera = new PerspectiveCamera(45, w / h, 1, 2000);
  camera.position.set(0, 20, 200);
  camera.lookAt(scene.position);
}

function setupLightning() {
  ambientLight = new AmbientLight(0x003973);
  scene.add(ambientLight);
  dynamicLight = new PointLight(0xffffff, 5, 0, 0.2);
  dynamicLight.add(
    new Mesh(
      new SphereGeometry(2, 16, 8),
      new MeshBasicMaterial({ color: 0xffffff }),
    ),
  );
  scene.add(dynamicLight);
}

function clearDragon() {
  dragons.forEach((dragon) => scene.remove(dragon.object3D));
  dragons = [];
  curves = [];
}

function makeDragon() {
  if (!model) {
    return;
  }
  const MIN_X = -40;
  const VAR_X = 80;
  const MIN_Y = -40;
  const VAR_Y = 80;
  const MIN_Z = -80;
  const VAR_Z = 160;
  const points = Array.from({ length: 20 }, (_) => {
    return {
      x: Math.random() * VAR_X + MIN_X,
      y: Math.random() * VAR_Y + MIN_Y,
      z: Math.random() * VAR_Z + MIN_Z,
    };
  });
  let curve = new CatmullRomCurve3(
    points.map((e) => new Vector3(e.x, e.y, e.z)),
  );
  curve.curveType = "centripetal";
  curve.closed = true;
  let dragon = new Flow(model);
  dragon.updateCurve(0, curve);
  scene.add(dragon.object3D);
  dragons.push(dragon);
  curves.push(curve);
}

async function init() {
  let canvas = document.getElementById(CANVAS_ID);
  let w = canvas.clientWidth;
  let h = canvas.clientHeight; //w * ASPECT_RATIO;
  renderer = new WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(w, h);
  addEventListener("resize", onWindowResize);
  if (scene != null) {
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    return;
  }
  await buildScene();
  setupCamera(w, h);
  setupLightning();
  makeDragon();
}

function destroy() {
  renderer.dispose();
}

function onWindowResize() {
  let canvas = document.getElementById(CANVAS_ID);
  if (!canvas) {
    return;
  }
  canvas.style = "";
  let w = canvas.clientWidth;
  let h = canvas.clientHeight; //w * ASPECT_RATIO;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}

function render() {
  time += clock.getDelta();
  for (let i = 0; i < dragons.length; i++) {
    dragons[i].updateCurve(0, curves[i]);
    dragons[i].moveAlongCurve(0.002);
  }
  if (dynamicLight) {
    dynamicLight.position.x = Math.sin(time * 0.7) * 30 + 20;
    dynamicLight.position.y = Math.cos(time * 0.5) * 40;
    dynamicLight.position.z = Math.cos(time * 0.3) * 30 + 20;
    dynamicLight.color.r = (Math.sin(time * 0.3) + 1.0) * 0.5;
    dynamicLight.color.g = (Math.sin(time * 0.7) + 1.0) * 0.5;
    dynamicLight.color.b = (Math.sin(time * 0.2) + 1.0) * 0.5;
  }
  if (ambientLight) {
    ambientLight.color.r = (Math.sin(time * 0.1) + 1.0) * 0.5;
    ambientLight.color.g = (Math.sin(time * 0.07) + 1.0) * 0.5;
    ambientLight.color.b = (Math.sin(time * 0.03) + 1.0) * 0.5;
  }
  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
}

export {
  CANVAS_ID,
  init,
  destroy,
  render,
  getCurrentDragonCount,
  clearDragon,
  makeDragon,
};
```

</details>

## Learn more

[Here](https://github.com/hucancode/flying-dragon) is a **Rust** version for this animated dragon, powered by **WebGPU**. We follow the same principle of passing a curve from CPU to GPU and then let the GPU take over the animation.
See it live at here ([/dragon-rs](/dragon-rs))

<div style="width: 100%;text-align: center;">
    <video autoplay loop controls muted>
    <source src="/blog/post/animated-dragon/dragon-rust.webm" type="video/webm" >
    </video>
</div>
