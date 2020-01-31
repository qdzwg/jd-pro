/**
 * 操作cookie
 */
var Cookie = {
    setCookie:setCookie,            // 设置cookie
    getCookie:getCookie,            // 获取cookie
    clearAllCookie:clearAllCookie   // 删除所有cookie
};

function setCookie(name,value,time){
    var exp = new Date(); 
    exp.setTime(exp.getTime() + time*60*1000); 
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
};

function getCookie($name){    
    var data=document.cookie;    
    var dataArray=data.split("; ");    
    for(var i=0;i<dataArray.length;i++){    
        var varName=dataArray[i].split("=");    
        if(varName[0]==$name){    
            return decodeURI(varName[1]);    
        }                    

    }    
}

function clearAllCookie(){ 
    var myDate=new Date();    
    myDate.setTime(-1000);//设置时间    
    var data=document.cookie;    
    var dataArray=data.split("; ");    
    for(var i=0;i<dataArray.length;i++){    
        var varName=dataArray[i].split("=");    
        document.cookie=varName[0]+"=''; expires="+myDate.toGMTString();    
    }  
};


export default Cookie;