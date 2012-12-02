//キーイベント
var selfEvt;
var newTabEvt;
var newWindowEvt;
var keyProp = {
	8: "backspace",
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
var defTabCommand = {
	meta: ["alt"]
};
var defWindowCommand = {
	meta: ["shift"]
};

// 初期化
chrome.extension.getBackgroundPage().getBookmarkTree(function(tree){
	renderBookmark(".bookmark", tree, {});
	initSettingForm();
	initBookmarkForm();
	initEnterEvent();
});

function initSettingForm(){
	initKeyCommandForm();
	initNewTabCommandForm();
	initNewWindowCommandForm();
}
function initKeyCommandForm(){
	var defCommand = {
		meta: ["ctrl"],
		key: "space"
	};
	var showCommand = getKeyCommand();
	if(!showCommand){
		showCommand = defCommand;
	}

	var command = "";
	var metaList = showCommand.meta
	for(var i in metaList){
		command += metaList[i] + " + ";
	}
	var key = showCommand.key;
	if(key){
		command += key;
	}
	$(".keyCommand").val(command);
}
function initNewTabCommandForm(){
	var newTabCommand = getNewTabCommand();
	if(!newTabCommand){
		newTabCommand = defTabCommand;
	}

	var command = "";
	var metaList = newTabCommand.meta
	for(var i in metaList){
		command += metaList[i] + " + ";
	}
	$(".newTabCommand").val(command);
}
function initNewWindowCommandForm(){
	var newWindowCommand = getNewWindowCommand();
	if(!newWindowCommand){
		newWindowCommand = defWindowCommand;
	}

	var command = "";
	var metaList = newWindowCommand.meta
	for(var i in metaList){
		command += metaList[i] + " + ";
	}
	$(".newWindowCommand").val(command);
}


// bind key command
$(document).on("keydown", ".keyCommand", function(){
	var command = [];
	var meta = [];
	if(event.altKey){
		command.push("alt");
		meta.push("alt");
	} 
	if(event.ctrlKey){
		command.push("ctrl");
		meta.push("ctrl");
	}
	if(event.metaKey){
		command.push("command");
		meta.push("command");
	}
	if(event.shiftKey){
		command.push("shift");
		meta.push("shift");
	}

	var keyCode = event.keyCode;
	var key = keyProp[keyCode];
	if(!key){
		key = String.fromCharCode(keyCode).toLowerCase();
	}
	if(key.match(/\w+/)){
		command.push(key);
	}
	// command += key;
	$(this).val(command.join(" + "));
	
	setKeyCommand({
		meta: meta,
		key: key
	});
	event.preventDefault();
	return false;
});
$(document).on("keydown", ".newTabCommand, .newWindowCommand", function(event){
	var command = "";
	var meta = [];
	if(event.altKey){
		command += "alt + ";
		meta.push("alt");
	} 
	if(event.ctrlKey){
		command += "ctrl + ";
		meta.push("ctrl");
	}
	if(event.metaKey){
		command += "command + ";
		meta.push("command");
	}
	if(event.shiftKey){
		command += "shift + ";
		meta.push("shift");
	}
	if(meta.length){
		var $this = $(this);
		$this.val(command);

		if($this.hasClass("newTabCommand")){
			setNewTabCommand({meta: meta});
		}else{
			setNewWindowCommand({meta: meta});
		}
		initEnterEvent();
	}

	event.preventDefault();
	return false;
});
$(document).on("keyup", ".keyCommand, .newTabCommand, .newWindowCommand", function(){
	notifyChangeCommand();
	event.preventDefault();
	return false;
});
$(document).on("click", ".bm-link", function(){
	var href = $(this).attr("href");
	openSelfPage(href);
});

// イベント初期化
function initEnterEvent(){
	//アンバインド
	if(selfEvt) selfEvt.unbind();
	if(newTabEvt) newTabEvt.unbind();
	if(newWindowEvt) newWindowEvt.unbind();

	//ページ遷移　キー操作をバインド
	selfEvt = KeyControl(window, "keydown", [], "enter", function(event){
		var $tgt = $(".bm-focus", ".bm-view");
		if($tgt.size()){
			var href = $tgt.children(".bm-link")[0].href;
			chrome.tabs.create({
				url: href
			});
		}
	});
	var newTabCmd = getNewTabCommand();
	var newTabMeta;
	if(newTabCmd){
		newTabMeta = newTabCmd.meta;
	}else{
		newTabMeta = defTabCommand;
	}
	newTabEvt = KeyControl(window, "keydown", newTabMeta, "enter", function(event){
		var $tgt = $(".bm-focus", ".bm-view");
		if($tgt.size()){
			var href = $tgt.children(".bm-link")[0].href;
			chrome.tabs.create({
				url: href
			});
		}
	});
	var newWinCmd = getNewWindowCommand();
	var newWinMeta;
	if(newWinCmd){
		newWinMeta = newWinCmd.meta;
	}else{
		newWinMeta = defWindowCommand;
	}
	newWindowEvt = KeyControl(window, "keydown", newWinMeta, "enter", function(event){
		var $tgt = $(".bm-focus", ".bm-view");
		if($tgt.size()){
			var href = $tgt.children(".bm-link")[0].href;
			chrome.windows.create({
				url: href
			});
		}
	});
}
//設定
$(".settingBtn").click(function(){
	var $setting = $(".setting");
	if($setting.is(":hidden")){
		$setting.slideDown(100);
	}else{
		$setting.slideUp(100);
	}
});
$(".settingCloseBtn").click(function(){
	var $setting = $(".setting");
	if($setting.is(":visible")){
		$setting.slideUp(100);
	}
});

function getKeyCommand(){
	return chrome.extension.getBackgroundPage().getKeyCommand();
}
function setKeyCommand(keys){
	chrome.extension.getBackgroundPage().setKeyCommand(keys);
}
function getNewTabCommand(){
	return chrome.extension.getBackgroundPage().getNewTabCommand();
}
function setNewTabCommand(keys){
	chrome.extension.getBackgroundPage().setNewTabCommand(keys);
}
function getNewWindowCommand(){
	return chrome.extension.getBackgroundPage().getNewWindowCommand();
}
function setNewWindowCommand(keys){
	chrome.extension.getBackgroundPage().setNewWindowCommand(keys);
}
function notifyChangeCommand(){
	chrome.extension.getBackgroundPage().notifyChangeCommand();
}
function openSelfPage(url){
	chrome.extension.getBackgroundPage().openSelfPage(url);
}