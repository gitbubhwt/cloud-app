import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';
import { createForm } from 'rc-form';
import MD5 from "crypto-js/md5"

import style from './index.less';

import { WingBlank, WhiteSpace, Button, Flex, InputItem, Toast, Checkbox } from 'antd-mobile';

import ajax from "Utils/ajax";

import app_icon_img from 'Static/images/logo_icon.jpg';

import actions from 'Actions/login'

import {updateTitle} from 'Utils/tool'

const CheckboxItem = Checkbox.CheckboxItem;

class Login extends React.Component {

	constructor(props) {
		super(props);
	}

	isInWeChat = /(micromessenger|webbrowser)/.test(navigator.userAgent.toLocaleLowerCase())

	state = {
		show: false,
		showPass: false,
		rememberPwd: 1,
		openid: '',
		vcc_code: '',
		ag_num: '',
		ag_password: '',
	}

	//给ajax发送的消息添加token头
	setToken(token, expires_in) {
		sessionStorage.setItem('token', token);
		expires_in ? sessionStorage.setItem('expires_in', expires_in) : null
		ajax.defaults.headers.common['access-token-id'] = token;
	}

	componentWillMount() {
		updateTitle("登录");

		
		let { actions, location } = this.props

		let rememberPwd = localStorage.getItem('rememberPwd')
		let vcc_code = localStorage.getItem('vcc_code')
		let ag_num = localStorage.getItem('ag_num')
		let ag_password = localStorage.getItem('ag_password')

		let code = location.query.code
		let scope = 'snsapi_userinfo'
		let appid = 'wxc825f78f41fc1920'
		let url; 

		if (process.env.NODE_ENV === 'development_ali'){
			url = encodeURIComponent('http://e.v2.dev.icsoc.net/h5/ticket/login')	
		}else if (process.env.NODE_ENV === 'test_ali'){
			url = encodeURIComponent('http://e.test.icsoc.net/h5/ticket/login')
		}else if (process.env.NODE_ENV === 'production_ali'){
			url = encodeURIComponent('https://e.icsoc.net/h5/ticket/login')	
		}else if (process.env.NODE_ENV === 'staging_ali'){
			url = encodeURIComponent('http://e.staging.icsoc.net/h5/ticket/login')
		}else{
			url = encodeURIComponent('http://e.v2.dev.icsoc.net/h5/ticket/login')
		}

		// 记住密码
		if (parseInt(rememberPwd)) {
			this.setState({
				vcc_code: vcc_code,
				ag_num: ag_num,
				ag_password: ag_password,
			})
		}

		if (!this.isInWeChat) {
			this.setState({ show: true })
			return
		}

		if (!code) {
			window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri=' + url + '&response_type=code&scope=' + scope + '&state=123456#wechat_redirect'
		} else {
			// 调用获取access_token接口
			actions.getAccessToken({ code: code }).then(() => {
				let { login } = this.props
				if (login.accessToken.code == 0) {
					let { openid, expires_in } = login.accessToken.data
					sessionStorage.setItem('openid', openid);
					this.setState({ openid: openid })

					// 调用判断是否绑定接口
					// 如果绑定，处理返回的token，跳转到列表页
					// 没绑定，显示登陆界面，根据access_token等获取用户信息
					actions.hasBinded({ openid: openid }).then(() => {
						let { code, data, message } = this.props.login.bindInfo
						if (code == 0) {
							let { if_bind, access_token } = data
							// 绑定
							if (if_bind == 1) {
								this.setToken(access_token, expires_in)
								browserHistory.push('/h5/ticket/orderList');
							} else {
								this.setState({ show: true })
							}
						} else {
							this.setState({ show: true })
							// Toast.fail(message, 2)
						}
					})
				} else {
					const access_token = sessionStorage.getItem('token')

					if (access_token) {
						browserHistory.push('/h5/ticket/orderList');
					} else {
						this.setState({ show: true })
						Toast.fail(login.accessToken.message, 2)
					}
				}

			})
		}
	}

	componentWillUpdate(nextProps, nextState) {
		
	}

