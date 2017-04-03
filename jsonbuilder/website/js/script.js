//
$(function () {
	"use strict";
	var app = new json_builder_app("#jsonEditor"),
		jObj = {
			project: {
				name: 'jsonmaker',
				version: 1.4
			},
			developer: {
				name: {
					firstName: 'Yogesh',
					lastName: 'Jagdale'
				},
				age: 25,
				hobies: [
					"Reading",
					"Programming"
				]
			},
			message: "Make your JSON while having your Coffee!"
		},
		editorStyle = window.getComputedStyle($(".text-area-wrap").get(0)),
		editor = $(".result"),
		json = app.json;

	json.makeJSON(jObj);
	$(".stringify").click(function () {
		showResult();
		var top = $(".result_pad").offset().top;
		$("html,body").animate({ scrollTop: top });
	});

	showResult();

	$(".objectify").click(function () {
		try {
			var json_str = $(".result").val(),
				json_obj = JSON.parse(json_str),
				top = $("#jsonEditor").offset().top;
			$(".parse_error").addClass("hide");
			json.makeJSON(json_obj);
			$("html,body").animate({ scrollTop: top - 10 });
		} catch (e) {
			var msg = "Error : " + e.message,
				top = $(".result_pad").offset().top;
			$(".parse_error").removeClass("hide").html(msg);
			$("html,body").animate({ scrollTop: top });
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

	$(".new-json").click(function () {
		json.reset();
		$(".result").val("").attr("rows", 1);
		updateEditor("update");
	});

	$(".result").bind("keypress keydown keyup", function (e) {
		if (e.type == "keypress") {
			if (e.keyCode == 13) { // enter
				updateEditor("update");
			}
		} else if (e.type == "keyup") {
			if (e.keyCode == 8 || e.keyCode == 13) { // backspace
				updateEditor("update");
			}
			if (e.ctrlKey && e.keyCode == 86) { // Paste
				updateEditor("update");
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

	var view = 0,minHeight = 260;
	$(".changeview").click(function(e){
		if(!view){
			var h = window.innerHeight - ($('.top-header').outerHeight() + 16 + $('.foot').outerHeight() + 16);
			view = 1;
			$(document.body)
			.addClass("horizontalView")
			.find(".jsoneditor-container")
			.css("height", h < minHeight ? minHeight : h);
		}else{
			view = 0;
			$(document.body)
			.removeClass("horizontalView")
			.find(".jsoneditor-container")
			.css("height","auto");
		}
	});

	$(window).resize(function(e){
		if(view){
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

	function updateEditor(type, val) {
		var lHeight = parseInt(editorStyle.lineHeight),
			rows = editor.val().split(String.fromCharCode(10)).length,
			height;

		if (type == "put") {
			rows = val.split(String.fromCharCode(10)).length;
			editor.removeClass("hide").val(val);//.css("height", height);
		} else if ("update") {
			//_this.removeClass("hide").val(val).css("height", height);
		}
		//_this.attr("rows", rows);
		height = rows * lHeight;
		editor.css("height", height);

		editorLineNumbers(rows);
	}

	function editorLineNumbers(lineCount, type) {
		var lines = [],
			gLines = lineGenerator(lineCount);

		$(".line-number-group").html(gLines);

		function lineGenerator(length) {
			for (var i = 1; i <= length; i++) {
				lines.push('<span class="line-number">' + i + '</span>');
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
			updateEditor("put", json);
		}
	}
});