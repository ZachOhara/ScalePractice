// Generated by CoffeeScript 1.12.7
(function() {
  var CLEARANCE, FILL_COLOR, MAX_DEGREES, NEEDLE_BASE_RATIO, NEEDLE_COLOR, NEEDLE_DEGREES_PER_CENT, NEEDLE_LENGTH_RATIO, NEEDLE_WIDTH, OUTLINE_COLOR, OUTLINE_WIDTH, PORTRAIT_WIDTH, canvas, context, drawNeedle, drawTuner, getClearanceToSection, pointDistance, previousCents, resizeTuner, updateNeedle;

  PORTRAIT_WIDTH = 0.9;

  CLEARANCE = 0.95;

  canvas = $("#tuner-canvas");

  context = document.getElementById("tuner-canvas").getContext("2d");

  resizeTuner = function() {
    var availableHeight, availableWidth, displayCenterX, displayCenterY, droneClearance, height, keyClearance, metronomeClearance, portraitMaxHeight, width;
    availableWidth = $(window).width();
    availableHeight = $(window).height() - $("#control-section-table").height() - $("#tuner-option-section").height();
    displayCenterX = $(window).width() / 2;
    displayCenterY = $(window).height() - $("#tuner-option-section").height();
    portraitMaxHeight = PORTRAIT_WIDTH * availableWidth / 2;
    droneClearance = CLEARANCE * getClearanceToSection("drone", displayCenterX, displayCenterY);
    keyClearance = CLEARANCE * getClearanceToSection("key", displayCenterX, displayCenterY);
    metronomeClearance = CLEARANCE * getClearanceToSection("metronome", displayCenterX, displayCenterY);
    height = Math.min(portraitMaxHeight, droneClearance, keyClearance, metronomeClearance);
    width = height * 2;
    if (height > availableHeight) {
      canvas.css("margin-top", availableHeight - height);
    }
    canvas.attr("width", width);
    canvas.attr("height", height);
    return drawTuner();
  };

  getClearanceToSection = function(name, centerX, centerY) {
    var leftCornerDistance, leftCornerX, middleEdgeDistance, middleX, rightCornerDistance, rightCornerX, section, sectionY;
    section = $(".control-section." + name + " table tbody");
    leftCornerX = section.position().left;
    middleX = leftCornerX + (section.outerWidth() / 2);
    rightCornerX = leftCornerX + section.outerWidth();
    sectionY = section.position().top + section.outerHeight();
    leftCornerDistance = pointDistance(centerX, centerY, leftCornerX, sectionY);
    middleEdgeDistance = pointDistance(centerX, centerY, middleX, sectionY);
    rightCornerDistance = pointDistance(centerX, centerY, rightCornerX, sectionY);
    return Math.min(leftCornerDistance, middleEdgeDistance, rightCornerDistance);
  };

  pointDistance = function(x0, y0, x1, y1) {
    return Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
  };

  FILL_COLOR = "#80CBC4";

  OUTLINE_COLOR = "#00251a";

  OUTLINE_WIDTH = 4;

  drawTuner = function() {
    var height, lineBuffer, width;
    context.clearRect(0, 0, canvas.width(), canvas.height());
    context.fillStyle = FILL_COLOR;
    context.strokeStyle = OUTLINE_COLOR;
    context.lineWidth = OUTLINE_WIDTH;
    lineBuffer = OUTLINE_WIDTH / 2;
    width = canvas.width() - lineBuffer;
    height = canvas.height() - lineBuffer;
    context.beginPath();
    context.moveTo(lineBuffer, height);
    context.lineTo(width - lineBuffer, height);
    context.stroke();
    context.arc(canvas.width() / 2, canvas.height(), height, 0, Math.PI, true);
    context.fill();
    return context.stroke();
  };

  NEEDLE_COLOR = "#00251a";

  NEEDLE_WIDTH = 2;

  NEEDLE_LENGTH_RATIO = 0.9;

  NEEDLE_BASE_RATIO = 0.4;

  NEEDLE_DEGREES_PER_CENT = 0.9;

  MAX_DEGREES = 80;

  previousCents = 0;

  updateNeedle = function(cents) {
    var degrees, previousDegrees;
    context.strokeStyle = FILL_COLOR;
    context.lineWidth = NEEDLE_WIDTH + 2;
    previousDegrees = previousCents * NEEDLE_DEGREES_PER_CENT;
    drawNeedle(previousDegrees, true);
    context.strokeStyle = NEEDLE_COLOR;
    context.lineWidth = NEEDLE_WIDTH;
    degrees = cents * NEEDLE_DEGREES_PER_CENT;
    drawNeedle(degrees, false);
    return previousCents = cents;
  };

  drawNeedle = function(degrees, covering) {
    var baseRadius, baseX, baseY, height, pointRadius, pointX, pointY, radians;
    degrees = Math.min(degrees, MAX_DEGREES);
    degrees = Math.max(degrees, -MAX_DEGREES);
    baseRadius = canvas.height() * NEEDLE_BASE_RATIO;
    pointRadius = canvas.height() * NEEDLE_LENGTH_RATIO;
    if (covering) {
      baseRadius -= 1;
      pointRadius += 1;
    }
    radians = degrees * Math.PI / 180;
    baseX = baseRadius * Math.sin(radians);
    baseY = baseRadius * Math.cos(radians);
    pointX = pointRadius * Math.sin(radians);
    pointY = pointRadius * Math.cos(radians);
    baseX += canvas.width() / 2;
    pointX += canvas.width() / 2;
    height = canvas.height() - (OUTLINE_WIDTH / 2);
    baseY = height - baseY;
    pointY = height - pointY;
    context.beginPath();
    context.moveTo(baseX, baseY);
    context.lineTo(pointX, pointY);
    return context.stroke();
  };

  $("#meta-cents-out").change(function() {
    return updateNeedle($(this).val());
  });

  $(window).resize(resizeTuner);

  resizeTuner();

}).call(this);