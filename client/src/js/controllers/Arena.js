var THREE = require('../libs/three.min.js');

var Arena = function(config) {
  this.renderer = null;
  this.renderTarget = config.renderTarget;
};

Arena.prototype.initRenderer = function() {
  this.threeRenderer = new THREE.WebGLRenderer({antialias: true});
  this.threeRenderer.setSize(this.renderTarget.clientWidth, this.renderTarget.clientHeight);
  this.scene = new THREE.Scene();
  this.camera = new THREE.PerspectiveCamera(50, this.renderTarget.offsetWidth / this.renderTarget.offsetHeight, 1, 4000);

  this.camera.position.set(0,0,35);

  var light = new THREE.DirectionalLight(0xffffff, 3.5);
  light.position.set(0,0,1);

  this.scene.add(light);

  this.renderTarget.appendChild(this.threeRenderer.domElement);
};

Arena.prototype.run = function() {
  this.initRenderer();
};

module.exports = Arena;
