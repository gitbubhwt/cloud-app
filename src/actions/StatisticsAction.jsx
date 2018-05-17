/*员工组*/
import axios from "axios";
import "../containers/AxiosInterceptors";
import { notification, } from "antd";
//请求报错
export const DYNAMICFIELD_ERR = "DYNAMICFIELD_ERR";
//工作量统计
//export const ADDSTAFF = "ADDSTAFF";
export const WORKLOADLIST = "WORKLOADLIST";
export const WORKLOADSEARCHLIST = "WORKLOADSEARCHLIST";
export const AGENTALL = "AGENTALL";
export const SESSIONRECORDLIST = "SESSIONRECORDLIST";
export const SESSIONRECORDSEARCH = "SESSIONRECORDSEARCH";
export const SESSIONSTATISTICSLIST = "SESSIONSTATISTICSLIST";
export const ASSIGNSESSIONRECORDLIST = "ASSIGNSESSIONRECORDLIST";
export const HISTORYRECORD = "HISTORYRECORD";
export const GUESTBOOKRECORD = "GUESTBOOKRECORD";
export const GUESTBOOKRECORDSEARCH = "GUESTBOOKRECORDSEARCH";
export const SESSIONSTATISTICSSEARCH = "SESSIONSTATISTICSSEARCH";
export const EVALUATESEARCH = "EVALUATESEARCH";
export const EVALUATELIST = "EVALUATELIST";
export const EVALUATECHANNELLIST = "EVALUATECHANNELLIST";
export const EVALUATECHANNELSEARCH = "EVALUATECHANNELSEARCH";
export const SESSIONDETAIL = "SESSIONDETAIL";
export const GUESTRECORD = "GUESTRECORD";
export const RECORDSTART = "RECORDSTART";
export const PERFORMLIST = "PERFORMLIST";
export const AGENTSTATELIST = "AGENTSTATELIST";
export const AGENTSTATESEARCH = "AGENTSTATESEARCH";
export const PERFORMSEARCH = "PERFORMSEARCH";

