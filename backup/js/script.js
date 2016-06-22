//
$(document ,":)", function(){
	var app = new json_builder_app("#jsonEditor");
	var jObj = {
		project:{
			name : 'jsonmaker',
			version : 1.3
		},
		developer:{
			name:{
				firstName:'Yogesh',
				lastName:'Jagdale'
			},
			age:24,
			hobies:[
				"Reading",
				"<h1>Programming</h1>"
			]
		},
		message:"Make your JSON while having your Coffee!"
	}
	json = app.json;
	json.makeJSON(jObj);
	$(".stringify","+={click}",function(){
		var json = makeStringify();
		if(json){
			var rows = json.split(String.fromCharCode(10)).length,
			top = $(".result_pad",'e{offsetTop}');

			$(".result","&x{hide}.e{value=''}.e{0}.@{1}",[{value:json},{rows:rows}]);
			$("html,body", "e{0}", [{scrollTop : top}]);
		}
	})[0].click();

	$(".objectify","+={click}",function(){
		try{
			var json_str = $(".result","%"),
			json_obj = JSON.parse(json_str),
			top = $("#jsonEditor",'e{offsetTop}');
			$(".parse_error","&+{hide}");
			json.makeJSON(json_obj);
			$("html,body", "e{0}", [{scrollTop : top - 10}]);
		}catch(e){
			var msg = "Error : " + e.message,
			top = $(".result_pad",'e{offsetTop}');
			$(".parse_error","&x{hide}.e{textContent=''}.e{0}",[{textContent:msg}]);
			$("html,body", "e{0}", [{scrollTop : top}]);
		}
	});

	$(".log","+={click}", function(){
		var json = makeStringify();
		if(json){
			if(console){
				console.group("{JSON : Maker}");
				console.log(json);
				console.groupEnd();
			}else{
				alert("Open your >_ console to see output!");
			}
		}
	});

	$(".new-json","+={click}", function(){
		json.reset();
		$(".result","e{value=''}.@{rows=1}");
	});

	$(".result","+={keypress keydown keyup}",function(e){
		if(e.type == "keypress"){
			if(e.keyCode == 13){ // enter
				updateRows(this);
			}
		}else if(e.type == "keyup"){
			if(e.keyCode == 8){ // backspace
				updateRows(this);
			}
			if(e.ctrlKey && e.keyCode == 86){ // Paste
				updateRows(this);
			}
		}else if(e.type == "keydown"){
			if(e.keyCode == 9){ // tab
				var _this = $(this),
				el = _this[0],
				cursorStartPoint = el.selectionStart,
				val = _this._("%");

				val = (val.substr(0, cursorStartPoint) + "   " + val.substr(cursorStartPoint));
				_this._("e{0}",[{value:val}]);

				this.setSelectionRange((cursorStartPoint + 3),(cursorStartPoint + 3));
				e.preventDefault();
			}
		}
	});

	$(".myform","+={submit}", function(e){
		var validate = true,
		inps = $(this,'?{.inp}.&x{err}'),
		data = {};

		for(var i=0; i<inps.length; i++){
			var el = $(inps[i]);
			if(el._("%") == ""){
				validate = false;
				el._("&+{err}");
				break;
			}else{
				var name = $(inps[i],'@{name}'),
				value = $(inps[i],'%');
				data[name] = value;
			}
		}
		if(validate){
			$(".sendmsg","e{0}",[{textContent:'SENDING'}]);
			$('>X<{FD}',{
			    url : 'http://localhost:8080/contactus',
			    type : 'POST',
			    data : data,
			    success : function(resp){
			    	if(resp.status == 0){
				        $(".sendmsg","e{0}",[{textContent:'SEND'}]);
				        $(".inp","e{value=''}");
			    	}else{
			    		showErr();
			    	}
			    },
			    error : function(){
			    	showErr();
			    }
			});
		}
		e.preventDefault();
	});
	
	var errTm;
	function showErr(){
		$(".sendmsg","e{0}",[{textContent:'SEND'}]);
		$(".err-msg","&x{hide}");
		clearTimeout(errTm);
		errTm = setTimeout(function(){
			$(".err-msg","&+{hide}");
		}.bind(),5000);
	}

	function updateRows(el){
		var _this = $(el),
		rows = _this._("%").split(String.fromCharCode(10)).length;
		_this._("@{rows="+(rows)+"}");
	}

	function makeStringify(){
		var json = "";
		if(app.json.type){
			json = app.json.stringify();
			if(json){
				json = JSON.stringify(json.main,null, '   ');
			}
		}
		return json;
	}
});