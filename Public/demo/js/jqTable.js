// JavaScript Document

// 创建一个闭包  
(function($) {  
  // 插件的定义  
  $.fn.hilight = function(options) {  
    // build main options before element iteration  
    var opts = $.extend({}, $.fn.hilight.defaults, options);  
    // iterate and reformat each matched element  
    return this.each(function() {  
      $this = $(this);  
      // build element specific options  
      var o = $.meta ? $.extend({}, opts, $this.data()) : opts;  
      // update element styles  
      $this.css({  
        backgroundColor: o.background,  
        color: o.foreground  
      });  
      var markup = $this.html();  
      // call our format function  
      markup = $.fn.hilight.format(markup);  
      $this.html(markup);  
    });  
  };   
  // 定义暴露format函数  
  $.fn.hilight.format = function(txt) {  
  alert("dsd");
    return '<strong>' + txt + '</strong>';  
  };  
  // 插件的defaults  
  $.fn.hilight.defaults = {  
    foreground: 'red',  
    background: 'yellow'  
  };  
// 闭包结束  
})(jQuery);   
  