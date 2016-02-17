/**
 YUIDoc 会认这个
 */
$(document).ready(function () {
    //tag搜索
    $(".tag-show a").click(function () {
        var tagId = $(this).attr("data-tagId");
        $.post(URL + "/tagSearch", {
            tagId: tagId
        }, function (data) {
            var newHtml = '';
            if(data != null){
                for (var i = 0; i < data.length; i++) {
                    var articleItem = ['<ul class="list-box-line">',
                        '<li class="list-title">',
                            '<a href="' + APP + '/Article/detail/?id=' + data[i].id + '" target="_blank">' + data[i].title + '</a>',
                        '</li>',
                        '<li>',
                        '<p class="info">',
                            '<span class="info-cate">类别：' +data[i].typeName+ '</span>',
                            '<span class="line">|</span>',
                            '<span class="info-time"><i>' +data[i].add_date+ '</i></span>',
                            '<span class="line">|</span>',
                            '<span class="info-view"><i>' +data[i].click_count+ '</i></span>',
                        '</p>',
                        '</li>',
                        '<li class="list-text">' + data[i].summary + '</li>',
                        '</ul>'
                    ].join('');
                    newHtml += articleItem;
                }
            }else{
                newHtml = '<div style="text-align: center">暂无数据</div>';
            }
            $('.article-list').html(newHtml); //跟新页面
        }, "json"); //这里返回的类型有：json,html,xml,text

    });

    //移动端点击展示导航
    $(".m-nav .nenu").click(function () {
        $(this).next('ul').toggle();
    });

});