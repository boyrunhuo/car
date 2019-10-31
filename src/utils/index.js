export default {
    addSuffix(data, length) {
        //截取添加省略号
        if (data.length > length) {
            return '...' + data.substring(data.length - length)
        } else {
            return data
        }
    },
    
    scroll(id) {
        //滚动显示
        function newContent(content) {
            var z = content.charAt(0)
            var l = content.substring(1,content.length)
            return l+z
        }
        let internal = setInterval(() => {
            //兼容innnerHTML和value，也就是普通标签和input标签里的字体都可以滚动
            if(document.getElementById(id)) {
                var content = document.getElementById(id).innerHTML || document.getElementById(id).value
            
                if(content !== newContent(content)) {
                    document.getElementById(id).innerHTML = newContent(content)
                    document.getElementById(id).value = newContent(content)
                } else {}
            } else {
                clearInterval(internal)
            }
           
        }, 1000);
    },
}