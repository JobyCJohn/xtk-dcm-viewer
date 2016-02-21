pageLoader = function(){

"use strict";
  $(document).ready(function() {
    $('.nav a').click(function(e) {
      if (e.target.id === "orthoViewMenuItem") {
        $('p.viewerLabel').text('Ortho View');
        render.mode(false);
      } else if (e.target.id === "3DViewMenuItem") {
        $('p.viewerLabel').text('3D View');
        render.mode(true);
      } else if (e.target.id === "patientMenuItem") {
        render.deInitialize();
        render.initialize();
        $('#filesInput').click();
      }
      e.preventDefault();
    });

    $('#filesInput').click(function() {
      this.value = null;
    });

    $('#filesInput').change(function() {
      $('p.viewerLabel').text('Ortho View');

      var files = $( "#filesInput" )[0].files;
      reader.read(files);
    });
});

}();
