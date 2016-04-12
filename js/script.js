//
$(document ,":)", function(){
	var app = new json_builder_app("#jsonEditor");
	var jObj = {
		project:{
			name : 'jsonmaker',
			version : "1.1"
		},
		developer:{
			name:{
				firstName:'yogesh',
				lastName:'jagdale'
			},
			age:24,
			hobies:[
				"reading",
				"programming"
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

			$("html,body", "e{0}", [{scrollTop : top}]);
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
			(function(){
				console.group("{JSON : Maker}");
				console.log(json);
				console.groupEnd();
				return true;
			})();
		}
	});

	$(".new-json","+={click}", function(){
		json.reset();
		$(".result","e{value=''}.@{rows=1}");
	});

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