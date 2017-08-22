
var METRONOME_INCREMENT = 5; // bpm

var metronomeIsOn = false;

var metSpeedField = $("#metronome-bpm");

$("#metronome-toggle-button").click(function() {
	if (metronomeIsOn) {
		stopMetronome();
		$(this).text("Start");
	} else {
		startMetronome();
		$(this).text("Stop");
	}
});

$("#metronome-up-button").click(function() {
	metSpeedField.val(parseInt(metSpeedField.val()) + METRONOME_INCREMENT);
});

$("#metronome-down-button").click(function() {
	metSpeedField.val(parseInt(metSpeedField.val()) - METRONOME_INCREMENT);
});

var startMetronome = function() {
	console.log("starting met");
	metronomeIsOn = true;
}

var stopMetronome = function() {
	console.log("stopping met");
	metronomeIsOn = false;
}
