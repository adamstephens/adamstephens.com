import * as THREE from 'three';
import EventEmitter from './EventEmitter';

export default class Time extends EventEmitter {
  constructor() {
    super();

    this.clock = new THREE.Clock();

    this.tick = this.tick.bind(this);
    this.tick();
  }

  tick() {
    this.ticker = window.requestAnimationFrame(this.tick);

    this.elapsedTime = this.clock.getElapsedTime();

    this.trigger('tick');
  }

  stop() {
    window.cancelAnimationFrame(this.ticker);
  }
}
