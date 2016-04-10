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
			var rows = json.split(String.fromCharCode(10)).length;
			$(".result","&x{hide}.e{value=''}.e{0}.@{1}",[{value:json},{rows:rows}]);
		}
	})[0].click();

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