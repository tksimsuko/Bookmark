//デフォルト　キーコマンド
var defCommand = {
	meta: ["ctrl"],
	key: "space"
};
var defTabCommand = {
	meta: ["alt"]
};
var defWindowCommand = {
	meta: ["shift"]
};

var bookmarkTrees;
setBookmarkTree();

//イベント
chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse){
		if(!request){
			sendResponse();
			return;
		}

		var status = request.status;
		switch(status){
			case "getBookmarkTree":
				sendResponse(bookmarkTrees);
				break;
			case "getKeyCommand":
				sendResponse({
					keyCommand: getKeyCommand(),
					newTabCommand: getNewTabCommand(),
					newWindowCommand: getNewWindowCommand()
				});
				break;
			case "openNewWindow":
				chrome.windows.create({
					url: request.url
				});
				break;
			default :
				sendResponse();
				break;
		}
});
chrome.bookmarks.onRemoved.addListener(function(id, info){
	setBookmarkTree();
});
chrome.bookmarks.onImportEnded.addListener(function(){
	setBookmarkTree();
});
chrome.bookmarks.onMoved.addListener(function(id, info){
	setBookmarkTree();
});
chrome.bookmarks.onCreated.addListener(function(id, node){
	setBookmarkTree();
});
chrome.bookmarks.onChanged.addListener(function(id, info){
	setBookmarkTree();
});
chrome.bookmarks.onChildrenReordered.addListener(function(id, info){
	setBookmarkTree();
});

function setBookmarkTree(){
	chrome.bookmarks.getTree(function(tree){
		bookmarkTrees = tree;
	});
}
function getBookmarkTree(callback){
	chrome.bookmarks.getTree(function(tree){
		callback(tree);
	});
}
function getKeyCommand(){
	var cmd = JSON.parse(window.localStorage.getItem("keyCommand"));
	if(!cmd) cmd = defCommand;
	return cmd;
}
function setKeyCommand(keys){
	window.localStorage.setItem("keyCommand", JSON.stringify(keys));
}
function getNewTabCommand(){
	var cmd = JSON.parse(window.localStorage.getItem("newTabCommand"));
	if(!cmd) cmd = defTabCommand;
	return cmd;
}
function setNewTabCommand(keys){
	window.localStorage.setItem("newTabCommand", JSON.stringify(keys));
}
function getNewWindowCommand(){
	var cmd = JSON.parse(window.localStorage.getItem("newWindowCommand"));
	if(!cmd) cmd = defWindowCommand
	return cmd;
}
function setNewWindowCommand(keys){
	window.localStorage.setItem("newWindowCommand", JSON.stringify(keys));
}
function notifyChangeCommand(){
	chrome.windows.getAll({populate: true}, function(windows){
		for(var i in windows){
			var win = windows[i];
			var tabs = win.tabs;
			for(var j in tabs){
				var tab = tabs[j];
				chrome.tabs.sendMessage(tab.id, {
					status: "changeCommand",
					keyCommand: getKeyCommand(),
					newTabCommand: getNewTabCommand(),
					newWindowCommand: getNewWindowCommand()
				}, function(){});
			}
		}
	});
}
function openSelfPage(url){
	chrome.tabs.getSelected(null, function(tab){
		chrome.tabs.sendMessage(tab.id, {
			status: "openSelfPage",
			url: url
		}, function(){});
	});
}