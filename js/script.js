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

// adds a letter to the input field
function addLetter(letter) {
  // converts the letter to lowercase
  letter = letter.toLowerCase();

  // adds the letter
  $(".form-control").val(function() {
    return this.value + letter;
  });
}

// update the teardrops
function updateTeardrops(teardrop) {
  // remove teardrops' text
  $(".text").empty();

  // change direction of the NW, NE, SW, and SE teardrops
  $(".NW-svg").addClass("NW-svg-outward");
  $(".NE-svg").addClass("NE-svg-outward");
  $(".SW-svg").addClass("SW-svg-outward");
  $(".SE-svg").addClass("SE-svg-outward");

  // grab the letters from the teardrop
  var letters = teardrop.split("");

  // update text with corresponding letters
  $(".N-text").text(letters[0]);
  $(".W-text").text(letters[1]);
  $(".S-text").text(letters[2]);

  // if there is a fourth letter
  if (letters.length === 4) {
    // update the east teardrop
    $(".E-text").text(letters[3]);
  } else {
    // otherwise, disable the east teardrop
    $(".E").hide();
  }
}

// resets the text to the original layout
function reset() {
  // change the content in teardrops to original layout
  $(".NE-text").text("ABCD");
  $(".N-text").text("EFGH");
  $(".NW-text").text("IJKL");
  $(".W-text").text("MNOP");
  $(".SW-text").text("QRS");
  $(".S-text").text("TUV");
  $(".SE-text").text("WXYZ");
  $(".E-text").html('<i class="fa fa-arrow-left fa-2x" aria-hidden="true"></i>');

  // re-enable the E teardrop
  $(".E").show();

  // rotate the NE, NE, SW, and SE teardrops to original position
  $(".NW-svg").removeClass("NW-svg-outward");
  $(".NE-svg").removeClass("NE-svg-outward");
  $(".SW-svg").removeClass("SW-svg-outward");
  $(".SE-svg").removeClass("SE-svg-outward");
}

// generates 2 words using predictive text based on the input phrase
function predictiveText(word) {
  // go through the dictionary
  $.get("dict/google-10000-english-usa-no-swears.txt", function(data) {
    // initiate an array that holds the top two words
    var words = [];

    // read each line within dictionary
    var lines = data.split("\n");

    // check each line to see if it contains the phrase
    lines.forEach(function(line) {
      if (words.length < 2) {
        if (line.substring(0, word.length) === word) {
          words.push(line);
        }
      }
    });
    
    // if the previous generated words exist, erase them
    if ($(".word1").text().length > 0) {
      $(".word1").empty();
    }
    if ($(".word2").text().length > 0) {
      $(".word2").empty();
    }

    // add buttons for the new generated words
    if (words.length > 0) {
      // show the container of the buttons
      $(".words").show();

      // add the first word to the first button
      $(".word1").append(words[0]);

      // if the found word only matches one word
      if (words.length === 1) {
        // hide the second button
        $(".word2").hide();
      } else {
        // otherwise, show the second button
        $(".word2").show();

        // add the second word to the second button
        $(".word2").append(words[1]);
      }
    } else {
      // hide the container if no words are found
      $(".words").hide();
    }
  }, "text");
}

// generates phrases
function generatePhrases() {
  // initialize the list of phrases
  var phrases = [];

  // grab the file that contains phrases
  var phrasesFile = new XMLHttpRequest();

  // add every phrase to the list
  phrasesFile.open("GET", "dict/phrases2.txt", false);
  phrasesFile.onreadystatechange = function () {
    if(phrasesFile.readyState === 4) {
      if(phrasesFile.status === 200 || phrasesFile.status == 0) {
        phrases = phrasesFile.responseText.split("\n");
      }
    }
  };
  phrasesFile.send(null);

  // return the list of phrases
  return phrases;
}

