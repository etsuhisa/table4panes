# Table4Panes 1.0.3
 HTMLを変更せずにjavaScriptだけでテーブルを4つのペインに分割します。

## デモ
以下のHTMLファイルを参照してください。
* demo-table4panes.html         基本的な呼び出し
* demo-table4panes_float.html   floatでの表示
* demo-table4panes_event.html   ペインに対するイベント設定
* demo-table4panes-jquery.html  jQueryでの呼び出し
* demo-table4panes_multi.html   複数テーブルの一括指定
* demo-table4panes_span.html    colspan/rowspanを持つテーブル
* demo-table4panes-min.html     minファイル

## Usage

ページにプラグインをインクルードします。

JavaScriptの場合
```html
<script src="table4panes.min.js"></script>
```

jQueryの場合
```html
<script src="jquery.min.js"></script>
<script src="table4panes.min.js"></script>
```

分割するテーブルに対し関数を呼び出します。
第1引数には列数、第2引数には行数を指定します。
第3引数にはオプションを指定します。
単一のテーブルに対して呼び出した場合、最上位のdivノードを返却します。
複数のテーブルに対して呼び出した場合、それぞれのテーブルの最上位のdivノードの配列を返却します。

JavaScriptの場合
```js
new Table4Panes(selector)
Table4Panes.apply(col_num, row_num, settings)
```

jQueryの場合
```js
$.fn.table4panes(col_num, row_num, settings)
```

## 例

4列3行で固定し、画面全体に表示するには以下のように呼び出します。

JavaScriptの場合
```js
var table4panes = new Table4Panes("#demo-table");
var div = table4panes.apply(4,3,{"display-method":"flex", "fit":true});
```

jQueryの場合
```js
$(function(){
    $("#demo-table").table4panes(4,3,{"display-method":"flex", "fit":true});
});
```

## settings(第3引数)

### "display-method"
"display-method"オプションは以下のCSSの横並びの方法のいずれかを指定できます。
* "inline-block"
* "table-cell"
* "flex"
* "float"

### "fit"
trueなら右下のペインを親ノードのサイズに合わせて配置します。
* fit-margin-widthでビューポートからのマージンの幅を指定します。
* fit-margin-heightでビューポートからのマージンの幅を指定します。

### サイズ
各ペインのサイズを以下で指定します。
* 全体サイズは"height"および"width"で指定します。
* 各ペインの高さは"top-height"および"bottom-height"で指定します。
* 各ペインの幅は"left-width"および"right-width"で指定します。

### "fix-width-rows"
このオプションは列幅を固定するために使用する行の開始と終了を配列で指定します。
デフォルトは[0, row_num]です。
fix-width-rowsに"dummy"を指定した場合、列幅は各ペインに挿入されたダミーの行で固定されます。

### "prefix"
このオプションはクラス名のプレフィックスをデフォルトの"table4panes"から変更します。

## サポートブラウザ
以下のブラウザで動作を確認しています。
* Chrome
* Firfox
* Microsoft Edge
* Internet Explorer 11
  注：IE*エミュレートでは利用できる機能に制限があります。

## ライセンス
Copyright &copy; ASAI Etsuhisa<br>
Licensed under the MIT license.

