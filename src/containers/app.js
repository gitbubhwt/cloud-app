import React, { Component } from 'react' // 引入React
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router' // 引入Link处理导航跳转
import { connect } from 'react-redux';

import ajax from "Utils/ajax";

import actions from 'Actions/login'


import 'Static/font/font-awesome/css/font-awesome.css';
import flexible from 'Static/js/flexible/flexible'

// import "./app.less";
import "Static/css/config.css";
import "Static/font/style.css"
import 'Static/font/font/iconfont.css';



class App extends Component {

    componentDidMount() {
        // window.addEventListener("popstate", function (e) {
        //     // 监听到了浏览器的返回按钮事件
        //     let path = browserHistory.getCurrentLocation().pathname
        //     if (path.indexOf('orderManage') !== -1 || path.indexOf('orderAssign') !== -1) {
        //         browserHistory.push('/h5/ticket/orderList')
        //     }
        // }, false);

        let openid = sessionStorage.getItem('openid')
        //刷新页面若使用weixin登录则再次获取token
        // 定时刷新access_token
        if (openid) {
            setInterval(() => {
                this.props.actions.refreshAccessToken({
                    openid: openid
                }).then(() => {
                    let { access_token, expires_in } = this.props.login.refreshTokenInfo.data
                    if (access_token) {
                        sessionStorage.setItem('token', access_token);
                        expires_in ? sessionStorage.setItem('expires_in', expires_in) : null
                        ajax.defaults.headers.common['access-token-id'] = access_token;
                    }
                })
            }, 60 * 60 * 1000)
        }
    }

    render() {
        return (
            <div>
                {this.props.children}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        login: state.login
    };
}

const mapDispatchToProps = (dispatch) => {

    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);