(function(){
//クラス名
	var focusCls = "bm-focus";

//トリガー
	//ウィンドウ操作　キー操作をバインド
	KeyDownControl(window, ["alt"], "tab", function(){
		if($(".bm-view").size()){
			// 非表示
			$(".bm-view").remove();
		}else{
			//表示
			sendRequest({
				status: "getTree"	
			}, function(response){
				render(response);
				initBookmarkForm();
			});
		}
	});
	KeyDownControl(window, [], "esc", function(){
		removeView();
	});
	KeyDownControl(window, [], "up", function(){
		var $focusedItem = $("." + focusCls);
		if($focusedItem.size()){
			$focusedItem.removeClass(focusCls);
			var $visibleItem = $(".bm-item:visible");
			var index = $visibleItem.index($focusedItem);
			if(index === -1) return;
			if(index === 0){
				$(".bm-input").focus();
				event.preventDefault();
			}else{
				$visibleItem.eq(index - 1).find(".bm-link").focus();
			}
		}
	});
	KeyDownControl(window, [], "down", function(){
		var $focusedItem = $("." + focusCls);
		if($focusedItem.size()){
			var $visibleItem = $(".bm-item:visible");
			var index = $visibleItem.index($focusedItem);
			if(index === -1) return;
			var $nextItem = $visibleItem.eq(index + 1);
			if($nextItem.size()){
				$focusedItem.removeClass(focusCls);
				$nextItem.find(".bm-link").focus();
			}
		}else{
			var $firstItem = $(".bm-item:visible", ".bm-content").eq(0);
			if(!$firstItem.size()) return;
			$(".bm-input").blur();
			$firstItem.find(".bm-link").focus();
			event.preventDefault();
		}
	});

//フォーム操作
	$(document).on("click", ".bm-close", function(){
		removeView();
		return false;
	});
	$(document).on("click", ".bm-input-reset", function(){
		var $input = $(".bm-input");
		$input.val("");
		$input.focus();
		return false;
	});
	$(document).on("keyup", ".bm-input", function(){
		var val = $(this).val();
		var $items = $(".bm-item", ".bm-view");
		if(!val){
			$items.hide();
			return false;
		}
		var words = val.split(/ |　/g);

		var $filteredItemTitle = $(".bm-item-title", ".bm-view");
		var $filteredItemUrl = $(".bm-url", ".bm-view");
		for(var i in words){
			var word = words[i];
			if(!word) continue;

			$filteredItemTitle = $filteredItemTitle.filter(":contains('" + word + "')");
			$filteredItemUrl = $filteredItemUrl.filter(":contains('" + word + "')");
		}

		$items.hide();
		$(".bm-content").show();
		$filteredItemTitle.parents(".bm-item").show();
		$filteredItemUrl.parents(".bm-item").show();

		return false;
	});
	$(document).on("focus", ".bm-input", function(){
		$(".bm-item").removeClass(focusCls);
	});
	$(document).on("blur", ".bm-input", function(){
		var val = $(this).val();
		if(!val){
			removeView();
		}
	});
	$(document).on("focus", ".bm-link", function(){
		$(this).parents(".bm-item").addClass(focusCls);
	});
	$(document).on("blur", ".bm-link", function(){
		$(this).parents(".bm-item").removeClass(focusCls);
	});
	$(document).on("mouseover", ".bm-item", function(){
		$(".bm-item").removeClass(focusCls);
		$(this).addClass(focusCls);
	});
	$(document).on("mouseout", ".bm-item", function(){
		$(this).removeClass(focusCls);
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

//テンプレート
	function bookmarkTmpl(tree){
		return 	"<div class='bm-view'>" + 
					"<div class='bm-form'>" + 
						"<input placeholder='search bookmark' type='text' class='bm-input' />" + 
						"<span class='bm-mark-top'></span>" +
						"<span class='bm-mark-bottom'></span>" +
						// "<a class='bm-input-reset' href='#'>×</a>" + 
						"<span class='bm-close'>×</span>" +
					"</div>" + 
					"<div class='bm-content'>" + 
						treeTmpl(tree) + 
					"</div>" + 
				"</div>";
	}
	function treeTmpl(tree){
		var html = "<ul class='bm-list'>";
		for(var i in tree){
			var node = tree[i];
			html += folderTmpl(node.children);
		}
		html += "</ul>";
		return html;
	}
	function folderTmpl(nodeArray){
		var html = "";
		for(var i in nodeArray){
			var node = nodeArray[i];
			if(isFolder(node)){
				var title = escape(node.title);
				var children = node.children;
				html += "<li class='bm-folder-item'>" +
							"<div class='bm-folder-title'>" + (title?title:"&nbsp;") + "</div>" +
				   			"<ul class='bm-list'>" + 
				   				folderTmpl(children) + 
				   			"</ul>" + 
				   		"</li>";
			}else{
				html += itemTmpl(node);
			}
		}
		return html;
	}
	function itemTmpl(node){
		var title = escape(node.title);
		var url = escape(node.url);

		return "<li class='bm-item'>" +
					"<a class='bm-link' href='" + url + "'>" + 
						"<p class='bm-item-title'>" + 
							(title?title:"&nbsp;") + 
						"</p>" +  
						"<p class='bm-url'>" + url + "</p>" +  
					"</a>" +
				"</li>";
	}

//レンダリング
	var $body = $("body");
	function render(response){
		var html = bookmarkTmpl(response);
		$body.append(html);
	}
	function removeView(){
		if($(".bm-view").size())
			$(".bm-view").remove();
	}
// フォーム初期化
	function initBookmarkForm(){
		window.setTimeout(function(){
			$bmView = $(".bm-view");
			$bmView.css("left", document.body.scrollLeft);
			$bmView.css("top", document.body.scrollTop);
			$(".bm-input").focus();
		}, 0);
	}

//bookmark tree操作
	function isFolder(node){
		return !node.url;
	}

//utility
	function escape(title){
		return title
				.replace(/</g, "&lt;")
				.replace(/>/g, "&gt;")
				.replace(/&/g, "&amp;")
				.replace(/"/g, "&quot;");
	}
	function getOrigin(url){
		var urlAry = url.replace(/:\//, "").split(/\//);
		var scheme = urlAry[0];
		var host_port = urlAry[1];
		return scheme + "://" + host_port;
	}

})()
