// background.js (service_worker)

// イベントリスナー
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (!request || !request.status) {
		sendResponse();
		return;
	}

	switch (request.status) {
		case "getBookmarkTree":
			chrome.bookmarks.getTree((tree) => {
				sendResponse(tree);
			});
			return true; // 非同期応答を維持
		default:
			sendResponse();
			break;
	}
});