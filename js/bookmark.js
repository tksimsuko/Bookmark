
//クラス名
	var focusCls = "bm-focus";
	var hoverCls = "bm-hover";

//トリガー
	KeyControl(window, "keydown", [], "up", function(event){
		keyUpHandler(event);
	});
	KeyControl(window, "keydown", [], "down", function(event){
		keyDownHandler(event);
	});
	KeyControl(window, "keydown", ["shift"], "tab", function(event){
		keyUpHandler(event);
		return false;
	});
	KeyControl(window, "keydown", [], "tab", function(event){
		keyDownHandler(event);
		return false;
	});
	function keyUpHandler(event){
		var $focusedItem = $("." + focusCls);
		if($focusedItem.length){
			var $visibleItem = $(".bm-item:visible");
			var index = $visibleItem.index($focusedItem);
			if(index <= 0) return;
			$focusedItem.removeClass(focusCls);
			$visibleItem.eq(index - 1).focus();
		}
		event.preventDefault();
	}
	function keyDownHandler(event){
		var $focusedItem = $("." + focusCls);
		if($focusedItem.length){
			var $visibleItem = $(".bm-item:visible");
			var index = $visibleItem.index($focusedItem);
			if(index === -1) return;
			var $nextItem = $visibleItem.eq(index + 1);
			if($nextItem.length){
				$focusedItem.removeClass(focusCls);
				$nextItem.focus();
			}
		}else{
			var $firstItem = $(".bm-item:visible", ".bm-content").eq(0);
			if(!$firstItem.length) return;
			$(".bm-input").blur();
			$firstItem.focus();
			
		}
		event.preventDefault();
	}


//フォーム操作
	var keyDownTimerId;
	var ovserveInterval = 100;
	var oldWord = "";
	$(document).on("click", ".bm-close", function(){
		removeBookmarkView();
		return false;
	}).on("click", ".bm-input-reset", function(){
		var $input = $(".bm-input");
		$input.val("");
		$input.focus();
		return false;
	}).on("keyup", ".bm-input", function(){
		var val = $(this).val().toLowerCase();
		var $items = $(".bm-item", ".bm-view");

		if(!val){
			$items.hide();
			return false;
		}

		var isSameWord = oldWord === val;
		oldWord = val;

		var words = val.split(/ |　/g);
		var $filteredItemTitle = $(".bm-item-title-search", ".bm-view");
		var $filteredItemUrl = $(".bm-url-search", ".bm-view");
		for(var i in words){
			var word = words[i].toLowerCase();
			if(!word) continue;
			$filteredItemTitle = $filteredItemTitle.filter(":contains(" + word + ")");
			$filteredItemUrl = $filteredItemUrl.filter(":contains(" + word + ")");
		}

		$items.hide();
		$(".bm-content").show();
		$filteredItemTitle.parents(".bm-item").show();
		$filteredItemUrl.parents(".bm-item").show();

		if(!isSameWord){
			ovserveItem();	
		}
		
		return false;
	}).on("focus", ".bm-item", function(){
		$(this).addClass(focusCls);
	}).on("blur", ".bm-item", function(){
		$(this).removeClass(focusCls);
	}).on("mouseover", ".bm-item", function(){
		$(".bm-item").removeClass(focusCls);
		$(this).addClass(focusCls);
	});
	function ovserveItem(){
		if(keyDownTimerId){
			clearTimeout(keyDownTimerId);	
		}
		keyDownTimerId = setTimeout(function(){
			activeNextItem();
		}, ovserveInterval);
	}
	function activeNextItem(){
		var activeItem = $(".bm-item:visible");
		var focusItem = $("." + focusCls);
		if(activeItem.length > 0){
			$(".bm-item").removeClass(focusCls);
			activeItem.eq(0).addClass(focusCls);
		}
	}

	//検索
	function search(vl){
		var val = vl.toLowerCase();
		var $items = $(".bm-item", ".bm-view");
		if(!val){
			$items.hide();
			return false;
		}
		var words = val.split(/ |　/g);
		var $filteredItemTitle = $(".bm-item-title-search", ".bm-view");
		var $filteredItemUrl = $(".bm-url-search", ".bm-view");
		for(var i in words){
			var word = words[i].toLowerCase();
			if(!word) continue;
			$filteredItemTitle = $filteredItemTitle.filter(":contains(" + word + ")");
			$filteredItemUrl = $filteredItemUrl.filter(":contains(" + word + ")");
		}

		$items.hide();
		$(".bm-content").show();
		$filteredItemTitle.parents(".bm-item").show();
		$filteredItemUrl.parents(".bm-item").show();
		
		if(!isSameWord){
			ovserveItem();	
		}
		
		return false;
	}
//テンプレート
	function bookmarkTmpl(tree, prop){
		return 	"<div class='bm-view'>" + 
					"<div class='bm-form'>" + 
						"<input placeholder='search bookmark' type='text' class='bm-input' />" + 
						"<span class='bm-mark-top'></span>" +
						"<span class='bm-mark-bottom'></span>" +
						(prop.isCloseBtn ? "<span class='bm-close'>×</span>" : "") +
					"</div>" + 
					"<div class='bm-content'>" + 
						bookmarkTreeTmpl(tree, prop) + 
					"</div>" + 
				"</div>";
	}
	function bookmarkTreeTmpl(tree, prop){
		var html = "<ul class='bm-list'>";
		for(var i in tree){
			var node = tree[i];
			html += bookmarkFolderTmpl(node.children, prop);
		}
		html += "</ul>";
		return html;
	}
	function bookmarkFolderTmpl(nodeArray, prop){
		var html = "";
		for(var i in nodeArray){
			var node = nodeArray[i];
			if(isFolder(node)){
				var title = escape(node.title);
				var children = node.children;
				html += "<li class='bm-folder-item'>" +
							"<div class='bm-folder-title'>" + (title?title:"&nbsp;") + "</div>" +
				   			"<ul class='bm-list'>" + 
				   				bookmarkFolderTmpl(children, prop) + 
				   			"</ul>" + 
				   		"</li>";
			}else{
				html += bookmarkItemTmpl(node, prop);
			}
		}
		return html;
	}
	function bookmarkItemTmpl(node, prop){
		var title = escape(node.title);
		var url = escape(node.url);
		const domain = new URL(url).hostname;
		var faviconURL = `https://www.google.com/s2/favicons?domain=${domain}`;
		return "<li class='bm-item'>" +
					"<a class='bm-link' href='" + url + "'>" + 
						"<p class='bm-item-title'>" + 
							(prop.isFavicon?"<img class='bm-favicon' src='" + faviconURL + "' />":"") + 
							(title?title:"&nbsp;") + 
						"</p>" +  
						"<p class='bm-url'>" + url + "</p>" + 
						"<span class='bm-item-title-search'>" + title.toLowerCase() + "</span>" + 
						"<span class='bm-url-search'>" + url.toLowerCase() + "</span>" +  
					"</a>" +
				"</li>";
	}

//レンダリング
	function renderBookmark(tgt, bookmarkTree, prop){
		var html = bookmarkTmpl(bookmarkTree, prop);
		$(tgt).append(html);
	}
	function removeBookmarkView(){
		if($(".bm-view").length)
			$(".bm-view").remove();
	}
// フォーム初期化
	function initBookmarkForm(){
		window.setTimeout(function(){
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

