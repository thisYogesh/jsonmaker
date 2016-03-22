//
$(document ,":)", function(){
	var app = new json_builder_app("#jsonEditor");
	json = app.json;
	$(".stringify","+={click}",function(){
		var json = makeStringify();
		if(json){
			$(".result","&x{hide}.e{innerHTML=''}.>+{0}",[json]);
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