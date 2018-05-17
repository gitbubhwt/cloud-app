/*统计报表*/
import {
    DYNAMICFIELD_ERR, WORKLOADLIST, AGENTALL, WORKLOADSEARCHLIST, SESSIONRECORDLIST, SESSIONSTATISTICSLIST, SESSIONRECORDSEARCH,
    ASSIGNSESSIONRECORDLIST, HISTORYRECORD, GUESTBOOKRECORD, GUESTBOOKRECORDSEARCH, SESSIONSTATISTICSSEARCH, EVALUATELIST,
    EVALUATESEARCH, EVALUATECHANNELLIST, EVALUATECHANNELSEARCH, SESSIONDETAIL, GUESTRECORD, PERFORMLIST, AGENTSTATELIST,
    AGENTSTATESEARCH, PERFORMSEARCH
} from 'Actions/StatisticsAction';

export const StatisticsReducer = (state = {}, action = {}) => {

    if (state.error) {
        delete state.error;
    }

    switch (action.type) {

        case WORKLOADLIST: {
            return {
                ...state,
                //deptInfo: action.deptInfo,
                workListData: action.workListData,
                agentAllData: action.agentAllData,
            }
        }
        case WORKLOADSEARCHLIST: {
            return {
                ...state,
                workListData: action.workListData,
            }
        }
        case AGENTALL: {
            return {
                ...state,
                agentAllData: action.agentAllData,
            }
        }
        case SESSIONRECORDLIST: {
            return {
                ...state,
                userInfo: action.userInfo,
                reportList: action.reportList,
            }
        }
        case SESSIONRECORDSEARCH: {
            return {
                ...state,
                reportList: action.reportList,
            }
        }
        case ASSIGNSESSIONRECORDLIST: {
            return {
                ...state,
                assignReportList: action.assignReportList,
            }
        }
        case SESSIONSTATISTICSLIST: {
            return {
                ...state,
                userGroup: action.userGroup,
                sessionStatistics: action.sessionStatistics,
                sessionTitle: action.sessionTitle,
            }
        }
        case SESSIONSTATISTICSSEARCH: {
            return {
                ...state,
                sessionStatistics: action.sessionStatistics,
            }
        }
        case HISTORYRECORD: {
            return {
                ...state,
                historyTicket: action.historyTicket,
            }
        }
        case GUESTBOOKRECORD: {
            return {
                ...state,
                webAll: action.webAll,
                wechatAll: action.wechatAll,
                guestRecord: action.guestRecord,
            }
        }
        case GUESTBOOKRECORDSEARCH: {
            return {
                ...state,
                guestRecord: action.guestRecord,
            }
        }
        case EVALUATELIST: {
            return {
                ...state,
                agentEvaluate: action.agentEvaluate,
                evaluateTitle: action.evaluateTitle,
                deptInfo: action.deptInfo,
                agentAllData: action.agentAllData,

            }
        }
        case EVALUATECHANNELLIST: {
            return {
                ...state,
                sourceEvaluate: action.sourceEvaluate,
                webAll: action.webAll,
                wechatAll: action.wechatAll,
            }
        }
        case EVALUATESEARCH: {
            return {
                ...state,
                agentEvaluate: action.agentEvaluate,
            }
        }
        case EVALUATECHANNELSEARCH: {
            return {
                ...state,
                sourceEvaluate: action.sourceEvaluate,
            }
        }
        case SESSIONDETAIL: {
            return {
                ...state,
                sessionDetail: action.sessionDetail,
            }
        }
        case GUESTRECORD: {
            return {
                ...state,
                oneGustRecord: action.oneGustRecord,
            }
        }
        case PERFORMLIST: {
            return {
                ...state,
                performData: action.performData,
                agentAllData: action.agentAllData,
            }
        }
        case AGENTSTATELIST: {
            return {
                ...state,
                agentStateData: action.agentStateData,
                agentAllData: action.agentAllData,
            }
        }
        case AGENTSTATESEARCH: {
            return {
                ...state,
                agentStateData: action.agentStateData,
            }
        }
        case PERFORMSEARCH: {
            return {
                ...state,
                performData: action.performData,
            }
        }
        case DYNAMICFIELD_ERR: {
            //报错
            return {
                ...state,
                error: action.err,
            }
        }

    }
    return state;
}