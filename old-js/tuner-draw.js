
var PORTRAIT_WIDTH = 0.9; // fraction of the available width (usually the width of the window)
var CLEARANCE = 0.95;

var canvas = $("#tuner-canvas");
var context = document.getElementById("tuner-canvas").getContext("2d");

var resizeTuner = function() {
	var availableWidth = $(window).width();
	var availableHeight = $(window).height() - $("#control-section-table").height() - $("#tuner-option-section").height();

	var displayCenterX = $(window).width() / 2;
	var displayCenterY = $(window).height() - $("#tuner-option-section").height();

	var portraitMaxHeight = PORTRAIT_WIDTH * availableWidth / 2;

	var droneClearance = CLEARANCE * getClearanceToSection("drone", displayCenterX, displayCenterY);
	var keyClearance = CLEARANCE * getClearanceToSection("key", displayCenterX, displayCenterY);
	var metronomeClearance = CLEARANCE * getClearanceToSection("metronome", displayCenterX, displayCenterY);

	var height = Math.min(portraitMaxHeight, droneClearance, keyClearance, metronomeClearance);
	var width = height * 2;

	if (height > availableHeight) {
		canvas.css("margin-top", availableHeight - height);
	}

	canvas.attr("width", width);
	canvas.attr("height", height);

	drawTuner();
}

var getClearanceToSection = function(name, centerX, centerY) {
	var section = $(".control-section." + name + " table tbody");
	var leftCornerX = section.position().left;
	var middleX = leftCornerX + (section.outerWidth() / 2);
	var rightCornerX = leftCornerX + section.outerWidth();
	var sectionY = section.position().top + section.outerHeight();
	// y coords will be the same for the three points, so only store one value

	var leftCornerDistance = pointDistance(centerX, centerY, leftCornerX, sectionY);
	var middleEdgeDistance = pointDistance(centerX, centerY, middleX, sectionY);
	var rightCornerDistance = pointDistance(centerX, centerY, rightCornerX, sectionY);
	return Math.min(leftCornerDistance, middleEdgeDistance, rightCornerDistance);
}

var pointDistance = function(x0, y0, x1, y1) {
	return Math.sqrt(Math.pow(x1-x0, 2) + Math.pow(y1-y0, 2));
}

var FILL_COLOR = "#80CBC4" // teal 200
var OUTLINE_COLOR = "#00251a"; // teal 900 dark
var OUTLINE_WIDTH = 4; // must be even or you get some small-but-weird artifacts

var drawTuner = function() {
	context.clearRect(0, 0, canvas.width(), canvas.height());

	context.fillStyle = FILL_COLOR
	context.strokeStyle = OUTLINE_COLOR;
	context.lineWidth = OUTLINE_WIDTH;
	
	var lineBuffer = OUTLINE_WIDTH / 2; // for one side
	var width = canvas.width() - lineBuffer;
	var height = canvas.height() - lineBuffer;

	context.beginPath();
	context.moveTo(lineBuffer, height);
	context.lineTo(width - lineBuffer, height);
	context.stroke();

	context.arc(canvas.width() / 2, canvas.height(), height, 0, Math.PI, true);
	context.fill();
	context.stroke();
}

var NEEDLE_COLOR = "#00251a"; // teal 900 dark, same as outline color
var NEEDLE_WIDTH = 2;

var NEEDLE_LENGTH_RATIO = 0.9; // a fraction of the radius of the display
var NEEDLE_BASE_RATIO = 0.4; // a fraction of the radius of the display

var NEEDLE_DEGREES_PER_CENT = 0.9;

var MAX_DEGREES = 80; // anything beyond this will not be rendered

var previousCents = 0;

var updateNeedle = function(cents) {
	// first cover up the old needle
	context.strokeStyle = FILL_COLOR;
	context.lineWidth = NEEDLE_WIDTH + 2;
	var previousDegrees = previousCents * NEEDLE_DEGREES_PER_CENT;
	drawNeedle(previousDegrees, true);

	// redraw in the correct position
	context.strokeStyle = NEEDLE_COLOR;
	context.lineWidth = NEEDLE_WIDTH;
	var degrees = cents * NEEDLE_DEGREES_PER_CENT;
	drawNeedle(degrees, false);

	// update
	previousCents = cents;
}

var drawNeedle = function(degrees, covering) {
	degrees = Math.min(degrees, MAX_DEGREES);
	degrees = Math.max(degrees, -MAX_DEGREES);

	// degress is measured clockwise from center, can be negative
	var baseRadius = canvas.height() * NEEDLE_BASE_RATIO;
	var pointRadius = canvas.height() * NEEDLE_LENGTH_RATIO;
	if (covering) {
		baseRadius -= 1;
		pointRadius += 1;
	}

	var radians = degrees * Math.PI / 180;

	var baseX = baseRadius * Math.sin(radians);
	var baseY = baseRadius * Math.cos(radians);

	var pointX = pointRadius * Math.sin(radians);
	var pointY = pointRadius * Math.cos(radians);

	// translate the coords from the center of the display to the absolute canvas
	baseX += canvas.width() / 2;
	pointX += canvas.width() / 2;

	var height = canvas.height() - (OUTLINE_WIDTH / 2);
	baseY = height - baseY;
	pointY = height - pointY;

	// actually do the thing
	context.beginPath();
	context.moveTo(baseX, baseY);
	context.lineTo(pointX, pointY);
	context.stroke();
}

$("#meta-cents-out").change(function() {
	updateNeedle($(this).val());
});

$(window).resize(resizeTuner);

resizeTuner();
