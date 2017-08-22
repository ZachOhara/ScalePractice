
var BUFFER_SIZE = 1024; // max allowed is 2^14 (16384)
var FFT_OUTPUT_SIZE = 32768; // 2^15, maximum allowed

// multi-browser support is a bitch
window.AudioContext = window.AudioContext ||
	window.webkitAudioContext ||
	window.mozAudioContext ||
	window.msAudioContext;

navigator.getUserMedia = navigator.getUserMedia ||
	navigator.webkitGetUserMedia ||
	navigator.mozGetUserMedia ||
	navigator.msGetUserMedia;

// construct an audio context
var audioContext = new AudioContext();

// declare nodes - initialization happens in startMicrophone()
var micSourceNode;
var fftNode;
var resultsNode;

var getResultsFFT = function () {
		var array = new Uint8Array(fftNode.frequencyBinCount);
		fftNode.getByteFrequencyData(array);
		var nonZeroCount = 0;
		for (var i = 0; i < array.length; i++) {
			if (array[i] != 0) {
				nonZeroCount++;
			}
		}
		var max = Math.max(...array);
		var maxIndex = array.indexOf(max);

		var frequency = calculateFrequency(maxIndex);

		$("#meta-detected-frequency").val(frequency);
		$("#meta-detected-frequency").change(); // triggers the update

}

var frequencyListener; // declare this here, then a listener can be set

var calculateFrequency = function (fftBucket) {
	// fftBucket will be in [0, FFT_OUTPUT_SIZE - 1]
	var nyquistFreq = audioContext.sampleRate;
	var bucketStep = nyquistFreq / FFT_OUTPUT_SIZE; // in Hz
	var estFreq = bucketStep * (fftBucket + 0.5);
	return estFreq;
}

var startMicrophone = function(stream) {
	// Build the source node. The browser will block here until the user grants microphone permissions.
	micSourceNode = audioContext.createMediaStreamSource(stream);

	// Build the FFT analysis node (magic happens here)
	fftNode = audioContext.createAnalyser();
	fftNode.smoothingTimeConstant = 0;
	fftNode.fftSize = FFT_OUTPUT_SIZE;

	// Build the results node (access and use the results of the FFT)
	resultsNode = audioContext.createScriptProcessor(BUFFER_SIZE, 1, 1);
	resultsNode.onaudioprocess = getResultsFFT;

	// Connect 'em up
	micSourceNode.connect(fftNode);
	fftNode.connect(resultsNode);
	resultsNode.connect(audioContext.destination);
	// the results node does not output any audio, but an eventual connection
	// to the destination is required to get the whole chain to work
}

var printError = function printError(msg) {
	console.log("Error while starting audio: ");
	console.log(msg);
}

navigator.getUserMedia({audio:true}, startMicrophone, printError);
