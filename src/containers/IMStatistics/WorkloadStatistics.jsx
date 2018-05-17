/**
 * 工作量统计
 * */
import React, {Component,} from "react";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import moment from 'moment';
import { Row, Col,Layout,Select,Form,Button,Table,Card,DatePicker,} from "antd";
import {WorkLoadList,WorkLoadSearchList,} from "Actions/StatisticsAction";
import WaterMark from 'Static/js/watermark';
const { RangePicker } = DatePicker;
moment.locale("zh-cn");
const { Option,} = Select;
export default class WorkloadStatistics extends Component{
    constructor(props, context) {
        super(props, context);
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
            title: '在线时长',
            dataIndex: 'online_secs',
            key: 'online_secs',
            width:150,
            sorter: true,
        },{
            title: '忙碌时长',
            dataIndex: 'busy_secs',
            key: 'busy_secs',
            width:150,
            sorter: true,
        },{
            title: '独立会话数',
            dataIndex: 'in_session_num',
            key: 'in_session_num',
            width:150,
            sorter: true,
        },{
            title: '无效会话数',
            dataIndex: 'invalid_session_num',
            key: 'invalid_session_num',
            width:150,
            sorter: true,
        },{
            title: '参与转接会话数',
            dataIndex: 'receive_session_num',
            key: 'receive_session_num',
            width:150,
            sorter: true,
        },{
            title: '转出次数',
            dataIndex: 'trans_out_session_num',
            key: 'trans_out_session_num',
            width:150,
            sorter: true,
        },{
            title: '转入次数',
            dataIndex: 'trans_in_session_num',
            key: 'trans_in_session_num',
            width:150,
            sorter: true,
        },{
            title: '回复消息数',
            dataIndex: 'reply_news_num',
            key: 'reply_news_num',
            width:150,
            sorter: true,
        }, ];
        //this.tableType="work";
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
        this.start_time="";
        this.end_time="";
        //this.deptInfo=[];
        this.deptId=0;
        this.dataSource=[];
        this.state = {
        };
    }
    //服务端取数据
    componentWillMount() {
        this.start_time=moment().format("YYYY-MM-DD") ;
        this.end_time=moment().format("YYYY-MM-DD");
        this.waterMarkText=localStorage.getItem("watermark");
        let condition={
            start:this.start_time.replace(/-/g,""),
            end:this.end_time.replace(/-/g,""),
            agentId:"",
        };
        this.condition=JSON.stringify(condition);
        let requestParams={
            listParams:{
                condition:JSON.stringify(condition),
                page:this.Pagin.page,
                pageSize:this.Pagin.pageSize,
                sortField:"",
                sortOrder:"",
            },
            agentParams:{params:{dept_id:0}}
        }
        this.props.dispatch(WorkLoadList(requestParams));
    }
    searchInfo(click){
        let dataformat = "YYYY-MM-DD";
        let condition={};
        this.props.form.validateFields((err, values) => {
            if (values.searchTime != undefined && values.searchTime.length > 0) {
                this.end_time = values.searchTime[1].format(dataformat);
                this.start_time = values.searchTime[0].format(dataformat);
                let ag_id=[];
                for(let i=0;i<values.user.length;i++){
                    ag_id.push(values.user[i].substring(0,values.user[i].indexOf("+")));
                }
                condition={
                    start:this.start_time.replace(/-/g,""),
                    end:this.end_time.replace(/-/g,""),
                    agentId:ag_id.join(","),
                };
                this.condition=JSON.stringify(condition);
            }
        });
        if(click=="clickSearch"){
            this.Pagin.page=1;
        }
        let _params = {
            condition:JSON.stringify(condition),
            page:this.Pagin.page,
            pageSize:this.Pagin.pageSize,
            sortField: this.sortRank.sorterInfo.field || '',
            sortOrder: this.sortRank.sorterInfo.order || '',
        };
        this.props.dispatch(WorkLoadSearchList(_params));
    }
    /*分页、排序、筛选变化时触发*/
    handleTableChange (pagination, filters, sorter) {
        this.Pagin={
            page:pagination.current,
            pageSize:pagination.pageSize,
        }
        this.sortRank.sorterInfo=sorter;
        //this.sortRank.pagination=pagination;
        this.sortRank.filterInfo=filters;
        this.searchInfo();

    }
    ShowSizeChange(current, size) {
        this.Pagin.pageSize=size;
    }
    exportExcel(){

    }
    componentDidUpdate(){
        if(this.waterMarkText){
            WaterMark.addWaterMark(this.waterMarkText,"#fff","20px 黑体","scroll");
        }
    }
    componentDidMount(){
        const tableContent=document.getElementsByClassName("ant-table-content");
        if(tableContent.length>0&&tableContent[0].clientWidth<1500){
            this.columns[0].fixed="left";
            this.columns[1].fixed="left";
        }
    }
    render() {
        let total=0,pageSize=this.Pagin.pageSize,page=this.Pagin.page;
        const { getFieldDecorator,} = this.props.form;
        //部门dom 表格数据
        if(this.props.StatisticsReducer&&this.props.StatisticsReducer.agentAllData){
            //this.deptInfo=this.props.StatisticsReducer.deptInfo;
            this.userInfo=this.props.StatisticsReducer.agentAllData;
            this.dataSource=this.props.StatisticsReducer.workListData.rows;
            total=this.props.StatisticsReducer.workListData.total;
            this.userDom=this.userInfo.map(function(item,index){
                     return <Option value={item.user_id+"+"+item.user_num+"  "+item.user_name} key={index}>{item.user_num+"  "+item.user_name}</Option>
            })

        }

        return(
            <Layout>
                <div className="configSearch">
                    <Card className="statistics">
                        <Form>
                            <Row>
                                <Col span={2} style={{"textAlign":"center"}}>查询时间</Col>
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
                                <Col span={1} />
                                <Col span={3}>
                                    {getFieldDecorator('user',{
                                        initialValue:[]
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
                    {total==0?<div className="evaluaBg"> <Table   columns={this.columns}
                                    dataSource={this.dataSource}  bordered size="middle"
                                    onChange={this.handleTableChange.bind(this)}
                                    title={() => '工作量统计'}
                                    pagination={false}
                                    scroll={{ x: 1500 }}
                                    footer={() => <a href={`/ticket/im/statics/work.json?condition=${this.condition}&sortField=${this.sortRank.sorterInfo.field||''}&sortOrder=${this.sortRank.sorterInfo.order||''}&export=true`}>
                                        <Button type="primary" style={{"marginRight": "20px"}}>
                                            <i className="fa fa-long-arrow-down"></i>&nbsp;导出</Button>
                                    </a>}
                    /></div>:<div className="evaluaBg"> <Table   columns={this.columns}
                                dataSource={this.dataSource}  bordered size="middle"
                                onChange={this.handleTableChange.bind(this)}
                                title={() => '工作量统计'}
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
                                scroll={{ x: 1500 }}
                                footer={() => <a href={`/ticket/im/statics/work.json?code=12345&condition=${this.condition}&sortField=${this.sortRank.sorterInfo.field||''}&sortOrder=${this.sortRank.sorterInfo.order||''}&export=true`}>
                                    <Button type="primary" style={{"marginRight": "20px"}}>
                                        <i className="fa fa-long-arrow-down"></i>&nbsp;导出</Button>
                                </a>}
                    /></div>}

                </Card>

            </Layout>
        );
    }
}
WorkloadStatistics.contextTypes = {
    router: PropTypes.object,
};
WorkloadStatistics = Form.create()(WorkloadStatistics);
WorkloadStatistics.PropTypes = {
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

WorkloadStatistics.defaultProps = {
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
const mapStateToProps = WorkloadStatistics => WorkloadStatistics;

module.exports = connect(mapStateToProps)(WorkloadStatistics);