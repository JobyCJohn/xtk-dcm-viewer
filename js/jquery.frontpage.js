$(document).ready(function() {
  $('.nav a').click(function(e) {
    if (e.target.id === "orthoViewMenuItem") {
      $('p.viewerLabel').text('Ortho View');
      renderVolumeImages(false);
    } else if (e.target.id === "3DViewMenuItem") {
      $('p.viewerLabel').text('3D View');
      renderVolumeImages(true);
    }
    e.preventDefault(); //to prevent scrolling
  });

  $('#filebutton').change(function() {
    selectFiles(this.files);
  });

});

function selectFiles(files) {
  $('p.viewerLabel').text('Ortho View');
  read(files);
};
