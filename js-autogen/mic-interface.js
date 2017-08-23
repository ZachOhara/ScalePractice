// Generated by CoffeeScript 1.12.7
(function() {
  
window.AudioContext = window.AudioContext ||
	window.webkitAudioContext ||
	window.mozAudioContext ||
	window.msAudioContext;

navigator.getUserMedia = navigator.getUserMedia ||
	navigator.webkitGetUserMedia ||
	navigator.mozGetUserMedia ||
	navigator.msGetUserMedia;
;
  var BUFFER_SIZE, FFT_OUTPUT_SIZE, audioContext, calculateFrequency, fftNode, getFourierResults, mediaRequirements, micSourceNode, printError, resultsNode, startMicrophone;

  BUFFER_SIZE = 1024;

  FFT_OUTPUT_SIZE = 32768;

  audioContext = new AudioContext();

  micSourceNode = null;

  fftNode = null;

  resultsNode = null;

  getFourierResults = function() {
    var array, frequency, i, j, max, maxIndex, nonZeroCount, ref;
    array = new Uint8Array(fftNode.frequencyBinCount);
    fftNode.getByteFrequencyData(array);
    nonZeroCount = 0;
    for (i = j = 0, ref = array.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      if (array[i] !== 0) {
        nonZeroCount += 1;
      }
    }
    max = Math.max.apply(Math, array);
    maxIndex = array.indexOf(max);
    frequency = calculateFrequency(maxIndex);
    $("#meta-detected-frequency").val(frequency);
    return $("#meta-detected-frequency").change();
  };

  calculateFrequency = function(fftBucketIndex) {
    var bucketStep, estFreq, nyquistFreq;
    nyquistFreq = audioContext.sampleRate / 2;
    bucketStep = nyquistFreq / FFT_OUTPUT_SIZE;
    estFreq = bucketStep * (fftBucketIndex + 0.5);
    return estFreq;
  };

  startMicrophone = function(stream) {
    micSourceNode = audioContext.createMediaStreamSource(stream);
    fftNode = audioContext.createAnalyser();
    fftNode.smoothingTimeConstant = 0;
    fftNode.fftSize = FFT_OUTPUT_SIZE;
    resultsNode = audioContext.createScriptProcessor(BUFFER_SIZE, 1, 1);
    resultsNode.onaudioprocess = getFourierResults;
    micSourceNode.connect(fftNode);
    fftNode.connect(resultsNode);
    resultsNode.connect(audioContext.destination);
    return 1;
  };

  printError = function(msg) {
    return console.log("Error while starting audio: \n" + msg);
  };

  mediaRequirements = {
    audio: true
  };

  navigator.getUserMedia(mediaRequirements, startMicrophone, printError);

}).call(this);
