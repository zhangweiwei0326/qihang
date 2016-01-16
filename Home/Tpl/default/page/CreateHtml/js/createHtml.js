/**
 * 自动生成页面
 * @authors zh
 * @date    2013-08-29
 * @version 1.0
 */
$(function() {
	var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
		lineNumbers: true,
		indentWithTabs: true,
		smartIndent: true,

		matchBrackets: true,

		autofocus: true,

		extraKeys: {

			"Ctrl-Space": "autocomplete"

		},

		mode: {

			name: "javascript",

			globalVars: true

		}

	});



	$(".file-list a").click(function() {

		var t = $(this);

		var filePath = t.prev().val();

		var name = t.prev().attr('data-name');

		$.ajax({

			type: 'POST',

			url: URL + "/getFileShow",

			data: {

				filePath: filePath

			},

			success: function(data) {

				$('#code').html(data);

				editor.setValue(data);

				$('#title').val(name);

				$('#saveFile').attr('data-url', filePath);



			}

		});

		//alert(editor.getValue());

	});



	$("#saveFile").click(function() {

		var t = $(this);

		var filePath = t.attr('data-url');

		var content = editor.getValue();

		//var content = $('#code').val();

		$.ajax({

			type: 'POST',

			url: URL + "/saveFile",

			data: {

				filePath: filePath,

				content: content

			},

			success: function(data) {

				if (data) {

					$('.hint').html('<em>操作成功！</em>');

					window.setTimeout(function() {
						$('.hint').hide()
					}, 3000);

				}

				console.log(data);

			}

		});



	});



	/**
	 *生成页面
	 */

	$("#createHtml").click(function() {

		var fileObj = new Object();

		$('.htmlList').find('input:checked').each(function() {

			var name = $(this).attr('data-name');

			fileObj[name] = $(this).val();

		});



		$.ajax({

			type: 'POST',

			url: URL + "/createHtml",

			data: {

				fileObj: fileObj

			},

			success: function(data) {

				console.log(data);

				if (data) {

					$('.hint').html('<em>操作成功！</em>');

					var url = $('#ifreamShow').attr('src');

					$('#ifreamShow').attr("src", url);

					window.setTimeout(function() {
						$('.hint').hide()
					}, 3000);

				}

			}

		});



	});



	/**
	 *合并css文件
	 */

	$("#buildCss").click(function() {
		var fileArr = new Array();
		$('.cssList').find('input:checked').each(function() {
			fileArr.push($(this).val());
		});

		$.ajax({
			type: 'POST',
			url: URL + "/buildCss",
			data: {
				fileArr: fileArr
			},
			success: function(data) {
				console.log(data);
				if (data) {
					$('.hint').html('<em>操作成功！</em>');
					var url = $('#ifreamShow').attr('src');
					window.setTimeout(function() {
						$('.hint').hide()
					}, 3000);
				}
			}
		});


	});


});