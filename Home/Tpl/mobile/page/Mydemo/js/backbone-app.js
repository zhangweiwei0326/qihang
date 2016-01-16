window.onload = function(){
	
	
	var tplBox = '<table id="app_table"><tr><td><%= name %></td></tr></table>';
	
	
	var tpl = '<td><%= eid %></td>'
			+'<td class="username"><div class="display"><%= username %></div><div class="edit"><input class="username" name="username"></input></div></td>'
				+'<td class="sex"><div class="display"><%= sex=="1" ? "女":"男" %></div><div class="edit"><select name="sex" class="sex" style="width:45px"><option value="0">男</option><option value="1">女</option></select></div></td>'
				+'<td class="age"><div class="display"><%= age %></div><div class="edit"><input class="age" name="age"></input></div></td>'
				+'<td class="position"><div class="display"><%= position %></div><div class="edit"><input class="position" name="position"></input></div></td>'
				+'<td><a href="#" class="del">删除</a></td>';
	
	window.Employee = Backbone.Model.extend({
		// 模型值校验
		validate:function(attrs){
			for(var key in attrs){
				if(attrs[key] == ''){
					return key + "不能为空";
				}
				if(key == 'age' && isNaN(attrs.age)){
					return "年龄必须是数字";
				}
			}
		}
	});
	window.EmployeeList = Backbone.Collection.extend({
		model : Employee,
		// 持久化到本地数据库
		localStorage: new Store("employees")
	});
	window.Employees = new EmployeeList();
	window.EmployeeView = Backbone.View.extend({
		tagName : 'tr',
		template : _.template(tpl),
		events : {
			"dblclick td" : "edit",
			"blur input,select" : "close",
			"click .del" : "clear",
		},
		initialize : function(){
			// 每次更新模型后重新渲染
			this.model.bind('change', this.render, this);
			// 每次删除模型之后自动移除UI
			this.model.bind('destroy', this.remove, this);
		},
		setText : function(){
			var model = this.model;
			this.input = $(this.el).find('input,select'); 
			this.input.each(function(){
				var input = $(this);
				input.val(model.get(input.attr("name")));
			});
		},
		close: function(e) {
			var input = $(e.currentTarget);
			var obj = {};
			obj[input.attr('name')] = input.val();
			this.model.save(obj);
			$(e.currentTarget).parent().parent().removeClass("editing");
	    },
		edit : function(e){
			// 给td加上editing样式
			$(e.currentTarget).addClass('editing').find('input,select').focus();
		},
		render: function() {
		    $(this.el).html(this.template(this.model.toJSON()));
		    // 把每个单元格的值赋予隐藏的输入框
		    this.setText();
		    return this;
	    },
	    remove: function() {
	        $(this.el).remove();
	    },
        clear: function() {
          this.model.destroy();
        }
	});
	
	var appBoxView = Backbone.View.extend({
		el : $("#appBox"),
		template : _.template(tplBox),
		initialize: function() {
			this.render();
	   },
	    render : function() { 
	    	alert("sdsd");
	    	
		    $(this.el).html(this.template(this.model.toJSON()));
		    // 把每个单元格的值赋予隐藏的输入框
		    return this;
		     
            //this.el.innerHTML = 'Hello World!';  
            //document.body.appendChild(this.el);  
        }  
	    
	});
	
	var testModel = {name:"xyang",year:"28"};
	
	window.appBoxView = new appBoxView({model:testModel});
	
	
	window.AppView = Backbone.View.extend({
		el : $("#app"),
		events : {
			"click .#add-btn" : "createOnEnter"
		},
		// 绑定collection的相关事件
		initialize: function() {
	        Employees.bind('add', this.addOne, this);
	        // 调用fetch的时候触发reset
	        Employees.bind('reset', this.addAll, this);
	        Employees.fetch();
	    },
	    createOnEnter : function(e) {
	    	var employee = new Employee();
	    	var attr = {};
	    	$('#emp-form input,#emp-form select').each(function(){
	    		var input = $(this);
	    		attr[input.attr('name')] = input.val();
	    	});
	    	employee.bind('error',function(model,error){
	    		alert(error);
	    	});
    		// set方法中会自动调用model的validate方法进行校验，如果不通过则返回false
    		if(employee.set(attr)){
    			Employees.create(employee);
    		}
	    },
        addOne : function(employee){
        	employee.set({"eid":employee.get("eid")||Employees.length});
        	employee.bind('error',function(model,error){
        		alert(error);
        	});
        	var view = new EmployeeView({model:employee});
        	$(".emp-table tbody").append(view.render().el);
        },
        addAll : function(){
        	Employees.each(this.addOne);
        }
	});
	window.App = new AppView();
}