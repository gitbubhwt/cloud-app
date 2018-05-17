import { combineReducers, } from "redux";

//引入reducer文件
import { StaffReducer, } from "./Configreducer";
import { StatisticsReducer, } from "./Statisticsreducer";
import { MonitReducer, } from "./Monitreducer";



export default combineReducers({
    StaffReducer,
    StatisticsReducer,
    MonitReducer,

});
