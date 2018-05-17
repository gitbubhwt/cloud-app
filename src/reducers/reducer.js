import { combineReducers } from 'redux';

//引入各个reducer
import login from './login'

import { StaffReducer, } from "./Configreducer";
import { StatisticsReducer, } from "./Statisticsreducer";
import { MonitReducer, } from "./Monitreducer";


//TODO
//添加reducer
const reducers = {
	login,
	StaffReducer,
	StatisticsReducer,
	MonitReducer,
	// order,orderList,orderDetail,orderAssign,orderManage
}



//合并普通reducer和route的reducer
const finalCombineReducers = (routerReducer) => {
	return combineReducers({
		...reducers,
		routing: routerReducer
	})
}

export default finalCombineReducers
