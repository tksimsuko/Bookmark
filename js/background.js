var trees;
getTree();

//イベント
chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse){
		if(!request) return;

		var status = request.status;
		switch(status){
			case "getTree":
				sendResponse(trees);
				break;
			default :
				sendResponse();
				break;
		}
});
chrome.bookmarks.onRemoved.addListener(function(id, info){
	getTree();
});
chrome.bookmarks.onImportEnded.addListener(function(){
	getTree();
});
chrome.bookmarks.onMoved.addListener(function(id, info){
	getTree();
});
chrome.bookmarks.onCreated.addListener(function(id, node){
	getTree();
});
chrome.bookmarks.onChanged.addListener(function(id, info){
	getTree();
});
chrome.bookmarks.onChildrenReordered.addListener(function(id, info){
	getTree();
});

function getTree(){
	chrome.bookmarks.getTree(function(tree){
		trees = tree;
	});
}

//bookmark tree操作
function isFolder(node){
	return !node.url;
}

//utility
function getOrigin(url){
	var urlAry = url.replace(/:\//, "").split(/\//);
	var scheme = urlAry[0];
	var host_port = urlAry[1];
	return scheme + "://" + host_port;
}