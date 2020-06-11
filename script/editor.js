/*
    file  : editor.js (CODi)
    autor : 정재균 (jgiraffe@naver.com)
    breif : editor socket evenet
*/
const editor = document.querySelector('#editor');

editor.addEventListener('keyup', function() {
  const text = editor.value;
  socket.emit('editortext', text);
});

socket.on('editortext', function(text) {
    editor.value = text;
});