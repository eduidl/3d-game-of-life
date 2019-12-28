import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { Point } from './types';


export default class ThreeJS {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  renderer: THREE.WebGLRenderer;

  constructor() {
    let width = window.innerWidth;
    let height = window.innerHeight;

    this.scene = new THREE.Scene();

    // light
    const light: THREE.SpotLight = new THREE.SpotLight(0xffffff);
    light.distance = 300;
    this.scene.add(light);

    const ambient: THREE.AmbientLight = new THREE.AmbientLight(0xffffff);
    this.scene.add(ambient);

    // camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    this.camera.position.set(0, 220, 220);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    // renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: false });
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0x010101);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    const stage = document.getElementById('stage');
    if (stage == null) { throw TypeError; }
    stage.appendChild(this.renderer.domElement);

    // // controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.autoRotate = true;
  }

  render() {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  resize(width: number, height: number) {
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  placeParticles(coordinateSet: Point[]) {
    this.scene = new THREE.Scene();
    let geometry = new THREE.Geometry();
    for (const coordinate of coordinateSet) {
      geometry.vertices.push(
        new THREE.Vector3(
          coordinate.x,
          coordinate.y,
          coordinate.z
        )
      );
    }
    let material = new THREE.PointsMaterial({
      color: '#1faa0e',
      size: 4,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthTest: true
    });
    let particles = new THREE.Points(geometry, material);
    this.scene.add(particles);
  }
}
