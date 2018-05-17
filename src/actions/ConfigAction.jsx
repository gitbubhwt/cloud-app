/*员工组*/
import axios from "axios";
import qs from 'qs';
import "../containers/AxiosInterceptors";
import { notification, } from "antd";

//请求报错
export const DYNAMICFIELD_ERR = "DYNAMICFIELD_ERR";
//添加员工组
export const ADDSTAFF = "ADDSTAFF";
export const SETSTAFF = "SETSTAFF";
export const EDITSTAFF = "EDITSTAFF";
export const LISTSTAFF = "LISTSTAFF";
export const WORKTIMEGET = "WORKTIMEGET";
export const LISTWORKTIME = "LISTWORKTIME";
export const WEBCHANNELGET = "WEBCHANNELGET";
export const WEBCHANNELLIST = "WEBCHANNELLIST";
export const SESSIONAUTOGET = "SESSIONAUTOGET";
export const SESSIONASSIGN = "SESSIONASSIGN";
export const SESSIONEVALUATE = "SESSIONEVALUATE";
export const SESSIONNAVMENU = "SESSIONNAVMENU";
export const SESSIONROUTE = "SESSIONROUTE";
export const STAFFGROUP = "STAFFGROUP";
export const SESSIONROUTEEDIT = "SESSIONROUTEEDIT";
export const LISTSESSIONROUTE = "LISTSESSIONROUTE";
export const LISTWECHAT = "LISTWECHAT";


//todo
let url= "http://127.0.0.1:8040/ticket" ;
let code = "?code=12345";
let codeParam ="12345"

//获取所有员工信息
export const StaffAdd = (staffCfun) => {
    return dispatch => {
        axios.get("/v1/flow/user/info.json").then((response) => {
            const staffAll = response;
            const StaffAddAction = {
                type: ADDSTAFF,
                staffAll
            }
            dispatch(StaffAddAction);
            if (staffCfun) {
                staffCfun();
            }
        }).catch((err) => {
            dispatch(TickelistErroe(err));
        })
    };
};
//添加员工组保存
export const StaffSet = (params, router, addCfun) => {
    return dispatch => {
        axios.post("/im/set/group.json", params).then((response) => {
            notification.success({
                message: "提示",
                description: "添加员工组成功！",
            });
            router.push(`/EditStaff/${response.group_id}`);
            addCfun(response.group_id);
        }).catch((err) => {
            dispatch(TickelistErroe(err));
        })
    };
};


//编辑获取员工组信息
export const StaffEdit = (params) => {
    return dispatch => {
        axios.all([axios.get("/v1/flow/user/info.json"), axios.post("/im/get/group.json", params)]).then((response) => {
            const staffAll = response[0];
            const selectStaff = response[1];
            const StaffEditAction = {
                type: EDITSTAFF,
                staffAll,
                selectStaff,
            }
            dispatch(StaffEditAction);

        }).catch((err) => {
            dispatch(TickelistErroe(err));
        })
    };
};
//编辑员工组保存
export const StaffUpdate = (params,cfun) => {
    return dispatch => {
        axios.post("/im/update/group.json", params).then((response) => {
            notification.success({
                message: "提示",
                description: "编辑员工组成功！",
            });
            cfun();
        }).catch((err) => {
            dispatch(TickelistErroe(err));
        })
    };
};


//获取员工组列表
export const StaffList = (params) => {
    return dispatch => {
        axios.get("/im/get/group/list.json", params).then((response) => {
            for (let i = 0; i < response.rows.length; i++) {
                response.rows[i].key = Number(response.rows[i].id);
                if (params.params.page == 1) {
                    response.rows[i].number = i + 1;
                } else {
                    response.rows[i].number = (params.params.page - 1) * (params.params.pageSize) + i + 1;
                }
            }
            response.total = Number(response.total);
            const listStaff = response;
            const StaffListAction = {
                type: LISTSTAFF,
                listStaff,
            }
            dispatch(StaffListAction);
        }).catch((err) => {
            dispatch(TickelistErroe(err));
        })
    };
};


