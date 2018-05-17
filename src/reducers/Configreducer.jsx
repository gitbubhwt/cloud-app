/*动态字段*/
import {
    DYNAMICFIELD_ERR, ADDSTAFF, EDITSTAFF, LISTSTAFF, WORKTIMEGET, LISTWORKTIME, WEBCHANNELGET, WEBCHANNELLIST,
    SESSIONAUTOGET, SESSIONASSIGN, SESSIONEVALUATE, SESSIONNAVMENU, SESSIONROUTE, STAFFGROUP, SESSIONROUTEEDIT,
    LISTSESSIONROUTE, LISTWECHAT,
} from 'Actions/ConfigAction.jsx';

export const StaffReducer = (state = {}, action = {}) => {

    if (state.error) {
        delete state.error;
    }

    switch (action.type) {
        case ADDSTAFF: {
            return {
                ...state,
                staffAll: action.staffAll,
            }
        }
        case EDITSTAFF: {
            return {
                ...state,
                staffAll: action.staffAll,
                selectStaff: action.selectStaff,
            }
        }
        case LISTSTAFF: {
            return {
                ...state,
                listStaff: action.listStaff,
            }
        }
        case WORKTIMEGET: {
            return {
                ...state,
                workTimeData: action.workTimeData,
            }
        }
        case LISTWORKTIME: {
            return {
                ...state,
                listWorkTime: action.listWorkTime,
            }
        }
        case WEBCHANNELGET: {
            return {
                ...state,
                webChannelData: action.webChannelData,
            }
        }
        case WEBCHANNELLIST: {
            return {
                ...state,
                listWebChannel: action.listWebChannel,
            }
        }
        case SESSIONAUTOGET: {
            return {
                ...state,
                sessionAutoData: action.sessionAutoData,
            }
        }
        case SESSIONASSIGN: {
            return {
                ...state,
                sessionAssignData: action.sessionAssignData,
            }
        }
        case SESSIONEVALUATE: {
            return {
                ...state,
                sessionEvaluateData: action.sessionEvaluateData,
            }
        }
        case SESSIONNAVMENU: {
            return {
                ...state,
                NavMenuData: action.NavMenuData,
                groupAllData: action.groupAllData,
            }
        }
        case SESSIONROUTE: {
            return {
                ...state,
                WebChannelData: action.WebChannelData,
                WechatData: action.WechatData,
                WorkAllData: action.WorkAllData,
                NavMenuData: action.NavMenuData,
            }
        }
        case STAFFGROUP: {
            return {
                ...state,
                staffGroupAll: action.staffGroupAll,
            }
        }
        case SESSIONROUTEEDIT: {
            return {
                ...state,
                WebChannelData: action.WebChannelData,
                WechatData: action.WechatData,
                WorkAllData: action.WorkAllData,
                NavMenuData: action.NavMenuData,
                RouteData: action.RouteData,
            }

        }
        case LISTSESSIONROUTE: {
            return {
                ...state,
                listSessionRoute: action.listSessionRoute,

            }
        }
        case LISTWECHAT: {
            return {
                ...state,
                listWechat: action.listWechat,

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