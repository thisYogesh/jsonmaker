//
$(function () {
	"use strict";
	var app = new json_builder_app("#jsonEditor"),
		jObj = {
			project: {
				name: 'jsonmaker',
				version: 2.0
			},
			developer: {
				name: {
					firstName: 'Yogesh',
					lastName: 'Jagdale'
				},
				age: 26,
				hobies: [
					"Reading",
					"Programming"
				]
			},
			message: "Make your JSON while having your Coffee!"
		},
		view = 0, // default view
		editorStyle = window.getComputedStyle($(".text-area-wrap").get(0)),
		editor = $(".result"),
		json = app.json,
		operations = {
			createNewJson: "Create New Json",
			loadExample: "Load Example"
		};

	json.makeJSON(jObj);
	$(".stringify").click(function () {
		showResult();
		var top = $(".result_pad").offset().top;
		scrollTop(top);
		makeDownloadUrl()
	});

	showResult();

	$(".objectify").click(function () {
		try {
			var json_str = $(".result").val(),
				json_obj = JSON.parse(json_str),
				top = $("#jsonEditor").offset().top;
			$(".parse_error").addClass("hide");
			json.makeJSON(json_obj);
			scrollTop(top - 10);
		} catch (e) {
			var msg = "Error : " + e.message,
				top = $(".result_pad").offset().top;
			$(".parse_error").removeClass("hide").html(msg);
			scrollTop(top);
		}
	});

	$(".log").click(function () {
		var json = makeStringify();
		if (json && console) {
			console.group("{JSON : Maker}");
			console.log(json);
			console.groupEnd();
		} else {
			alert("Open your >_ console to see output!");
		}
	});

	/*$(".new-json").click(function () {
		json.reset();
		$(".result").val("").attr("rows", 1);
		updateEditor("update");
	});*/

	$(".option-list").click(function (e) {
		var _this = $(this);
		if (!_this.data("open")) {
			_this.data("open", 1).find(".option-menu").slideDown(100);
		} else {
			_this.data("open", 0).find(".option-menu").slideUp(100);
		}
		e.stopPropagation();
	}).data("open", 0).find(".option-menu").hide(0);

	$(window).click(function () {
		$(".option-list").data("open", 0).find(".option-menu").hide(0);
	});

	$(".option-list .option-menu>li").click(function () {
		var _this = $(this);

		if (_this.data("value") == operations.createNewJson) {
			json.reset();
			$(".result").val("").attr("rows", 1);
			updateEditor({ type: "update" });
		} else if (_this.data("value" == operations.loadExample)) {
			json.makeJSON(jObj);
			showResult();
		}
	});

	$(".result").bind("keypress keydown keyup", function (e) {
		if (e.type == "keypress") {
			if (e.keyCode == 13) { // enter
				updateEditor({ type: "update", event: e });
			}
		} else if (e.type == "keyup") {
			if (e.keyCode == 8 || e.keyCode == 13) { // backspace
				updateEditor({ type: "update" });
			}
			if (e.ctrlKey && e.keyCode == 86) { // Paste
				updateEditor({ type: "update" });
			}
		} else if (e.type == "keydown") {
			if (e.keyCode == 9) { // tab
				var _this = $(this),
					el = _this[0],
					cursorStartPoint = el.selectionStart,
					val = _this.val();

				val = (val.substr(0, cursorStartPoint) + "   " + val.substr(cursorStartPoint));
				_this.val(val);

				this.setSelectionRange((cursorStartPoint + 3), (cursorStartPoint + 3));
				e.preventDefault();
			}
		}
	});

	$(".myform").submit(function (e) {
		var validate = true,
			inps = $(this).find(".inp").removeClass("err"),
			data = {};

		inps.each(function () {
			var el = $(this);
			if (el.val() == "") {
				validate = false;
				el.addClass("err");
				return false;
			} else {
				var name = el.attr('name'),
					value = el.val();
				data[name] = value;
			}
		});
		if (validate) {
			$(".sendmsg").text("SENDING");
			$.ajax({
				url: 'http://localhost:8080/contactus',
				type: 'POST',
				data: data,
				success: function (resp) {
					if (resp.status == 0) {
						$(".sendmsg").text("SEND");
						$(".inp").val("");
					} else {
						showErr();
					}
				},
				error: function () {
					showErr();
				}
			});
		}
		e.preventDefault();
	});

	var minHeight = 260;
	$(".changeview").click(function (e) {
		if (!view) {
			var h = window.innerHeight - ($('.top-header').outerHeight() + 16 + $('.foot').outerHeight() + 16);
			view = 1;
			$(document.body)
				.addClass("horizontalView")
				.find(".jsoneditor-container")
				.removeClass("flex-col")
				.css("height", h < minHeight ? minHeight : h);
		} else {
			view = 0;
			$(document.body)
				.removeClass("horizontalView")
				.find(".jsoneditor-container")
				.addClass("flex-col")
				.css("height", "auto");
		}
	});

	$(".play-game").click(function(){
		window.open("https://thisyogesh.github.io/snake");
	});

	$(window).resize(function (e) {
		if (view) {
			var h = window.innerHeight - ($('.top-header').outerHeight() + 16 + $('.foot').outerHeight() + 16);
			$(".jsoneditor-container").css("height", h < minHeight ? minHeight : h);
		}
	});

	var errTm;
	function showErr() {
		$(".sendmsg").text("SEND");
		$(".err-msg").removeClass("hide");
		clearTimeout(errTm);
		errTm = setTimeout(function () {
			$(".err-msg").addClass("hide");
		}.bind(), 5000);
	}

	/*
	 * Update Editor 
	 * @param {String} a.type
	 * @param {String} a.val
	 * @param {Object} a.event
	 * 
	 * @return {undefined}
	 */

	function updateEditor(a) {
		var lHeight = parseInt(editorStyle.lineHeight),
			isEnterKeyPress = a.event ? (a.event.type == "keypress" && a.event.keyCode == 13 ? true : false) : false,
			rows = editor.val().split("\n").length,
			rows = isEnterKeyPress ? rows += 1 : rows,
			height;

		if (a.type == "put") {
			rows = a.val.split("\n").length;
			editor.removeClass("hide").val(a.val);//.css("height", height);
		} else if (a.type == "update") {
			//_this.removeClass("hide").val(val).css("height", height);
		}
		//_this.attr("rows", rows);
		height = rows * lHeight;
		editor.css("height", height);

		editorLineNumbers(rows);
	}

	function editorLineNumbers(lineCount, type) {
		//return;
		var lines = [],
			gLines = lineGenerator(lineCount);

		$(".line-number-group").html(gLines);

		function lineGenerator(length) {
			for (var i = 1; i <= length; i++) {
				//lines.push('<span class="line-number">' + i + '</span>');
				lines.push('<span class="line-number">&nbsp;</span>');
			}
			return lines.join("");
		}
	}

	function makeStringify() {
		var json = "";
		if (app.json.type) {
			json = app.json.stringify();
			if (json) {
				json = JSON.stringify(json.main, null, '   ');
			}
		}
		return json;
	}

	function showResult() {
		var json = makeStringify();
		if (json) {
			updateEditor({
				type: "put",
				val: json
			});
		}
	}

	function makeDownloadUrl() {
		const jsonData = $(".result").get(0).value
		const blob = new Blob([jsonData], { type: "application/json" });
		const href = URL.createObjectURL(blob);

		$(".download__btn").get(0).href = href
	}

	function scrollTop(a) {
		if (view == 0) {
			$("html,body").animate({ scrollTop: a });
		}
	}
});