let code = "?code=12345";
//工作量统计初始数据
export const WorkLoadList = (params) => {
    return dispatch => {
        axios.all([
            axios.get("/im/statics/work.json"+code, { params: params.listParams }),
            axios.get("/im/get/dept/agent/all.json"+code, params.agentParams)])
            .then((response) => {
                const workListData = response[0];
                const agentAllData = response[1];
                if (workListData.rows.length == 0) {
                    workListData.rows.push({ in_session_num: "暂无数据" });
                }
                let workLoadAction = {
                    type: WORKLOADLIST,
                    workListData,
                    agentAllData,
                };
                dispatch(workLoadAction);
            })
            .catch((err) => {
                dispatch(TickelistErroe(err));
            });
    };
};
export const AgentAll = (params) => {
    return dispatch => {
        axios.get("/im/get/dept/agent/all.json", params)
            .then((response) => {
                const agentAllData = response;
                let workLoadAction = {
                    type: AGENTALL,
                    agentAllData
                };
                dispatch(workLoadAction);
            })
            .catch((err) => {
                dispatch(TickelistErroe(err));
            });
    };
};
export const WorkLoadSearchList = (params) => {
    return dispatch => {
        axios.get("/im/statics/work.json"+code, { params })
            .then((response) => {
                const workListData = response;
                if (workListData.rows.length == 0) {
                    workListData.rows.push({ in_session_num: "暂无数据", key: "1" });
                }
                let workLoadAction = {
                    type: WORKLOADSEARCHLIST,
                    workListData
                };
                dispatch(workLoadAction);
            })
            .catch((err) => {
                dispatch(TickelistErroe(err));
            });
    };
};
//会话记录初始数据
export const SessionRecordList = (params) => {
    return dispatch => {
        axios.all([axios.get("/v1/flow/user/info.json"), axios.get("/im/statis/session/record.json"+code, { params }),])
            .then((response) => {
                const userInfo = response[0];
                const reportList = response[1];
                let rows = response[1].rows;
                if (rows.length == 0) {
                    rows[0] =
                        {
                            agent_news_num: "暂无数据",
                            key: "1",
                        }
                }
                let sessionRecordAction = {
                    type: SESSIONRECORDLIST,
                    userInfo,
                    reportList,
                };
                dispatch(sessionRecordAction);
            })
            .catch((err) => {
                dispatch(TickelistErroe(err));
            });
    };
};
//会话记录初始搜索数据
export const SessionRecordSearch = (params) => {
    return dispatch => {
        axios.all([axios.get("/im/statis/session/record.json"+code, { params }),])
            .then((response) => {
                const reportList = response[0];
                let rows = response[0].rows;
                if (rows.length == 0) {
                    rows[0] =
                        {
                            agent_news_num: "暂无数据",
                            key: "1",
                        }
                }
                let sessionRecordAction = {
                    type: SESSIONRECORDSEARCH,
                    reportList,
                };
                dispatch(sessionRecordAction);
            })
            .catch((err) => {
                dispatch(TickelistErroe(err));
            });
    };
};
//业务受理会话记录
export const AssignSessionRecordList = (params) => {
    return dispatch => {
        /*axios.post(`/v1/statis/work/data.json`,params)*/
        axios.get("/im/client/dialog/report.json", { params })
            .then((response) => {
                const assignReportList = response;
                let sessionRecordAction = {
                    type: ASSIGNSESSIONRECORDLIST,
                    assignReportList,

                };
                dispatch(sessionRecordAction);
            })
            .catch((err) => {
                dispatch(TickelistErroe(err));
            });
    };
};
//会话统计初始值
export const SessionStatisticsList = (params) => {
    return dispatch => {
        /*axios.post(`/v1/statis/work/data.json`,params)*/
        axios.all([axios.post("/im/get/group/all.json"), axios.get("/im/get/dialog/statis.json", { params: params }), axios.get("/im/get/evaluate/title.json")])
            .then((response) => {
                let columns = [{
                    title: '序号',
                    dataIndex: 'number',
                    key: 'number',
                    //width:150,
                    sorter: true
                }, {
                    title: '时间',
                    dataIndex: 'date',
                    key: 'date',
                    // width:150,
                    sorter: true
                }, {
                    title: '坐席组',
                    dataIndex: 'group_name',
                    key: 'group_name',
                    //width:150,
                    sorter: true
                }, {
                    title: '总会话数',
                    dataIndex: 'total_session_num',
                    key: 'total_session_num',
                    //width:150,
                    sorter: true,
                }, {
                    title: '接待会话数',
                    dataIndex: 'receive_session_num',
                    key: 'receive_session_num',
                    //width:150,
                    sorter: true,
                }, {
                    title: '完成会话数',
                    dataIndex: 'end_session_num',
                    key: 'end_session_num',
                    //width:150,
                    sorter: true,
                }, {
                    title: '总消息数',
                    dataIndex: 'total_session_news_num',
                    key: 'total_session_news_num',
                    //width:150,
                    sorter: true,
                }, {
                    title: '客户消息数',
                    dataIndex: 'client_news_num',
                    key: 'client_news_num',
                    //width:150,
                    sorter: true,
                }, {
                    title: '坐席消息数',
                    dataIndex: 'agent_news_num',
                    key: 'agent_news_num',
                    //width:150,
                    sorter: true,
                }, {
                    title: '平均首次响应时长',
                    dataIndex: 'avg_response_secs',
                    key: 'avg_response_secs',
                    //width:150,
                    sorter: true,
                }, {
                    title: '客户数',
                    dataIndex: 'session_client_num',
                    key: 'session_client_num',
                    //width:150,
                    sorter: true,
                }, {
                    title: '一次会话客户数',
                    dataIndex: 'one_session_client_num',
                    key: 'one_session_client_num',
                    //width:150,
                    sorter: true,
                }, {
                    title: '满意度评价数',
                    dataIndex: 'evaluate_num',
                    key: 'evaluate_num',
                    //width:150,
                    sorter: true,
                }, {
                    title: '参评率',
                    dataIndex: 'rate_evaluate',
                    key: 'rate_evaluate',
                    //width:150,
                    sorter: true,
                },];
                response[0].unshift({ id: "0", group_name: "全部" });
                const userGroup = response[0];
                const sessionTitle = columns.concat(response[2]);
                let rows = response[1].rows;
                for (let i = 0; i < rows.length; i++) {
                    rows[i].number = (params.page - 1) * params.pageSize + i + 1;
                }
                const sessionStatistics = response[1];
                let sessionStatisticsAction = {
                    type: SESSIONSTATISTICSLIST,
                    userGroup,
                    sessionStatistics,
                    sessionTitle
                };
                dispatch(sessionStatisticsAction);
            })
            .catch((err) => {
                dispatch(TickelistErroe(err));
            });
    };
};
//会话统计搜索
export const SessionStatisticsSearch = (params) => {
    return dispatch => {
        /*axios.post(`/v1/statis/work/data.json`,params)*/
        axios.all([axios.get("/im/get/dialog/statis.json", { params: params })])
            .then((response) => {

                let rows = response[0].rows;
                for (let i = 0; i < rows.length; i++) {
                    rows[i].number = (params.page - 1) * params.pageSize + i + 1;
                }
                const sessionStatistics = response[0];
                let sessionStatisticsAction = {
                    type: SESSIONSTATISTICSSEARCH,
                    sessionStatistics,
                };
                dispatch(sessionStatisticsAction);
            })
            .catch((err) => {
                dispatch(TickelistErroe(err));
            });
    };
};
//历史工单
export const HistoryRecordList = (params) => {
    return dispatch => {
        /*axios.post(`/v1/statis/work/data.json`,params)*/
        axios.all([axios.get("/im/ticket/history.json", params),])
            .then((response) => {

                const historyTicket = response[0];
                if (response[0].rows) {
                    for (let i = 0; i < response[0].rows.length; i++) {
                        if (response[0].rows[i].ticket_status == 1) {
                            response[0].rows[i].ticket_status = "接单中";
                        } else if (response[0].rows[i].ticket_status == 2) {
                            response[0].rows[i].ticket_status = "受理中";
                        } else if (response[0].rows[i].ticket_status == 3) {
                            response[0].rows[i].ticket_status = "已完成";
                        }
                    }
                }
                let historyRecordAction = {
                    type: HISTORYRECORD,
                    historyTicket,
                };
                dispatch(historyRecordAction);
            })
            .catch((err) => {
                dispatch(TickelistErroe(err));
            });
    };
};
//留言记录初始数据
export const GuestbookRecordList = (params) => {
    return dispatch => {
        /*axios.post(`/v1/statis/work/data.json`,params)*/
        axios.all([axios.get("/im/web/channel/all.json"+code),
        axios.get("/im/wechat/get/all.json"+code),
        axios.get("/im/get/leave/word.json"+code, { params: params })])
            .then((response) => {
                response[0].unshift({ id: "0", source_name: "全部" });
                response[1].unshift({ id: "0", nick_name: "全部" });
                const webAll = response[0];
                const wechatAll = response[1];
                let rows = [];
                if (response[2].length !== 0) {
                    rows = response[2].rows;
                }
                for (let i = 0; i < rows.length; i++) {
                    response[2].rows[i].number = (params.page - 1) * params.pageSize + i + 1;
                    response[2].rows[i].key = response[2].rows[i].user_id.toString();
                }
                const guestRecord = response[2];
                let guestRecordAction = {
                    type: GUESTBOOKRECORD,
                    webAll,
                    wechatAll,
                    guestRecord
                };
                dispatch(guestRecordAction);
            })
            .catch((err) => {
                dispatch(TickelistErroe(err));
            });
    };
};
//留言记录搜索
export const GuestbookRecordSearch = (params) => {
    return dispatch => {
        /*axios.post(`/v1/statis/work/data.json`,params)*/
        axios.all([axios.get("/im/get/leave/word.json", { params: params })])
            .then((response) => {
                let rows = [];
                if (response[0].length !== 0) {
                    rows = response[0].rows;
                }

                for (let i = 0; i < rows.length; i++) {
                    response[0].rows[i].number = (params.page - 1) * params.pageSize + i + 1;
                    response[0].rows[i].key = response[0].rows[i].user_id.toString();
                }
                const guestRecord = response[0];
                let guestRecordAction = {
                    type: GUESTBOOKRECORDSEARCH,
                    guestRecord
                };
                dispatch(guestRecordAction);

            })
            .catch((err) => {
                dispatch(TickelistErroe(err));
            });
    };
};
//满意度报表
export const EvaluateList = (params) => {
    return dispatch => {
        axios.all([axios.get("/im/statis/agent/evaluate.json", { params: params.listParams }),
        axios.get("/im/get/dept/agent/all.json", params.agentParams)])
            .then((response) => {
                const agentEvaluate = response[0];
                const agentAllData = response[1];
                let guestRecordAction = {
                    type: EVALUATELIST,
                    agentEvaluate,
                    agentAllData,
                };
                dispatch(guestRecordAction);
            })
            .catch((err) => {
                dispatch(TickelistErroe(err));
            });
    };
};
export const EvaluateChannelList = (params) => {
    return dispatch => {
        axios.all(
            [axios.get("/im/statis/source/evaluate.json", { params }),
            ])
            .then((response) => {
                const sourceEvaluate = response[0];
                let guestRecordAction = {
                    type: EVALUATECHANNELLIST,
                    sourceEvaluate,
                };
                dispatch(guestRecordAction);
            })
            .catch((err) => {
                dispatch(TickelistErroe(err));
            });
    };
};
export const EvaluateSearch = (params) => {
    return dispatch => {
        axios.all([axios.get("/im/statis/agent/evaluate.json", { params })])
            .then((response) => {
                const agentEvaluate = response[0];
                let EvaluateSearchAction = {
                    type: EVALUATESEARCH,
                    agentEvaluate,
                };
                dispatch(EvaluateSearchAction);
            })
            .catch((err) => {
                dispatch(TickelistErroe(err));
            });
    };
};
export const EvaluateChannelSearch = (params) => {
    return dispatch => {
        axios.all([axios.get("/im/statis/source/evaluate.json", { params }),])
            .then((response) => {
                const sourceEvaluate = response[0];
                let EvaluateChannelSearchAction = {
                    type: EVALUATECHANNELSEARCH,
                    sourceEvaluate,
                };
                dispatch(EvaluateChannelSearchAction);
            })
            .catch((err) => {
                dispatch(TickelistErroe(err));
            });
    };
};
export const SessionChat = (params, cfun) => {
    return dispatch => {
        axios.get("/im/session/detail.json", params)
            .then((response) => {
                for (let i = 0; i < response.length; i++) {
                    response[i].number = i + 1
                }
                const sessionDetail = response;
                let SessionDetailAction = {
                    type: SESSIONDETAIL,
                    sessionDetail,
                };
                cfun();
                dispatch(SessionDetailAction);
            })
            .catch((err) => {
                dispatch(TickelistErroe(err));
            });
    };
};

