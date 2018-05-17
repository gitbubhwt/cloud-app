import { Toast } from 'antd-mobile'
import { browserHistory } from 'react-router'

export function fillZero(num) {
    return num > 9 ? String(num) : '0' + String(num)
}

export function getTime(date, type) {
    if (!date || date == 0) return ''

    let time
    let now = new Date(date),
        year = now.getFullYear(),
        month = now.getMonth() + 1,
        day = now.getDate(),
        hour = now.getHours(),
        min = now.getMinutes(),
        second = now.getSeconds()

    time = type == 'YYYY-MM-DD'
        ? year + '-' + fillZero(month) + '-' + fillZero(day)
        : year + '-' + fillZero(month) + '-' + fillZero(day) + ' '
        + fillZero(hour) + ':' + fillZero(min) + ':00'
    return time
}

export function handleFormData(formData) {
    for (let i in formData) {
        if (!formData[i]) {
            delete formData[i]
        } else {
            // 处理日期格式
            if (Object.prototype.toString.call(formData[i]) == '[object Object]') {
                if (formData[i].type == 'cascade') {
                    let data = formData[i]
                    formData[i] = data.ls
                    formData[i + '_ids'] = data.vs
                } else if (formData[i].value instanceof Date) {
                    formData[i] = getTime(formData[i].value, formData[i].type)
                } else if (formData[i].type && formData[i].type.indexOf('YYYY-MM-DD') !== -1) {
                    if(formData[i].value) {
                        formData[i] = formData[i].value
                    } else {
                        delete formData[i]
                    }
                }
            }
            // 处理单选或下拉格式  ["{type,text,value}"]
            if (Object.prototype.toString.call(formData[i]) == '[object Array]') {
                let item = formData[i][0]
                try {
                    let data = JSON.parse(item)
                    if (data.type === 'select') {
                        formData[i] = data.text
                        formData[i + '_ids'] = data.value
                    }
                } catch (e) { }

            }
        }
    }

    return formData
}

export function handleError(error, value) {
    let errorCount = 0;
    for (let e in error) {
        if (errorCount < 1) {
            errorCount = errorCount + 1;
            // 多节点， 节点的formData
            if (Object.prototype.toString.call(error[e]) == '[object Array]') {
                error[e].map((value, key) => {
                    // 附件节点&日期
                    if (!value.errors) {
                        Object.keys(value).map((v, k) => {
                            if(error[e][v].value) {
                                // 日期
                                Toast.fail(value[v].value.errors[0].message, 1)
                            } else {
                                Toast.fail(value[v].errors[0].message, 1)
                            }
                        })
                    } else {
                        // 普通节点
                        Toast.fail(value.errors[0].message, 1)
                    }
                })
            } else {
                // 单节点

                // 附件节点&日期
                if (!error[e].errors) {
                    Object.keys(error[e]).map((v, k) => {
                        // 日期
                        if(error[e][v].value) {
                            Toast.fail(error[e][v].value.errors[0].message, 1)
                        } else {
                            Toast.fail(error[e][v].errors[0].message, 1)
                        }
                    })
                } else {
                    Toast.fail(error[e].errors[0].message, 1)
                }
            }
        }
    }
}

export function randomkey() {
    let Reno = Math.random(1000 * 100) + "";
    let keyId = Reno.replace(/^0\./, "");
    return keyId;
}

//修改微信标题
export function updateTitle(name) {
    if(typeof document !== 'undefined'){
        document.title=name;
        const iframe = document.createElement('iframe'); 
        iframe.src="/favicon.ico";
        iframe.style.display = "none";  
        iframe.addEventListener("load",func);
        document.body.appendChild(iframe);


        const func = function(){
            setTimeout(function(){
                iframe.removeEventListener("load",func);
                // document.body.removeChild(iframe);
                iframe.remove();
            },0)
        }            
    }
}

 //添加记录
function pushHistory(title) {
    var state = {  
        title:title,  
        url: location.pathname  
    };  
    window.history.pushState(state, state.title, state.url); 
}

//退后键指向制定页面
export function toTheUrl(url,title,bc) {
    if(typeof document === 'undefined'){
        return
    }

    //如果已由监听则先删除监听
    if(window.toTheUrlFunc){
        window.removeEventListener("popstate",window.toTheUrlFunc);

    }

    window.toTheUrlFunc = function(){
        browserHistory.push(url);
        if(typeof bc === 'function'){
            bc();
        }
        //utils.pushHistory(title); 
    }
    pushHistory(title);
    //设置新的监听
    window.addEventListener("popstate", toTheUrlFunc, false);  

    
}


//退后键指向关闭页面（微信）
export function toClosePage(title){
    if(typeof document === 'undefined'){
        return
    }

    //如果已由监听则先删除监听
    if(window.toTheUrlFunc){
        window.removeEventListener("popstate",window.toTheUrlFunc);
    }

    window.toTheUrlFunc = function(){
        if(typeof WeixinJSBridge !== 'undefined'){
            WeixinJSBridge.call('closeWindow');    
        }           
    }
    pushHistory(title);
    //设置新的监听
    window.addEventListener("popstate", toTheUrlFunc, false);  
}