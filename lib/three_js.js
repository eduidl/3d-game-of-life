const THREE = require('three');
const OrbitControls = require('three-orbitcontrols');

export default class ThreeJS {
  constructor() {
    let width = window.innerWidth;
    let height = window.innerHeight;

    this.scene = new THREE.Scene();

    // light
    const light = new THREE.SpotLight(0xffffff);
    light.distance = 300;
    this.scene.add(light);

    const ambient = new THREE.AmbientLight(0xffffff);
    this.scene.add(ambient);

    // camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    this.camera.position.set(0, 220, 220);
    this.camera.lookAt({ x:0, y:0, z:0 })

    // controls
    this.controls = new THREE.OrbitControls(this.camera);
    this.controls.autoRotate = true;

    // renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: false });
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0x010101);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('stage').appendChild(this.renderer.domElement);
  }

  render() {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  resize(width, height) {
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  placeParticles(coordinate_set) {
    this.scene = new THREE.Scene();
    let geometry = new THREE.Geometry();
    for (const coordinate of coordinate_set) {
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
