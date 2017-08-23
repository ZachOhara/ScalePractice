
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

nodes = {
	micSource: null,
	fourier: null,
	catcher: null,
}

catchFourierResults = ->
	array = new Uint8Array(nodes.fourier.frequencyBinCount)
	nodes.fourier.getByteFrequencyData(array)
	nonZeroCount = 0
	for i in array
		nonZeroCount += 1 if not i == 0
	max = Math.max(array...)
	maxIndex = array.indexOf(max)
	frequency = calculateFrequency(maxIndex)
	$("#meta-detected-frequency").val(frequency)
	$("#meta-detected-frequency").change()
	return null

calculateFrequency = (fftBucketIndex) ->
	# fftBucketIndex will be in [0, FFT_OUTPUT_SIZE - 1]
	nyquistFreq = audioContext.sampleRate # if you divide by 2 here (like you should) it's an 8ve too low
	bucketStep = nyquistFreq / FFT_OUTPUT_SIZE
	estFreq = bucketStep * (fftBucketIndex + 0.5)
	#console.log nyquistFreq, bucketStep, estFreq
	console.log(estFreq)
	return estFreq

startMicrophone = (stream) ->
	# build the source node
	# browser will block here until user grants microphone permission
	nodes.micSource = audioContext.createMediaStreamSource(stream)

	# build the fft analysis node
	nodes.fourier = audioContext.createAnalyser()
	nodes.fourier.smoothingTimeConstant = 0
	nodes.fourier.fftSize = FFT_OUTPUT_SIZE

	# build the results node, which catches results of the FFT
	nodes.catcher = audioContext.createScriptProcessor(BUFFER_SIZE, 1, 1)
	nodes.catcher.onaudioprocess = catchFourierResults

	# connect 'em up
	nodes.micSource.connect(nodes.fourier)
	nodes.fourier.connect(nodes.catcher)
	nodes.catcher.connect(audioContext.destination)

	# The results node does not output any audio, so the connection
	# to context.destination is fine. An eventual connection to the
	# destination is required for any sound data to flow through the chain.

	return null

printError = (msg) ->
	console.log("Error while starting audio: \n#{msg}")

mediaRequirements = {
	audio: true
}

navigator.getUserMedia(mediaRequirements, startMicrophone, printError)
