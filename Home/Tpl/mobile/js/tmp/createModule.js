/**
 * 自动生成页面
 * @authors zh
 * @date    2013-08-29
 * @version 1.0
 */
$(function() {

	var codeHtml = CodeMirror.fromTextArea(document.getElementById("codeHtml"), {
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


	var codeCss = CodeMirror.fromTextArea(document.getElementById("codeCss"), {
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
	var codeJs = CodeMirror.fromTextArea(document.getElementById("codeJs"), {
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

	$("#module-list a").click(function() {
		var t = $(this);
		var id = t.attr('data-id');
		$.ajax({
			type: 'POST',
			url: URL + "/moduleShow",
			data: { id: id },
			dataType: 'json',
			success: function(data) {
				$('#id').val(data.id);
				$('.input-title').val(data.name);
				codeHtml.setValue(data.html);
				codeCss.setValue(data.css);
				codeJs.setValue(data.js);
			}
		})
	});


})