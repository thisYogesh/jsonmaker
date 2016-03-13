//
$(document ,":)", function(){
	var app = new json_builder_app("#jsonEditor");
	json = app.json;
	$(".stringify",'+={click}',function(){
		if(app.json.type){
			var json = app.json.stringify();
			if(json){
				json = JSON.stringify(json.main,null, '   ');
			}
			$(".result","&x{hide}.e{innerHTML=''}.>+{0}",[json]);
		}
	});
});