//单个留言记录
export const oneRecordTable = (params) => {
    return dispatch => {
        axios.get("/im/get/a/leave/word.json", params)
            .then((response) => {
                /*for(let i=0;i<response.length;i++){
                    response[i].number=i+1
                }*/
                const oneGustRecord = response;
                let GuestAction = {
                    type: GUESTRECORD,
                    oneGustRecord,
                };
                dispatch(GuestAction);
            })
            .catch((err) => {
                dispatch(TickelistErroe(err));
            });
    };
};

//批量发起会话

export const RecordStart = (params) => {
    return dispatch => {
        axios.get("/im/create/chat.json", params)
            .then((response) => {
                /*for(let i=0;i<response.length;i++){
                    response[i].number=i+1
                }*/
                notification.success({
                    message: "提示",
                    description: response,
                })
                if (response == "发起会话成功") {
                    window.parent.addTab("会话", 'chat/chat.html');
                }
                /*const chatRecord=response;
                let GuestAction={
                    type:RECORDSTART,
                    chatRecord,
                };
                dispatch(GuestAction);*/
            })
            .catch((err) => {
                dispatch(TickelistErroe(err));
            });
    };
};
//绩效统计
export const PerformStatisticsList = (params) => {
    // console.log("params", params);
    return dispatch => {
        axios.all([//axios.get("/v1/flow/dept/info.json"),
            axios.get("/im/statis/achievements.json", { params: params.listParams }),
            axios.get("/im/get/dept/agent/all.json", { params: params.agentParams })])
            .then((response) => {
                const performData = response[0];
                if (performData.rows.length == 0) {
                    performData.rows.push({ ar_ratio: "暂无数据" })
                }
                const agentAllData = response[1];
                let performAction = {
                    type: PERFORMLIST,
                    performData,
                    agentAllData,
                };
                dispatch(performAction);
            })
            .catch((err) => {
                dispatch(TickelistErroe(err));
            });
    };
};

