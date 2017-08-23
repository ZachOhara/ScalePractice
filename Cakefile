
{exec} = require "child_process"

sourceFolder = "coffee";
outputFolder = "js-autogen";

task "build", "Build mic-interface.coffee", ->
	exec "coffee --compile --output #{outputFolder} #{sourceFolder}", (err, stdout, stderr) ->
		throw err if err
		console.log stdout + stderr
