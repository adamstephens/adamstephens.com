import * as THREE from 'three';
import EventEmitter from '../utils/EventEmitter';
import Loader from './Loader';

export default class Resources extends EventEmitter {
  constructor(_assets) {
    super();

    // Items (will contain every resources)
    this.items = {};

    // Loader
    this.loader = new Loader({ renderer: this.renderer });

    this.groups = {};
    this.groups.assets = _assets;
    this.groups.loaded = [];
    this.groups.current = null;
    this.loadNextGroup();

    // Loader file end event
    this.loader.on('fileEnd', (_resource, _data) => {
      let data = _data;

      // Convert to texture
      if (_resource.type === 'texture') {
        data = new THREE.Texture(_data);
        data.encoding = THREE.sRGBEncoding;
        data.needsUpdate = true;
      }

      this.items[_resource.name] = data;

      // Progress and event
      this.groups.current.loaded += 1;
      this.trigger('progress', [this.groups.current, _resource, data]);
    });

    // Loader all end event
    this.loader.on('end', () => {
      this.groups.loaded.push(this.groups.current);

      // Trigger
      this.trigger('groupEnd', [this.groups.current]);

      if (this.groups.assets.length > 0) {
        this.loadNextGroup();
      } else {
        this.trigger('end');
      }
    });
  }

  loadNextGroup() {
    this.groups.current = this.groups.assets.shift();
    this.groups.current.toLoad = this.groups.current.items.length;
    this.groups.current.loaded = 0;

    this.loader.load(this.groups.current.items);
  }

  static createInstancedMeshes(_children, _groups) {
    // Groups
    const groups = [];

    _groups.forEach((element) => {
      groups.push({
        name: element.name,
        regex: element.regex,
        meshesGroups: [],
        instancedMeshes: [],
      });
    });

    // Result
    const result = {};

    groups.forEach((_group) => {
      result[_group.name] = _group.instancedMeshes;
    });

    return result;
  }

  destroy() {
    this.items.forEach((_itemKey) => {
      const item = this.items[_itemKey];
      if (item instanceof THREE.Texture) {
        item.dispose();
      }
    });
  }
}
