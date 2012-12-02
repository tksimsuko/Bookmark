
//初期化
var keydownCommandEvt;
var keyPressCommandEvt;
var escCommandEvt;
var selfEvt;
var newTabEvt;
var newWindowEvt;

	sendRequest({status: "getKeyCommand"}, function(response){
		init(response);
	});
	
	function init(data){
		keyCommand = data.keyCommand;
		newTabCommand = data.newTabCommand;
		newWindowCommand = data.newWindowCommand;

	// イベント初期化
		//アンバインド
		if(keydownCommandEvt) keydownCommandEvt.unbind();
		if(keyPressCommandEvt) keyPressCommandEvt.unbind();
		if(escCommandEvt) escCommandEvt.unbind();
		if(selfEvt) selfEvt.unbind();
		if(newTabEvt) newTabEvt.unbind();
		if(newWindowEvt) newWindowEvt.unbind();

		//ウィンドウ操作　キー操作をバインド
		keydownCommandEvt = KeyControl(window, "keydown", keyCommand.meta, keyCommand.key, function(event){
			if($(".bm-view").size()){
				// 非表示
				$(".bm-view").remove();
			}else{
				//表示
				sendRequest({
					status: "getBookmarkTree"	
				}, function(bookmarkTrees){
					renderBookmark("body", bookmarkTrees, {isCloseBtn: true});
					initBookmarkPosition();
					initBookmarkForm();
				});
			}
		});
		keyPressCommandEvt = KeyControl(window, "keypress", keyCommand.meta, keyCommand.key, function(event){
			return false;
		});
		escCommandEvt = KeyControl(window, "keydown", [], "esc", function(event){
			removeBookmarkView();
		});
		selfEvt = KeyControl(window, "keydown", [], "enter", function(event){
			var $tgt = $(".bm-focus", ".bm-view");
			if($tgt.size()){
				var href = $tgt.children(".bm-link")[0].href;
				window.open(href, "_self");
			}
		});
		newTabEvt = KeyControl(window, "keydown", newTabCommand.meta, "enter", function(event){
			var $tgt = $(".bm-focus", ".bm-view");
			if($tgt.size()){
				var href = $tgt.children(".bm-link")[0].href;
				window.open(href, "_blank");
				removeBookmarkView();
			}
		});
		newWindowEvt = KeyControl(window, "keydown", newWindowCommand.meta, "enter", function(event){
			var $tgt = $(".bm-focus", ".bm-view");
			if($tgt.size()){
				var href = $tgt.children(".bm-link")[0].href;
				sendRequest({
					status: "openNewWindow",
					url: href
				}, function(){});
				removeBookmarkView();
			}
		});
	}

//通信
	//backgroundへりクエストを送る
	function sendRequest(sendData, callback){
	    chrome.extension.sendMessage(sendData, function(response) {
	        if(response){
	            if(callback) callback(response);
	        }
	    });
	}

	//backgroundからリクエストを受け取る
	chrome.extension.onMessage.addListener(
		function(request, sender, sendResponse){
			if(!request) sendResponse();
			var status = request.status;
			switch(status){
				case "changeCommand":
					init(request);
					break;
				case "openSelfPage":
					window.open(request.url, "_self")
					break;
				default:
					break;
			}
			sendResponse();
	});
