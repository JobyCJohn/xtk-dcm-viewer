render = function(){

function initialize() {
  ren3d = new X.renderer3D();
  ren3d.container = '3DViewer';
  ren3d.init();
  volume = new X.volume();
  volume.volumeRendering = false;
};

function deInitialize() {
  if (typeof ren3d == "undefined") { return; }
  ren3d.destroy();
  ren3d = null;
  volume = null;
};

function mode(isVolumeMode) {
  if (!volume) { return; }

  if (isVolumeMode) {
    volume.lowerThreshold = (volume.min + (volume.max / 10));
  }
  volume.volumeRendering = isVolumeMode;
};

function volumeRendering() {
  if (!volume) { return; }
  ren3d.add(volume);
  ren3d.camera.position = [0, 500, 0]; ren3d.render();
};

function parse(data) {
  if (data['volume']['file'].length > 0) {
    volume.file = data['volume']['file'].map(function(v) {
      return v.name;
    });
    volume.filedata = data['volume']['filedata']; } volumeRendering();
};

return {initialize:initialize, deInitialize:deInitialize, mode:mode, parse:parse}

}();
