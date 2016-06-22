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
			if(this.parent) $(this.view.html,'?{>.val}.&x{nonobj}.&+{obj}');
			this.val = new this.constructor({
				type : key,
				parent : this,
				val : key,
				view : this.view.html
			});
			this.getAccessName();
		}else if(this.type == "Object"){
			if(this.parent) $(this.view.html,'?{>.val}.&x{nonobj}.&+{obj}');
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
	}
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
							"<div class='key'>" +
								"<span class='objtxt' spellcheck='false' contenteditable></span>" +
							"</div>" +
							"<div class='val nonobj'>";
		}else if(is_array){
			if(is_firstChild)
			html += "<div class='key_holder'><div class='line'></div>";

			html +=		"<div class='key_row'>" +
							"<div class='remove'></div>" +
							"<div class='val nonobj'>";
		}
	}
	
	// only if json_object is of type [Array] or [Object] then json_block going to create
	if(is_object || is_array || !json_object.parent || json_object.view){ 
		html += 				"<div class='json_block'>";
		html += 					_this.json_init(json_object);
		html += 				"</div>";
	}else if(is_number || is_string || is_boolean){
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
		var selector;
		if(!json_object.parent || json_object.view){
			selector = '?{.json_init}.#{op=close}.+={click,1}.+={keypress,3}.?{.op}.+={click,2}.+={keypress,3}....';
		}else{
			selector = '?{.remove}.+={click,0}.^.?{.json_init}.#{op=close}.+={click,1}.+={keypress,3}.?{.op}.+={click,2}.+={keypress,3}........';
		}
		_this.html = $('<->',html)._(selector, [
			function(e){
				_this.remove.bind(this)(e, _this);
			}, function(e){
				_this.open_option.bind(this)(e, _this);
			}, function(e){
				_this.option_controller.bind(this)(e, _this);
			}, function(e){
				_this.triggerClick.bind(this)(e, _this);
			}
		])[0];
	}else if(is_number || is_string || is_boolean){
		if(!is_boolean){
			_this.html = $('<->',html)._('+={blur,0}.+={keypress,1}',[
				function(e){
					_this.setVal.bind(this)(e, _this);
				},
				function(e){
					/*if(_this.json_object.parent.type == "Number"){
						if(isNaN(String.fromCharCode(e.charCode))){
							e.preventDefault();
						}
					}
					if(e.charCode == 13)e.preventDefault();*/
				}
			])[0];
		}else if(is_boolean){
			_this.html = $('<->',html)._('+={click}.#{value=1}', function(e){
				_this.setBoolVal.bind(this)(e, _this);
			})[0];
			_this.html.click();
		}
	}

	if(is_object){
		$(_this.html, '?{.objtxt}.+={blur,0}.+={keypress,1}', [
			function(e){
				_this.setKey.bind(this)(e, _this);
			},
			function(e){
				if(e.keyCode == 13)e.preventDefault();
			}
		]);
	}
	/* append to the parent */
	if(!json_object.parent && !json_object.view){ // superParent
		$(json_object.parent_el,'>+{0}',[_this.html]);
	}else if(is_firstChild){
		if(is_object || is_array){
			var add_sibling = "<div class='add_obj'></div>",
			collapse_button = "<span class='collapse'></span>";
			add_sibling = $('<->',add_sibling)._('+={click,0}.+={mouseenter,1}.+={mouseleave,1}',[
				function(e){
					_this.add_sibling.bind(this)(e, _this);
				},
				function(e){
					_this.highLight.bind(this)(e, _this);
				}
			])[0];
			collapse_button = $('<->',collapse_button)._('+={click,0}', [
				function(e){
					_this.json_object.parent.view.exp_collapse();
				}
			])[0];
			$(json_object.parent_el,'?{.json_init}.>|{0}.x',[_this.html]);
			$(_this.html,'>|{0}.|<{1}',[add_sibling,collapse_button]);
			_this.html = $(_this.html,'?{.key_row}')[0];
		}else if(is_number || is_string || is_boolean){
			$(json_object.parent_el,'?{.json_init}.>|{0}.x',[_this.html]);
		}
	}else if(!json_object.view){ // if view is not present
		if(!json_object.parent.parent){
			$(json_object.parent_el,'?{>.key_holder}.>+{0}',[_this.html]);
		}else{
			$(json_object.parent_el,'?{>.val >.json_block >.key_holder}.>+{0}',[_this.html]);
		}
	}
	// auto focuable key and value
	if(auto_mk == false){
		if(_this.json_object.parent){
			if(_this.json_object.parent.type == "Object"){
				var keyEl = $(_this.html,'?{.objtxt}');
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
	option_controller : function(e, _this){
		var el = $(this);
		if(el._("&h{_Object}")){
			_this.json_object.setType({});
			_this.setTypeInView();
		}else if(el._("&h{_Array}")){
			_this.json_object.setType([]);
			_this.setTypeInView();
		}else if(el._("&h{_String}")){
			_this.json_object.setType("");
			_this.setTypeInView();
		}else if(el._("&h{_Number}")){
			_this.json_object.setType(0);
			_this.setTypeInView();
		}else if(el._("&h{_Boolean}")){
			_this.json_object.setType(true);
			_this.setTypeInView();
		}
		el._('^.&x{show}');
		_this.json_object.add();
		e.stopPropagation();
	},
	setTypeInView : function(){
		if(this.json_object.type == "Object"){
			if( $(this.html, '&h{json_block}') ){
				$(this.html,'&x{iarr}.&+{iobj}');
			}else{
				$(this.html,'?{.json_block}.&x{iarr}.&+{iobj}');
			}
		}else if(this.json_object.type == "Array"){
			if( $(this.html, '&h{json_block}') ){
				$(this.html,'&x{iobj}.&+{iarr}');
			}else{
				$(this.html,'?{.json_block}.&x{iobj}.&+{iarr}');
			}
		}else if(this.json_object.type == "Object"){
			$(this.html,'&x{iarr iobj}');
		}else if(this.json_object.type == "Number"){
			$(this.html,'&x{iarr iobj}');
		}else if(this.json_object.type == "Boolean"){
			$(this.html,'&x{iarr iobj}');
		}
	},
	open_option : function(e, _this){
		var el = $(this);
		if(el._('#{op}') == "close"){
			el._('#{op=open}.?{.json_op}.&+{show}');
		}else{
			el._('#{op=close}.?{.json_op}.&x{show}');
		}
	},
	setKey : function(e, _this, key){
		if(!key){ // called by blur event
			key = $(this,',');
			if(key){
				_this.json_object.setKey(key);
			}
		}else if(key){ // called by programatic
			$(this.html, '?{.objtxt}.>+{0}', [key]);
			this.json_object.setKey(key);
		}
	},
	setVal : function(e, _this, val){
		if(e == null){ // we pass e as null when setVal get called manually
			$(this.html, 'e{0}', [{textContent:val}]); // value should be put as text only
			this.json_object.setVal(val);
		}else if(e != null){ // setVal event get called by event
			var v = $(this,',');
			_this.json_object.setVal(v);
		}
	},
	setBoolVal : function(e, _this, val){
		if(e == null){
			switch(val){
				case true:
					this.json_object.setVal(true);
					$(this.html)._("e{innerHTML=true}.#{value=0}");
					break;
				case false:
					this.json_object.setVal(false);
					$(this.html)._("e{innerHTML=false}.#{value=1}");
					break;
			}
		}else if(e != null){
			var el = $(this),
			v = el._('#{value}');
			switch(v){
				case '1':
					_this.json_object.setVal(true);
					el._("e{innerHTML=true}.#{value=0}");
					break;
				case '0':
					_this.json_object.setVal(false);
					el._("e{innerHTML=false}.#{value=1}");
					break;
			}
		}
	},
	add_sibling : function(e, _this){
		_this.json_object.add_sibling();
	},
	remove: function(e, _this){
		$(_this.json_object.view.html ,'x'); // removed the element from DOM
		_this.json_object.remove();
	},
	reset: function(){
		var resetView = new this.constructor(this.json_object);
		if(this.json_object.parent){
			var sr = '?{>.val}.&x{obj}.&+{nonobj}.?{>.json_block}.>|{0}.x';
			if(["String", "Number"].indexOf(this.json_object.parent.type) != -1){
				$(this.json_object.parent.view.html, sr, [resetView.html]);
			}else{
				$(this.html, sr, [resetView.html]);
			}
		}else{
			$(this.html, '>|{0}.x', [resetView.html]);
			this.html = resetView.html;
		}
		var path = $(this.html,'?{.path}');
		if( path.length > 0){
			path._("x");
		}
	},
	highLight: function(e, _this){
		if(e.type == "mouseenter"){
			if(_this.json_object.parent != _this.json_object.superParent){
				$(_this.json_object.parent_el,'?{>.val>.json_block>.key_holder}.&+{to_add}');
			}else{
				$(_this.json_object.parent_el,'?{>.key_holder}.&+{to_add}');
			}
		}else{
			if(_this.json_object.parent != _this.json_object.superParent){
				$(_this.json_object.parent_el,'?{>.val>.json_block>.key_holder}.&x{to_add}');
			}else{
				$(_this.json_object.parent_el,'?{>.key_holder}.&x{to_add}');
			}
		}
	},
	setAccessName: function(name){
		if(this.json_object.type){	
			var html = "<span class='path'>"+ name +"</span>";
			if(this.json_object.type == "String" || this.json_object.type == "Number" || this.json_object.type == "Boolean"){
				var el = $(this.html,'?{>.val>.json_block>.path}');
				if(el.length) el._("x");
				$(this.html,'?{>.val>.json_block}.>+{0}',[html]);
			}else if(this.json_object.parent){
				if(this.json_object.parent.type == "Object"){
					var el = $(this.html,'?{>.key>.path}');
					if(el.length) el._("x");
					$(this.html,'?{>.key}.>+{0}',[html]);
				}else if(this.json_object.parent.type == "Array"){
					var el = $(this.html,'?{>.val>.json_block>.path}');
					if(el.length) el._("x");
					$(this.html,'?{>.val>.json_block}.>+{0}',[html]);
				}
			}else if(this.json_object == this.json_object.superParent){
				var el = $(this.html);
				if(el._('?{>.path}').length == 1){
					el._('x...>+{0}',[html]);
				}else{
					$(this.html,'>+{0}',[html]);
				}
			}
		}
	},
	exp_collapse: function(){
		var view = $(this.html);
		if(view._('&h{row_collapse}')){
			view._('&x{row_collapse}');
			this.json_object.collapse = false;
		}else{
			view._('&+{row_collapse}');
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