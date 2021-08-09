import * as THREE from "three";
import { FBXLoader } from "../three/loaders/FBXLoader";
import { OrbitControls } from "../three/controls/OrbitControls";

let camera, scene, renderer;
const clock = new THREE.Clock();
let mixer;

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

}
export function init() {
    let canvas = document.getElementById('renderer');
    let w = window.innerWidth*0.8;
    let h = window.innerHeight*0.8;
    
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.set( 100, 350, 300 );
    camera.lookAt(0,100,0);

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x282c34 );
    scene.fog = new THREE.Fog( 0xa0a0a0, 100, 2000 );

    const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
    hemiLight.position.set( 0, 200, 0 );
    scene.add( hemiLight );

    const dirLight = new THREE.DirectionalLight( 0xffffff );
    dirLight.position.set( 0, 200, 100 );
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 180;
    dirLight.shadow.camera.bottom = - 100;
    dirLight.shadow.camera.left = - 120;
    dirLight.shadow.camera.right = 120;
    scene.add( dirLight );

    // scene.add( new THREE.CameraHelper( dirLight.shadow.camera ) );

    // ground
    const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 20000, 20000 ), new THREE.MeshPhongMaterial( { color: 0x282c34, depthWrite: false } ) );
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    mesh.material.opacity = 0.2;
    mesh.material.transparent = true;
    scene.add( mesh );

    //const grid = new THREE.GridHelper( 200, 10, 0x000000, 0x000000 );
    //grid.material.opacity = 0.2;
    //grid.material.transparent = true;
    //scene.add( grid );

    // model
    
    const loader = new FBXLoader();
    loader.setPath('assets/fbx/');
    loader.setResourcePath('assets/textures/');
    loader.load( 'SarborV2.fbx', function ( object ) {
        mixer = new THREE.AnimationMixer( object );
        object.animations.forEach((e) => {
            console.log(e.name);
        });
        const action = mixer.clipAction(object.animations.find(e => e.name === 'idle'));
        action.play();
        object.traverse(child => {
            if (!child.isMesh) {
                return;
            }
            child.castShadow = true;
            child.receiveShadow = false;
            child.material.vertexColors = false;
        });
        scene.add( object );
    } );

    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( w, h );
    renderer.shadowMap.enabled = true;
    const controls = new OrbitControls( camera, renderer.domElement );
    controls.target.set( 0, 100, 0 );
    controls.update();
    window.addEventListener( 'resize', onWindowResize );
}

export function animate() {
    requestAnimationFrame( animate );
    const delta = clock.getDelta();
    if ( mixer ) mixer.update( delta );
    renderer.render( scene, camera );
}