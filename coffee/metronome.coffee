
METRONOME_INCREMENT = 5 # bpm

metronomeIsOn = false

metSpeedField = $("#metronome-bpm")

$("#metronome-toggle-button").click(->
	if metronomeIsOn
		stopMetronome()
		$(this).text("Start")
	else
		startMetronome()
		$(this).text("Stop")
	
)

$("#metronome-up-button").click(->
	metSpeedField.val(parseInt(metSpeedField.val()) + METRONOME_INCREMENT)
)

$("#metronome-down-button").click(->
	metSpeedField.val(parseInt(metSpeedField.val()) - METRONOME_INCREMENT)
)

startMetronome = ->
	console.log("starting met")
	metronomeIsOn = true

stopMetronome = ->
	console.log("stopping met")
	metronomeIsOn = false
