
var {ipcRenderer, remote} = require('electron');  
var dialog = remote.dialog;
var main = remote.require("./main.js");
var edge = require('electron-edge-js');
const
        Conf = require('conf'),
        config = new Conf()

document.getElementById('openFile').addEventListener('click',function() {

	//ipcRenderer.send('async', 1);
	dialog.showOpenDialog(function (fileNames) {
		if (fileNames === undefined) return;
	 	var fileName = fileNames[0];

		var decompileFn = edge.func({
		     assemblyFile: 'ilspy/bin/Debug/netstandard2.0/ilspylib.dll',
		     typeName: 'ILSpy.Decompiler',
		     methodName: "Decompile"
		});

		decompileFn(fileName, function (error, result) {
	    	if (error) throw error;
	    	$("#codeView").html(result);
	    	$("#codeArea").show();
   			hljs.highlightBlock($("#codeView")[0]);
		});
  	}); 
}, false);

$('#cfgTheme').on('change', function () {
	var name = $(this).val();
	config.set('theme', name);
	enableTheme(name);
});

$('#cfgDebug').on('change', function () {
	var debug = $('#cfgDebug').is(':checked') ? true : false;
	config.set('debug', debug);
	main.showDevTools(debug);
});

$("link[title]").each(function(i, item) {
	$("#cfgTheme").append("<option>" + item.title + "</option>")
});

// load cfg
$('#cfgDebug').prop('checked', config.get('debug'));
$('#cfgTheme').val(config.get('theme'));
enableTheme(config.get('theme'));

function enableTheme(name) {
	$("link[title]").each(function(i, item) {
    	item.disabled = item.title !== name;
    });
}