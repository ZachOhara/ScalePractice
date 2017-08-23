// Generated by CoffeeScript 1.12.7
(function() {
  var METRONOME_INCREMENT, metSpeedField, metronomeIsOn, startMetronome, stopMetronome;

  METRONOME_INCREMENT = 5;

  metronomeIsOn = false;

  metSpeedField = $("#metronome-bpm");

  $("#metronome-toggle-button").click(function() {
    if (metronomeIsOn) {
      stopMetronome();
      return $(this).text("Start");
    } else {
      startMetronome();
      return $(this).text("Stop");
    }
  });

  $("#metronome-up-button").click(function() {
    return metSpeedField.val(parseInt(metSpeedField.val()) + METRONOME_INCREMENT);
  });

  $("#metronome-down-button").click(function() {
    return metSpeedField.val(parseInt(metSpeedField.val()) - METRONOME_INCREMENT);
  });

  startMetronome = function() {
    console.log("starting met");
    return metronomeIsOn = true;
  };

  stopMetronome = function() {
    console.log("stopping met");
    return metronomeIsOn = false;
  };

}).call(this);