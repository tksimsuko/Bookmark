chrome.extension.getBackgroundPage().getBookmarkTree(function(tree){
	renderBookmark(".bookmark", tree, {});
	initBookmarkForm();
});

var keyProp = {
	46: "delete",
	13: "enter",
	27: "esc",
	9: "tab",
	32: "space",
	37: "left",
	38: "up",
	39: "right",
	40: "down"
};
$(document).on("keydown", ".commandKeyInput", function(){
console.dir(event);
	var command = "";
	if(event.altKey) command += "alt + ";
	if(event.ctrlKey) command += "ctrl + ";
	if(event.metaKey) command += "command + "
	if(event.shiftKey) command += "shift + ";

	var keyCode = event.keyCode;
	var key = keyProp[keyCode];
	if(!key){
		key = String.fromCharCode(keyCode).toLowerCase();
	}
	command += key;

	$(this).val(command);
	event.preventDefault();
	return false;
});
$(document).on("keyup", ".commandKeyInput", function(){
	return false;
})
$(document).on("keyup", ".commandKeyInput", function(){
	event.preventDefault();
	return false;
});

$(document).on("click", ".bm-link", function(){
	//カレントウィンドウ　カレントタブに対してメッセージを送る
	// status openPage
	// url
	// 
});