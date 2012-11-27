
chrome.extension.getBackgroundPage().getBookmarkTree(function(tree){
	renderBookmark(".bookmark", tree);
	initBookmarkForm();
});