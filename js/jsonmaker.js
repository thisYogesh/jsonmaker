// Author : Yogesh Jagdale
var ky = /^(\d(.*))|((.*)?(-)(.*)?)$/,
auto_mk = false; // if auto_mk variable is set to false then auto focus will not happen.
function json_object(op){
	op = op || {};
	this.key = op.key;
	this.val = op.val;
	this.parent = op.parent;
	this.name = "";
	this.type = null;
	this.json_collection.push(this); // adding all json objects to json_collection
	if(!(op instanceof json_object)){
		this.child = [];
	}
	if(this.parent){
		if(!(op instanceof json_object)){
			this.parent.child.push(this);
		}
		this.superParent = this.parent.superParent;
		this.setPathName();
	}else if(!this.parent){ // main superparent parent
		//this.name = [];
		this.parent = null;
		this.superParent = this;
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
			if(this.parent) $(this.view.html).find(">.val").removeClass("nonobj").addClass("obj");

			this.val = new this.constructor({
				type : key,
				parent : this,
				val : key,
				view : this.view.html
			});
			this.getAccessName();
		}else if(this.type == "Object"){
			if(this.parent) $(this.view.html).find(">.val").removeClass("nonobj").addClass("obj");
			this.val = new this.constructor({
				type : val,
				parent : this,
				key : key,
				view : this.view.html,
				val : val
			});
			this.getAccessName();
		}
		else if(this.type == "Boolean"){
			this.val = new this.constructor({
				type : val,
				parent : this,
				key : key,
				view : this.view.html,
				val : val
			});
			this.getAccessName();
		}else if(this.type == "String" || this.type == "Number"){
			this.val = new this.constructor({
				type : val,
				parent : this,
				key : key,
				view : this.view.html,
				val : val
			});
			this.getAccessName();
		}
	},
	setVal : function(val){
		this.val = val;
	},
	getType : function(op){
		if(op != undefined){
			return op.constructor.name
		}else{
			return null;
		}
	},
	setPathName : function(){
		if(this.parent.type == "Object"){
			//this.name = this.parent.name;
		}else if(this.parent.type == "Array"){
			var nm = "["+ (this.parent.child.length - 1) +"]";
			this.name = this.parent.name;
			this.name = nm;
		}
	},
	setType : function(type){
		//type = type.val != undefined ? type.val : type;
		this.type = this.getType(type);
		if(!this.parent){
			this.name = this.type == "Object" ? "Object" : "Array";
		}
	},
	setKey : function(key){
		if(key && key != this.key){
			this.key = key;
			if(ky.test(key)){
				this.name = "['" + this.key + "']";
			}else{
				this.name = this.key;
			}
			this.getAccessName();
			this.resetName();
		}
	},
	add_sibling : function(){
		if(this.parent){
			this.parent.add();
		}else{
			console.log("you can't add sibling to superParent!");
		}
	},
	remove : function(){
		if(this.parent){
			for(var i=0; i<this.parent.child.length; i++){
				if(this.parent.child[i] == this){
					this.parent.child.splice(i,1);
					break;
				}
			}
			if(this.parent.child.length == 0){
				this.parent.reset();
			}else{
				if(this.parent.type == "Array"){
					this.parent.resetArrayName();
					this.parent.resetName(i);
				}
			}
		}
	},
	resetName : function(st){
		st = !st ? 0 : st;
		if(this.child.length > 0){
			for(var i=0; i<this.child.length; i++){
				if(i >= st){
					var json_object = this.child[i];
					if(json_object.type == "String" || json_object.type == "Number"){
						json_object.getAccessName();
					}else{
						json_object.getAccessName();
						json_object.resetName();
					}
				}
			}
		}
	},
	resetArrayName : function(){
		for(var i=0; i<this.child.length; i++){
			this.child[i].name = "["+ i +"]";
		}
	},
	reset : function(){
		this.child = [];
		this.type = null;
		this.val = null;
		this.view.reset();
	},
	buildAccessName : function(){
		var n = this.name;
		if((this.parent && this.parent.type == "Array") || ky.test(this.key)){
			var a = this.parent.buildAccessName();
			a = a.split(".");a[0] += n;n = "";a = a.join(".");
			n += a;
		}else if(this.parent && this.parent.type == "Object"){
			n += "." + this.parent.buildAccessName();
		}
		return n;
	},
	getAccessName : function(){
		var name = this.buildAccessName();
		name = name.split(".").reverse().join(".");
		this.view.setAccessName(name);
	},
	stringify: function(){
		var stringify;
		if(this.child.length > 0){
			for(var i=0; i<this.child.length; i++){
				if(this.type == "Object"){
					if(!this.parent){
						if(stringify == undefined){
							stringify = {main:{}};
							stringify.main[this.child[i].key] = this.child[i].stringify();
						}else{
							stringify.main[this.child[i].key] = this.child[i].stringify();
						}
					}else if(this.parent){
						if(stringify == undefined){
							stringify = {};
							stringify[this.child[i].key] = {};
							stringify[this.child[i].key] = this.child[i].stringify();
						}else{
							stringify[this.child[i].key] = {};
							stringify[this.child[i].key] = this.child[i].stringify();
						}
						//stringify[this.key] = this.child[i].stringify();
					}
				}else if(this.type == "Array"){
					if(!this.parent){
						if(stringify == undefined){	
							stringify = {main:[]};
							stringify.main.push(this.child[i].stringify());
						}else{
							stringify.main.push(this.child[i].stringify());
						}
					}else if(this.parent){
						if(stringify == undefined){
							stringify = [];
							stringify.push(this.child[i].stringify());
						}else{
							stringify.push(this.child[i].stringify());
						}
					}
				}else if(this.type == "String"){
					stringify = this.val.val;
				}else if(this.type == "Number"){
					stringify = Number(this.val.val);
				}else if(this.type == "Boolean"){
					stringify = this.val.val;
				}
			}
		}
		return stringify;
	},
	makeJSON : function(Obj){
		this.reset(); // if already json is present then reset
		var type = this.getType(Obj);
		if(type == "Object"){
			this.setType({});
			this.view.setTypeInView();
			for(var key in Obj){
				auto_mk = true;this.add();auto_mk = false;
				this.val.view.setKey(null, null, key);
				this.val.makeJSON(Obj[key]);
			}
		}else if(type == "Array"){
			this.setType([]);
			this.view.setTypeInView();
			for(var i=0;i<Obj.length; i++){
				auto_mk = true;this.add();auto_mk = false;
				this.val.makeJSON(Obj[i]);
			}
		}else if(type == "String" || type == "Number"){
			this.setType(type == "String" ? "" : 0);
			this.view.setTypeInView();
			auto_mk = true;this.add();auto_mk = false;
			this.val.view.setVal(null, null, Obj);
		}else if(type == "Boolean"){
			this.setType(true);
			this.view.setTypeInView();
			auto_mk = true;this.add();auto_mk = false;
			this.val.view.setBoolVal(null, null, Obj);
		}
	},
	json_collection : []
});

