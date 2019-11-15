/**
 * jquery-table4panes 0.1.0 - jQuery plugin to split the table to four panes.
 *
 * Copyright (c) 2019 ASAI Etsuhisa
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 *
 * Split the table to four panes.
 *
 * [Usage]
 * = JavaScript =
 * constractor
 *   new Table4Panes(selector)
 *   @param {String} selector (in) selector string of table node(s) to split to the panes.
 * method
 *   Table4Panes.apply(col_num, row_num, settings)
 * 
 * = jQuery =
 * method
 *   $.fn.table4panes(col_num, row_num, settings)
 *   @param {jQuery} this (in) table node(s) to split to the panes.
 *
 * = common parameters/return value =
 * @param col_num  (in) number of columns to fix
 * @param row_num  (in) number of rows to fix
 * @param settings (in) settings for table4panes
 *   "display-method": ("inline-block"|"table-cell"|"flex"|"float") - Select the method.
 *   "fit": (true|flase) - If true, fit the bottom right pane fits the parent node.
 *   ("height"|"top-height"|"bottom-height"|"width"|"left-width"|"right-width"): size - Set the size.
 *   "fix-width-rows": [lower,upper] or "dummy" - Fix the width of columns
 *                     with the specified numbers of lower/upper row.
 *   "prefix": "prefix" - Set the prefix for the class name.
 * @return If single table, return sigle div node. If muntiple tables, return multiple div nodes.
 *
 * From:
 * +- table id --------------------------+
 * | (col_num + ***) x (row_num + ***)   |
 * |                                     |
 * | # with or without thead/tbody/th/td |
 * +-------------------------------------+
 *
 * To:
 * +- div table4panes -------------------------------------------+
 * |      #id-table4panes                                        |
 * |      .prefix                                                |
 * | +- div left ----------------+ +- div right ---------------+ |
 * | |      #id-left             | |      #id-right            | |
 * | |      .prefix-left         | |      .prefix-right        | |
 * | | +- div top-left --------+ | | +- div top-right -------+ | |
 * | | |      #id-top-left     | | | |      #id-top-right    | | |
 * | | |      .prefix-top      | | | |      .prefix-top      | | |
 * | | |      .pane            | | | |      .pane            | | |
 * | | | +- table -----------+ | | | | +- table -----------+ | | |
 * | | | | col_num x row_num | | | | | | *** x row_num     | | | |
 * | | | +-------------------+ | | | | +-------------------+ | | |
 * | | +-----------------------+ | | +-----------------------+ | |
 * | | +- div bottom-left -----+ | | +- div bottom-right--- -+ | |
 * | | |      #id-bottom-left  | | | |      #id-bottom-right | | |
 * | | |      .prefix-bottom   | | | |      .prefix-bottom   | | |
 * | | |      .pane            | | | |      .pane            | | |
 * | | | +- table -----------+ | | | | +- table id --------+ | | |
 * | | | | col_num x ***     | | | | | | *** x ***         | | | |
 * | | | +-------------------+ | | | | +-------------------+ | | |
 * | | +-----------------------+ | | +-----------------------+ | |
 * | +---------------------------+ +---------------------------+ |
 * +-------------------------------------------------------------+
 *
 */
