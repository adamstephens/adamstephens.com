import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default class Loader {
  constructor(_options) {
    this.modelPath = _options.modelPath;
    this.model = null;
    this.loadModel();
    return this.model;
  }

  loadModel() {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      '/models/grass.glb',
      (gltf) => {
        this.model = gltf;
      },
    );
  }
}