function json_view(json_object){
	var _this = this,
	html = "",
	is_object = !json_object.view && json_object.parent && json_object.parent.type == "Object",
	is_array = !json_object.view && json_object.parent && json_object.parent.type == "Array",
	is_string = !json_object.view && json_object.parent && json_object.parent.type == "String",
	is_number = !json_object.view && json_object.parent && json_object.parent.type == "Number",
	is_boolean = !json_object.view && json_object.parent && json_object.parent.type == "Boolean",
	is_firstChild = !json_object.view && json_object.parent && json_object.parent.child.length == 1;

	_this.json_object = json_object;

	if(is_object || is_array){
		if(is_object){
			if(is_firstChild)
			html += "<div class='key_holder'><div class='line'></div>";

			html +=		"<div class='key_row'>" +
							"<div class='remove'></div>" +
							"<div class='key'>";
			//html +=				_this.obOption(json_object);
			html +=				"<span class='objtxt' spellcheck='false' contenteditable></span>" +
							"</div>" +
							"<div class='val nonobj'>";
		}else if(is_array){
			if(is_firstChild)
			html += "<div class='key_holder'><div class='line'></div>";

			html +=		"<div class='key_row'>" +
							"<div class='remove'></div>" +
							"<div class='val nonobj'>";
			//html +=				_this.obOption(json_object);
		}
	}
	
	// only if json_object is of type [Array] or [Object] then json_block going to create
	if(is_object || is_array || !json_object.parent || json_object.view){ 
		html += 				"<div class='json_block'>";
		html += 					_this.json_init(json_object);
		html += 				"</div>";
	}else if(is_number || is_string || is_boolean){
		//html += (json_object.parent.parent.type == "Array" ? _this.obOption(json_object) : "");
		if(is_number){
			html += 			"<span class='objval num' spellcheck='false' contenteditable></span>";
		}else if(is_string){
			html += 			"<span class='objval str' spellcheck='false' contenteditable></span>";
		}else if(is_boolean){
			html += 			"<span class='objval bool' spellcheck='false'></span>";
		}
	}

	if(is_object || is_array){
		if(is_object){
			html +=			"</div>" +
						"</div>";
			if(is_firstChild)
					"</div>";
		}else if(is_array){	
			html +=	"</div>";
			if(is_firstChild)
				"</div>";
		}
	}

	if(is_object || is_array || !json_object.parent || json_object.view){
		if(!json_object.parent || json_object.view){
			_this.html = $(html).find(".json_init").data("op", "close").click(function(e){
				_this.open_option.bind(this)(e, _this);
			}).keypress(function(e){
				_this.triggerClick.bind(this)(e, _this);
			}).find(".op").click(function(e){
				_this.option_controller.bind(this)(e, _this);
			}).keypress(function(e){
				_this.triggerClick.bind(this)(e, _this);
			}).end().end().get(0);
		}else{
			_this.html = $(html).find(".remove").click(function(e){
				_this.remove.bind(this)(e, _this);
			}).parent().find(".json_init").data("op","close").click(function(e){
				_this.open_option.bind(this)(e, _this);
			}).keypress(function(e){
				_this.triggerClick.bind(this)(e, _this);
			}).find(".op").click(function(e){
				_this.option_controller.bind(this)(e, _this);
			}).keypress(function(e){
				_this.triggerClick.bind(this)(e, _this);
			}).end().end().end().end().get(0);
		}
	}else if(is_number || is_string || is_boolean){
		if(!is_boolean){
			_this.html = $(html).blur(function(e){
				_this.setVal.bind(this)(e, _this);
			}).keypress(function(){}).get(0);
		}else if(is_boolean){
			_this.html = $(html).click(function(e){
				_this.setBoolVal.bind(this)(e, _this);
			}).data("value", 1).get(0);	
			$(_this.html).click();
		}
		if(json_object.parent.parent.type == "Array"){
			$(_this.html).mouseenter(function(e){
				_this.bounceEvent.bind(this)(e, _this.json_object.parent.view);
			});
		}
	}

	if(is_object){
		$(_this.html).find(".objtxt").blur(function(e){
			_this.setKey.bind(this)(e, _this);
		}).keypress(function(e){
			if(e.keyCode == 13) e.preventDefault();
		}).mouseenter(function(e){
			_this.bounceEvent.bind(this)(e, _this);
		});
	}
	/* append to the parent */
	if(!json_object.parent && !json_object.view){ // superParent
		$(json_object.parent_el).append(_this.html);
		//$(json_object.parent_el,'>+{0}',[_this.html]);
	}else if(is_firstChild){
		if(is_object || is_array){
			var add_sibling = "<div class='add_obj'></div>",
			collapse_button = "<span class='collapse'></span>";
			add_sibling = $(add_sibling).click(function(e){
				_this.add_sibling.bind(this)(e, _this);
			}).mouseenter(function(e){	
				_this.highLight.bind(this)(e, _this);
			}).mouseleave(function(e){
				_this.highLight.bind(this)(e, _this);
			}).get(0);
			
			collapse_button = $(collapse_button).click(function(){
				_this.json_object.parent.view.exp_collapse();
			}).get(0);
			
			$(json_object.parent_el).find(".json_init").after(_this.html).remove();
			$(_this.html).after(add_sibling).before(collapse_button);
			
			_this.html = $(_this.html).find('.key_row').get(0);
		}else if(is_number || is_string || is_boolean){
			$(json_object.parent_el).find(".json_init").after(_this.html).remove();
		}
	}else if(!json_object.view){ // if view is not present
		if(!json_object.parent.parent){
			$(json_object.parent_el).find(">.key_holder").append(_this.html);
		}else{
			$(json_object.parent_el).find(">.val >.json_block >.key_holder").append(_this.html);
		}
	}
	// auto focuable key and value
	if(auto_mk == false){
		if(_this.json_object.parent){
			if(_this.json_object.parent.type == "Object"){
				var keyEl = $(_this.html).find('.objtxt');
				if(keyEl.length == 1){
					keyEl = keyEl[0];
					selectNode(keyEl);
				}
			}else if(_this.json_object.parent.type == "String" || _this.json_object.parent.type == "Number"){
				selectNode(_this.html);
			}
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
	bounceEvent : function(e, _this){
		$(this).unbind("mouseenter mouseleave").parent().bind("mouseenter mouseleave",function(e){
			_this.showAdvOpt(e, _this);
		})
	},
	showAdvOpt : function(e, _this){
		var el = $(_this.html),
		ob_type = _this.json_object.parent.type == "Array" ? "val >.json_block" : "key";
		//console.log(_this);
		if(e.type == "mouseenter"){
			var html = _this.obOption(_this.json_object);
			if( el.find(">."+ ob_type +">.option_tray").length == 0 ){
				el.find(">."+ ob_type).prepend(html).find(">.option_tray").show(0).find(">ul").animate({left:0}, 100);
			}else{
				el.find(">."+ ob_type +">.option_tray").show(0).find(">ul").animate({left:0}, 100);
			}
		}else if(e.type == "mouseleave"){
			el.find(">."+ ob_type +">.option_tray>ul").animate({left:'-100%'}, 100, function(){ $(this).parent().hide(0) });
		}
	},
	triggerClick : function(e, _this){
		if(e.keyCode == 13){
			this.click();
		}
		e.preventDefault();
	},
	json_init : function(json_object){
		var html = "<div tabindex='0' class='json_init'>" +
			  			"JSON" +
			  			"<div class='json_op'>";
		html += 			this.option(json_object);
		html +=			"</div>" +
			  		"</div>";
		return html;
	},
	option : function(json_object){
		var _Object = "<input type='button' value='{} Object' class='op _Object'/>",
			_Array 	= "<input type='button' value='[] Array' class='op _Array'/>",
			_String	= "<input type='button' value='\"\" String' class='op _String'/>",
			_Number	= "<input type='button' value='0 Number' class='op _Number'/>",
			_Boolean = "<input type='button' value='Boolean' class='op _Boolean'/>",
			html 	= "";

		if(json_object == json_object.superParent){
			html += _Object + _Array;
		}else{
			html += _String + _Number + _Boolean + _Object + _Array;
		}
		return html;
	},
	obOption : function(json_object){
		var option_tray = 	"<div class='option_tray'>" +
								"<ul>" +
									"<li class='op_item'>" +
										"<span class='ops remove_obj' title='Remove'></span>" +
									"</li>" +
									"<li class='op_item'>" +
										"<span class='ops reset_obj' title='Reset'></span>" +
									"</li>" +
									"<li class='op_item'>" +
										"<span class='ops clone_obj' title='Clone'></span>" +
									"</li>" +
								"</ul>" +
							"</div>";
		return option_tray;
	},
	option_controller : function(e, _this){
		var el = $(this);
		if(el.hasClass("_Object")){
			_this.json_object.setType({});
			_this.setTypeInView();
		}else if(el.hasClass("_Array")){
			_this.json_object.setType([]);
			_this.setTypeInView();
		}else if(el.hasClass("_String")){
			_this.json_object.setType("");
			_this.setTypeInView();
		}else if(el.hasClass("_Number")){
			_this.json_object.setType(0);
			_this.setTypeInView();
		}else if(el.hasClass("_Boolean")){
			_this.json_object.setType(true);
			_this.setTypeInView();
		}
		el.parent().removeClass("show");
		_this.json_object.add();
		e.stopPropagation();
	},
	setTypeInView : function(){
		if(this.json_object.type == "Object"){
			if( $(this.html).hasClass("json_block") ){
				$(this.html).removeClass("iarr").addClass("iobj");
			}else{
				$(this.html).find(".json_block").removeClass("iarr").addClass("iobj");
			}
		}else if(this.json_object.type == "Array"){
			if( $(this.html).hasClass("json_block") ){
				$(this.html).removeClass("iobj").addClass("iarr");
			}else{
				$(this.html).find(".json_block").removeClass("iobj").addClass("iarr");
			}
		}else if(this.json_object.type == "Object"){
			$(this.html).removeClass("iarr iobj");
		}else if(this.json_object.type == "Number"){
			$(this.html).removeClass("iarr iobj");
		}else if(this.json_object.type == "Boolean"){
			$(this.html).removeClass("iarr iobj");
		}
	},
	open_option : function(e, _this){
		var el = $(this);
		if(el.data("op") == "close"){
			el.data("op", "open").find(".json_op").addClass("show");
		}else{
			el.data("op","close").find(".json_op").removeClass("show");
		}
	},
	setKey : function(e, _this, key){
		if(!key){ // called by blur event
			key = $(this).text();
			if(key){
				_this.json_object.setKey(key);
			}
		}else if(key){ // called by programatic
			$(this.html).find(".objtxt").append(key);
			this.json_object.setKey(key);
		}
	},
	setVal : function(e, _this, val){
		if(e == null){ // we pass e as null when setVal get called manually
			$(this.html).text(val); // value should be put as text only
			this.json_object.setVal(val);
		}else if(e != null){ // setVal event get called by event
			var v = $(this).text();
			_this.json_object.setVal(v);
		}
	},
	setBoolVal : function(e, _this, val){
		if(e == null){
			switch(val){
				case true:
					this.json_object.setVal(true);
					$(this.html).html("true").data("value", 0);
					break;
				case false:
					this.json_object.setVal(false);
					$(this.html).html("false").data("value", 1);
					break;
			}
		}else if(e != null){
			var el = $(this),
			v = el.data("value");
			switch(v){
				case 1:
					_this.json_object.setVal(true);
					el.html("true").data("value", 0);
					break;
				case 0:
					_this.json_object.setVal(false);
					el.html("false").data("value", 1);
					break;
			}
		}
	},
	add_sibling : function(e, _this){
		_this.json_object.add_sibling();
	},
	remove: function(e, _this){
		$(_this.json_object.view.html).remove(); // removed the element from DOM
		_this.json_object.remove();
	},
	reset: function(){
		var resetView = new this.constructor(this.json_object);
		if(this.json_object.parent){
			["String", "Number"].indexOf(this.json_object.parent.type) != -1 ? $(this.json_object.parent.view.html).find(">.val").removeClass("obj").addClass("nonobj").find(">.json_block").after(resetView.html).remove() : $(this.html).find(">.val").removeClass("obj").addClass("nonobj").find(">.json_block").after(resetView.html).remove();
		}else{
			$(this.html).after(resetView.html).remove();
			this.html = resetView.html;
		}
		var path = $(this.html).find(".path");
		if( path.length > 0) path.remove();
	},
	highLight: function(e, _this){
		if(e.type == "mouseenter") _this.json_object.parent != _this.json_object.superParent ? $(_this.json_object.parent_el).find(">.val>.json_block>.key_holder").addClass("to_add") : $(_this.json_object.parent_el).find(">.key_holder").addClass("to_add");
		else _this.json_object.parent != _this.json_object.superParent ? $(_this.json_object.parent_el).find(">.val>.json_block>.key_holder").removeClass("to_add") : $(_this.json_object.parent_el).find(">.key_holder").removeClass("to_add");
	},
	setAccessName: function(name){
		if(this.json_object.type){	
			var html = "<span class='path'>"+ name +"</span>";
			if(this.json_object.type == "String" || this.json_object.type == "Number" || this.json_object.type == "Boolean"){
				var el = $(this.html).find(">.val>.json_block>.path");
				if(el.length) el.remove();
				$(this.html).find(">.val>.json_block").append(html);
			}else if(this.json_object.parent){
				if(this.json_object.parent.type == "Object"){
					var el = $(this.html).find('>.key>.path');
					if(el.length) el.remove();
					$(this.html).find(">.key").append(html);
				}else if(this.json_object.parent.type == "Array"){
					var el = $(this.html).find('>.val>.json_block>.path');
					if(el.length) el.remove();
					$(this.html).find(">.val>.json_block").append(html);
				}
			}else if(this.json_object == this.json_object.superParent){
				var el = $(this.html);
				el.find(">.path").length == 1 ? el.find(">.path").remove().end().append(html) : $(this.html).append(html);
			}
		}
	},
	exp_collapse: function(){
		var view = $(this.html);
		if( view.hasClass("row_collapse") ){
			view.removeClass("row_collapse");
			this.json_object.collapse = false;
		}else{
			view.addClass("row_collapse");
			this.json_object.collapse = false;
		}
	}
});

Array.prototype.flat = function(obj){
    var a= [],cf = false;
    for(var i=0; i<this.length; i++){
        if(this[i] instanceof Array){
            for(var c=0; c<this[i].length; c++){
                if(this[i][c] instanceof Array){
                    cf = true;
                    //a.push(this.flat(this[i][c]));
                    a.push(this[i][c].flat());
                }else{
                    a.push(this[i][c])
                }
            }
        }else{
            a.push(this[i]);
        }
    }
    //if(cf) a = this.flat(a);
    if(cf) a = a.flat();
    return a;
}
function selectNode(node){
	var selection = window.getSelection(),
	range = document.createRange();
	range.selectNodeContents(node);
	selection.removeAllRanges();
	selection.addRange(range);
}