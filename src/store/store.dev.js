import { applyMiddleware, createStore, compose } from 'redux'
// import axiosMiddleware from 'redux-axios-middleware'

// import axiosMiddlewareConfig from 'Utils/axios_middleware_config'

import axiosMiddleware from 'Utils/axios_middleware'

import axiosInstance from 'Ajax'

import thunk from 'redux-thunk' // redux-thunk 支持 dispatch function，并且可以异步调用它
import { createLogger } from 'redux-logger'
import DevTools from '../containers/DevTools'


// 创建日志中间件
const loggerMiddleware = createLogger()

// 创建一个中间件集合
const middleware = [axiosMiddleware,thunk,loggerMiddleware]

// 利用compose增强store，这个 store 与 applyMiddleware 和 redux-devtools 一起使用
const finalCreateStore = compose(
    applyMiddleware(...middleware),
    DevTools.instrument(),
)(createStore)


export default finalCreateStore
