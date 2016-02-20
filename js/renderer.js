function initializeRenderers() {
  ren3d = new X.renderer3D();
  ren3d.container = '3DViewer';
  ren3d.init();
};

function renderVolumeImages(isVolumeMode) {
  if (!volume) {
    return;
  }

  if (isVolumeMode) {
    volume.lowerThreshold = (volume.min + (volume.max / 10));
  }
  volume.volumeRendering = isVolumeMode;
}

function createData() {
  _data = {
    'volume': {
      'file': [],
      'filedata': [],
      'extensions': ['NRRD', 'MGZ', 'MGH', 'NII', 'GZ', 'DCM', 'DICOM']
    }
  };
}

//
// Reading files using the HTML5 FileReader.
//
function read(files) {
  createData();

  for (var i = 0; i < files.length; i++) {

    var f = files[i];
    var _fileName = f.name;
    var _fileExtension = _fileName.split('.').pop().toUpperCase();

    // check for files with no extension
    if (_fileExtension == _fileName.toUpperCase()) {
      // this must be dicom
      _fileExtension = 'DCM';
    }

    var _fileSize = f.size;

    // check which type of file it is
    if (_data['volume']['extensions'].indexOf(_fileExtension) >= 0) {
      _data['volume']['file'].push(f);
    }

  }

  // we now have the following data structure for the scene
  window.console.log('New data', _data);

  var _types = Object.keys(_data);

  // number of total files
  var _numberOfFiles = files.length;
  var _numberRead = 0;
  window.console.log('Total new files:', _numberOfFiles);

  //
  // the HTML5 File Reader callbacks
  //

  // setup callback for errors during reading
  var errorHandler = function(e) {
    console.log('Error:' + e.target.error.code);
  };

  // setup callback after reading
  var loadHandler = function(type, file) {
    return function(e) {
      // reading complete
      var data = e.target.result;

      // might have multiple files associated
      // attach the filedata to the right one
      _data[type]['filedata'][_data[type]['file'].indexOf(file)] = data;

      _numberRead++;
      if (_numberRead == _numberOfFiles) {
        // all done, start the parsing
        parse(_data);
      }
    };
  };

  //
  // start reading
  //
  _types.forEach(function(v) {

    if (_data[v]['file'].length > 0) {

      _data[v]['file'].forEach(function(u) {
        var reader = new FileReader();
        reader.onerror = errorHandler;
        reader.onload = (loadHandler)(v, u); // bind the current type
        // start reading this file
        reader.readAsArrayBuffer(u);
      });
    }
  });
};

function volumeRendering() {
  if (!volume) {
    return;
  }
  ren3d.add(volume);
  ren3d.camera.position = [0, 500, 0];
  ren3d.render();
};

function parse(data) {

  // initialize renderers
  initializeRenderers();

  if (data['volume']['file'].length > 0) {

    // we have a volume
    volume = new X.volume();
    volume.file = data['volume']['file'].map(function(v) {
      return v.name;
    });
    volume.filedata = data['volume']['filedata'];
  }
  volumeRendering();
};