	//提交登陆
	submit = () => {
		this.props.form.validateFields((error, value) => {

			if (error) {
				let errorCount = 0;
				for (let e in error) {
					if (errorCount < 1) {
						errorCount = errorCount + 1;
						Toast.fail(error[e].errors[0].message, 1);
					}
				}
			} else {
				let { vcc_code, ag_num, ag_password } = this.props.form.getFieldsValue();

				localStorage.setItem('rememberPwd', this.state.rememberPwd);
				localStorage.setItem('vcc_code', vcc_code);
				localStorage.setItem('ag_num', ag_num);
				if (this.state.rememberPwd) {	
					localStorage.setItem('ag_password', ag_password)
				}

				// 微信中打开页面登陆
				if (this.isInWeChat) {
					let reqData = {
						vcc_code: vcc_code,
						ag_num: ag_num,
						ag_password: ag_password,
						openid: this.state.openid,
						if_remember: 1
					}
					if (!this.state.rememberPwd) {
						reqData.if_remember = 2
					}
					this.props.actions.loginSubmitInWX(reqData).then(() => {
						let { code, data, message } = this.props.login.tokenInfo
						if (code != 0) {
							Toast.fail(message, 2)
							return
						}
						let { access_token, expires_in } = data
						if (access_token) {
							this.setToken(access_token, expires_in)
							browserHistory.push('/h5/ticket/orderList');
						}
					})
				} else {
					// 非微信
					this.props.actions.loginSubmit({
						accountNumber: vcc_code,
						employeeNumber: ag_num,
						password: ag_password
					}).then(() => {
						const { access_token, expires_in } = this.props.login.tokenInfo;

						if (access_token) {
							this.setToken(access_token, expires_in)
							browserHistory.push('/h5/ticket/orderList');
						}
					})
				}

			}
		});
	}


	// 
	render() {
		const login_input_flex_style = { flex: 7 }

		const { getFieldProps, getFieldError } = this.props.form;

		let errors;

		return (
			<div className="login-container" style={{ display: this.state.show ? "block" : "none" }}>
				<WingBlank>
					<div className="logo-info">
						<Flex>
							<img className="app_icon" src={app_icon_img} />
							中通天鸿·易客通
						</Flex>
					</div>
					<div className="login-inputs-box">
						<Flex>
							<Flex.Item>
								<Flex justify="center">
									<i className="login-inputs-icon iconfont icon-community_me" />
								</Flex>
							</Flex.Item>
							<Flex.Item style={login_input_flex_style}>
								<InputItem
									{...getFieldProps('vcc_code', {
										initialValue: this.state.vcc_code,
										rules: [{
											required: true,
											message: "请输入企业账号"
										}],
									}) }
									placeholder="请输入企业账号"
									clear
								></InputItem>
							</Flex.Item>
						</Flex>
						<Flex>
							<Flex.Item>
								<Flex justify="center">
									<i className="login-inputs-icon iconfont icon-shenfenzheng" />
								</Flex>
							</Flex.Item>
							<Flex.Item style={login_input_flex_style}>
								<InputItem
									{...getFieldProps('ag_num', {
										initialValue: this.state.ag_num,
										rules: [{ required: true, message: "请输入工号" }],
									}) }
									placeholder="请输入工号"
									clear
								></InputItem>
							</Flex.Item>
						</Flex>
						<Flex>
							<Flex.Item>
								<Flex justify="center">
									<i className="login-inputs-icon iconfont icon-mima" />
								</Flex>
							</Flex.Item>
							<Flex.Item style={login_input_flex_style}>
								<div>
									<InputItem
										{...getFieldProps('ag_password', {
											initialValue: this.state.ag_password,
											rules: [{ required: true, message: "请输入密码" }],
										}) }
										type={this.state.showPass ? 'text' : 'password'}
										placeholder="请输入密码"
										clear
										extra={this.state.showPass ?
											<i className='login-inputs-icon iconfont icon-open_eye' />
											: <i className='login-inputs-icon iconfont icon-close_eye' />}
										onExtraClick={
											() => {
												this.setState({
													showPass: !this.state.showPass
												})
											}
										}
									></InputItem>
								</div>
							</Flex.Item>
						</Flex>
					</div>

					{(errors = getFieldError('required')) ? errors.join(',') : null}

					<WhiteSpace size="xl" />

					<Flex justify="end">
						{/* <i className="login-inputs-icon iconfont icon-choose_done_line" />
						<text className="remember">记住密码</text> */}
						<CheckboxItem
							onChange={(e) => {
								this.setState({ rememberPwd: e.target.checked ? 1 : 0 })
							}}
							defaultChecked>
							记住密码
						</CheckboxItem>
					</Flex>

					<WhiteSpace size="xl" />
					<Button style={{ background: '#1882fa', color: '#ffffff' }} onClick={this.submit}>确认登录</Button><WhiteSpace />
				</WingBlank>
				<div className="login-right-info">版权所有 中通天鸿@2017</div>
			</div>
		)
	}
}


const mapStateToProps = (state) => {
	// console.log(state.login);
	return {
		login: state.login
	};
}

const mapDispatchToProps = (dispatch) => {

	return {
		actions: bindActionCreators(actions, dispatch),
	};
}

const LoginWrapper = createForm()(Login);

export default connect(mapStateToProps, mapDispatchToProps)(LoginWrapper);