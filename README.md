# Table4Panes 1.0.1
 Split the table into 4 panes with only JavaScript without changing the HTML.

## Demo
Refer the following HTML files:
* demo-table4panes.html         Basic call
* demo-table4panes_event.html   Event settings for panes
* demo-table4panes-jquery.html  Call with jQuery
* demo-table4panes_multi.html   Batch specification of multiple tables
* demo-table4panes_span.html    Table with colspan / rowspan
* demo-table4panes-min.html     min file

## Usage

Include the plugin on a page.

In case of JavaScript
```html
<script src="table4panes.min.js"></script>
```

In case of jQuery
```html
<script src="jquery.min.js"></script>
<script src="table4panes.min.js"></script>
```

Call the function for the table(s) to be split.
Specify the number of columns in the first parameter and the number of rows in the second parameter.
The options (ex. display size, display method) specify in the third parameter.
If a single table is specified, this function returns the top level div node.
If more than one table are specified, this function returns an array of top-level div nodes for each table.

In case of JavaScript
```js
new Table4Panes(selector)
Table4Panes.apply(col_num, row_num, settings)
```

In case of jQuery
```js
$.fn.table4panes(col_num, row_num, settings)
```

## Example

Call the following to fix it in 4 columns and 3 rows and display it on the entire screen.

In case of JavaScript
```js
var table4panes = new Table4Panes("#demo-table");
var div = table4panes.apply(4,3,{"display-method":"flex", "width":"100%", "height":"100%", "fit":true});
```

In case of jQuery
```js
$(function(){
    $("#demo-table").table4panes(4,3,{"display-method":"flex", "width":"100%", "height":"100%", "fit":true});
});
```

## settings(3rd parameter)

### "display-method"
The "display-method" option can be one of the following CSS side-by-side methods:
* "inline-block"
* "table-cell"
* "flex"
* "float"

### "fit"
If it is true, the bottom right pane fits the parent node.

### Size
The size of each pane is specified the following:
* The overall size is specified by "height" and "width".
* Height of each pane is specified by "top-height" and "bottom-height".
* Width of each pane is specified by "left-width" and "right-width".

### "fix-width-rows"
This option specifies an array of the start and end of the row(index) used to fix the column width.
The default value is [0, row_num].
If the fix-width-rows value is set to "dummy", column widths are fixed by inserting dummy rows into each pane.

### "prefix"
The option changes the class name prefix from the default "table4panes".

## License
Copyright &copy; ASAI Etsuhisa<br>
Licensed under the MIT license.

