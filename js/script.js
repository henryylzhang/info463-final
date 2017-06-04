'use strict';

// global variables for XML document
var USER_DATA;
var CURRENT_TRIAL;
var ENTRY_COUNTER;

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
    if (phrasesFile.readyState === 4) {
      if (phrasesFile.status === 200 || phrasesFile.status == 0) {
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

// format the date
function formatDate(date) {
  var d = new Date(date);
  var hh = d.getHours();
  var m = d.getMinutes();
  var s = d.getSeconds();
  var dd = "AM";
  var h = hh;
  if (h >= 12) {
    h = hh - 12;
    dd = "PM";
  }
  if (h === 0) {
    h = 12;
  }
  
  m = m < 10 ? "0" + m : m;
  s = s < 10 ? "0" + s : s;

  var pattern = new RegExp("0?" + hh + ":" + m + ":" + s);

  var replacement = h + ":" + m;
  replacement += ":" + s;
  replacement += " " + dd;

  return date.replace(pattern, replacement);
}

// append a trial to XML
function appendTrial(counter) {
  // create a trial element
  var trial = USER_DATA.createElement("Trial");

  // add the trial number
  $(trial).attr("number", counter + 1);

  // if the current trial is 1-5
  if (counter < 5) {
    // make the testing attribute false
    $(trial).attr("testing", false);
  } else {
    // otherwise, make it true
    $(trial).attr("testing", true);
  }

  // initialize the number of entries with 0
  $(trial).attr("entries", ENTRY_COUNTER);

  // make the current trial a global variable
  CURRENT_TRIAL = trial;

  // append the trial
  USER_DATA.getElementsByTagName("Swipecycle")[0].appendChild(trial);

  // append the presented text to the trial
  appendPresented(counter);
}

// append the presented phrase to XML
function appendPresented(counter) {
  // create a presented element
  var presentedPhrase = USER_DATA.createElement("Presented");

  // make the presented element's text content be the presented phrase
  presentedPhrase.textContent = $(".phrase").text();

  // append the presented element
  USER_DATA.getElementsByTagName("Trial")[counter].appendChild(presentedPhrase);
}

// append an entry to a trial
function appendEntry(counter, char) {
  // make the character into lowercase
  char = char.toLowerCase();

  // initialize the ticks and seconds
  var ticks = (new Date().getTime() * 10000) + 621355968000000000;
  var seconds = new Date().getTime() / 1000;

  // if the character is the backspace
  if (char === "&#x8;") {
    // create an entry element
    var entry = USER_DATA.createElement("Entry");

    // add the char, value, ticks, and seconds attributes
    $(entry).attr("char", char);
    $(entry).attr("value", 8);
    $(entry).attr("ticks", ticks);
    $(entry).attr("seconds", seconds);

    // append the entry
    USER_DATA.getElementsByTagName("Trial")[counter].appendChild(entry);

    // increment the entry counter
    ENTRY_COUNTER++;
  } else {
    // split the character
    var charArray = char.split("");

    // if the character is a string
    if (charArray.length > 1) {
      // make the last character into a space
      charArray[charArray.length - 1] = " ";
    } else {
      // if character has length of 0, make it into a space
      if (charArray[0].length === 0) {
        charArray[charArray.length - 1] = " ";
      }
    }
    
    // for each character in the array
    charArray.forEach(function (character) {
      // create the entry element
      var entry = USER_DATA.createElement("Entry");

      // add the character to entry
      $(entry).attr("char", character);

      // if character is a blank space, add its ASCII value
      if (character === " ") {
        $(entry).attr("value", 32);
      } else {
        // add the letter's ASCII value
        $(entry).attr("value", character.charCodeAt(0));
      }
      
      // add the ticks and seconds
      $(entry).attr("ticks", ticks);
      $(entry).attr("seconds", seconds);

      // append the entry to the trial
      USER_DATA.getElementsByTagName("Trial")[counter].appendChild(entry);

      // increase entry counter
      ENTRY_COUNTER++;
    });
  }

  // update the current trial's entry counter
  $(CURRENT_TRIAL).attr("entries", ENTRY_COUNTER);
}

// append the transcribed phrase to XML
function appendTranscribed(counter) {
  // create the transcribed phrase element
  var transcribedPhrase = USER_DATA.createElement("Transcribed");

  // grab the input, excluding any whitespace at end of phrase
  transcribedPhrase.textContent = $("input").val().trim();

  // append the transcribed phrase element
  USER_DATA.getElementsByTagName("Trial")[counter].appendChild(transcribedPhrase);
}

function north(counter) {
  if ($(".N-text").text().length <= 1) {
    // if north teardrop contains a letter
    if ($(".N-text").text().length === 1) {
      // add the letter
      addLetter($(".N-text").text());

      // append it to XML
      appendEntry(counter, $(".N-text").text());

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

function west(counter) {
  if ($(".W-text").text().length <= 1) {
    // if west teardrop contains a letter
    if ($(".W-text").text().length === 1) {
      // add the letter
      addLetter($(".W-text").text());

      // append it to XML
      appendEntry(counter, $(".W-text").text());

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

function south(counter) {
  if ($(".S-text").text().length <= 1) {
    // if south teardrop contains a letter
    if ($(".S-text").text().length === 1) {
      // add the letter
      addLetter($(".S-text").text());

      // append it to XML
      appendEntry(counter, $(".S-text").text());

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

function east(counter) {
  // if the east teardrop contains a letter
  if ($(".E-text").text().length === 1) {
    // add the letter
    addLetter($(".E-text").text());

    // append it to XML
    appendEntry(counter, $(".E-text").text());

    // reset the layout
    reset();
  } else if ($(".E-text").html() === '<i class="fa fa-arrow-left fa-2x" aria-hidden="true"></i>') { // otherwise, remove a letter if the teardrop has the backarrow
    // grab the input without the most recent letter
    var formerInput = $(".form-control").val().substring(0, $(".form-control").val().length - 1);

    // append the backspace to XML
    appendEntry(counter, "&#x8;");

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
  // initialize entry counter
  ENTRY_COUNTER = 0;

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

  // initialize user data for XML
  USER_DATA = document.implementation.createDocument(null, "TextTest");
  var root = USER_DATA.documentElement;

  // initialize the date for xml: https://stackoverflow.com/questions/4898574
  var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var date = new Date();
  var currentDate = months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  currentDate = formatDate(currentDate);
  currentDate = weekdays[date.getDay()] + ", " + currentDate;

  // add attributes to XML
  $(root).attr("version", "2.7.2");
  $(root).attr("trials", 45);
  $(root).attr("ticks", (date.getTime() * 10000) + 621355968000000000);
  $(root).attr("seconds", date.getTime() / 1000);
  $(root).attr("date", currentDate);

  // append the first trial
  appendTrial(phraseCounter);

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
        north(phraseCounter);
      } else if (angle > 115 && angle <= 160) {
        northeast();
      } else if (angle > 160 && angle <= 200) {
        east(phraseCounter);
      } else if (angle > 200 && angle <= 250) {
        southeast();
      } else if (angle > 250 && angle <= 290) {
        south(phraseCounter);
      } else if (angle > 290 && angle <= 340) {
        southwest();
      } else { // angle > 340 or angle is <= 20
        west(phraseCounter);
      }
    } else if ((x1 === event.pageX && y1 !== event.pageY) || (x1 !== event.pageX && y1 === event.pageY)) {
      // if the X-axis is the same, but Y-axis isn't (or vice versa), check if the angle is exactly N, E, S, or W
      if (angle === 0) {
        west(phraseCounter);
      } else if (angle === 90) {
        north(phraseCounter);
      } else if (angle === 180) {
        east(phraseCounter);
      } else { // angle === 270
        south(phraseCounter);
      }
    } else {
      // adds space to input if X-axis and Y-axis are the same
      $(".form-control").val(function() {
        return this.value + " ";
      });

      // append the space to XML
      appendEntry(phraseCounter, " ");
    }

    // re-show the blinking vertical bar
    $("input").focus();
  });

  // replaces the most recent word with a predictive word
  $("button").click(function() {
    // grab the current sentence
    var sentence = $(".form-control").val().split(" ");

    // grab the rest of the word that is not typed
    var cutoffWord = $(this).text().substring(sentence[sentence.length - 1].length);
    
    // add that part of the word to XML
    appendEntry(phraseCounter, cutoffWord);

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
    // while the latest entry has a whitespace
    while (USER_DATA.getElementsByTagName("Trial")[phraseCounter].lastChild.getAttribute("char") === " ") {
      // remove that entry with whitespace
      USER_DATA.getElementsByTagName("Trial")[phraseCounter].lastChild.remove();

      // decrement the entry counter
      ENTRY_COUNTER--;
    }

    // update number of entries
    $(CURRENT_TRIAL).attr("entries", ENTRY_COUNTER);

    // append the transcribed phrase to XML
    appendTranscribed(phraseCounter);

    // reset the entry counter
    ENTRY_COUNTER = 0;
    
    // increase the counter
    phraseCounter++;

    // remove the current phrase
    $(".phrase").empty();

    // if the counter reaches 45
    if (phraseCounter === 45) {
      // empty the input
      $(".form-control").val("");

      // remove Swipecycle
      $(".input-container").hide();
      $(".tipckle-redesign").hide();

      // alert that testing has ended
      $(".phrase-box h2").text("Thank you for participating in our study.");
      $(".phrase").text("An .xml file download containing your inputs will be starting shortly.");

      // download the XML document
      var a = document.createElement("a"), xml, ev;
      a.download = "Swipecycle_Subject.xml";
      xml = '<?xml version = "1.0" encoding="utf-8" standalone="yes"?>' + (new XMLSerializer()).serializeToString(USER_DATA).replace(/&amp;#x8;/gi, "&#x8;");
      a.href = 'data:application/octet-stream;base64,' + btoa(xml);
      ev = document.createEvent("MouseEvents");
      ev.initMouseEvent("click", true, false, self, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.dispatchEvent(ev);
    } else {
      // empty the input
      $(".form-control").val("");

      // choose and display a new phrase
      choosePhrase(phrases);

      // create a new trial
      appendTrial(phraseCounter);
    }
  });
});