//绩效搜索
export const PerformStatisticsSearch = (params) => {
    return dispatch => {
        axios.all([//axios.get("/v1/flow/dept/info.json"),
            axios.get("/im/statis/achievements.json", { params }),
        ])
            .then((response) => {
                const performData = response[0];
                if (performData.rows.length == 0) {
                    performData.rows.push({ ar_ratio: "暂无数据" })
                }
                let performAction = {
                    type: PERFORMSEARCH,
                    performData,
                };
                dispatch(performAction);
            })
            .catch((err) => {
                dispatch(TickelistErroe(err));
            });
    };
};
//坐席状态记录
export const AgentStateList = (params) => {
    // console.log("params", params);
    return dispatch => {
        axios.all([
            axios.get("/im/statis/agent/record.json", { params: params.listParams }),
            axios.get("/im/get/dept/agent/all.json", { params: params.agentParams })])
            .then((response) => {
                const agentStateData = response[0];
                const agentAllData = response[1];
                let agentStateAction = {
                    type: AGENTSTATELIST,
                    agentStateData,
                    agentAllData,
                };
                dispatch(agentStateAction);
            })
            .catch((err) => {
                dispatch(TickelistErroe(err));
            });
    };
};
//坐席状态搜索
export const AgentStateSearch = (params) => {
    // console.log("params", params);
    return dispatch => {
        axios.all([//axios.get("/v1/flow/dept/info.json"),
            axios.get("/im/statis/agent/record.json", { params }),
        ])
            .then((response) => {
                //const deptInfo=response[0];
                /*for(let i=0;i<response[0].length;i++){
                    response[0][i].number=i+1;
                }*/
                const agentStateData = response[0];
                //response[1].unshift({user_id:"",user_name:"全部",user_num:"全部"})
                let agentStateAction = {
                    type: AGENTSTATESEARCH,
                    agentStateData,
                };
                dispatch(agentStateAction);
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