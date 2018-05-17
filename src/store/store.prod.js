import { applyMiddleware, createStore, compose } from 'redux'
// import axiosMiddleware from 'redux-axios-middleware'
// import axiosMiddlewareConfig from 'config/axios_middleware_config'
import axiosMiddleware from 'Utils/axios_middleware'
// import axiosInstance from 'Ajax'
import thunk from 'redux-thunk' // redux-thunk 支持 dispatch function，并且可以异步调用它

// 创建一个中间件集合
const middleware = [thunk,axiosMiddleware]

const finalCreateStore = compose(
    applyMiddleware(...middleware),
)(createStore)


export default finalCreateStore