//删除员工组列表
export const StaffDelete = (params, cfun) => {
    return dispatch => {
        axios.post("/im/del/group.json", { group_id: params }).then((response) => {
            notification.success({
                message: "提示",
                description: "删除员工组成功！",
            });
            cfun();
        }).catch((err) => {
            dispatch(TickelistErroe(err));
        })
    };
};
//添加或编辑工作时间
export const WorkTimeSet = (params, router, cfun) => {
    return dispatch => {
        let workTimeId = 0;
        if (router.params.id) {
            workTimeId = router.params.id
        }
        axios.post(`/im/worktime/set/${workTimeId}.json`, params).then((response) => {
            if (router.path == "WorkTimeEdit") {
                notification.success({
                    message: "提示",
                    description: "编辑工作时间成功！",
                });
                cfun();
            } else {
                notification.success({
                    message: "提示",
                    description: "添加工作时间成功！",
                });
                router.push(`/WorkTimeEdit/${response.lastId}`);
            }
        }).catch((err) => {
            dispatch(TickelistErroe(err));
        })
    };
};
//获取工作时间
export const WorkTimeGet = (workTimeId, cfun) => {
    return dispatch => {
        axios.get(`/im/worktime/info/${workTimeId}.json`).then((response) => {
            const workTimeData = response;
            const WorkTimeDataAction = {
                type: WORKTIMEGET,
                workTimeData
            }
            dispatch(WorkTimeDataAction);
            cfun();
        }).catch((err) => {
            dispatch(TickelistErroe(err));
        })
    };
};
//获取工作时间列表
export const WorkList = (params) => {
    return dispatch => {
        axios.get("/im/worktime/list.json", params).then((response) => {
            for (let i = 0; i < response.rows.length; i++) {
                response.rows[i].key = Number(response.rows[i].id);
                if (params.params.page == 1) {
                    response.rows[i].number = i + 1;
                } else {
                    response.rows[i].number = (params.params.page - 1) * (params.params.pageSize) + i + 1;
                }
            }
            response.total = Number(response.total);
            const listWorkTime = response;
            const StaffListAction = {
                type: LISTWORKTIME,
                listWorkTime,
            }
            dispatch(StaffListAction);
        }).catch((err) => {
            dispatch(TickelistErroe(err));
        })
    };
};
//删除工作时间列表
export const WorkDelete = (params, cfun) => {
    return dispatch => {
        let reParams = { params: { worktime_ids: `[${params}]` } };
        axios.delete("/im/worktime/del.json", reParams).then((response) => {
            notification.success({
                message: "提示",
                description: "删除工作时间成功！",
            });
            cfun();
        }).catch((err) => {
            dispatch(TickelistErroe(err));
        })
    };
};


//添加网站渠道保存
export const WebChannelSet = (params, router, addCfun) => {
    return dispatch => {
        axios.post("/im/web/set/channel.json"+code, params).then((response) => {
            notification.success({
                message: "提示",
                description: "添加网站渠道成功！",
            });
            router.push(`/TrenchWebsiteEdit/${response.id}`);
        }).catch((err) => {
            dispatch(TickelistErroe(err));
        })
    };
};
//获取网站渠道
export const WebChannelGet = (channel_id) => {
    return dispatch => {
        axios.post(`/im/web/get/channel.json`+code, { channel_id: channel_id}).then((response) => {
            const webChannelData = response;
            const webChannelDataAction = {
                type: WEBCHANNELGET,
                webChannelData
            }
            dispatch(webChannelDataAction);

        }).catch((err) => {
            dispatch(TickelistErroe(err));
        })
    };
};
//编辑网站渠道
export const WebChannelEdit = (params) => {
    return dispatch => {
        axios.post("/im/web/update/channel.json"+code, params).then((response) => {
            notification.success({
                message: "提示",
                description: "编辑网站渠道成功！",
            });
        }).catch((err) => {
            dispatch(TickelistErroe(err));
        })
    };
};
//获取网站渠道列表
export const WebChannelList = (params) => {
    return dispatch => {
        axios.get("/im/web/get/channels/list.json"+code, params).then((response) => {
            console.log("response",response);
            for (let i = 0; i < response.rows.length; i++) {
                response.rows[i].key = Number(response.rows[i].id);
                if (params.params.page == 1) {
                    response.rows[i].number = i + 1;
                } else {
                    response.rows[i].number = (params.params.page - 1) * (params.params.pageSize) + i + 1;
                }
            }
            response.total = Number(response.total);
            const listWebChannel = response;
            const WebChannelListAction = {
                type: WEBCHANNELLIST,
                listWebChannel,
            }
            dispatch(WebChannelListAction);
        }).catch((err) => {
            dispatch(TickelistErroe(err));
        })
    };
};

