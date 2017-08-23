
METRONOME_INCREMENT = 5 # bpm

metSpeedField = $("#metronome-bpm")
click = new Audio("met_click.wav")

metronomeIsOn = false

$("#metronome-toggle-button").click(->
	if metronomeIsOn
		$(this).text("Start")
	else
		$(this).text("Stop")
	metronomeIsOn = !metronomeIsOn
	updateMetronome()
)

$("#metronome-up-button").click(->
	metSpeedField.val(parseInt(metSpeedField.val()) + METRONOME_INCREMENT)
	metSpeedField.change()
)

$("#metronome-down-button").click(->
	metSpeedField.val(parseInt(metSpeedField.val()) - METRONOME_INCREMENT)
	metSpeedField.change()
)

metSpeedField.change(->
	updateMetronome()
)

metLoop = null

updateMetronome = ->
	bpm = metSpeedField.val()
	clearInterval(metLoop)
	if metronomeIsOn
		playMetClick()
		metLoop = setInterval(playMetClick, 1000 * 60 / bpm)

playMetClick = ->
	click.play()
