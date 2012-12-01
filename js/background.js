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
