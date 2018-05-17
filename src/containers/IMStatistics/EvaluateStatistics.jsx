/*
* 满意度评价*/
import React, {Component,} from "react";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import moment from 'moment';
import { Row, Col,Layout,Select,Form,Button,Table,Card,DatePicker,TreeSelect,Tabs, } from "antd";
import {EvaluateList,EvaluateSearch,EvaluateChannelList,AgentAll,EvaluateChannelSearch} from "Actions/StatisticsAction";
import WaterMark from 'Static/js/watermark';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;
moment.locale("zh-cn");
const { Option, OptGroup } = Select;
const TreeNode = TreeSelect.TreeNode;
export default class EvaluateStatistics extends Component{
    constructor(props, context) {
        super(props, context);
        this.Time=0;
        this.start_time="";
        this.end_time="";
        this.sourceType=1;
        this.columns = [{
            title: '坐席工号',
            dataIndex: 'worker_id',
            key: 'worker_id',
            width:150,
            sorter: true,
        },{
            title: '员工组',
            dataIndex: 'group_ids',
            key: 'group_ids',
            width:150,
            sorter: true,
        },{
            title: '独立会话数',
            dataIndex: 'indep_session_num',
            key: 'indep_session_num',
            width:150,
            sorter: true,
        },{
            title: '邀评发送次数',
            dataIndex: 'require_eval_times',
            key: 'require_eval_times',
            width:150,
            sorter: true,
        }, {
            title: '满意度评价数',
            dataIndex: 'evaluate_num',
            key: 'evaluate_num',
            width:150,
            sorter: true,
        },{
            title: '参评率',
            dataIndex: 'rate_evaluate',
            key: 'rate_evaluate',
            width:150,
        },{
            title: '一星评价数',
            dataIndex: 'one_star_num',
            key: 'one_star_num',
            width:150,
            sorter: true,
        },{
            title: '二星评价数',
            dataIndex: 'two_star_num',
            key: 'two_star_num',
            width:150,
            sorter: true,
        },{
            title: '三星评价数',
            dataIndex: 'three_star_num',
            key: 'three_star_num',
            width:150,
            sorter: true,
        },{
            title: '四星评价数',
            dataIndex: 'four_star_num',
            key: 'four_star_num',
            width:150,
            sorter: true,
        },{
            title: '五星评价数',
            dataIndex: 'five_star_num',
            key: 'five_star_num',
            width:150,
            sorter: true,
        },{
            title: '六星评价数',
            dataIndex: 'six_star_num',
            key: 'six_star_num',
            width:150,
            sorter: true,
        },];
        this.channelColumns = [{
            title: '渠道名称',
            dataIndex: 'channelName',
            key: 'channelName',
            width:150,
            sorter: true,
        },{
            title: '完成会话数',
            dataIndex: 'end_session_num',
            key: 'end_session_num',
            width:150,
            sorter: true,
        },  {
            title: '满意度评价数',
            dataIndex: 'evaluate_num',
            key: 'evaluate_num',
            width:150,
            sorter: true,
        },{
            title: '参评率',
            dataIndex: 'rate_evaluate',
            key: 'rate_evaluate',
            width:150,
        },{
            title: '一星评价数',
            dataIndex: 'one_star_num',
            key: 'one_star_num',
            width:150,
            sorter: true,
        },{
            title: '二星评价数',
            dataIndex: 'two_star_num',
            key: 'two_star_num',
            width:150,
            sorter: true,
        }, {
            title: '三星评价数',
            dataIndex: 'three_star_num',
            key: 'three_star_num',
            width:150,
            sorter: true,
        },{
            title: '四星评价数',
            dataIndex: 'four_star_num',
            key: 'four_star_num',
            width:150,
            sorter: true,
        },{
            title: '五星评价数',
            dataIndex: 'five_star_num',
            key: 'five_star_num',
            width:150,
            sorter: true,
        }, {
            title: '六星评价数',
            dataIndex: 'six_star_num',
            key: 'six_star_num',
            width:150,
            sorter: true,
        },];
        this.agenttableType="agent_eval";
        this.channeltableType="source_eval";
        //分页
        this.onShowSizeChange=(value)=> {
            this.Pagin.page=value;
            this.searchInfo();
        };
        this.Pagin={
            page:1,
            pageSize:10,
        };
        this.sortRank={
            filterInfo: {},
            sorterInfo: {},
            pagination:{},
        };
        this.channelonShowSizeChange=(value)=> {
            this.Pagin.page=value;
            this.searchInfo();
        };
        this.channelPagin={
            page:1,
            pageSize:10,
        };
        this.channelsortRank={
            filterInfo: {},
            sorterInfo: {},
            pagination:{},
        };
        this.state={
            selectedRowKeys:[],
            visible:false,
            tabsKey:1,
        }
    }
    //服务端取数据
    componentWillMount() {
        this.waterMarkText=localStorage.getItem("watermark");
        this.start_time=moment().format("YYYY-MM-DD") ;
        this.end_time=moment().format("YYYY-MM-DD");
        this.channel_start_time=moment().format("YYYY-MM-DD");
        this.channel_end_time=moment().format("YYYY-MM-DD");
        this.agentDom=[];
        const condition={
            start:this.start_time.replace(/-/g,""),
            end:this.end_time.replace(/-/g,""),
            agentId:"",
        };
        this.condition=JSON.stringify(condition);
        const listParams={
            condition:JSON.stringify(condition),
            page:1,
            pageSize:10,
            sortField: this.channelsortRank.sorterInfo.field || '',
            sortOrder: this.channelsortRank.sorterInfo.order || '',
        };
        const agentParams={dept_id:0};
        let params={
            listParams,
            agentParams
        }
        this.props.dispatch(EvaluateList(params));
    }
    componentDidMount(){
        if(this.waterMarkText){
            WaterMark.addWaterMark(this.waterMarkText,"#fff","20px 黑体","scroll");
        }
    }
    searchInfo(click){
        let dataformat = "YYYY-MM-DD";
        let condition={};
        let _params={};
        if(this.state.tabsKey==1){
            this.props.form.validateFields((err, values) => {
                if (values.searchTime != undefined && values.searchTime.length > 0) {
                    this.end_time_search = values.searchTime[1].format(dataformat);
                    this.start_time_search = values.searchTime[0].format(dataformat);
                    let ag_id=[];
                    if(values.ag_id==undefined){
                        values.ag_id=[];
                    }
                    for(let i=0;i<values.ag_id.length;i++){
                        ag_id.push(values.ag_id[i].substring(0,values.ag_id[i].indexOf("+")));
                    }
                    condition={
                        start:this.start_time_search.replace(/-/g,""),
                        end:this.end_time_search.replace(/-/g,""),
                        agentId:ag_id.join(","),
                    };
                }
            });
            this.condition=JSON.stringify(condition);
            if(click=="clickSearch"){
                this.Pagin.page=1;
            }
            _params = {
                condition:JSON.stringify(condition),
                page:this.Pagin.page,
                pageSize:this.Pagin.pageSize,
                sortField: this.sortRank.sorterInfo.field || '',
                sortOrder: this.sortRank.sorterInfo.order || '',
            };
        }else{
            this.props.form.validateFields((err, values) => {
                if (values.searchChannelTime != undefined && values.searchChannelTime.length > 0) {
                    this.end_time_channel_search = values.searchChannelTime[1].format(dataformat);
                    this.start_time_channel_search = values.searchChannelTime[0].format(dataformat);
                    condition={
                        start:this.start_time_channel_search.replace(/-/g,""),
                        end:this.end_time_channel_search.replace(/-/g,""),
                    };
                }
            });
            this.channel_condition=JSON.stringify(condition);
            if(click=="clickSearch"){
                this.channelPagin.page=1;
            }
             _params = {
                condition:JSON.stringify(condition),
                page:this.channelPagin.page,
                pageSize:this.channelPagin.pageSize,
                sortField: this.channelsortRank.sorterInfo.field || '',
                sortOrder: this.channelsortRank.sorterInfo.order || '',

            };
        }
        if(this.state.tabsKey==1){
            this.props.dispatch(EvaluateSearch(_params));
        }else{
            this.props.dispatch(EvaluateChannelSearch(_params));
        }

    }
    /*分页、排序、筛选变化时触发*/
    handleTableChange (pagination, filters, sorter) {
        this.Pagin={
            page:pagination.current,
            pageSize:pagination.pageSize,
        }
        if(sorter.field=="channel_name"){
            sorter.field="channel_id";
        }
        if(sorter.field=="cle_name"){
            sorter.field="cle_id";
        }
        this.sortRank.sorterInfo=sorter;
        this.sortRank.pagination=pagination;
        this.sortRank.filterInfo=filters;
        this.searchInfo();

    }
    handleTableChannelChange(pagination, filters, sorter) {
        this.channelPagin={
            page:pagination.current,
            pageSize:pagination.pageSize,
        }
        this.channelsortRank.sorterInfo=sorter;
        this.channelsortRank.pagination=pagination;
        this.channelsortRank.filterInfo=filters;
        this.searchInfo();

    }
    ShowSizeChange(current, size) {
        this.Pagin.pageSize=size;
    }
    channelShowSizeChange(current, size) {
        this.Pagin.pageSize=size;
    }
    tabsOnchange(key){
        if(key==1){
            this.setState({tabsKey:1});

        }else{
            this.setState({tabsKey:2});
            if(!this.sourcedataSource){
                const condition={
                    start:this.channel_start_time.replace(/-/g,""),
                    end:this.channel_end_time.replace(/-/g,""),
                }
                this.channel_condition=JSON.stringify(condition);
                let params={
                    condition:JSON.stringify(condition),
                    page:1,
                    pageSize:10,
                    sortField: this.channelsortRank.sorterInfo.field || '',
                    sortOrder: this.channelsortRank.sorterInfo.order || '',
                };
                this.props.dispatch(EvaluateChannelList(params))
            }
        }
    }
    //时间变化
    searchTimeChange(site,date, dateString,){
        // console.log(date, dateString,site);
        if(site==1){
            this.start_time=dateString[0];
            this.end_time=dateString[1];
        }else{
            this.channel_start_time=dateString[0];
            this.channel_end_time=dateString[1];
        }
    }
    agentIdChange(e){
        // console.log("e",e);
        this.agentDom=e;
    }
    render() {
        let pageSize=this.Pagin.pageSize,page=this.Pagin.page;
        let channelpageSize=this.channelPagin.pageSize,channelpage=this.channelPagin.page;
        const { getFieldDecorator,} = this.props.form;
        //部门dom
        if(this.props.StatisticsReducer&&this.props.StatisticsReducer.agentAllData&&this.state.tabsKey==1){
            this.agent=this.props.StatisticsReducer.agentAllData;
            this.dataSource=this.props.StatisticsReducer.agentEvaluate.rows;
            this.total=this.props.StatisticsReducer.agentEvaluate.total;
            this.userDom=[];
            this.userDom=this.agent.map(function(item,index){
                return <Option value={item.user_id + "+" + item.user_num + "  " + item.user_name}
                               key={index}>{item.user_num + "  " + item.user_name}</Option>
            })

        }
        if(this.props.StatisticsReducer&&this.props.StatisticsReducer.sourceEvaluate&&this.state.tabsKey==2){
            this.sourcedataSource=this.props.StatisticsReducer.sourceEvaluate.rows;
            this.total=this.props.StatisticsReducer.sourceEvaluate.total;
            for(let i=0;i<this.sourcedataSource.length;i++){
                /*if(this.sourcedataSource[i].source_type==1){
                    this.sourcedataSource[i].source_name_dom=<div><i </div>this.sourcedataSource[i].source_name
                }else{
                    this.sourcedataSource[i].source_name_dom=this.sourcedataSource[i].source_name
                }*/
                if(this.sourcedataSource[i].source_type==0){
                    this.sourcedataSource[i].channelName=<div><i className="fa fa-television" aria-hidden="true" style={{"color":"#108ee9"}}/>&nbsp;&nbsp;&nbsp;{this.sourcedataSource[i].source_name}</div>;
                }else if(this.sourcedataSource[i].source_type==1){
                    this.sourcedataSource[i].channelName=<div><i className="fa fa-weixin" aria-hidden="true" style={{"color":"#26d272"}}/>&nbsp;&nbsp;&nbsp;{this.sourcedataSource[i].source_name}</div>;
                }else if(this.sourcedataSource[i].source_type==2){
                    this.sourcedataSource[i].channelName=<div><i className="fa fa-android" aria-hidden="true" style={{"color":"#15a9ff"}}/>&nbsp;&nbsp;&nbsp;{this.sourcedataSource[i].source_name}</div>;
                }else{
                    this.sourcedataSource[i].channelName=<div><i className="fa fa-apple" aria-hidden="true" style={{"color":"#8392a5"}}/>&nbsp;&nbsp;&nbsp;{this.sourcedataSource[i].source_name}</div>;
                }

            }
        }
        return(
            <Layout>
                <div className="configSearch">
                    <Card className="statistics">
                        <Form>{
                            this.state.tabsKey==1?<Row>
                                <Col span={2} style={{"textAlign":"center"}}>查询时间</Col>
                                <Col span={6}>
                                    {getFieldDecorator('searchTime',{
                                        initialValue: [moment(this.start_time, 'YYYY-MM-DD'), moment(this.end_time, 'YYYY-MM-DD')],
                                        onChange:this.searchTimeChange.bind(this,1)
                                    })(
                                        <RangePicker
                                            format="YYYY-MM-DD"
                                            allowClear={false}
                                        />
                                    )}
                                </Col>
                                <Col span={1}/>
                                <Col span={3}>
                                    {getFieldDecorator('ag_id',{
                                        initialValue:this.agentDom,
                                        onChange:this.agentIdChange.bind(this),
                                    })(
                                        <Select showSearch mode="multiple" placeholder="请选择坐席">
                                            {this.userDom}
                                        </Select>
                                    )}
                                </Col>
                                <Col span={2}>
                                    <Button type="primary" onClick={this.searchInfo.bind(this,"clickSearch")}><i className="fa fa-search" />&nbsp;搜索</Button>
                                </Col>
                            </Row>:<Row>
                                <Col span={2} style={{"textAlign":"center"}}>查询时间</Col>
                                <Col span={6}>
                                    {getFieldDecorator('searchChannelTime',{
                                        initialValue: [moment(this.channel_start_time, 'YYYY-MM-DD'), moment(this.channel_end_time, 'YYYY-MM-DD')],
                                        onChange:this.searchTimeChange.bind(this,2)
                                    })(
                                        <RangePicker
                                            format="YYYY-MM-DD"
                                            allowClear={false}
                                        />
                                    )}
                                </Col>
                                <Col span={1}/>
                                <Button type="primary" onClick={this.searchInfo.bind(this,"clickSearch")}><i className="fa fa-search" ></i>&nbsp;搜索</Button>
                            </Row>
                        }
                        </Form>
                    </Card>
                </div>
                <Card style={{"margin":"0px 10px 10px 10px"}}>
                    <Tabs defaultActiveKey="1" onChange={this.tabsOnchange.bind(this)}>
                        <TabPane tab="坐席满意度" key="1">
                            <div className="evaluaBg"><Table   columns={this.columns}
                                     dataSource={this.dataSource}  bordered size="middle"
                                     onChange={this.handleTableChange.bind(this)}
                                     title={() => '坐席满意度统计'}
                                     scroll={{x:1800}}
                                     pagination={{
                                         current: page,
                                         total: this.total,
                                         pageSize: pageSize,
                                         size: 'small',
                                         showSizeChanger: true,
                                         showQuickJumper: true,
                                         pageSizeOptions: ['10', '20', '30', '40'],
                                         showTotal: function (total, range) {
                                             return `显示 ${range[0]} 到 ${range[1]}，共 ${total} 条记录`;
                                         },
                                         onShowSizeChange:this.ShowSizeChange.bind(this),
                                     }}
                                     footer={() => <div><a href={`/ticket/im/statis/agent/evaluate.json?condition=${this.condition}&sortField=${this.sortRank.sorterInfo.field||''}&sortOrder=${this.sortRank.sorterInfo.order||''}&export=true`}>
                                         <Button type="primary" style={{"marginRight": "20px"}}>
                                             <i className="fa fa-long-arrow-down"></i>&nbsp;导出</Button>
                                     </a></div>}
                            /></div>
                        </TabPane>
                        <TabPane tab="渠道满意度" key="2">
                            <div className="evaluaBg"><Table   columns={this.channelColumns}
                                     dataSource={this.sourcedataSource}  bordered size="middle"
                                     onChange={this.handleTableChannelChange.bind(this)}
                                     title={() => '渠道满意度统计'}
                                     scroll={{x:1500}}
                                     pagination={{
                                         current: channelpage,
                                         total: this.total,
                                         pageSize: channelpageSize,
                                         size: 'small',
                                         showSizeChanger: true,
                                         showQuickJumper: true,
                                         pageSizeOptions: ['10', '20', '30', '40'],
                                         showTotal: function (total, range) {
                                             return `显示 ${range[0]} 到 ${range[1]}，共 ${total} 条记录`;
                                         },
                                         onShowSizeChange:this.channelShowSizeChange.bind(this),
                                     }}
                                     footer={() => <a href={`/ticket/im/statis/source/evaluate.json?condition=${this.channel_condition}&sortField=${this.sortRank.sorterInfo.field||''}&sortOrder=${this.sortRank.sorterInfo.order||''}&export=true`}>
                                         <Button type="primary" style={{"marginRight": "20px"}}>
                                             <i className="fa fa-long-arrow-down"></i>&nbsp;导出</Button>
                                     </a>}
                            /></div>
                        </TabPane>
                    </Tabs>
                </Card>
            </Layout>
        );
    }
}
EvaluateStatistics.contextTypes = {
    router: PropTypes.object,
};
EvaluateStatistics = Form.create()(EvaluateStatistics);
EvaluateStatistics.PropTypes = {
    IssNodeList: {
        loading: PropTypes.bool,
        pagination: PropTypes.bool,
        size: PropTypes.string,
        dataSource: PropTypes.array,
        columns: PropTypes.array,
        recolumns: PropTypes.bool,
        TableReload:PropTypes.bool,
        Pagin:PropTypes.string,
    },
};
const mapStateToProps = EvaluateStatistics => EvaluateStatistics;

module.exports = connect(mapStateToProps)(EvaluateStatistics);