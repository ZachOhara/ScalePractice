// Generated by CoffeeScript 1.12.7
(function() {
  var FLAT_ORDER, KEYS, KEY_CENTERS, MAX_KEY, NOTE_NAMES, SCALE_RATIOS, SHARP_ORDER, i, j, notesInKey, ref, scaleFrequencies, tuningA4;

  KEYS = ["Cb", "Gb", "Db", "Ab", "Eb", "Bb", "F", "C", "G", "D", "A", "E", "B", "F#", "C#"];

  KEY_CENTERS = [2, 9, 4, 11, 6, 1, 8, 3, 10, 5, 0, 7, 2, 9, 4];

  MAX_KEY = 7;

  FLAT_ORDER = ["B", "E", "A", "D", "G", "C", "F"];

  SHARP_ORDER = ["F", "C", "G", "D", "A", "E", "B"];

  NOTE_NAMES = ["C", "D", "E", "F", "G", "A", "B"];

  SCALE_RATIOS = [[1, 1], [9, 8], [5, 4], [4, 3], [3, 2], [5, 3], [15, 8], [2, 1]];

  tuningA4 = 440;

  scaleFrequencies = new Float32Array(SCALE_RATIOS.length);

  notesInKey = [];

  $("#key-select").change(function() {
    var i, j, k, keyCenter, keyTitle, l, newKey, noteIndex, ref, ref1, ref2, results;
    newKey = parseInt($(this).val());
    keyTitle = $(this).find(":selected").text();
    noteIndex = NOTE_NAMES.indexOf(keyTitle.substring(0, 1));
    notesInKey = NOTE_NAMES.slice(noteIndex).concat(NOTE_NAMES.slice(0, noteIndex));
    if (newKey < 0) {
      for (i = j = 0, ref = -1 * newKey; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        notesInKey[notesInKey.indexOf(FLAT_ORDER[i])] += "b";
      }
    } else if (newKey > 0) {
      for (i = k = 0, ref1 = newKey; 0 <= ref1 ? k < ref1 : k > ref1; i = 0 <= ref1 ? ++k : --k) {
        notesInKey[notesInKey.indexOf(SHARP_ORDER[i])] += "#";
      }
    }
    notesInKey.push(notesInKey[0]);
    keyCenter = tuningA4 * Math.pow(2, KEY_CENTERS[newKey + MAX_KEY] / 12);
    results = [];
    for (i = l = 0, ref2 = SCALE_RATIOS.length; 0 <= ref2 ? l < ref2 : l > ref2; i = 0 <= ref2 ? ++l : --l) {
      results.push(scaleFrequencies[i] = (keyCenter * SCALE_RATIOS[i][0]) / SCALE_RATIOS[i][1]);
    }
    return results;
  });

  $('#meta-detected-frequency').change(function() {
    var centsOutOfTune, closestNote, frequency, i, j, minDifference, noteIndex, pitchDifferences, ref, semitonesOutOfTune;
    frequency = $(this).val();
    while (frequency < scaleFrequencies[0]) {
      frequency *= 2;
    }
    while (frequency > scaleFrequencies[scaleFrequencies.length - 1]) {
      frequency /= 2;
    }
    pitchDifferences = [];
    for (i = j = 0, ref = scaleFrequencies.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      pitchDifferences.push(Math.abs((scaleFrequencies[i] / frequency) - 1));
    }
    minDifference = Math.min.apply(Math, pitchDifferences);
    noteIndex = pitchDifferences.indexOf(minDifference);
    closestNote = notesInKey[noteIndex];
    semitonesOutOfTune = 12 * Math.log(frequency / scaleFrequencies[noteIndex]) / Math.log(2);
    centsOutOfTune = semitonesOutOfTune * 100;
    $("#meta-cents-out").val(centsOutOfTune);
    $("#meta-cents-out").change();
    $("#meta-note").val(closestNote);
    return $("#meta-note").change();
  });

  for (i = j = 0, ref = KEYS.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
    $("#key-select").append($('<option>', {
      value: i - MAX_KEY,
      text: KEYS[i]
    }));
  }

  $("#key-select").val(0);

  $("#key-select").change();

}).call(this);
