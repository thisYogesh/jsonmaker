//
function json_builder_app(editor_selector){
	if(!editor_selector)return false;
	this.jsonEditors_container = editor_selector;
	this.jsonEditor;
	this.createJsonBuilder();
}
json_builder_app.prototype.createJsonBuilder = function(){
	// actual view
	var editorHtml = "<div class='json_editor'></div>";
	this.jsonEditor = $(editorHtml).get(0);
	$(this.jsonEditors_container).append(this.jsonEditor);
	this.json = new json_object({
		parent_el : this.jsonEditor
	});
}