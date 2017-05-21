'use strict';

// calculates the angle between 2 points
function getAngle(x1, y1, x2, y2) {
  // calculate the differences between the X-axis and Y-axis
  var dx = x2 - x1;
  var dy = y2 - y1;

  // calculate angle based on those differences
  var angle = Math.atan2(dy, dx) * (180 / Math.PI);

  // make angle have a range from [0, 360) if it's less than 0
  if (angle < 0) {
    angle += 360;
  }

  // return the calculated angle
  return angle;
}

$(document).ready(function() {
  // initialize the first point
  var x1 = 0;
  var y1 = 0;

  // update the first point once mouse is held down
  $(".container").mousedown(function(event) {
    x1 = event.pageX;
    y1 = event.pageY;
  });

  // once the mouse is released...
  $(".container").mouseup(function(event) {
    // calculate the angle from the first point with current point
    var angle = getAngle(x1, y1, event.pageX, event.pageY);
  });
});