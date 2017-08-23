
DEFAULT = false;

debugElementIds = ["meta-detected-frequency", "meta-note", "meta-cents-out"]

window.setDebug = (mode) ->
	if mode
		debugOn()
	else
		debugOff()
	return null

window.debugOn = ->
	for i in [0...debugElementIds.length]
		$("#" + debugElementIds[i]).removeClass "hidden"
	return null

window.debugOff = ->
	for i in [0...debugElementIds.length]
		$("#" + debugElementIds[i]).addClass "hidden"
	return null

setDebug DEFAULT
