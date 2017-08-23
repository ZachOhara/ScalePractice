
# Key selection

# Titles of all the keys
KEYS        = ["Cb", "Gb", "Db", "Ab", "Eb", "Bb", "F", "C", "G", "D", "A", "E", "B", "F#", "C#"]
# Semitones above A
KEY_CENTERS = [ 2,    9,    4,    11,   6,    1,    8,   3,   10,  5,   0,   7,   2,   9,    4  ]
MAX_KEY = 7 # key values should go from -7 to +7, sharps are positive

# todo: stylize the flats and sharps on the display

FLAT_ORDER  = ["B", "E", "A", "D", "G", "C", "F"]
SHARP_ORDER = ["F", "C", "G", "D", "A", "E", "B"]

NOTE_NAMES = ["C", "D", "E", "F", "G", "A", "B"]

SCALE_RATIOS = [[1, 1], [9, 8], [5, 4], [4, 3], [3, 2], [5, 3], [15, 8], [2, 1]]
# note that the 8ve is added here... this just makes the later programming easier

# These variables may change with the key
tuningA4 = 440 # Hz for A4, constant for all keys
scaleFrequencies = new Float32Array(SCALE_RATIOS.length)
notesInKey = []

$("#key-select").change ->
	newKey = parseInt $(this).val()
	keyTitle = $(this).find(":selected").text()
	noteIndex = NOTE_NAMES.indexOf keyTitle.substring(0, 1)

	# First, reorder the letters for the correct key (no accidentals yet)
	notesInKey = NOTE_NAMES.slice(noteIndex).concat(NOTE_NAMES.slice 0, noteIndex)
	# Add in the accidentals
	if newKey < 0
		for i in [0...-1*newKey]
			notesInKey[notesInKey.indexOf(FLAT_ORDER[i])] += "b"
	else if newKey > 0
		for i in [0...newKey]
			notesInKey[notesInKey.indexOf(SHARP_ORDER[i])] += "#"
	# There is no condition if newKey == 0, because we're in C major (no accidentals)
	# Add the octave
	notesInKey.push(notesInKey[0])

	# Populate the frequency data
	keyCenter = tuningA4 * Math.pow(2, KEY_CENTERS[newKey + MAX_KEY] / 12)
	for i in [0...SCALE_RATIOS.length]
		scaleFrequencies[i] = (keyCenter * SCALE_RATIOS[i][0]) / SCALE_RATIOS[i][1]

$('#meta-detected-frequency').change ->
	frequency = $(this).val()
	while frequency < scaleFrequencies[0]
		frequency *= 2
	while frequency > scaleFrequencies[scaleFrequencies.length - 1]
		frequency /= 2

	pitchDifferences = []
	for i in scaleFrequencies
		pitchDifferences.push(Math.abs(i / frequency) - 1)
	minDifference = Math.min(pitchDifferences...)
	noteIndex = pitchDifferences.indexOf(minDifference)
	closestNote = notesInKey[noteIndex]

	semitonesOutOfTune = 12 * Math.log(frequency / scaleFrequencies[noteIndex]) / Math.log(2)
	# basically just the log base (2^1/12) of the ratio
	# this works because Wolfram Alpha says so
	centsOutOfTune = semitonesOutOfTune * 100

	$("#meta-cents-out").val(centsOutOfTune)
	$("#meta-cents-out").change()

	$("#meta-note").val(closestNote)
	$("#meta-note").change()

for i in [0...KEYS.length]
	$("#key-select").append($('<option>', {
		value: i - MAX_KEY, # range on [-7, 7]
		text: KEYS[i],
	}))

# Set the selector to C major (default)
$("#key-select").val(0)
$("#key-select").change()
