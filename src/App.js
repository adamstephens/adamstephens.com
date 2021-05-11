import Time from './utils/Time';
import Experience from './experience/Experience';

export default class App {
  constructor() {
    window.app = this;

    this.time = new Time();
    // this.sizes = new Sizes();
    this.init();
  }

  init() {
    // Canvas
    const canvas = document.querySelector('canvas.webgl');
    // const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    // gl.getExtension('OES_standard_derivatives');

    this.experience = new Experience({
      canvas,
    });
  }
}