// randomly chooses a phrase
function choosePhrase(phrases) {
  // randomly choose a phrase from the list of phrases
  var index = Math.round(Math.random() * (phrases.length - 1));
  var phrase = phrases[index];

  // removes the phrase from the list
  phrases.splice(index, 1);

  // display a new phrase
  $(".phrase").append(phrase);
}

function north() {
  if ($(".N-text").text().length <= 1) {
    // if north teardrop contains a letter
    if ($(".N-text").text().length === 1) {
      // add the letter
      addLetter($(".N-text").text());

      // if the input contains anything
      if ($(".form-control").val().length > 0) {
        // grab the most recent word the user is typing
        var sentence = $(".form-control").val().split(" ");
        var recentWord = sentence[sentence.length - 1];

        // use predictive text on the most recent word
        predictiveText(recentWord);
      }
    }

    // reset the layout
    reset();
  } else {
    // update the teardrop layout
    updateTeardrops($(".N-text").text());
  }
}

function west() {
  if ($(".W-text").text().length <= 1) {
    // if west teardrop contains a letter
    if ($(".W-text").text().length === 1) {
      // add the letter
      addLetter($(".W-text").text());

      // if the input contains anything
      if ($(".form-control").val().length > 0) {
        // grab the most recent word the user is typing
        var sentence = $(".form-control").val().split(" ");
        var recentWord = sentence[sentence.length - 1];

        // use predictive text on the most recent word
        predictiveText(recentWord);
      }
    }

    // reset the layout
    reset();
  } else {
    // update the teardrop layout
    updateTeardrops($(".W-text").text());
  }
}

function south() {
  if ($(".S-text").text().length <= 1) {
    // if south teardrop contains a letter
    if ($(".S-text").text().length === 1) {
      // add the letter
      addLetter($(".S-text").text());

      // if the input contains anything
      if ($(".form-control").val().length > 0) {
        // grab the most recent word the user is typing
        var sentence = $(".form-control").val().split(" ");
        var recentWord = sentence[sentence.length - 1];

        // use predictive text on the most recent word
        predictiveText(recentWord);
      }
    }

    // reset the layout
    reset();
  } else {
    // update the teardrop layout
    updateTeardrops($(".S-text").text());
  }
}

function east() {
  // if the east teardrop contains a letter
  if ($(".E-text").text().length === 1) {
    // add the letter
    addLetter($(".E-text").text());

    // reset the layout
    reset();
  } else if ($(".E-text").html() === '<i class="fa fa-arrow-left fa-2x" aria-hidden="true"></i>') { // otherwise, remove a letter if the teardrop has the backarrow
    // grab the input without the most recent letter
    var formerInput = $(".form-control").val().substring(0, $(".form-control").val().length - 1);

    // update the input without the most recent letter
    $(".form-control").val(formerInput);
  }

  // if the input contains anything
  if ($(".form-control").val().length > 0) {
    // grab the most recent word the user is typing
    var sentence = $(".form-control").val().split(" ");
    var recentWord = sentence[sentence.length - 1];

    // if the recent word exists
    if (recentWord.length > 0) {
      // use predictive text on it
      predictiveText(recentWord);
    } else {
      $(".words").hide();
    }
  } else {
    // empty the words
    $(".word1").empty();
    $(".word2").empty();

    // hide the container of buttons
    $(".words").hide();
  }
}

function northeast() {
  // if the northeast teardrop doesn't contain any letters
  if ($(".NE-text").text().length === 0) {
    // reset the layout
    reset();
  } else {
    // update the teardrop layout
    updateTeardrops($(".NE-text").text());
  }
}

function northwest() {
  // if the northwest teardrop doesn't contain any letters
  if ($(".NW-text").text().length === 0) {
    // reset the layout
    reset();
  } else {
    // update the teardrop layout
    updateTeardrops($(".NW-text").text());
  }
}

function southwest() {
  // if the southwest teardrop doesn't contain any letters
  if ($(".SW-text").text().length === 0) {
    // reset the layout
    reset();
  } else {
    // update the teardrop layout
    updateTeardrops($(".SW-text").text());
  }
}

