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
}