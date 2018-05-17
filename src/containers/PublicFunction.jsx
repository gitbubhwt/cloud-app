//JS 判断输入字符串的长度（中文占用两个字节，英文占用一个字节）
function getByteLen(val) {    //传入一个字符串
    var len = 0;
    for (var i = 0; i < val.length; i++) {
        if (val[i].match(/[^\x00-\xff]/ig) != null) //全角
            len += 2; //如果是全角，占用两个字节  如果mysql中某字段是text, 如果设置编码为utf-8,那么一个中文是占3个字节, gbk是两个字节
        else
            len += 1; //半角占用一个字节
    }
    return len;
}
//js截取字符串 区分中英文
function suolve(str, sub_length) {
    if (str == "" || str == null)
        return "";
    var temp1 = str.replace(/[^\x00-\xff]/g, "**"); //精髓
    var temp2 = temp1.substring(0, sub_length);
    //找出有多少个*
    var x_length = temp2.split("\*").length - 1;
    var hanzi_num = x_length / 2;
    sub_length = sub_length - hanzi_num; //实际需要sub的长度是总长度-汉字长度
    var res = str.substring(0, sub_length);
    if (sub_length < str.length) {
        var end = res + "…";
    } else {
        var end = res;
    }
    // console.log("end",end);
    return end;
}
//截取指定字节数
function cutStr(str,L){
    var result = '',
        strlen = str.length, // 字符串长度
        chrlen = str.replace(/[^\x00-\xff]/g,'**').length; // 字节长度

    if(chrlen<=L){return str;}

    for(var i=0,j=0;i<strlen;i++){
        var chr = str.charAt(i);
        if(/[\x00-\xff]/.test(chr)){
            j++; // ascii码为0-255，一个字符就是一个字节的长度
        }else{
            j+=2; // ascii码为0-255以外，一个字符就是两个字节的长度
        }
        if(j<=L){ // 当加上当前字符以后，如果总字节长度小于等于L，则将当前字符真实的+在result后
            result += chr;
        }else{ // 反之则说明result已经是不拆分字符的情况下最接近L的值了，直接返回
            return result;
        }
    }
}


export default{
    getByteLen,
    suolve,
    cutStr,
}