//删除网站渠道列表
export const WebChannelDelete = (params, cfun) => {
    return dispatch => {
        axios.post("/im/web/del/channel.json"+code, { channel_id: params }).then((response) => {
            notification.success({
                message: "提示",
                description: "删除网页插件成功！",
            });
            cfun();
        }).catch((err) => {
            dispatch(TickelistErroe(err));
        })
    };
};
//获取会话配置-自动消息
export const SessionAutoMessageGet = () => {
    return dispatch => {
        axios.post("/im/get/chat/auto/config.json").then((response) => {
            const sessionAutoData = response;
            const sessionAutoDataAction = {
                type: SESSIONAUTOGET,
                sessionAutoData
            }
            dispatch(sessionAutoDataAction);

        }).catch((err) => {
            dispatch(TickelistErroe(err));
        })
    };
};
//设置会话配置-自动消息
export const SessionAutoMessageSet = (params) => {
    return dispatch => {
        axios.post("/im/chat/auto/config.json", params).then((response) => {
            notification.success({
                message: "提示",
                description: "设置会话配置-自动消息成功！",
            });

        }).catch((err) => {
            dispatch(TickelistErroe(err));
        })
    };
};
//获取会话配置-会话分配
export const SessionAssignGet = () => {
    return dispatch => {
        axios.post("/im/get/chat/allocation/config.json").then((response) => {
            const sessionAssignData = response;
            const sessionAssignAction = {
                type: SESSIONASSIGN,
                sessionAssignData
            }
            dispatch(sessionAssignAction);

        }).catch((err) => {
            dispatch(TickelistErroe(err));
        })
    };
};
//设置会话配置-会话分配
export const SessionAssignSet = (params) => {
    return dispatch => {
        axios.post("/im/chat/allocation/config.json", params).then((response) => {
            notification.success({
                message: "提示",
                description: "设置会话配置-会话分配成功！",
            });
        }).catch((err) => {
            dispatch(TickelistErroe(err));
        })
    };
};
//获取会话配置-满意度评价
export const SessionEvaluateGet = () => {
    return dispatch => {
        axios.post("/im/get/chat/evaluate/config.json").then((response) => {
            const sessionEvaluateData = response;
            const sessionEvaluateAction = {
                type: SESSIONEVALUATE,
                sessionEvaluateData
            }
            dispatch(sessionEvaluateAction);

        }).catch((err) => {
            dispatch(TickelistErroe(err));
        })
    };
};
//设置会话配置-满意度评价
export const SessionEvaluateSet = (params, cfun) => {
    return dispatch => {
        axios.post("/im/chat/evaluate/config.json", params).then((response) => {
            notification.success({
                message: "提示",
                description: "设置会话配置-满意度评价成功！",
            });
            cfun();
        }).catch((err) => {
            dispatch(TickelistErroe(err));
        })
    };
};
//获取会话配置-导航菜单
export const SessionNavMenuGet = () => {
    return dispatch => {
        axios.all([axios.post("/im/get/chat/menu/config.json"), axios.post("/im/get/group/all.json")]).then((response) => {
            const NavMenuData = response[0];
            const groupAllData = response[1];
            const sessionNavMenuAction = {
                type: SESSIONNAVMENU,
                NavMenuData,
                groupAllData
            }
            dispatch(sessionNavMenuAction);

        }).catch((err) => {
            dispatch(TickelistErroe(err));
        })
    };
};
//设置会话配置-导航菜单
export const SessionNavMenuSet = (params, cfun) => {
    return dispatch => {
        axios.post("/im/chat/menu/config.json", params).then((response) => {
            notification.success({
                message: "提示",
                description: "设置会话配置-导航菜单成功！",
            });
            cfun();
        }).catch((err) => {
            dispatch(TickelistErroe(err));
        })
    };
};
//获取会话路由需要的信息-添加页面
export const SessionRouteGet = () => {
    return dispatch => {
        axios.all([axios.get("/im/web/channel/all.json"), axios.get("/im/wechat/get/all.json"), axios.get("/im/worktime/all.json"), axios.post("/im/get/chat/menu/config.json")]).then((response) => {
            const WebChannelData = response[0];
            const WechatData = response[1];
            const WorkAllData = response[2];
            const NavMenuData = response[3];
            const sessionRouteAction = {
                type: SESSIONROUTE,
                WebChannelData,
                WechatData,
                WorkAllData,
                NavMenuData

            }
            dispatch(sessionRouteAction);
        }).catch((err) => {
            dispatch(TickelistErroe(err));
        })
    };
};
//动作变化-获取坐席组
export const StaffGroup = (staffGroupCfun) => {
    return dispatch => {
        axios.post("/im/get/group/all.json").then((response) => {
            const staffGroupAll = response;
            const StaffGroupAction = {
                type: STAFFGROUP,
                staffGroupAll
            }
            dispatch(StaffGroupAction);
            if (staffGroupCfun) {
                staffGroupCfun();
            }
        }).catch((err) => {
            dispatch(TickelistErroe(err));
        })
    };
};
//设置会话配置-会话路由
export const SessionRouteSet = (parames, router) => {
    return dispatch => {
        axios.post(`/im/session/route/set/${parames.rid}.json`, parames).then((response) => {
            if (parames.rid == 0) {
                notification.success({
                    message: "提示",
                    description: "添加会话配置-会话路由成功！",
                });
                SessionRouteSet(response.lastId);
            } else {
                notification.success({
                    message: "提示",
                    description: "编辑会话配置-会话路由成功！",
                });
            }
            router.push(`/SessionRouteEdit/${response.lastId}`);
        }).catch((err) => {
            dispatch(TickelistErroe(err));
        })
    };
};
//获取会话路由需要的信息-编辑页面
export const SessionRouteEditGet = (rid) => {
    return dispatch => {
        axios.all([axios.get("/im/web/channel/all.json"), axios.get("/im/wechat/get/all.json"), axios.get("/im/worktime/all.json"),
        axios.post("/im/get/chat/menu/config.json"), axios.get(`/im/session/route/info/${rid}.json`)]).then((response) => {
            const WebChannelData = response[0];
            const WechatData = response[1];
            const WorkAllData = response[2];
            const NavMenuData = response[3];
            const RouteData = response[4];
            if (RouteData.assign_type == 1) {
                dispatch(StaffGroup()) //获取坐席组
            }
            if (RouteData.assign_type == 2) {
                dispatch(StaffAdd()) //获取所有坐席
            }
            const sessionRouteAction = {
                type: SESSIONROUTEEDIT,
                WebChannelData,
                WechatData,
                WorkAllData,
                NavMenuData,
                RouteData
            }
            dispatch(sessionRouteAction);
        }).catch((err) => {
            dispatch(TickelistErroe(err));
        })
    };
};
//获取会话配置-会话路由列表
export const RouteList = (params) => {
    return dispatch => {
        axios.get("/im/session/route/list.json", params).then((response) => {
            for (let i = 0; i < response.length; i++) {
                response[i].key = Number(response[i].id);
                response[i].number = i + 1;
            }
            const listSessionRoute = response;
            const StaffListAction = {
                type: LISTSESSIONROUTE,
                listSessionRoute,
            }
            dispatch(StaffListAction);
        }).catch((err) => {
            dispatch(TickelistErroe(err));
        })
    };
};
//删除会话路由列表
export const RouteDelete = (params, cfun) => {
    let reParams = { params: { session_ids: `[${params}]` } };
    return dispatch => {
        axios.get("/im/session/route/del.json", reParams).then((response) => {
            notification.success({
                message: "提示",
                description: "删除会话路由成功！",
            });
            cfun();
        }).catch((err) => {
            dispatch(TickelistErroe(err));
        })
    };
};
//获取会话配置-微信公众号列表
export const WechatList = (params) => {
    return dispatch => {
        axios.get("/im/wechat/get/list.json", params).then((response) => {
            for (let i = 0; i < response.rows.length; i++) {
                response.rows[i].key = Number(response.rows[i].id);
                if (params.params.page == 1) {
                    response.rows[i].number = i + 1;
                } else {
                    response.rows[i].number = (params.params.page - 1) * (params.params.pageSize) + i + 1;
                }
            }
            response.total = Number(response.total);
            const listWechat = response;
            const StaffListAction = {
                type: LISTWECHAT,
                listWechat,
            }
            dispatch(StaffListAction);
        }).catch((err) => {
            dispatch(TickelistErroe(err));
        })
    };
};
//微信渠道添加
export const WeChatAdd = () => {
    return dispatch => {
        axios.get("/api/wechat/authorizer.json").then((response) => {
            window.location.href = response.url;
        }).catch((err) => {
            dispatch(TickelistErroe(err));
        })
    };
}
//会话路由排序
export const SessionSort = (params) => {
    return dispatch => {
        axios.get("/im/session/route/order.json", params).then((response) => {
            notification.success({
                message: "提示",
                description: "会话路由列表排序成功！",
            });
        }).catch((err) => {
            dispatch(TickelistErroe(err));
        })
    };
};
/*export const*/
//报错-
export const TickelistErroe = (err) => {
    return {
        type: DYNAMICFIELD_ERR,
        err,
    };
};