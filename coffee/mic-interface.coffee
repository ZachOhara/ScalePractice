
# Embedded JS for multi-browser support

`
window.AudioContext = window.AudioContext ||
	window.webkitAudioContext ||
	window.mozAudioContext ||
	window.msAudioContext;

navigator.getUserMedia = navigator.getUserMedia ||
	navigator.webkitGetUserMedia ||
	navigator.mozGetUserMedia ||
	navigator.msGetUserMedia;
`

# Constants

BUFFER_SIZE = 1024 # max allowed is 2^14 (16384)
FFT_OUTPUT_SIZE = 32768 # 2^15, maximum allowed

# Code begins here

# construct the audio context for our app
audioContext = new AudioContext()

# audio nodes

micSourceNode = null
fftNode = null
resultsNode = null

getFourierResults = ->
	array = new Uint8Array(fftNode.frequencyBinCount)
	fftNode.getByteFrequencyData array
	nonZeroCount = 0;
	for i in [0...array.length]
		nonZeroCount += 1 if array[i] != 0
	max = Math.max(array...)
	maxIndex = array.indexOf(max)

	frequency = calculateFrequency maxIndex

	$("#meta-detected-frequency").val(frequency)
	$("#meta-detected-frequency").change()

calculateFrequency = (fftBucketIndex) ->
	# fftBucketIndex will be in [0, FFT_OUTPUT_SIZE - 1]
	nyquistFreq = audioContext.sampleRate / 2 # TODO in the original js, there is no division
	bucketStep = nyquistFreq / FFT_OUTPUT_SIZE
	estFreq = bucketStep * (fftBucketIndex + 0.5)
	#console.log nyquistFreq, bucketStep, estFreq
	return estFreq

startMicrophone = (stream) ->
	# build the source node
	# browser will block here until user grants microphone permission
	micSourceNode = audioContext.createMediaStreamSource stream

	# build the fft analysis node
	fftNode = audioContext.createAnalyser()
	fftNode.smoothingTimeConstant = 0
	fftNode.fftSize = FFT_OUTPUT_SIZE

	# build the results node, which catches results of the FFT
	resultsNode = audioContext.createScriptProcessor(BUFFER_SIZE, 1, 1)
	resultsNode.onaudioprocess = getFourierResults

	# connect 'em up
	micSourceNode.connect fftNode
	fftNode.connect resultsNode
	resultsNode.connect audioContext.destination

	# The results node does not output any audio, so the connection
	# to context.destination is fine. An eventual connection to the
	# destination is required for any sound data to flow through the chain.

	return 1


printError = (msg) ->
	console.log "Error while starting audio: \n#{msg}"

mediaRequirements = {
	audio: true
}

navigator.getUserMedia(mediaRequirements, startMicrophone, printError)
