
PORTRAIT_WIDTH = 0.9 # fraction of the available width (usually the width of the window)
CLEARANCE = 0.95 # fraction of the distance that should be used between the other gui elements

canvas = $("#tuner-canvas")
context = document.getElementById("tuner-canvas").getContext("2d")

resizeTuner = ->
	availableWidth = $(window).width()
	availableHeight = $(window).height() - $("#control-section-table").height() - $("#tuner-option-section").height()

	displayCenterX = $(window).width() / 2
	displayCenterY = $(window).height() - $("#tuner-option-section").height()

	portraitMaxHeight = PORTRAIT_WIDTH * availableWidth / 2

	droneClearance = CLEARANCE * getClearanceToSection("drone", displayCenterX, displayCenterY)
	keyClearance = CLEARANCE * getClearanceToSection("key", displayCenterX, displayCenterY)
	metronomeClearance = CLEARANCE * getClearanceToSection("metronome", displayCenterX, displayCenterY)

	height = Math.min(portraitMaxHeight, droneClearance, keyClearance, metronomeClearance)
	width = height * 2

	if height > availableHeight
		canvas.css("margin-top", availableHeight - height)

	canvas.attr("width", width)
	canvas.attr("height", height)

	drawTuner()

getClearanceToSection = (name, centerX, centerY) ->
	section = $(".control-section." + name + " table tbody")
	leftCornerX = section.position().left
	middleX = leftCornerX + (section.outerWidth() / 2)
	rightCornerX = leftCornerX + section.outerWidth()
	sectionY = section.position().top + section.outerHeight()
	# y coords will be the same for the three points, so only store one value

	leftCornerDistance = pointDistance(centerX, centerY, leftCornerX, sectionY)
	middleEdgeDistance = pointDistance(centerX, centerY, middleX, sectionY)
	rightCornerDistance = pointDistance(centerX, centerY, rightCornerX, sectionY)
	return Math.min(leftCornerDistance, middleEdgeDistance, rightCornerDistance)

pointDistance = (x0, y0, x1, y1) ->
	return Math.sqrt(Math.pow(x1-x0, 2) + Math.pow(y1-y0, 2))

FILL_COLOR = "#80CBC4" # teal 200
OUTLINE_COLOR = "#00251a" # teal 900 dark
OUTLINE_WIDTH = 4 # must be even or you get some small-but-weird artifacts

drawTuner = ->
	context.clearRect(0, 0, canvas.width(), canvas.height())

	context.fillStyle = FILL_COLOR
	context.strokeStyle = OUTLINE_COLOR
	context.lineWidth = OUTLINE_WIDTH
	
	lineBuffer = OUTLINE_WIDTH / 2 # for one side
	width = canvas.width() - lineBuffer
	height = canvas.height() - lineBuffer

	context.beginPath()
	context.moveTo(lineBuffer, height)
	context.lineTo(width - lineBuffer, height)
	context.stroke()

	context.arc(canvas.width() / 2, canvas.height(), height, 0, Math.PI, true)
	context.fill()
	context.stroke()

NEEDLE_COLOR = "#00251a" # teal 900 dark, same as outline color
NEEDLE_WIDTH = 2

NEEDLE_LENGTH_RATIO = 0.9 # a fraction of the radius of the display
NEEDLE_BASE_RATIO = 0.4 # a fraction of the radius of the display

NEEDLE_DEGREES_PER_CENT = 0.9

MAX_DEGREES = 80 # anything beyond this will not be rendered

previousCents = 0

updateNeedle = (cents) ->
	# first cover up the old needle
	context.strokeStyle = FILL_COLOR
	context.lineWidth = NEEDLE_WIDTH + 2
	previousDegrees = previousCents * NEEDLE_DEGREES_PER_CENT
	drawNeedle(previousDegrees, true)

	# redraw in the correct position
	context.strokeStyle = NEEDLE_COLOR
	context.lineWidth = NEEDLE_WIDTH
	degrees = cents * NEEDLE_DEGREES_PER_CENT
	drawNeedle(degrees, false)

	# update
	previousCents = cents

drawNeedle = (degrees, covering) ->
	degrees = Math.min(degrees, MAX_DEGREES)
	degrees = Math.max(degrees, -MAX_DEGREES)

	# degress is measured clockwise from center, can be negative
	baseRadius = canvas.height() * NEEDLE_BASE_RATIO
	pointRadius = canvas.height() * NEEDLE_LENGTH_RATIO
	if covering
		baseRadius -= 1
		pointRadius += 1

	radians = degrees * Math.PI / 180

	baseX = baseRadius * Math.sin(radians)
	baseY = baseRadius * Math.cos(radians)

	pointX = pointRadius * Math.sin(radians)
	pointY = pointRadius * Math.cos(radians)

	# translate the coords from the center of the display to the absolute canvas
	baseX += canvas.width() / 2
	pointX += canvas.width() / 2

	height = canvas.height() - (OUTLINE_WIDTH / 2)
	baseY = height - baseY
	pointY = height - pointY

	# actually do the thing
	context.beginPath()
	context.moveTo(baseX, baseY)
	context.lineTo(pointX, pointY)
	context.stroke()

$("#meta-cents-out").change(->
	updateNeedle($(this).val())
)

$(window).resize(resizeTuner)

resizeTuner()
