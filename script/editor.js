/*
    file  : editor.js (CODi)
    autor : 정재균 (jgiraffe@naver.com), 정홍기
    breif : editor socket evenet
*/

let editor;

window.onload = function(){
	var edit = CodeMirror(document.getElementById("codeeditor"), {
		theme: "darcula",
		tabSize: 10,
		tabindex: 10,
		lineNumbers: true,
		autoCloseTags: true,
		autofocus: true,
		spellcheck: true,
		autocorrect: true,
		readOnly: false,
		extraKeys: {"Ctrl-Space": "autocomplete"}
	});
	editor = document.querySelector('.CodeMirror').CodeMirror;
	editor.on('keyup', editorKeyup);
};

function showHide() {
	var click = document.getElementById('drop-content');
	if (click.style.display === "block") {
		click.style.display = "none";
  } 
  else {
		click.style.display = "block";
	}
}

// socket emit
function editorKeyup() {
  const text = editor.getValue();
	socket.emit('editortext', text, roomID);
}

function fontChange(fontSize) {
	socket.emit('fontChange', fontSize, roomID);
}

function clickCode(clickID) {
	socket.emit('clickCode', clickID, roomID);
}

// socket on
socket.on('editortext', function(text) {
  editor.setValue(text);
});

socket.on('fontChange', function(fontSize) {
	document.getElementById('font_size').value = fontSize;
	editor.getWrapperElement().style["font-size"] = fontSize + "px";
	editor.refresh();
});

socket.on('clickCode', function(clickID) {
	var list = document.getElementById('drop-content');
	if (list.style.display === "block") {
		list.style.display = "none";
	}
	switch(clickID){
		case "C":
		editor.setOption("mode", "text/x-csrc");
		break;
		case "C++":
		editor.setOption("mode", "text/x-c++src");
		break;
		case "Java":
		editor.setOption("mode", "text/x-java");
		break;
		case "Python":
		editor.setOption("mode", "text/x-python");
		break;
	}
	document.getElementById('clickCodeButton').innerHTML = clickID;
	editor.refresh();
});