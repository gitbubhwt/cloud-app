/*统计报表*/
import { DYNAMICFIELD_ERR, CHANNELMONIT, AGENTGROUPMONIT, AGENTMONIT, AGENTALL, AGENTMONITSEARCH, } from 'Actions/MonitAction';

export const MonitReducer = (state = {}, action = {}) => {

    if (state.error) {
        delete state.error;
    }

    switch (action.type) {
        case AGENTMONIT: {
            //接入渠道
            return {
                ...state,
                agentMonit: action.agentMonit,
                deptInfo: action.deptInfo,
                userInfo: action.userInfo,
            }
        }

        case AGENTGROUPMONIT: {
            //接入渠道
            return {
                ...state,
                agentGroupMonit: action.agentGroupMonit,
            }
        }

        case CHANNELMONIT: {
            //接入渠道
            return {
                ...state,
                channelMonit: action.channelMonit,
            }
        }

        case AGENTALL: {
            //接入渠道
            return {
                ...state,
                userInfo: action.userInfo,
            }
        }
        case AGENTMONITSEARCH: {
            return {
                ...state,
                agentMonit: action.agentMonit,
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