/*员工组*/
import axios from "axios";
import "../containers/AxiosInterceptors";
import { notification, } from "antd";
//请求报错
export const DYNAMICFIELD_ERR = "DYNAMICFIELD_ERR";
//在线客服监控
export const CHANNELMONIT = "CHANNELMONIT";
export const AGENTGROUPMONIT = "AGENTGROUPMONIT";
export const AGENTMONIT = "AGENTMONIT";
export const AGENTALL = "AGENTALL";
export const AGENTMONITSEARCH = "AGENTMONITSEARCH";

let code = "?code=12345";
//接入渠道监控
export const ChannelMonitList = (params) => {
    return dispatch => {
        axios.get("/im/statis/channel/monitor.json"+code, { params })
            .then((response) => {
                const channelMonit = response;
                let ChannelMonitAction = {
                    type: CHANNELMONIT,
                    channelMonit,
                };
                dispatch(ChannelMonitAction);
            })
            .catch((err) => {
                dispatch(TickelistErroe(err));
            });
    };
};
//坐席组监控
export const AgentGroupList = () => {
    return dispatch => {
        axios.get("/im/group/monitor.json"+code)
            .then((response) => {
                const agentGroupMonit = response;
                let AgentGroupMonitAction = {
                    type: AGENTGROUPMONIT,
                    agentGroupMonit,
                };
                dispatch(AgentGroupMonitAction);
            })
            .catch((err) => {
                dispatch(TickelistErroe(err));
            });
    };
};
//坐席监控
export const AgentList = (requestParams) => {
    return dispatch => {
        axios.all([axios.get("/im/statis/agent/monitor.json"+code, { params: requestParams.listParams }), axios.get("/v1/flow/dept/info.json"), axios.get("/im/get/dept/agent/all.json", requestParams.agentParams)])
            .then((response) => {
                const agentMonit = response[0];
                if (agentMonit.rows.length == 0) {
                    agentMonit.rows.push({ status_keep_time: "暂无数据" });
                }
                const userInfo = response[2];
                response[2].unshift({ user_id: "", user_name: "全部", user_num: "全部" })
                const deptInfo = response[1];
                let AgentMonitAction = {
                    type: AGENTMONIT,
                    agentMonit,
                    deptInfo,
                    userInfo,
                };
                dispatch(AgentMonitAction);
            })
            .catch((err) => {
                dispatch(TickelistErroe(err));
            });
    };
};
//部门变化
export const AgentAll = (params) => {
    return dispatch => {
        axios.get("/im/get/dept/agent/all.json", params)
            .then((response) => {
                response.unshift({ user_id: "0", user_name: "全部", user_num: "全部" });
                const userInfo = response;
                let workLoadAction = {
                    type: AGENTALL,
                    userInfo
                };
                dispatch(workLoadAction);
            })
            .catch((err) => {
                dispatch(TickelistErroe(err));
            });
    };
};
//坐席监控表格数据（搜索和刷新后的数据）
export const AgentMonitSearch = (params) => {
    return dispatch => {
        axios.get("/im/statis/agent/monitor.json"+code, { params })
            .then((response) => {
                const agentMonit = response;
                if (agentMonit.rows.length == 0) {
                    agentMonit.rows.push({ status_keep_time: "暂无数据" });
                }
                let workLoadAction = {
                    type: AGENTMONITSEARCH,
                    agentMonit
                };
                dispatch(workLoadAction);
            })
            .catch((err) => {
                dispatch(TickelistErroe(err));
            });
    };
};
//坐席监控-状态改变
export const AgentStatus = (params, cfun) => {
    return dispatch => {
        axios.get("/im/agent/change/status.json"+code, params)
            .then((response) => {
                notification.success({
                    message: "提示",
                    description: "改变坐席状态成功！",
                });
                cfun();
            })
            .catch((err) => {
                dispatch(TickelistErroe(err));
            });
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