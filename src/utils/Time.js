import * as THREE from 'three';
import EventEmitter from './EventEmitter';

export default class Time extends EventEmitter {
  constructor() {
    super();

    this.clock = new THREE.Clock();

    this.previousTime = 0;

    this.tick = this.tick.bind(this);
    this.tick();
  }

  tick(now) {
    this.ticker = window.requestAnimationFrame(this.tick);

    this.elapsedTime = this.clock.getElapsedTime();
    this.deltaTime = this.elapsedTime - this.previousTime;
    this.previousTime = this.elapsedTime;

    this.now = now;

    this.trigger('tick');
  }

  stop() {
    window.cancelAnimationFrame(this.ticker);
  }
}
