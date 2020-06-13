window.onload = function(){
	var editor = CodeMirror(document.getElementById("codeeditor"), {
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
};

function show_hide(){
	var click = document.getElementById('drop-content');
	if(click.style.display === "block"){
		click.style.display = "none";
	}else{
		click.style.display = "block";
	}
}

function click_code(click_id){
	var list = document.getElementById('drop-content');
	var editor = document.querySelector('.CodeMirror').CodeMirror;
	if(list.style.display === "block"){
		list.style.display = "none";
		document.all('button').innerHTML=click_id;
	}
	switch(click_id){
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
	editor.refresh();
}

function font_change(font_size){
	var editor = document.querySelector('.CodeMirror').CodeMirror;
	editor.getWrapperElement().style["font-size"]=font_size + "px";
	editor.refresh();
}

function test(){
	var editor = document.querySelector('.CodeMirror').CodeMirror;
	var editBtn = document.getElementById('select_mode');
	if(!editor.isReadOnly()){
		editor.setOption("readOnly", "nocursor");
		editBtn.innerHTML = 'Reading';
		editBtn.style.backgroundColor = '#4CAF50';
	} else {
		editor.setOption("readOnly", false);
		editBtn.innerHTML = 'Editing';
		editBtn.style.backgroundColor = '#F96';
	}
}