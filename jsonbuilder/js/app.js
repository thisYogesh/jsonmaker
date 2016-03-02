//
$ = $S;
function json_builder_app(editor_selector){
	if(!editor_selector)return false;
	this.jsonEditors_container = editor_selector;
	this.jsonEditor;
	this.createJsonBuilder();
}
json_builder_app.prototype.createJsonBuilder = function(){
	// actual view
	var editorHtml = "<div class='json_editor'></div>";
	this.jsonEditor = $("<->", editorHtml)[0];
	$(this.jsonEditors_container,'>+{el}', {el:this.jsonEditor});
	this.json = new json_object({
		parent_el : this.jsonEditor
	});
}