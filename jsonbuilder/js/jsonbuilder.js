//
/*
	op = {
		type = "object", "Array"
		parent = parent Object
		key = key
		val = value
		name,
		updateObject
		parent_el
	}
*/
function json_object(op){
	op = op || {};
	this.key = op.key;
	this.val = op.val;
	this.parent = op.parent;
	this.type = this.getType(op);
	this.JSON = this.setJson(op);
	if(!(op instanceof json_object)){
		this.child = [];
	}
	if(this.parent){
		if(!(op instanceof json_object)){
			this.parent.child.push(this);
		}
		this.superParent = this.parent.superParent;
		this.name = op.name;
		if(this.parent.type == "Array"){
			this.parent.JSON.push(this.JSON);
		}else if(this.parent.type == "Object"){
			if(op.key){
				this.superParent[this.name] = this;
				this.parent.JSON[op.key] = this.JSON;
			}
		}
	}else if(!this.parent){ // main superparent parent
		this.parent = null;
		this.superParent = this;
		if(this.type)
			this.name = this.type == "Object" ? "Object" : "Array";
		else 
			this.name = null;
	}

	if(!this.parent && !(op instanceof json_object)){
		this.parent_el = op.parent_el;
		this.view = new json_view(this);
	}else if(op.view && !(op instanceof json_object)){
		this.parent_el = op.view;
		this.view = new json_view(this);
	}
};
json_object.ext = function(methods){
	for(var method in methods){
		this.prototype[method] = methods[method];
	}
};
json_object.ext({
	add : function(key, val){
		key = key || "";
		val = val || undefined;
		if(this.type == "Array"){
			if(this.parent)
			$(this.view.html,'?{>.val}.&+{obj}');
			this.val = new this.constructor({
				type : key,
				parent : this,
				val : key,
				view : this.view.html,
				name : this.name + '[' + this.JSON.length + ']'
			});
		}else if(this.type == "Object"){
			if(this.parent)
			$(this.view.html,'?{>.val}.&+{obj}');
			this.val = new this.constructor({
				type : val,
				parent : this,
				key : key,
				view : this.view.html,
				val : val,
				name : this.name + '.' + key
			});
		}else if(this.type == "String"){
			//this.JSON.string = key;
			//this.setVal();
			this.val = new this.constructor({
				type : val,
				parent : this,
				key : key,
				view : this.view.html,
				val : val,
				name : this.name + '.' + key
			});
		}else if(this.type == "Number"){
			//this.JSON.number = key;
			this.val = new this.constructor({
				type : val,
				parent : this,
				key : key,
				view : this.view.html,
				val : val,
				name : this.name + '.' + key
			});
		}
	},
	setVal : function(val){
		this.val = val;
	},
	getType : function(op){
		if(op.type != undefined){
			return op.type.constructor.name
		}else{
			return null;
		}
	},
	setJson : function(op){
		if(this.type == "Array"){
			return [];
		}else if(this.type == "Object"){
			return {};
		}else if(this.type == "String"){
			return {string : op.val};
		}else if(this.type == "Number"){
			return {number : op.val};
		}else{
			return {};
		}
	},
	setType : function(type){
		type = type.val != undefined ? type.val : type;
		this.type = this.getType({type:type});
		this.JSON = this.setJson(this);
		if(!this.parent){
			this.name = this.type == "Object" ? "{}" : "[]";
		}
	},
	setKey : function(key){
		if(key && !this.key){
			this.key = key;
			this.name += this.key;
			this.superParent[this.name] = this;
			this.parent.JSON[key] = this.JSON;
		}else if(key && this.key){

		}
	},
	add_sibling : function(){
		//console.log(this);
		this.add();
	}
});

