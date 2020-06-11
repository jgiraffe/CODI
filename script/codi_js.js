var editBtn = document.getElementById('select_mode');
var edit = document.querySelector('codeeditor');

var editor = CodeMirror(document.getElementById('codeeditor'), {
	theme: "bespin",
	tabSize: 10,
	tabindex: 10,
	lineNumbers: true,
	autoCloseTags: true,
	autofocus: true,
	spellcheck: true,
	autocorrect: true,
	extraKeys: {"Ctrl-Space": "autocomplete"}
});