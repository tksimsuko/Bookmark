
//トリガー
	//ウィンドウ操作　キー操作をバインド
	KeyDownControl(window, ["alt"], " ", function(event){
		if($(".bm-view").size()){
			// 非表示
			$(".bm-view").remove();
			event.preventDefault();
		}else{
			//表示
			sendRequest({
				status: "getBookmarkTree"	
			}, function(response){
				renderBookmark("body", response);
				initBookmarkForm();
				initBookmarkPosition();
				event.preventDefault();
			});
		}
	});

	KeyDownControl(window, [], "esc", function(event){
		removeBookmarkView();
	});

//フォーム操作
	$(document).on("blur", ".bm-input", function(){
		var val = $(this).val();
		if(!val){
			removeBookmarkView();
		}
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
