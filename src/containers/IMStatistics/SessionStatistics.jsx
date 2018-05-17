/**
 * 工作量统计
 * */
import React, {Component,} from "react";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import moment from 'moment';
import { Row, Col,Layout,Select,Input,Form,Button,Radio,Icon,Table,Card,DatePicker,Progress,TreeSelect, } from "antd";
import {SessionStatisticsList,SessionStatisticsSearch,} from "Actions/StatisticsAction";
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
moment.locale("zh-cn");
const { Option, OptGroup } = Select;
const TreeNode = TreeSelect.TreeNode;
let loop = (dataTreeSource) => dataTreeSource.map((item) => {
    if (item.children && item.children.length) {
        return <TreeNode key={item.dept_name} title={item.dept_name}
                         value={JSON.stringify(item)}>{loop(item.children)}</TreeNode>;
    }
    return <TreeNode key={item.dept_name} title={item.dept_name} value={JSON.stringify(item)}/>
})
export default class SessionStatistics extends Component{
    constructor(props, context) {
        super(props, context);
        this.Time=0;
        this.start_time="";
        this.end_time="";
        this.columns = [{
            title: '序号',
            dataIndex: 'number',
            key: 'number',
            width:150,
            fixed: 'left',
        }, {
            title: '时间',
            dataIndex: 'date',
            key: 'date',
            width:150,
            sorter: true,
            fixed: 'left',
        },{
            title: '员工组',
            dataIndex: 'group_name',
            key: 'group_name',
            width:150,
            sorter: true,
            fixed: 'left',
        }, {
            title: '总会话数',
            dataIndex: 'total_session_num',
            key: 'total_session_num',
            width:150,
            sorter: true,
        },{
            title: '接待会话数',
            dataIndex: 'receive_session_num',
            key: 'receive_session_num',
            width:150,
            sorter: true,
        },{
            title: '完成会话数',
            dataIndex: 'end_session_num',
            key: 'end_session_num',
            width:150,
            sorter: true,
        }, {
            title: '总消息数',
            dataIndex: 'total_session_news_num',
            key: 'total_session_news_num',
            width:150,
            sorter: true,
        },{
            title: '客户消息数',
            dataIndex: 'client_news_num',
            key: 'client_news_num',
            width:150,
            sorter: true,
        },{
            title: '坐席消息数',
            dataIndex: 'agent_news_num',
            key: 'agent_news_num',
            width:150,
            sorter: true,
        }, {
            title: '平均首次响应时长',
            dataIndex: 'avg_response_secs',
            key: 'avg_response_secs',
            width:150,
        },{
            title: '客户数',
            dataIndex: 'session_client_num',
            key: 'session_client_num',
            width:150,
            sorter: true,
        },{
            title: '一次会话客户数',
            dataIndex: 'one_session_client_num',
            key: 'one_session_client_num',
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
        },];
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
        this.tableType="hour";
    }
    //服务端取数据
    componentWillMount() {
        this.start_time=moment().format("YYYY-MM-DD") ;
        this.end_time=moment().format("YYYY-MM-DD");
        let condition={
            start_time:this.start_time,
            type:"hour",
            group_id:"0"
        };
        this.condition=JSON.stringify(condition);
        let params={
            condition:JSON.stringify(condition),
            pageSize:10,
            page:1
        }
        this.props.dispatch(SessionStatisticsList(params));
    }
    viewRecord(){

    }
    searchInfo(start,end){
        let _params={}
        // console.log(this.start_time,this.end_time)
        this.props.form.validateFields((err, values) => {
                let condition={
                    type:values.action,
                    group_id:values.group_id.substring(0,values.group_id.indexOf("+"))
                };
                if(this.tableType=="hour"){
                    condition.start_time= this.start_time;
                }else{
                    condition.start_time= this.start_time;
                    condition.end_time=this.end_time;
                }
                this.condition=JSON.stringify(condition);
                _params={
                    condition:JSON.stringify(condition),
                    pageSize:10,
                    page:1
                }
        });

        // console.log("_params",_params);
        //this.downflowId=this.flowId;
        //this.downnodeId=this.nodeId;
        this.props.dispatch(SessionStatisticsSearch(_params));
    }
    /*分页、排序、筛选变化时触发*/
    handleTableChange (pagination, filters, sorter) {
        this.Pagin={
            page:pagination.current,
            pageSize:pagination.pageSize,
        }
        this.sortRank.sorterInfo=sorter;
        this.sortRank.pagination=pagination;
        this.sortRank.filterInfo=filters;
        this.searchInfo();

    }
    ShowSizeChange(current, size) {
        this.Pagin.pageSize=size;
    }
    Searchclick (e){
        e.preventDefault();
        this.searchInfo();
    }
    tableTypeChange(e){
        this.tableType=e;
        if(e=="month"){
            this.start_time=moment().format("YYYY-MM") ;
            this.end_time=moment().format("YYYY-MM");
        }else{
            this.start_time=moment().format("YYYY-MM-DD") ;
            this.end_time=moment().format("YYYY-MM-DD");
        }

    }
    searchTimeChange(dates, dateStrings){
        // console.log(dates, dateStrings);
        if(this.tableType=="hour"){
            this.start_time=dateStrings
        }else{
            this.start_time=dateStrings[0];
            this.end_time=dateStrings[1];
        }
    }
    render() {
        let total=0,pageSize=this.Pagin.pageSize,page=this.Pagin.page;
        const { getFieldDecorator,} = this.props.form;
        //部门dom
        if(this.props.StatisticsReducer&&this.props.StatisticsReducer.userGroup){
            this.userGroup=this.props.StatisticsReducer.userGroup;
            this.columns=this.props.StatisticsReducer.sessionTitle;
            // console.log("this.columns",this.columns)
            this.userDom=[];
            this.userDom=this.userGroup.map(function(item,index){
                return <Option value={item.id+"+"+item.group_name} key={index}>{item.group_name}</Option>
            })
        }
        return(
            <Layout>
                <div className="configSearch">
                    <Card className="statistics">
                        <Form>
                            <Row>
                                <Col span={3}>
                                    {getFieldDecorator('action',{
                                        initialValue:"hour",
                                        onChange:this.tableTypeChange.bind(this)
                                    })(
                                        <Select>
                                            <Option value="hour">时报</Option>
                                            <Option value="day">日报</Option>
                                            <Option value="month">月报</Option>
                                        </Select>
                                    )}
                                </Col>
                                <Col span={2} style={{"textAlign":"center"}}>查询时间</Col>
                                {this.tableType=="hour"?<Col span={3}>
                                        {getFieldDecorator('searchTime1',{
                                            initialValue: moment(this.start_time, 'YYYY-MM-DD'),
                                            onChange:this.searchTimeChange.bind(this)
                                        })(
                                            <DatePicker
                                                format="YYYY-MM-DD"
                                            />
                                        )}
                                    </Col>:this.tableType=="day"?<Col span={6}>
                                        {getFieldDecorator('searchTime2',{

                                            initialValue: [moment(this.start_time, 'YYYY-MM-DD'), moment(this.end_time, 'YYYY-MM-DD')],
                                            onChange:this.searchTimeChange.bind(this),
                                        })(
                                            <RangePicker
                                                format="YYYY-MM-DD"
                                                allowClear={false}
                                            />
                                        )}
                                    </Col>:<Col span={6}>
                                            {getFieldDecorator('searchTime3',{

                                                initialValue: [moment(this.start_time, 'YYYY-MM'), moment(this.end_time, 'YYYY-MM')],
                                                onChange:this.searchTimeChange.bind(this),
                                            })(
                                                <RangePicker
                                                    format="YYYY-MM"
                                                    allowClear={false}
                                                />
                                            )}
                                        </Col>}
                                <Col span={1}></Col>
                                <Col span={2} style={{"textAlign":"center"}}>坐席组</Col>
                                <Col span={3}>
                                    {getFieldDecorator('group_id',{
                                        initialValue:"0+全部"
                                    })(
                                        <Select showSearch>
                                            {this.userDom}
                                        </Select>
                                    )}
                                </Col>
                                <Col span={2}>
                                    <Button type="primary" onClick={this.searchInfo.bind(this)}><i className="fa fa-search" ></i>&nbsp;搜索</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </div>
                <Card style={{"margin":"0px 10px 10px 10px"}}>
                    <Table   columns={this.columns}
                             dataSource={this.dataSource}  bordered size="middle"
                             onChange={this.handleTableChange.bind(this)}
                             title={() => '会话统计列表'}
                             pagination={{
                                 current: page,
                                 total: total,
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
                             footer={() => <a href={`/ticket/im/get/dialog/statis.json?condition=${this.condition}&sortField=${this.sortRank.sorterInfo.field||''}&sortOrder=${this.sortRank.sorterInfo.order||''}&export=true`}>
                                 <Button type="primary" style={{"marginRight": "20px"}}>
                                     <i className="fa fa-long-arrow-down"></i>&nbsp;导出</Button>
                             </a>}
                    />
                </Card>

            </Layout>
        );
    }
}
SessionStatistics.contextTypes = {
    router: PropTypes.object,
};
SessionStatistics = Form.create()(SessionStatistics);
SessionStatistics.PropTypes = {
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

SessionStatistics.defaultProps = {
    IssNodeList: {
        loading: false,
        pagination: false,
        size: "middle",
        dataSource: [],
        columns: [],
        recolumns: true,
        TableReload:true,
        Pagin:{},
    },
};
const mapStateToProps = SessionStatistics => SessionStatistics;

module.exports = connect(mapStateToProps)(SessionStatistics);