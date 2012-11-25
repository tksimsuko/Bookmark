/**
 * keydowncontrol.js
 *
 * @version  0.0.2
 *
 * Copyright 2012 tksimsuko.
 * Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 */
function KeyDownControl(tgt, metaKeySet, key, callback){
	//初期化
	var $bindTarget;
	var bindKey = "KeyDownControl" + new Date().getTime();
	var metaKeyProp = {
		alt: false,
		ctrl: false,
		shift: false
	};
	var keyProp = {
		delete: 46,
		enter: 13,
		esc: 27,
		tab: 9,
		left: 37,
		up: 38,
		right: 39,
		down: 40
	};

	//バインド
	bind();
	
	return {
		unbind: function(){
			$bindTarget.unbind("keydown." + bindKey);
		}
	}

	function bind(){
		for(var i in metaKeySet){
			var metaKey = metaKeySet[i];
			metaKeyProp[metaKey] = true;
		}
		var keyCode = keyProp[key];
		var isPressed;
		if(keyCode){
			//keyProp に含まれる key の場合 の判定
			isPressed = function(){
				return isKeyPressed(event, metaKeyProp, keyCode);
			};
		}else{
			//char code 判定
			isPressed = function(){
				return isCharKeyPressed(event, metaKeyProp, key);
			};
		}

		$bindTarget = $(tgt);
		$bindTarget.bind("keydown." + bindKey, function(){
			if(isPressed()) callback();
		});
	}

	function isKeyPressed(event, targetMetaKey, targetKey){
		return isMetaKey(event, targetMetaKey) && isKey(event, targetKey);
	}
	function isCharKeyPressed(event, targetMetaKey, targetChar){
		return isMetaKey(event, targetMetaKey) && isCharKey(event, targetChar);
	}
	// meta key 判定
	// metaProp の状態と完全一致 判定
	// @param event: keyDown event
	// @param targetMetaKey: 対象となるメタキー 必須 以下すべて必須
	//		alt 
	//		ctrl
	//		shift
	function isMetaKey(event, targetMetaKey){
		if(targetMetaKey.alt !== event.altKey) return false;
		if(targetMetaKey.ctrl !== event.ctrlKey) return false;
		if(targetMetaKey.shift !== event.shiftKey) return false;
		
		return true;
	}
	// key 判定
	// @param event: keyDown event
	// @param targetKeyCode  keyCode
	function isKey(event, targetKeyCode){
		var keyCode = event.keyCode;
		if(targetKeyCode && (targetKeyCode !== keyCode)) return false;
		return true;
	}
	// char key判定
	// @param event: keyDown event
	// @param targetChar  小文字
	function isCharKey(event, targetChar){
		var keyChar = String.fromCharCode(event.keyCode).toLowerCase();
		if(targetChar && (keyChar !== targetChar)) return false;
		return true;
	}
}