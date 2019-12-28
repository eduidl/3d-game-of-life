import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { Point } from "./types";

export default class ThreeJS {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  renderer: THREE.WebGLRenderer;

  constructor() {
    const width = window.innerWidth;
    const height = window.innerHeight;

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
    const stage = document.getElementById("stage");
    if (stage == null) {
      throw TypeError;
    }
    stage.appendChild(this.renderer.domElement);

    // // controls
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

  placeParticles(coordinateSet: Point[]): void {
    this.scene = new THREE.Scene();
    const geometry = new THREE.Geometry();
    for (const coordinate of coordinateSet) {
      geometry.vertices.push(
        new THREE.Vector3(coordinate.x, coordinate.y, coordinate.z)
      );
    }
    const material = new THREE.PointsMaterial({
      color: "#1faa0e",
      size: 4,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthTest: true
    });
    const particles = new THREE.Points(geometry, material);
    this.scene.add(particles);
  }
}