function json_view(json_object){
	var _this = this,
	html = "",
	is_object = json_object.parent && json_object.parent.type == "Object",
	is_array = json_object.parent && json_object.parent.type == "Array",
	is_string = json_object.parent && json_object.parent.type == "String",
	is_number = json_object.parent && json_object.parent.type == "Number";

	_this.json_object = json_object;

	if(is_object || is_array){	
		if(is_object){
			if(json_object.parent.child.length == 0){
				html += "<div class='key_holder'>";
			}
			html += 	"<div class='key_row'>" +
							"<div class='key'>" +
								"<span class='objtxt' contenteditable></span>" +
							"</div>" +
							"<div class='val'>";
		}else if(is_array){	
			if(json_object.parent.child.length == 0){
				html += "<div class='key_holder'>";
			}
			html += 	"<div class='key_row'>" +
							"<div class='val'>";
		}
	}
	
	// only if json_object is of type [Array] or [Object] then json_block going to create
	if(is_object || is_array || !json_object.parent){ 
		html += 				"<div class='json_block'>";
		html += 					_this.json_init(json_object);
		html += 				"</div>";
	}else if(is_number || is_string){
		html += 				"<span class='objval' contenteditable></span>";
	}

	if(is_object || is_array){
		if(is_object){
			html +=			"</div>" +
						"</div>";
			if(json_object.parent.child.length == 0){
				html += "</div>";
			}
		}else if(is_array){	
			html +=	"</div>";
			if(json_object.parent.child.length == 0){
				html += "</div>";
			}
		}
	}

	if(is_object || is_array || !json_object.parent){
		_this.html = $('<->',html)._('?{.json_init}.+={click,0}.?{.op}.+={click,1}....',[
			function(e){
				_this.open_option.bind(this)(e, _this);
			}, function(e){
				_this.option_controller.bind(this)(e, _this);
			}
		])[0];
	}else if(is_number || is_string){
		_this.html = $('<->',html)._('+={blur}',function(e){
			_this.setVal.bind(this)(e, _this);
		})[0];
	}

	if(is_object){
		$(_this.html, '?{.objtxt}.+={blur}', function(e){
			_this.setKey.bind(this)(e, _this);
		});
	}

	if(!json_object.parent){ // superParent
		$(json_object.parent_el,'>+{0}',[_this.html]);
	}else{
		if(json_object.parent.child.length == 1){ //$(_this.html,'&h{key_holder}')
			if(is_object || is_array){
				var add_sibling = "<div class='add_obj'></div>";
				add_sibling = $('<->',add_sibling)._('+={click}',function(e){
					_this.add_sibling.bind(this)(e, _this);
				})[0];
				$(json_object.parent_el,'?{.json_init}.>|{0}.x',[_this.html]);
				$(_this.html,'>|{0}',[add_sibling]);
				_this.html = $(_this.html,'?{.key_row}')[0];

			}else if(is_number || is_string){
				$(json_object.parent_el,'?{.json_init}.>|{0}.x',[_this.html]);
			}
		}else{
			$(json_object.parent_el,'?{.json_init}.>|{0}.x',[_this.html]);
		}
	}
	return _this;
}

json_view.ext = function(methods){
	for(var method in methods){
		this.prototype[method] = methods[method];
	}
};

json_view.ext({
	key_field : function(json_object){

		var html = "<div class='key_holder'>";
		if(json_object.type = "Array"){
			html += "<div class='key_row'>"
						"<div class='val'>" +
							"<input type='text' class='objtxt _val'/>" +
						"</div>" +
					"</div>";
		}else if(json_object.type = "Object"){
			html += "<div class='key_row'>"
						"<div class='key'>" +
							"<input type='text' class='objtxt _key'/>" +
						"</div>" +
						"<div class='val'></div>" +
					"</div>";
		}
		html += "</div>";
		return html;
	},
	json_init : function(json_object){
		var html = "<div class='json_init'>" +
			  			"JSON" +
			  			"<div class='json_op'>";
		html += 			this.option(json_object);
		html +=			"</div>" +
			  		"</div>";
		return html;
	},
	option : function(json_object){
		var _Object = "<span class='op _Object'>{} Object</span>",
			_Array 	= "<span class='op _Array'>[] Array</span>",
			_String	= "<span class='op _String'>\"\" String</span>",
			_Number	= "<span class='op _Number'>0 Number</span>",
			html 	= "";

		if(!json_object.parent){
			html += _Object + _Array;
		}else{
			html += _Object + _Array + _Number + _String;
		}
		return html;
	},
	option_controller : function(e, _this){
		var el = $(this);
		if(el._("&h{_Object}")){
			_this.json_object.setType({});
			if( $(_this.html, '&h{json_block}') ){
				$(_this.html,'&x{iarr}.&+{iobj}');
			}else{
				$(_this.html,'?{.json_block}.&x{iarr}.&+{iobj}');
			}
		}else if(el._("&h{_Array}")){
			_this.json_object.setType([]);
			if( $(_this.html, '&h{json_block}') ){
				$(_this.html,'&x{iobj}.&+{iarr}');
			}else{
				$(_this.html,'?{.json_block}.&x{iobj}.&+{iarr}');
			}
		}else if(el._("&h{_String}")){
			_this.json_object.setType({val : ""});
			$(_this.html,'&x{iarr iobj}');
		}else if(el._("&h{_Number}") > -1){
			_this.json_object.setType({val : 0});
			$(_this.html,'&x{iarr iobj}');
		}
		el._('^.&x{show}');

		_this.json_object.add();

		//console.log(_this.json_object);
		e.stopPropagation();
	},
	open_option : function(e, _this){
		$(this,'?{.json_op}.&+{show}');
	},
	setKey : function(e, _this){
		var key = $(this,',');
		if(key){
			_this.json_object.setKey(key)
		}
	},
	setVal : function(e, _this){
		var val = $(this,',');
		if(val){
			_this.json_object.setVal(val);
		}
	},
	add_sibling : function(e, _this){
		_this.json_object.add_sibling();
	}
});