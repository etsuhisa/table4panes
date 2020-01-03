# Table4Panes 1.0.3
 HTML��ύX������javaScript�����Ńe�[�u����4�̃y�C���ɕ������܂��B

## �f��
�ȉ���HTML�t�@�C�����Q�Ƃ��Ă��������B
* demo-table4panes.html         ��{�I�ȌĂяo��
* demo-table4panes_float.html   float�ł̕\��
* demo-table4panes_event.html   �y�C���ɑ΂���C�x���g�ݒ�
* demo-table4panes-jquery.html  jQuery�ł̌Ăяo��
* demo-table4panes_multi.html   �����e�[�u���̈ꊇ�w��
* demo-table4panes_span.html    colspan/rowspan�����e�[�u��
* demo-table4panes-min.html     min�t�@�C��

## Usage

�y�[�W�Ƀv���O�C�����C���N���[�h���܂��B

JavaScript�̏ꍇ
```html
<script src="table4panes.min.js"></script>
```

jQuery�̏ꍇ
```html
<script src="jquery.min.js"></script>
<script src="table4panes.min.js"></script>
```

��������e�[�u���ɑ΂��֐����Ăяo���܂��B
��1�����ɂ͗񐔁A��2�����ɂ͍s�����w�肵�܂��B
��3�����ɂ̓I�v�V�������w�肵�܂��B
�P��̃e�[�u���ɑ΂��ČĂяo�����ꍇ�A�ŏ�ʂ�div�m�[�h��ԋp���܂��B
�����̃e�[�u���ɑ΂��ČĂяo�����ꍇ�A���ꂼ��̃e�[�u���̍ŏ�ʂ�div�m�[�h�̔z���ԋp���܂��B

JavaScript�̏ꍇ
```js
new Table4Panes(selector)
Table4Panes.apply(col_num, row_num, settings)
```

jQuery�̏ꍇ
```js
$.fn.table4panes(col_num, row_num, settings)
```

## ��

4��3�s�ŌŒ肵�A��ʑS�̂ɕ\������ɂ͈ȉ��̂悤�ɌĂяo���܂��B

JavaScript�̏ꍇ
```js
var table4panes = new Table4Panes("#demo-table");
var div = table4panes.apply(4,3,{"display-method":"flex", "fit":true});
```

jQuery�̏ꍇ
```js
$(function(){
    $("#demo-table").table4panes(4,3,{"display-method":"flex", "fit":true});
});
```

## settings(��3����)

### "display-method"
"display-method"�I�v�V�����͈ȉ���CSS�̉����т̕��@�̂����ꂩ���w��ł��܂��B
* "inline-block"
* "table-cell"
* "flex"
* "float"

### "fit"
true�Ȃ�E���̃y�C����e�m�[�h�̃T�C�Y�ɍ��킹�Ĕz�u���܂��B
* fit-margin-width�Ńr���[�|�[�g����̃}�[�W���̕����w�肵�܂��B
* fit-margin-height�Ńr���[�|�[�g����̃}�[�W���̕����w�肵�܂��B

### �T�C�Y
�e�y�C���̃T�C�Y���ȉ��Ŏw�肵�܂��B
* �S�̃T�C�Y��"height"�����"width"�Ŏw�肵�܂��B
* �e�y�C���̍�����"top-height"�����"bottom-height"�Ŏw�肵�܂��B
* �e�y�C���̕���"left-width"�����"right-width"�Ŏw�肵�܂��B

### "fix-width-rows"
���̃I�v�V�����͗񕝂��Œ肷�邽�߂Ɏg�p����s�̊J�n�ƏI����z��Ŏw�肵�܂��B
�f�t�H���g��[0, row_num]�ł��B
fix-width-rows��"dummy"���w�肵���ꍇ�A�񕝂͊e�y�C���ɑ}�����ꂽ�_�~�[�̍s�ŌŒ肳��܂��B

### "prefix"
���̃I�v�V�����̓N���X���̃v���t�B�b�N�X���f�t�H���g��"table4panes"����ύX���܂��B

## �T�|�[�g�u���E�U
�ȉ��̃u���E�U�œ�����m�F���Ă��܂��B
* Chrome
* Firfox
* Microsoft Edge
* Internet Explorer 11
  ���FIE*�G�~�����[�g�ł͗��p�ł���@�\�ɐ���������܂��B

## ���C�Z���X
Copyright &copy; ASAI Etsuhisa<br>
Licensed under the MIT license.

