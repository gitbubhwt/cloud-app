import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { Router, match, hashHistory } from 'react-router'
import { routerReducer, syncHistoryWithStore } from 'react-router-redux'

import finalCombineReducers from './reducers/reducer'
import configureStore from './store'
import routes from './routes'
// import { LocaleProvider } from 'antd';
// import zhCN from 'antd/lib/locale-provider/zh_CN';


const reducers = finalCombineReducers(routerReducer);

//传入reducer获取store
const store = configureStore(reducers);



//支持webpack热重启
if (module.hot && process.env.NODE_ENV !== 'production') {
    module.hot.accept('./reducers', () => {
        const nextRootReducer = require('./reducers')(routerReducer);
        store.replaceReducer(nextRootReducer)
    })
};



//这里使用了html5的browserHistory， 而不是hash路由
//同步history路由到redux的store中
// const history = syncHistoryWithStore(browserHistory, store)


// console.log(Provider);

//渲染根节点
// <LocaleProvider locale={zhCN}>
// </LocaleProvider>,
render(
    <Provider store={store}>
        <Router history={hashHistory} routes={routes} />
    </Provider>,
    document.getElementById('root')
)