var Table4Panes = (function() {
	var Table4Panes = function(target) {
		if(this instanceof Table4Panes == false) {
			return new Table4Panes(target);
		}
		this.target = target;
	}
	return Table4Panes;
})();
(function(){
	/**
	 * getSubtractedNums(num)
	 * Get the array with the number of rowspan subtracted.
	 * @param this (in) parent node of tr
	 * @param num (in) number to move
	 * @return array of number of column to move.
	 */
	var getSubtractedNums = function(num){
		var nums = new Array(this.children.length);
		/** Compatible with browsers where 'fill' is not defined */
		if(Array.prototype.fill){
			nums.fill(num);
		}
		else{
			for(var i = 0; i < this.children.length; i++){
				nums[i] = num;
			}
		}
		/** tr list */
		for(var i = 0; i < this.children.length; i++){
			var tr = this.children[i];
			/** th/td list */
			for(var j = 0; j < nums[i] && j < tr.children.length; j++){
				var td = tr.children[j];
				/** Subtract rowspan from number of column to move. */
				var colspan = td.colSpan - 1;
				for(var k = 1; k < td.rowSpan && i + k < nums.length; k++){
					nums[i + k] -= 1 + colspan;
				}
			}
		}
		return nums;
	}
	/**
	 * moveToNewTable(kind, num)
	 * Move rows/columns to a newly created table that inherits the source table/thead/tbody.
	 * The function treats the DOM object only, expect this.
	 * @param this (in) source table node
	 * @param kind (in) "row", "col"
	 * @param num  (in) number to move
	 * @return the created table
	 */
	var moveToNewTable = function(kind, num){
		/** Clone the node without children and id. */
		var src = this;
		var dst = src.cloneNode(false);
		dst.removeAttribute("id");
		/** If no move, return the clone node only. */
		if(num <= 0) return dst;
		/** Array of number of columns to move for each tr node. */
		var nums = null;
		/** Apply process for each child node. */
		for(var i = 0; i < src.children.length; i++){
			var elm = src.children[i];
			var tag = elm.nodeName.toLowerCase();
			/** Recall to subnodes (thead/tbody -> [tr], tr -> [th/td]). */
			if(tag == "thead" || tag == "tbody" || (tag == "tr" && kind == "col")){
				if(tag == "tr" && kind == "col"){
					if(nums == null){
						nums = getSubtractedNums.call(this, num);
					}
					num = nums[i];
				}
				var chld = dst.appendChild(moveToNewTable.call(elm, kind, num));
				if(kind == "row"){
					num -= chld.children.length;
					if(num <= 0) break;
				}
				if(tag != "tr" && elm.children.length <= 0){
					/** Compatible with browsers where 'remove' is not defined */
					elm.parentNode.removeChild(elm);
					i--;
				}
			}
			/** Move to destination node (row -> tr, col -> th/td). */
			else if(tag == "tr" || tag == "th" || tag == "td"){
				dst.appendChild(elm);
				i--;
				num -= (elm.colSpan || 1);
				if(num <= 0) break;
			}
		}
		return dst;
	}
	/**
	 * getStyle(elm)
	 * @param elm (in) element
	 * @return style of element.
	 */
	var getStyle = function(elm){
		return (elm.currentStyle || document.defaultView.getComputedStyle(elm, ''));
	}
	/**
	 * getWidth(elm)
	 * @param elm (in) element
	 * @return width of element.
	 */
	var getWidth = function(elm){
		var width;
		var style = getStyle(elm);
		if(style.width.indexOf("px") == -1){
			var rect = elm.getBoundingClientRect();
			width = rect.width;
		}
		else{
			width = parseFloat(style.width);
		}
		return width;
	}
	/**
	 * getHeight(elm)
	 * @param elm (in) element
	 * @return height of element.
	 */
	var getHeight = function(elm){
		var height;
		var style = getStyle(elm);
		if(style.height.indexOf("px") == -1){
			var rect = elm.getBoundingClientRect();
			height = rect.height;
		}
		else{
			height = parseFloat(style.height);
		}
		return height;
	}
	/**
	 * getWidthCols(row_num)
	 * @param this (in) table node
	 * @param row_nums (in) numbers of rows to get width.
	 * @return the array of width of all columns in the first row.
	 */
	var getWidthCols = function(row_num){
		var arr = [];
		var elms;
		if(this.nodeName.toLowerCase() == "tr"){
			elms = this.children;
		}
		else{
			var trs = this.querySelectorAll("tr");
			elms = trs[row_num].children;
		}
		for(var i = 0; i < elms.length; i++){
			arr.push(Math.ceil(getWidth(elms[i])));
		}
		return arr;
	}
	/**
	 * getHeightRows()
	 * @param this (in) table node
	 * @return the array of height of all rows.
	 */
	var getHeightRows = function(){
		var arr = [];
		var elms = this.querySelectorAll("tr");
		for(var i = 0; i < elms.length; i++){
			arr.push(Math.ceil(getHeight(elms[i])));
		}
		return arr;
	}
	/**
	 * setWidthCols(arr, row_num)
	 * Set width of all columns in the first row.
	 * @param this (in) table node
	 * @param arr (in) width of columns
	 * @param row_nums (in) numbers of rows to set width.
	 * @return this.
	 */
	var setWidthCols = function(arr, row_num){
		var elms;
		if(this.nodeName.toLowerCase() == "tr"){
			elms = this.children;
		}
		else{
			var trs = this.querySelectorAll("tr");
			elms = trs[row_num].children;
		}
		for(var i = 0; i < elms.length; i++){
			setFixWidth.call(elms[i], arr[i]);
		}
		return this;
	}
	/**
	 * reapplyWidthCols(row_num)
	 * Set width of all columns in the specified rows.
	 * @param this (in) table node
	 * @param row_nums (in) numbers of rows to set width.
	 * @return this
	 */
	var reapplyWidthCols = function(row_num){
		var trs = this.querySelectorAll("tr");
		var width_cols = [];
		for(var i = row_num[0]; i < trs.length && i < row_num[1]+1; i++){
			width_cols.push(getWidthCols.call(trs[i], null));
		}
		for(var i = row_num[0]; i < trs.length && i < row_num[1]+1; i++){
			setWidthCols.call(trs[i], width_cols[i]);
		}
		return this;
	}
	/**
	 * setHeightRows(arr)
	 * Set height of all rows.
	 * @param this (in) table node
	 * @param arr (in) height of rows
	 * @return this.
	 */
	var setHeightRows = function(arr){
		var elms = this.querySelectorAll("tr");
		for(var i = 0; i < elms.length; i++){
			setFixHeight.call(elms[i], arr[i]);
		}
		return this;
	}
	/**
	 * setFixWidth(val)
	 * Set width/min-width/max-width of the node.
	 * @param this (in) target node
	 * @param val (in) width
	 * @return this.
	 */
	var setFixWidth = function(val){
		if(typeof val == "number") val = val+"px";
		this.style.width = val;
		this.style.minWidth = val;
		this.style.maxWidth = val;
		return this;
	}
	/**
	 * setFixHeight(val)
	 * Set height/min-height/max-height of the node.
	 * @param this (in) target node
	 * @param val (in) height
	 * @return this.
	 */
	var setFixHeight = function(val){
		if(typeof val == "number") val = val+"px";
		this.style.height = val;
		this.style.minHeight = val;
		this.style.maxHeight = val;
		return this;
	}
	/**
	 * createDummyRow(col_num)
	 * Create dummy row to fix width of columns.
	 * @param this (in) target node
	 * @param col_num (in) number of columns
	 * @return object of dummy row.
	 */
	var createDummyRow = function(col_num){
		var dummy = {};
		var tr = document.createElement("tr");
		var trs = this.querySelectorAll("tr");
		var elms = trs[0].children;
		for(var i = 0; i < elms.length; i++){
			for(var j = 0; j < elms[i].colSpan; j++){
				tr.appendChild(document.createElement("td"));
			}
		}
		var parent = trs[trs.length-1].parentNode;
		parent.appendChild(tr);
		var widths = [];
		elms = tr.children;
		for(var i = 0; i < elms.length; i++){
			widths.push(getWidth(elms[i]));
		}
		dummy.left_widths = widths.slice(0, col_num);
		dummy.right_widths = widths.slice(col_num);
		dummy.right_tr = tr;
		tr.parentNode.removeChild(tr);
		dummy.left_tr = document.createElement("tr");
		elms = tr.children;
		for(var i = 0; i < col_num; i++){
			dummy.left_tr.appendChild(elms[i]);
		}
		return dummy;
	}
	/**
	 * wrap(tag, tag_id)
	 * Create dummy row to fix width of columns.
	 * @param this (in) target node
	 * @param tag (in) tag name to wrap
	 * @param tag_id (in) id of new node
	 * @return new node.
	 */
	var wrap = function(tag, tag_id){
		var node = document.createElement(tag);
		if(tag_id) node.setAttribute("id", tag_id);
		if(this.parentNode){
			this.parentNode.insertBefore(node, this);
		}
		node.appendChild(this);
		return node;
	}
	/**
	 * insert_first(tag, nodes)
	 * Insert new node at first.
	 * @param this (in) target node
	 * @param tag (in) tag name to insert
	 * @param nodes (in) child nodes
	 * @return new node.
	 */
	var insert_first = function(selector, new_node){
		var selnode = this.querySelectorAll(selector);
		if(selnode.length == 0){
			this.appendChild(new_node);
		}
		else{
			selnode[0].parentNode.insertBefore(new_node, selnode[0]);
		}
		return new_node;
	}
	/**
	 * Body of table4panes.
	 */
	var table4panes_body = function(index, col_num, row_num, settings){
		/** Do not process if the target node is not "table". */
		if(this.nodeName.toLowerCase() != "table") return;
		/** Set the default class name prefix, if no prefix. */
		var prefix = "table4panes";
		if(settings && settings["prefix"]) prefix = settings["prefix"];
		/** Decide IDs. */
		var id_table = this.getAttribute("id");
		var id_table4panes = id_table + "-table4panes";
		var id_left = id_table + "-left";
		var id_right = id_table + "-right";
		var id_top_left = id_table + "-top-left";
		var id_bottom_left = id_table + "-bottom-left";
		var id_top_right = id_table + "-top-right";
		var id_bottom_right = id_table + "-bottom-right";
		/** Do not process if already applied. */
		if(document.getElementById(id_table4panes)) return;
		/* Set ID if this  */
		if(!id_table){ /** table has no ID */
			id_table = prefix+index;
			this.setAttribute("id", id_table);
		}
		/** Fix width/height. */
		var dummy_row = null;
		var fix_width_rows = [0, row_num];
		if(settings && settings["fix-width-rows"]){
			fix_width_rows = settings["fix-width-rows"];
		}
		if(fix_width_rows == "dummy"){
			dummy_row = createDummyRow.call(this, col_num);
		}
		else{
			reapplyWidthCols.call(this, fix_width_rows); /* Fix width of columns */
		}
		var row_heights = getHeightRows.call(this); /* Get height of rows */
		/** Prepare to split the table. */
		this.style.tableLayout = "fixed";
		this.classList.add("pane");
		/** Move rows/columns. Set height/width. Wrap with div node. */
		var table_bottom_right = this;
		var table_bottom_left = moveToNewTable.call(table_bottom_right, "col", col_num);
		var div_right = wrap.call(table_bottom_right, "div", id_right);
		var div_left = wrap.call(table_bottom_left, "div", id_left);
		setHeightRows.call(table_bottom_right, row_heights);
		setHeightRows.call(table_bottom_left, row_heights);
		var table_top_right = moveToNewTable.call(table_bottom_right, "row", row_num);
		var table_top_left = moveToNewTable.call(table_bottom_left, "row", row_num);
		/** Insert tables so that they are in the order of top left, bottom left, top right, bottom right. */
		div_right.insertBefore(table_top_right, table_bottom_right);
		div_left.insertBefore(table_top_left, table_bottom_left);
		/** Wrap table with div node. */
		var div_table4panes = wrap.call(div_right, "div", id_table4panes);
		div_table4panes.insertBefore(div_left, div_right);
		/** Insert the dummy rows to top of each pane. */
		if(dummy_row){
			insert_first.call(table_top_left, "tr", dummy_row.left_tr);
			setWidthCols.call(table_top_left, dummy_row.left_widths, 0);
			insert_first.call(table_bottom_left, "tr",
				dummy_row.left_tr.cloneNode(true));
			setWidthCols.call(table_bottom_left, dummy_row.left_widths, 0);
			insert_first.call(table_top_right, "tr", dummy_row.right_tr);
			setWidthCols.call(table_top_right, dummy_row.right_widths, 0);
			insert_first.call(table_bottom_right, "tr",
				dummy_row.right_tr.cloneNode(true));
			setWidthCols.call(table_bottom_right, dummy_row.right_widths, 0);
		}
		/** Wrap each tables with div node. */
		var div_bottom_right = wrap.call(table_bottom_right, "div", id_bottom_right);
		var div_bottom_left = wrap.call(table_bottom_left, "div", id_bottom_left);
		var div_top_right = wrap.call(table_top_right, "div", id_top_right);
		var div_top_left = wrap.call(table_top_left, "div", id_top_left);
		/** Add classes for each div nodes. */
		div_table4panes.classList.add(prefix);
		div_right.classList.add(prefix+"-right");
		div_left.classList.add(prefix+"-left");
		div_top_left.classList.add(prefix+"-top");
		div_top_right.classList.add(prefix+"-top");
		div_bottom_left.classList.add(prefix+"-bottom");
		div_bottom_right.classList.add(prefix+"-bottom");
		/** Set overflow style for each div node. */
		div_bottom_right.style.overflowX = "scroll";
		div_bottom_right.style.overflowY = "scroll";
		div_top_right.style.overflowX = "hidden";
		div_top_right.style.overflowY = "scroll";
		div_bottom_left.style.overflowX = "scroll";
		div_bottom_left.style.overflowY = "hidden";
		div_top_left.style.overflowX = "hidden";
		div_top_left.style.overflowY = "hidden";
		/** Set the side-by-side CSS property. */
		switch(settings["display-method"]){
		case "inline-block" :
			div_left.style.display = "inline-block";
			div_right.style.display = "inline-block";
			break;
		case "table-cell" :
			div_table4panes.style.display = "table";
			div_table4panes.style.tableLayout = "fixed";
			div_table4panes.style.margin = "0 auto";
			div_left.style.display = "table-cell";
			div_right.style.display = "table-cell";
			break;
		case "flex" :
			div_table4panes.style.display = "flex";
			break;
		case "float" :
		default :
			div_left.style.float = "left";
			break;
		}
		/** Set height/width from settings. */
		Object.keys(settings).forEach(function(param){
			switch(param){
			case "height" :
				setFixHeight.call(div_table4panes, settings[param]);
				break;
			case "top-height" :
				setFixHeight.call(div_top_left, settings[param]);
				setFixHeight.call(div_top_right, settings[param]);
				break;
			case "bottom-height" :
				setFixHeight.call(div_bottom_left, settings[param]);
				setFixHeight.call(div_bottom_right, settings[param]);
				break;
			case "width" :
				setFixWidth.call(div_table4panes, settings[param]);
				break;
			case "left-width" :
				setFixWidth.call(div_top_left, settings[param]);
				setFixWidth.call(div_bottom_left, settings[param]);
				break;
			case "right-width" :
				setFixWidth.call(div_top_right, settings[param]);
				setFixWidth.call(div_bottom_right, settings[param]);
				break;
			}
		});
		/** Fit the parent div container. */
		/** Recalculate height/width of bottom right when resizing. */
		if(settings["fit"]){
			if(!div_table4panes.style.width) div_table4panes.style.width = "100%";
			if(!div_table4panes.style.height) div_table4panes.style.height = "100%";
			var dw = div_right.offsetWidth-div_top_right.clientWidth;
			var dh = div_bottom_left.offsetHeight-div_bottom_left.clientHeight;
			var resize_func = function(){
				var w = div_table4panes.clientWidth-div_left.offsetWidth-dw;
				var h = div_table4panes.clientHeight-div_top_left.offsetHeight-dh;
				setFixWidth.call(div_top_right, w);
				setFixWidth.call(div_bottom_right, w);
				setFixHeight.call(div_bottom_left, h);
				setFixHeight.call(div_bottom_right, h);
			}
			window.addEventListener('resize', resize_func);
			resize_func.call();
		}
		/** Set scroll events to move in sync. */
		div_top_right.addEventListener('scroll', function(){
			div_top_left.scrollTop = div_top_right.scrollTop;
		});
		div_bottom_left.addEventListener('scroll', function(){
			div_top_left.scrollLeft = div_bottom_left.scrollLeft;
		});
		div_bottom_right.addEventListener('scroll', function(){
			div_bottom_left.scrollTop = div_bottom_right.scrollTop;
			div_top_right.scrollLeft = div_bottom_right.scrollLeft;
		});
		/** Return the top level node. */
		return div_table4panes;
	};
	/**
	 * Call this function to split the table to four panes.
	 */
	Table4Panes.prototype.apply = function(col_num, row_num, settings){
		var top_nodes = [];
		var elms = document.querySelectorAll(this.target);
		elms.forEach(function(elm, i) {
			top_nodes.push(table4panes_body.call(elm, i, col_num, row_num, settings));
		});
		return top_nodes.length == 1 ? top_nodes[0] : top_nodes;
	}
	/**
	 * jQuery Plugin Method
	 */
	if(jQuery){
		(function($){
			$.fn.table4panes = function(col_num, row_num, settings){
				var top_nodes = [];
				$.each($(this), function(i, elm){
					top_nodes.push(table4panes_body.call(elm, i, col_num, row_num, settings));
				});
				return top_nodes.length == 1 ? top_nodes[0] : top_nodes;
			}
		})(jQuery);
	}
})();
