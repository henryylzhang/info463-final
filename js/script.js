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

    // check if both points are the same source and destination
    if ((x1 !== event.pageX) && (y1 !== event.pageY)) {
      // check the direction (with a margin error of 20 degrees)
      if (angle > 20 && angle <= 65) {
        console.log("direction: SE");
      } else if (angle > 65 && angle <= 115) {
        console.log("direction: S");
      } else if (angle > 115 && angle <= 160) {
        console.log("direction: SW");
      } else if (angle > 160 && angle <= 200) {
        console.log("direction: W");
      } else if (angle > 200 && angle <= 250) {
        console.log("direction: NW");
      } else if (angle > 250 && angle <= 290) {
        console.log("direction: N");
      } else if (angle > 290 && angle <= 340) {
        console.log("direction: NE");
      } else { // angle > 340 or angle is <= 20
        console.log("direction: E");
      }
    } else if ((x1 === event.pageX && y1 !== event.pageY) || (x1 !== event.pageX && y1 === event.pageY)) {
      // if the X-axis is the same, but Y-axis isn't (or vice versa), check if the angle is exactly N, E, S, or W
      if (angle === 0) {
        console.log("direction: E");
      } else if (angle === 90) {
        console.log("direction: S");
      } else if (angle === 180) {
        console.log("direction: W");
      } else { // angle === 270
        console.log("direction: N");
      }
    }
  });
});