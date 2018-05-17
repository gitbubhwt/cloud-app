import {LOGIN,COMMON} from 'Constants/ActionTypes'

import ajax from  "Utils/ajax";
import MD5 from "crypto-js/md5"

import qs from 'qs';


const actions = {
	loginSubmitInWX:function(data){
		const {openid,vcc_code,ag_num,ag_password} = data;

		return {
			type:[COMMON.LOAD,LOGIN.SUBMIT],
			payload:{
				post:{
					url:"/ticket/api/webchat/bind/agent",
					data: data
				}
			}
		}
	},

	loginSubmit:function(inputObj){
		const {accountNumber,employeeNumber,password} = inputObj;

		let config = {}
		let baseURL;

		if (process.env.NODE_ENV === 'development_ali'){
			baseURL = 'http://oauth-dev.icsoc.net';		
		}else if (process.env.NODE_ENV === 'test_ali'){
			baseURL = 'http://oauth-test.icsoc.net';	
		}else if (process.env.NODE_ENV === 'production_ali'){
			baseURL = 'https://oauth.icsoc.net/access_token';	
		}else if (process.env.NODE_ENV === 'staging_ali'){
			baseURL = 'https://oauth.icsoc.net/access_token';	
		}else{
			baseURL = 'http://oauth-dev.icsoc.net';
		}

		if(process.env.NODE_ENV !== 'development'){
			config = {
				baseURL:baseURL,
				withCredentials:true
			}
		}

		return {
			type:[COMMON.LOAD,LOGIN.SUBMIT],
			payload:{
				post:{
					url:"/ekt/access_token",
					data:qs.stringify({
						grant_type:"client_credentials",
			      		client_id:accountNumber+"-"+employeeNumber+"-agent",
			      		client_secret:MD5(password).toString(),
					}),
					config:config
				}
			}
		}
	},

	getAccessToken: function(data) {
		return {
			type: LOGIN.GET_ACCESS_TOKEN,
			payload:{
				post:{
					url:"/ticket/api/webchat/access/token",
					data: data
				}
			}
		}
	},

	refreshAccessToken: function(data) {
		return {
			type: LOGIN.REFRESH_ACCESS_TOKEN,
			payload:{
				post:{
					// 解绑微信（调试用）
					// url:"/ticket/api/webchat/releasebind/agent",
					url:"/ticket/api/webchat/refresh/token",
					data: data
				}
			}
		}
	},

	hasBinded: function(data) {
		return {
			type: LOGIN.HAS_BINDED,
			payload:{
				post:{
					url:"/ticket/api/webchat/check/bind",
					data: data
				}
			}
		}
	}
}

export default actions