function southeast() {
  // if the southeast teardrop doesn't contain any letters
  if ($(".SE-text").text().length === 0) {
    // reset the layout
    reset();
  } else {
    // update the teardrop layout
    updateTeardrops($(".SE-text").text());
  }
}

$(document).ready(function() {
  // show the blinking vertical bar
  $("input").focus();

  // hide the empty word buttons
  $(".words").hide();

  // initialize the list of phrases
  var phrases = generatePhrases();

  // make the list of phrases all lowercase
  phrases = phrases.map(function(phrase) {
    return phrase.toLowerCase();
  });

  // initialize the counter of phrases
  var phraseCounter = 0;
  
  // choose a phrase
  choosePhrase(phrases);

  // initialize the first point
  var x1 = 0;
  var y1 = 0;

  // once mouse is held down
  $(".tipckle-redesign").mousedown(function(event) {
    // update the first point
    x1 = event.pageX;
    y1 = event.pageY;

    // re-show the blinking vertical bar
    $("input").focus();
  });

  // once the mouse is released...
  $(".tipckle-redesign").mouseup(function(event) {
    // calculate the angle from the first point with current point
    var angle = getAngle(x1, y1, event.pageX, event.pageY);

    // check if both points are the same source and destination
    if ((x1 !== event.pageX) && (y1 !== event.pageY)) {
      // check the direction (with a margin error of 20 degrees)
      if (angle > 20 && angle <= 65) {
        northwest();
      } else if (angle > 65 && angle <= 115) {
        north();
      } else if (angle > 115 && angle <= 160) {
        northeast();
      } else if (angle > 160 && angle <= 200) {
        east();
      } else if (angle > 200 && angle <= 250) {
        southeast();
      } else if (angle > 250 && angle <= 290) {
        south();
      } else if (angle > 290 && angle <= 340) {
        southwest();
      } else { // angle > 340 or angle is <= 20
        west();
      }
    } else if ((x1 === event.pageX && y1 !== event.pageY) || (x1 !== event.pageX && y1 === event.pageY)) {
      // if the X-axis is the same, but Y-axis isn't (or vice versa), check if the angle is exactly N, E, S, or W
      if (angle === 0) {
        west();
      } else if (angle === 90) {
        north();
      } else if (angle === 180) {
        east();
      } else { // angle === 270
        south();
      }
    } else {
      // adds space to input if X-axis and Y-axis are the same
      $(".form-control").val(function() {
        return this.value + " ";
      });
    }

    // re-show the blinking vertical bar
    $("input").focus();
  });

  // replaces the most recent word with a predictive word
  $("button").click(function() {
    // grab the current sentence
    var sentence = $(".form-control").val().split(" ");

    // replace the latest word with the word in the button
    sentence[sentence.length - 1] = $(this).text();

    // generate a sentence containing predictive word
    var predictSentence = "";
    sentence.forEach(function(word) {
      predictSentence += word + " ";
    });
    
    // update the input field with sentence containing predictive word
    $(".form-control").val(function() {
      return predictSentence;
    });

    // empty the words in the buttons
    $(".word1").empty();
    $(".word2").empty();

    // hide the container of buttons
    $(".words").hide();

    // reset the layout
    reset();

    // re-show the blinking vertical bar
    $("input").focus();
  });

  // submits the text input upon double-clicking
  $(".tipckle-redesign").dblclick(function() {
    // increase the counter
    phraseCounter++;

    // remove the current phrase
    $(".phrase").empty();

    // if the counter reaches 45
    if (phraseCounter === 45) {
      // empty the input
      $(".form-control").val("");

      // alert that testing has ended
      alert("Test is over.");
    } else {
      // StreamAnalyzer goes here

      // empty the input
      $(".form-control").val("");

      // choose and display a new phrase
      choosePhrase(phrases);
    }
  });
});