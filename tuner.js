
// Key selection

// titles of all the keys
var KEYS        = ["Cb", "Gb", "Db", "Ab", "Eb", "Bb", "F", "C", "G", "D", "A", "E", "B", "F#", "C#"];
// semitones above A
var KEY_CENTERS = [ 2,    9,    4,    11,   6,    1,    8,   3,   10,  5,   0,   7,   2,   9,    4  ];
var MAX_KEY = 7; // key values should go from -7 to +7, sharps are positive

// todo: stylize the flats and sharps on the display

var FLAT_ORDER = ["B", "E", "A", "D", "G", "C", "F"];
var SHARP_ORDER = ["F", "C", "G", "D", "A", "E", "B"];

var NOTE_NAMES = ["C", "D", "E", "F", "G", "A", "B"];

var SCALE_RATIOS = [[1, 1], [9, 8], [5, 4], [4, 3], [3, 2], [5, 3], [15, 8], [2, 1]];
// note that the 8ve is added here... deal with it later

// These variables may change with the key (tuning probably wont, but the other two will for sure)
var tuningA4 = 440; // Hz for A4
var scaleFrequencies = new Float32Array(SCALE_RATIOS.length);
var notesInKey = [];

$("#key-select").change(function() {
	var newKey = parseInt($(this).val());
	var keyTitle = $(this).find(":selected").text();
	var noteIndex = NOTE_NAMES.indexOf(keyTitle.substring(0, 1));

	// First, reorder the letters for the correct key (no accidentals yet)
	notesInKey = NOTE_NAMES.slice(noteIndex).concat(NOTE_NAMES.slice(0, noteIndex));
	// Add in the accidentals
	if (newKey < 0) {
		for (var i = 0; i < -1*newKey; i++) {
			notesInKey[notesInKey.indexOf(FLAT_ORDER[i])] += "b";
		}
	} else if (newKey > 0) {
		for (var i = 0; i < newKey; i++) {
			notesInKey[notesInKey.indexOf(SHARP_ORDER[i])] += "#";
		}
	}
	// Add the octave
	notesInKey.push(notesInKey[0]);

	// Populate the frequency data
	var keyCenter = tuningA4 * Math.pow(2, KEY_CENTERS[newKey + MAX_KEY] / 12);
	for (var i = 0; i < SCALE_RATIOS.length; i++) {
		scaleFrequencies[i] = (keyCenter * SCALE_RATIOS[i][0]) / SCALE_RATIOS[i][1];
	}
})

$('#meta-detected-frequency').change(function() {
	var frequency = $(this).val();
	while (frequency < scaleFrequencies[0]) {
		frequency *= 2;
	}
	while (frequency > scaleFrequencies[scaleFrequencies.length - 1]) {
		frequency /= 2;
	}

	var pitchDifferences = [];
	for (var i = 0; i < scaleFrequencies.length; i++) {
		pitchDifferences.push(Math.abs((scaleFrequencies[i] / frequency) - 1));
	}
	var minDifference = Math.min(...pitchDifferences);
	var noteIndex = pitchDifferences.indexOf(minDifference);
	var closestNote = notesInKey[noteIndex];

	var semitonesOutOfTune = 12 * Math.log(frequency / scaleFrequencies[noteIndex]) / Math.log(2);
	// basically just the log base (2^1/12) of the ratio
	// this works because Wolfram Alpha says so
	var centsOutOfTune = semitonesOutOfTune * 100;

	$("#meta-cents-out").val(centsOutOfTune);
	$("#meta-cents-out").change();

	$("#meta-note").val(closestNote);
	$("#meta-note").change();
})

for (var i = 0; i < KEYS.length; i++) {
	$("#key-select").append($('<option>', {
		value: i - MAX_KEY, // range on [-7, 7]
		text: KEYS[i],
	}))
}

// Set the selector to C major (default)
$("#key-select").val(0);
$("#key-select").change();

