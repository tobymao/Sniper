var Arena = require('./controllers/Arena.js');

window.onload = function() {
  // Load up the arena
  var canvasElement = document.getElementById('main-canvas');

  var arena = new Arena({
    renderTarget: canvasElement  
  });

  arena.run();
};
