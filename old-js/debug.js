
var DEFAULT = false;

var debugElementIds = ["meta-detected-frequency", "meta-note", "meta-cents-out"];

var setDebug = function(mode) {
	if (mode) {
		debugOn();
	} else {
		debugOff();
	}
}

var debugOn = function() {
	for (var i = 0; i < debugElementIds.length; i++) {
		$("#" + debugElementIds[i]).removeClass("hidden");
	}
}

var debugOff = function() {
	for (var i = 0; i < debugElementIds.length; i++) {
		$("#" + debugElementIds[i]).addClass("hidden");
	}
}

setDebug(DEFAULT);
