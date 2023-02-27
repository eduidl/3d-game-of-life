import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { Point } from "./types";

export default class Visualizer {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  renderer: THREE.WebGLRenderer;

  constructor() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.scene = new THREE.Scene();

    // camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    this.camera.position.set(0, 220, 220);

    // renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: false });
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0x010101);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    const stage = document.getElementById("stage");
    if (stage === null) {
      throw TypeError;
    }
    stage.appendChild(this.renderer.domElement);

    // controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.autoRotate = true;
  }

  render(): void {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  resize(width: number, height: number): void {
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  placeParticles(coordinates: Point[]): void {
    this.scene = new THREE.Scene();
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array(coordinates.length * 3);
    for (let i = 0; i < coordinates.length; ++i) {
      vertices[3 * i + 0] = coordinates[i].x;
      vertices[3 * i + 1] = coordinates[i].y;
      vertices[3 * i + 2] = coordinates[i].z;
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    const material = new THREE.PointsMaterial({
      color: "#1faa0e",
      size: 4,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthTest: true
    });
    this.scene.add(new THREE.Points(geometry, material));
  }
}
