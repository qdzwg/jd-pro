/*
 validation 1.x
 */
var validation = {
  checkPhone: checkPhone,   // 检测是否为电话号码
  isEmpty: isEmpty,         // 是否为空
  isNumber: isNumber,       // 是否为数字
  checkLength:checkLength,  // 检测字符串长度
  isEqual: isEqual,         // 是否相同
  replaceStr:replaceStr,    // *替换str
  checkPwd:checkPwd,        // 检测密码格式 6-16位数字字母
  checkArrLen:checkArrLen,  // 检测数组长度是否存在
};

function checkPhone(num) {
  //表示以1开头，第二位可能是3/4/5/7/8等的任意一个，在加上后面的\d表示数字[0-9]的9位，总共加起来11位结束。
  if ((/^1[3|4|5|7|8]\d{9}$/.test(num))) { // 判断条件:不是正确的手机号码
    return false;
  } else {
    return true;
  }
};

function isEmpty(str) {  
  str = str || '';
  if (/^\s*$/.test(str)) {  // 为空，返回true
    return true;
  } else {
    return false;
  }
};

function isNumber(str) {  // 是数字 为true
  str = str || '';
  if(/^[0-9]*$/.test(str)){
    return true;
  }else{
    return false;
  }
}

function checkLength(str,len){   // 超出了，返回true
  str = str.trim() || '';
  if(str.length > len){
    return true;
  } else{
    return false;
  }
};

function isEqual(str1,str2) { //不相同，返回true
  str1 = str1 || '';
  str2 = str2 || '';
  if(str1 === str2){
    return false;
  }else{
    return true;
  }
};

function repeatStr(str, count) {
    var text = '';
    for (var i = 0; i < count; i++) {
        text += str;
    }
    return text;
};

function replaceStr(str,regArr,type,ARepText){  // demo:replaceStr('18819322663',[3,5,3],0)
  var regtext = '',
      Reg = null,
      replaceText = ARepText || '*';
  if (regArr.length === 3 && type === 0) {
        regtext = '(\\w{' + regArr[0] + '})\\w{' + regArr[1] + '}(\\w{' + regArr[2] + '})';
        Reg = new RegExp(regtext);
        var replaceCount = repeatStr(replaceText, regArr[1]);
        return str.replace(Reg, '$1' + replaceCount + '$2')
  }
};

function checkPwd(str){
  str = str || '';
  if(/^[a-zA-Z0-9]{6,16}$/.test(str)){
    return false;
  }else{
    return true;
  }
};

function checkArrLen(arr) {
  arr =arr || [];
  if(arr.length < 1)
    return false
  else
    return true
};



export default validation;
