reader = function(){

  function read(files) {
    data = {
      'volume': {
        'file': [],
        'filedata': [],
        'extensions': ['DCM', 'DICOM']
      }
    };

    for (var i = 0; i < files.length; i++) {

      var f = files[i];
      var fileName = f.name;
      var fileExtension = fileName.split('.').pop().toUpperCase();

      // check for files with no extension
      if (fileExtension == fileName.toUpperCase()) {
        // this must be dicom
        fileExtension = 'DCM';
      }

      // check which type of file it is
      if (data['volume']['extensions'].indexOf(fileExtension) >= 0) {
        data['volume']['file'].push(f);
      }
    }

    // number of total files
    var numberOfFiles = files.length;
    var numberRead = 0;
    window.console.log('Total new files:', numberOfFiles);

    // setup callback for errors during reading
    var errorHandler = function(e) {
      console.log('Error:' + e.target.error.code);
    };

    // setup callback after reading
    var loadHandler = function(type, file) {
      return function(e) {
        // reading complete
        var resultData = e.target.result;

        // might have multiple files associated
        // attach the filedata to the right one
        data[type]['filedata'][data[type]['file'].indexOf(file)] = resultData;

        numberRead++;
        if (numberRead === numberOfFiles) {
          // all done, start the parsing
          render.parse(data);
        }
      };
    };

    var types = Object.keys(data);
    types.forEach(function(v) {
      if (data[v]['file'].length > 0) {
        data[v]['file'].forEach(function(u) {
          var reader = new FileReader();
          reader.onerror = errorHandler;
          reader.onload = loadHandler(v, u);
          reader.readAsArrayBuffer(u);
        });
      }
    });
  };

  return {read:read}

}();
