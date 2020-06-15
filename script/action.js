/*
    file  : action.js (CODi)
    autor : 정재균 (jgiraffe@naver.com)
    breif : javascript for html elements
*/

function mainToConnect() {
    $(".main").css("display", "none");
    $(".connect").css("display", "block");
    $(".edit").css("display", "none");
}

function connectToEditor() {
    $(".main").css("display", "none");
    $(".connect").css("display", "none");
    $(".edit").css("display", "block");
    editor.refresh();
}

function roomIDCheck() {
    const num = $('.input').val();
    if (num && num >= 0 && num <= 9999) {
        return true;
    }
    else {
        alert("CODi에는 0번방부터 9999번 방 까지만 존재합니다.");
    }
}