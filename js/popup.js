// 初期化
chrome.runtime.sendMessage({ status: "getBookmarkTree" }, function (tree) {
	if (!tree) return;

	renderBookmark(".bookmark", tree, {
		isCloseBtn: false,
		isFavicon: true
	});

	initBookmarkForm();
});


//クリック　ページ遷移　イベント
$(document).on("click", ".bm-link", function (event) {
	var href = $(this).attr("href");

	if (event.shiftKey) {
		chrome.windows.create({
			url: href
		});
	} else {
		chrome.tabs.create({
			url: href
		});
	}
	event.preventDefault();
	return false;
});
KeyControl(window, "keydown", [], "enter", function (event) {
	var bm = $("." + focusCls);
	if (!bm.size()) return;

	var href = bm.children("a").attr("href");
	chrome.tabs.create({
		url: href
	});
});
KeyControl(window, "keydown", ["shift"], "enter", function (event) {
	var bm = $("." + focusCls);
	if (!bm.size()) return;

	var href = bm.children("a").attr("href");
	chrome.windows.create({
		url: href
	});
});