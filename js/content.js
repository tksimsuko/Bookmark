
//トリガー
	//ウィンドウ操作　キー操作をバインド
	KeyControl(window, "keydown", ["ctrl"], " ", function(event){
		if($(".bm-view").size()){
			// 非表示
			$(".bm-view").remove();
		}else{
			//表示
			sendRequest({
				status: "getBookmarkTree"	
			}, function(response){
				renderBookmark("body", response, {});
				initBookmarkPosition();
				initBookmarkForm();
			});
		}
	});
	KeyControl(window, "keypress", ["ctrl"], " ", function(){
		return false;
	});
	KeyControl(window, "keydown", [], "esc", function(event){
		removeBookmarkView();
	});

//通信
	//backgroundへりクエストを送る
	function sendRequest(sendData, callback){
	    chrome.extension.sendMessage(sendData, function(response) {
	        if(response){
	            if(callback) callback(response);
	        }
	    });
	}
