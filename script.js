//兼容getElementsByClassName
function getElementsByClassName(element,names){
	var arr = [];
	if(element.getElementsByClassName){
		return element.getElementsByClassName(names);
	}
	var result = document.getElementsByTagName('*');
	var namesArr = names.split(' ');
	for(var i=0,len=result.length;i<len;i++){
		var ans = 0;
		for(var j=0,l=namesArr.length;j<l;j++){
			var className = " "+result[i].className+" ";
			var index = className.indexOf(" "+namesArr[j]+" ");
			if(index!=-1){
				ans++;
			}
		}
			if(ans==namesArr.length){
				arr.push(result[i]);
			}
	}
			return arr;
}
//兼容事件注册
function addEvent(o,e,f){
	if(o.addEventListener){
		o.addEventListener(e,f);
	}else if(o.attachEvent){
		o.attachEvent("on"+e,f);
	}else{
		o["on"+e] = f;
	}
}
function removeEvent(o,e,f){
	if(o.removeEventListener){
		o.removeEventListener(e,f);
	}else if(o.detachEvent){
		o.detachEvent("on"+e,f);
	}else{
		o["on"+e] = null;
	}
}
//取得cookie函数
function getcookie(){
	var cookie={};
	var all=document.cookie;
	if(all==='')
		return cookie;
	var list=all.split('; ');
	for(var i=0;i<list.length;i++){
		var item=list[i];
		var p=item.indexOf('=');
		var name=item.substring(0,p);
		name=decodeURIComponent(name);
		var value=item.substring(p+1);
		value=decodeURIComponent(value);
		cookie[name]=value;
	}
	return cookie;
}
//设置cookie函数
function setCookie(name,value,expires,path,domain,secure){
	var cookie=encodeURIComponent(name)+'='+encodeURIComponent(value);
	if(expires){
		cookie+='; expires='+expires.toGMTString();
	}
	if(path){
		cookie+='; path='+path;
	}
	if(domain){
		cookie+='; domain='+domain;
	}
	if(secure){
		cookie+='; secure='+secure;
	}
	document.cookie=cookie;
}
//移除cookie函数
function removeCookie(name,path,domain){
	document.cookie=name+'='
	+'; path='+path
	+'; domain='+domain
	+'; max-age=0';
}
//使用ajax通信函数
function get(url,options,callback){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                callback(xhr.responseText);
            } else {
                console.error('Request was unsuccessful: ' + xhr.status);
            }
        };
    }
    if (!!options) {
        var url = url + '?' + serialize(options);
    };
    xhr.open("get",url,true);
    xhr.send(null);

    function serialize(data){
        if (!data) {
            return "";
        };
        var pairs = [];
        for (var name in data) {
            if (!data.hasOwnProperty(name)) {
                continue;
            };
            if (typeof data[name] === "function") {
                continue;
            };
            var value = data[name].toString();
            name = encodeURIComponent(name);
            value = encodeURIComponent(value);
            pairs.push(name + '=' + value);
        };
        return pairs.join("&");
    }
}
//登录表单和cookie等设置
(function(){
var cancel = getElementsByClassName(document,'cancel')[0];

addEvent(cancel,"mouseover",function(){
	var focused = getElementsByClassName(document,'focused')[0];
	focused.style.backgroundColor = "#fff";
});
addEvent(cancel,"mouseout",function(){
	var focused = getElementsByClassName(document,'focused')[0];
	focused.style.backgroundColor = "#f8f8f8";
});
var close = getElementsByClassName(document,'close')[0];
addEvent(window,'load',function(event){
	if(!document.cookie){
		setCookie('closeSuc','no');
		setCookie('loginSuc','no');
		setCookie('followSuc','no');
	}
	event=event||window.event;
	var tip=document.getElementById('tip-container');
	var cookie = getcookie();
	if(cookie.closeSuc=='yes'){
		tip.style.display="none";
	}else{
		tip.style.display="block";
	}
	if(cookie.loginSuc=='yes'){
		getElementsByClassName(document,'focus')[0].style.display = "none";
		getElementsByClassName(document,'focused')[0].style.display = "inline-block";
	}else{
		getElementsByClassName(document,'focus')[0].style.display = "inline-block";
		getElementsByClassName(document,'focused')[0].style.display = "none";
	}

});
addEvent(close,'click',function(event){
	event = event || window.event;
	if(event.stopPropagation){
		event.stopPropagation();	
	}else{
		event.cancelBubble = true;
	}
	var cookie = getcookie();
	if(cookie.closeSuc=='no'){
		setCookie('closeSuc','yes');
	}
	var tip = document.getElementById('tip-container');
	tip.style.display="none";
});

var form = document.forms[0];
addEvent(form,'submit',function(event){
	if(event.preventDefault){
		event.preventDefault();
	}else{
		event.returnValue = false;
	}
	
	var u = form.getElementsByTagName('input')[0].value;
	var p = form.getElementsByTagName('input')[1].value;

	u = md5(u);
	p = md5(p);

	get('http://study.163.com/webDev/login.htm',{userName:u,password:p},function(data){
		if(data==1){
			document.forms[0].style.display = "none";
			getElementsByClassName(document,'mask')[0].style.display = "none"; 
			setCookie('loginSuc','yes');
			getElementsByClassName(document,'focus')[0].style.display = "none";
			getElementsByClassName(document,'focused')[0].style.display = "inline-block";
			
		}else{
			alert("帐号或者密码错误");
		}
	});
	get('http://study.163.com/webDev/attention.htm',null,function(data){
		if(data==1){
			setCookie('followSuc','yes');
		}
	});
});
var focus = getElementsByClassName(document,'focus')[0];
addEvent(focus,'click',function(){
	var cookie = getcookie();
	if(cookie.loginSuc=='no'){
		var mask = getElementsByClassName(document,'mask')[0];
		var form = document.forms[0];
		mask.style.display = 'block';
		form.style.display = 'block';
	}
});
var formclose = document.forms[0].getElementsByTagName('span')[0];
addEvent(formclose,'click',function(event){
	document.forms[0].style.display = "none";
	getElementsByClassName(document,'mask')[0].style.display = "none"; 
});
})();
//轮播图 
(function(){
	var mib = getElementsByClassName(document,'mib')[0];
	var li = mib.getElementsByTagName('li');
	var a = mib.getElementsByTagName('a');
	li[0].style.backgroundColor = "#000";
	for(var i=0,len=li.length;i<len;i++){
		li[i].index = i;
		addEvent(li[i],'click',function(event){
			event = event || window.event;
			clearInterval(changeId);
			for(var j=0;j<a.length;j++){  
				a[j].style.display = "none";
				li[j].style.backgroundColor = "#fff";
			}
			if(event.target!=null){
				a[event.target.index].style.display = "block";
				li[event.target.index].style.backgroundColor = "#000";
				fadeIn(a[event.target.index]);
			}else{
				a[event.srcElement.index].style.display = "block";
				li[event.srcElement.index].style.backgroundColor = "#000";
				fadeIn(a[event.srcElement.index]);
			}
			
		});
	}
	var changeId = setInterval(change,5000);
		function fadeIn(element){
            if(element.style.opacity!==undefined){
                element.style.opacity = 0;
                var intervalID = setInterval(opacityChange,1,element);
            }else{
                element.style.filter = "alpha(opacity=50)";
                var intervalID = setInterval(opacityChange,1);
            }
            function opacityChange(){
                if(element.style.opacity!==undefined){
                    if(element.style.opacity!=1){
                        element.style.opacity = parseFloat(element.style.opacity) + 0.008;
                    }else{
                        clearInterval(intervalID);
                    }
                }else{
                    var text = element.style.filter;
                    var op = text.indexOf('=');
                    var opacity = text.substring(op+1,text.length-1);
                    if(parseFloat(opacity)<100){
                        opacity = parseFloat(opacity) + 0.8;
                        element.style.filter = "alpha(opacity="+opacity+")";
                    }else{
                        clearInterval(intervalID);
                    }
                }
            }
        }
	function change(){
		var now = -1;
		for(var i=0,len=a.length;i<len;i++){
			if(a[i].style.display=="block"){
				if(i==0){
					now = 1;
				}else if(i==1){
					now = 2;
				}else{
					now = 0;
				}
			}
			a[i].style.display = "none";
			li[i].style.backgroundColor = "#fff";
		}
		if(now==-1){
			now=1;
		}
		a[now].style.display = "block";
		fadeIn(a[now]);
		li[now].style.backgroundColor = "#000";
		
	}
	addEvent(mib,'mouseover',function(){
		clearInterval(changeId);
	});
	addEvent(mib,'mouseout',function(){
		changeId = setInterval(change,5000);
	})
})();
//TAB模块
(function(){
	var ul = getElementsByClassName(document,'options')[0];
	var li = ul.children;
	var page = getElementsByClassName(document,'page')[0];
	var pageLi = getElementsByClassName(document,'page-num');
	var pageForward = getElementsByClassName(document,'forward')[0];
	var pageBack = getElementsByClassName(document,'back')[0];
	var pS = 20;
	var pN = 1;
	var t = 10;
	var lessonBox = getElementsByClassName(document,'lesson-box');
	addEvent(window,'load',function(){
			li[0].index = 10;
			li[1].index = 20;
		for(var i=0,len=pageLi.length;i<len;i++){
			pageLi[i].index = i+1;
		}
		pageForward.index = -1;
		pageBack.index = -2;
		get('http://study.163.com/webDev/couresByCategory.htm',{pageNo:pN,psize:pS,type:t},getdata);
	});
	addEvent(ul,'click',function(event){
		event = event || window.event;
		for(var i=0,len=li.length;i<len;i++){
			li[i].className = '';
		}
		if(event.target!=null){
			event.target.className = "options-li";
			t = event.target.index;
		}else{
			event.srcElement.className = "options-li";
			t = event.srcElement.index;
		}

		get('http://study.163.com/webDev/couresByCategory.htm',{pageNo:pN,psize:pS,type:t},getdata);
	});
	//分页
	addEvent(page,'click',function(event){
		//样式设置
		event = event || window.event;
		var pN;
		var pS = 20;
		var t;
		if(event.target!=null&&(event.target==page||event.target.index<0)||
			event.srcElement!=null&&(event.srcElement==page||event.srcElement.index<0)){
			return;
		}
		for(var i=0,len=pageLi.length;i<len;i++){
			pageLi[i].className = "page-num";
		}
		if(event.target!=null){
			event.target.className = "page-num selected";
			pN = event.target.index;
		}else{
			event.srcElement.className = "page-num selected";
			pN = event.srcElement.index;
		}
		//数据接口

		if(li[0].className=="options-li"){
			t = li[0].index;
		}else{
			t = li[1].index;
		}
		get('http://study.163.com/webDev/couresByCategory.htm',{pageNo:pN,psize:pS,type:t},getdata);
	});
	addEvent(pageForward,'click',function(event){
		event = event||window.event;
		var p = 24;
		if(li[0].className=="options-li"){
			t = li[0].index;
		}else{
			t = li[1].index;
			p = 23;
		}
		for(var i=0,len=pageLi.length;i<len;i++){
			if(pageLi[i].className=="page-num selected"&&i!=7){
				pageLi[i].className = "page-num";
				pageLi[i+1].className = "page-num selected";
				pN = pageLi[i+1].index;
				break;
			}else if(pageLi[i].className=="page-num selected"&&i==7&&pageLi[i].index<=p){
				for(var i=0,len=pageLi.length;i<len;i++){
					pageLi[i].index+=1;
					pageLi[i].innerHTML = pageLi[i].index;
				}
				pN = pageLi[7].index;
				break;
			}
		}
		if(li[0].className=="options-li"){
			t = li[0].index;
		}else{
			t = li[1].index;
		}
		get('http://study.163.com/webDev/couresByCategory.htm',{pageNo:pN,psize:pS,type:t},getdata);

	});
	addEvent(pageBack,'click',function(event){
		for(var i=0,len=pageLi.length;i<len;i++){
			if(pageLi[i].className=="page-num selected"&&i!=0&&pageLi[i].index>1){
				pageLi[i].className = "page-num";
				pageLi[i-1].className = "page-num selected";
				pN = pageLi[i-1].index;
				break;
			}else if(pageLi[i].className=="page-num selected"&&i==0&&pageLi[i].index>1){
				for(var i=0,len=pageLi.length;i<len;i++){
					pageLi[i].index-=1;
					pageLi[i].innerHTML = pageLi[i].index;
				}
				pN = pageLi[0].index;
				break;
			}
		}
		if(li[0].className=="options-li"){
			t = li[0].index;
		}else{
			t = li[1].index;
		}
		get('http://study.163.com/webDev/couresByCategory.htm',{pageNo:pN,psize:pS,type:t},getdata);
	});
	//设置数据的函数
function getdata(data){
	var lessonBox = getElementsByClassName(document,'lesson-box');
	var lessonFrame = document.getElementById('lesson-frame');
	var clientWidth = document.documentElement.clientWidth;
	//动态构建DIV
	if(lessonFrame.children.length<20){
		for(var i=0;i<20;i++){
			var div = document.createElement('div');
			div.className = "lesson-box";
			div.innerHTML = "<div class='hide'><div class='hide-div1'><img src='31.jpg' class='hide-img'><div><p class='lesson-name'></p><p class='lesson-students'><span class='mans-icons'></span></p><p class='lesson-teacher'></p><p class='classify'></p></div></div><p></p></div><img src='31.jpg'><p class='lesson-title'></p><p class='lesson-from'></p><p class='lesson-mans'><span class='mans-icons'></span>510</p><p class='lesson-price'></p>";
			lessonFrame.appendChild(div);
		}
	}	
	//构造完毕
	data = JSON.parse(data);
	console.log(data.totalPage);
	if(data){
		for(var i=0,len=lessonBox.length;i<len;i++){
			var box = lessonBox[i];
			var img = box.children[1];
			var name = box.children[2];
			var provider = box.children[3];
			var learnerCount = box.children[4];
			var price = box.children[5];
			//设置数据
			img.src = data.list[i].middlePhotoUrl;
			name.innerHTML = data.list[i].name;
			provider.innerHTML = data.list[i].provider;
			learnerCount.innerHTML = "<span class='mans-icons'></span>"+data.list[i].learnerCount;
			if(data.list[i].price==0){
				price.innerHTML = "免费";
			}else{
				price.innerHTML = "￥"+data.list[i].price;
			}
			//隐藏的,hover时才有的效果
			var hideImg = getElementsByClassName(document,'hide-img')[i];
			var hideName = getElementsByClassName(document,'lesson-name')[i];
			var hideProvider = getElementsByClassName(document,'lesson-teacher')[i];
			var classify = getElementsByClassName(document,'classify')[i];
			var hideP = getElementsByClassName(document,'hide')[i].children[1];
			var hideLearnerCount = getElementsByClassName(document,'lesson-students')[i];
			hideImg.src = data.list[i].bigPhotoUrl;
			hideName.innerHTML = data.list[i].name;
			hideProvider.innerHTML = data.list[i].provider;
			classify.innerHTML = "分类:"+data.list[i].categoryName;
			hideP.innerHTML = data.list[i].description;
			hideLearnerCount.innerHTML = "<span class='mans-icons'></span>"+data.list[i].learnerCount;
		}
	}
}


})();
//右侧视频
(function(){
	var videoBox = getElementsByClassName(document,'video-box')[0];
	var mask = getElementsByClassName(document,'mask')[0];
	var sideTop = document.getElementById('side-top');
	var close2 = getElementsByClassName(document,'close2')[0];
	var video = document.getElementById('v');
	addEvent(sideTop,'click',function(){
		videoBox.style.display = "block";
		mask.style.display = "block";
	});
	addEvent(close2,'click',function(){
		videoBox.style.display = "none";
		mask.style.display = "none";
		v.pause();
	});
})();
//热门推荐
(function(){
	var sbc = getElementsByClassName(document,'sb-content')[0];
	sbc.index = 0;
	var li = sbc.children;
	
	get('http://study.163.com/webDev/hotcouresByCategory.htm',null,function(data){
		data = JSON.parse(data);
		for(var j=0;j<20;j++){
			var l = document.createElement('li');
			l.innerHTML = "<img/><p class='sb-t'></p><p class='sb-m lesson-mans'><span class='mans-icons'></span></p>";
			getElementsByClassName(document,'sb-content')[0].appendChild(l);
		}

		//设置数据
		for(var i=0,len=li.length;i<len;i++){
			var img = li[i].children[0];
			var name = li[i].children[1];
			var learnerCount = li[i].children[2];
			if(data){
				img.src = data[i].smallPhotoUrl;
				name.innerHTML = data[i].name;
				learnerCount.innerHTML = "<span class='mans-icons'></span>"+data[i].learnerCount;
			}
			
		}
	for(var i=0;i<li.length;i++){
        li[i].style.top = 0+'px';
        li[i].index = 0;
    }
		var over = setInterval(scroll,5000);
	});
	//滚动
	function scroll(){                                     
    	var id = setInterval(function(){
	        for(var i=0;i<li.length;i++){
	            li[i].index -=5;
	            li[i].style.top = li[i].index + 'px';
	             
	            if(li[i].index%70==0){
	                clearInterval(id);
	            }
	            if(li[i].index<-(i+1)*70){
	            	li[i].index = (20-i-1)*70-5;
	            	li[i].style.top = li[i].index + 'px';
	            }
	        }
    	},100);
	}
	


})();
//宽度自适应
(function(){
	addEvent(window,'resize',function(){
		var lf = document.getElementById('lesson-frame');
		var lc = getElementsByClassName(document,'lesson-container')[0];
		var container = getElementsByClassName(document,'container')[0];
		var page = getElementsByClassName(document,'page')[0];
		var head = getElementsByClassName(document,'head')[0];
		var headBox = getElementsByClassName(document,'head-box')[0];
		var hbp = getElementsByClassName(document,'hbp')[0];
		var tip = document.getElementById('tip');
		if(document.documentElement.clientWidth<1205){
			lf.style.width = '726px';
			lc.style.height = '1972px';
			container.style.width = '972px';
			page.style.marginRight = '265px';
			head.style.width = '100%';
			headBox.style.width = '100%';
			hbp.style.width = '100%';
			tip.style.width = '100%';
		}else{
			lf.style.width = '960px';
			lc.style.height = '1472px';
			container.style.width = '1206px';
			page.style.marginRight = '26px';
			head.style.width = '1206px';
			headBox.style.width = '1206px';
			hbp.style.width = '1206px';
			tip.style.width = '1206px';
		}
	});
	addEvent(window,'load',function(){
		var lf = document.getElementById('lesson-frame');
		var lc = getElementsByClassName(document,'lesson-container')[0];
		var container = getElementsByClassName(document,'container')[0];
		var page = getElementsByClassName(document,'page')[0];
		var head = getElementsByClassName(document,'head')[0];
		var headBox = getElementsByClassName(document,'head-box')[0];
		var hbp = getElementsByClassName(document,'hbp')[0];
		var tip = document.getElementById('tip');

		if(document.documentElement.clientWidth<1205){
			lf.style.width = '726px';
			lc.style.height = '1972px';
			container.style.width = '972px';
			page.style.marginRight = '265px';
			head.style.width = '100%';
			headBox.style.width = '100%';
			hbp.style.width = '100%';
			tip.style.width = '100%';
		}else{
			lf.style.width = '960px';
			lc.style.height = '1472px';
			container.style.width = '1206px';
			page.style.marginRight = '26px';
			head.style.width = '1206px';
			headBox.style.width = '1206px';
			hbp.style.width = '1206px';
			tip.style.width = '1206px';
		}
	});
})();