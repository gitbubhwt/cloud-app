/**
 * 工作量统计
 * */
import React, {Component,} from "react";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import moment from 'moment';
import { Row, Col,Layout,Select,Input,Form,Button,Radio,Icon,Table,Card,DatePicker,Progress,TreeSelect, } from "antd";
import {PerformStatisticsList,PerformStatisticsSearch,} from "Actions/StatisticsAction";
import WaterMark from 'Static/js/watermark';
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
export default class PerformStatistics extends Component{
    constructor(props, context) {
        super(props, context);
        this.Time=0;
        this.start_time="";
        this.end_time="";
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
        }, {
            title: '访客消息数',
            dataIndex: 'receive_msg_times',
            key: 'receive_msg_times',
            width:150,
            sorter: true,
        },{
            title: '坐席消息数',
            dataIndex: 'reply_news_num',
            key: 'reply_news_num',
            width:150,
            sorter: true,
        },{
            title: '问答比',
            dataIndex: 'ar_ratio',
            key: 'ar_ratio',
            width:150,
        }, {
            title: '邀评发送次数',
            dataIndex: 'require_eval_times',
            key: 'require_eval_times',
            width:150,
            sorter: true,
        },{
            title: '总会话数',
            dataIndex: 'total_session_num',
            key: 'total_session_num',
            width:150,
            sorter: true,
        },{
            title: '无效会话数',
            dataIndex: 'invalid_session_num',
            key: 'invalid_session_num',
            width:150,
            sorter: true,
        }, {
            title: '无效会话比',
            dataIndex: 'invalid_ratio',
            key: 'invalid_ratio',
            width:150,
        },{
            title: '平均首次响应时长',
            dataIndex: 'avg_response_secs',
            key: 'avg_response_secs',
            width:150,
        },{
            title: '平均对话时长',
            dataIndex: 'avg_session_secs',
            key: 'avg_session_secs',
            width:150,
        }, {
            title: '服务客户数',
            dataIndex: 'serv_user_num',
            key: 'serv_user_num',
            width:150,
            sorter: true,
        },{
            title: '一次会话客户数',
            dataIndex: 'one_serv_client_num',
            key: 'one_serv_client_num',
            width:150,
            sorter: true,
        },{
            title: '满意度评价数',
            dataIndex: 'receive_eval_times',
            key: 'receive_eval_times',
            width:150,
            sorter: true,
        },{
            title: '参评率',
            dataIndex: 'eval_ratio',
            key: 'eval_ratio',
            width:150,
        },];
        this.tableType="achievements";
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
    }
    //服务端取数据
    componentWillMount() {
        this.waterMarkText=localStorage.getItem("watermark");
        this.start_time=moment().format("YYYY-MM-DD") ;
        this.end_time=moment().format("YYYY-MM-DD");
        let condition={
            start:this.start_time.replace(/-/g,""),
            end:this.end_time.replace(/-/g,""),
            agentId:"",
        };
        this.condition=JSON.stringify(condition);
        let listParams={
            condition:JSON.stringify(condition),
            page:1,
            pageSize:10,
            sortField: this.sortRank.sorterInfo.field || '',
            sortOrder: this.sortRank.sorterInfo.order || '',
        };
        let agentParams= {
            dept_id:0
        }
        let params={
            listParams,
            agentParams,
        }
        this.props.dispatch(PerformStatisticsList(params))
    }
    componentDidMount(){
        if(this.waterMarkText){
            WaterMark.addWaterMark(this.waterMarkText,"#fff","20px 黑体","scroll");
        }
        const tableContent=document.getElementsByClassName("ant-table-content");
        if(tableContent.length>0&&tableContent[0].clientWidth<2250){
            this.columns[0].fixed="left";
            this.columns[1].fixed="left";
        }
    }
    searchInfo(click){
        let _params={};
        let dataformat = "YYYY-MM-DD";
        this.props.form.validateFields((err, values) => {
            this.start_time=values.searchTime[0].format(dataformat);
            this.end_time=values.searchTime[1].format(dataformat);
            let ag_id=[];
            if(values.ag_id==undefined){
                values.ag_id=[];
            }
            for(let i=0;i<values.ag_id.length;i++){
                ag_id.push(values.ag_id[i].substring(0,values.ag_id[i].indexOf("+")));
            }
            let condition={
                start:this.start_time.replace(/-/g,""),
                end:this.end_time.replace(/-/g,""),
                agentId:ag_id.join(","),
            };
            this.condition=JSON.stringify(condition);
            // this.condition=encodeURI(this.condition);
            // this.condition=encodeURI(this.condition);
            if(click=="clickSearch"){
                this.Pagin.page=1;
            }
            _params={
                condition:JSON.stringify(condition),
                pageSize:this.Pagin.pageSize,
                page:this.Pagin.page,
                sortField: this.sortRank.sorterInfo.field || '',
                sortOrder: this.sortRank.sorterInfo.order || '',
            }
        });
        this.props.dispatch(PerformStatisticsSearch(_params));
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
    componentDidUpdate(){
        if(this.waterMarkText){
            WaterMark.addWaterMark(this.waterMarkText,"#fff","20px 黑体","scroll");
        }
    }
    render() {
        let total=0,pageSize=this.Pagin.pageSize,page=this.Pagin.page;
        const { getFieldDecorator,} = this.props.form;
        //部门dom
        if(this.props.StatisticsReducer&&this.props.StatisticsReducer.agentAllData){
            this.agent=this.props.StatisticsReducer.agentAllData;
            this.dataSource=this.props.StatisticsReducer.performData.rows;
            total=this.props.StatisticsReducer.performData.total;
            this.userDom=[];
            this.userDom=this.agent.map(function(item,index){
                return <Option value={item.user_id + "+" + item.user_num + "  " + item.user_name}
                               key={index}>{item.user_num + "  " + item.user_name}</Option>
            })
        }
        return(
            <Layout>
                <div className="configSearch">
                    <Card className="statistics">
                        <Form>
                            <Row>
                                <Col span={6}>
                                    {getFieldDecorator('searchTime',{
                                        initialValue: [moment(this.start_time, 'YYYY-MM-DD'), moment(this.end_time, 'YYYY-MM-DD')],
                                    })(
                                        <RangePicker
                                            format="YYYY-MM-DD"
                                            allowClear={false}
                                        />
                                    )}
                                </Col>
                                <Col span={1}/>
                                <Col span={2} style={{"textAlign":"center"}}>坐席</Col>
                                <Col span={3}>
                                    {getFieldDecorator('ag_id',{
                                    })(
                                        <Select showSearch mode="multiple" placeholder="请选择坐席">
                                            {this.userDom}
                                        </Select>
                                    )}
                                </Col>
                                <Col span={2}>
                                    <Button type="primary" onClick={this.searchInfo.bind(this,"clickSearch")}><i className="fa fa-search" />&nbsp;搜索</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </div>
                <Card style={{"margin":"0px 10px 10px 10px"}}>
                    {total==0?<div className="evaluaBg"><Table   columns={this.columns}
                        dataSource={this.dataSource}  bordered size="middle"
                        onChange={this.handleTableChange.bind(this)}
                        title={() => '绩效统计'}
                        scroll={{x:2250}}
                        pagination={false}
                    
                        footer={() => <a href={`/ticket/im/statis/achievements.json?condition=${this.condition}&sortField=${this.sortRank.sorterInfo.field||''}&sortOrder=${this.sortRank.sorterInfo.order||''}&export=true`}>
                        <Button type="primary" style={{"marginRight": "20px"}}>
                            <i className="fa fa-long-arrow-down"></i>&nbsp;导出</Button>
                    </a>}
                        /></div>:<div className="evaluaBg"><Table   columns={this.columns}
                        dataSource={this.dataSource}  bordered size="middle"
                        onChange={this.handleTableChange.bind(this)}
                        title={() => '绩效统计'}
                        scroll={{x:2250}}
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
                        footer={() => <a href={`/ticket/im/statis/achievements.json?condition=${this.condition}&sortField=${this.sortRank.sorterInfo.field||''}&sortOrder=${this.sortRank.sorterInfo.order||''}&export=true`}>
                        <Button type="primary" style={{"marginRight": "20px"}}>
                            <i className="fa fa-long-arrow-down"></i>&nbsp;导出</Button>
                    </a>}
                    /></div>}

                </Card>
            </Layout>
        );
    }
}
PerformStatistics.contextTypes = {
    router: PropTypes.object,
};
PerformStatistics = Form.create()(PerformStatistics);
PerformStatistics.PropTypes = {
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

PerformStatistics.defaultProps = {
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
const mapStateToProps = PerformStatistics => PerformStatistics;

module.exports = connect(mapStateToProps)(PerformStatistics);