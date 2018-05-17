/**
 * 工作量统计
 * */
import React, {Component,} from "react";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import moment from 'moment';
import { Row, Col,Layout,Select,Form,Button,Table,Card,DatePicker,} from "antd";
import {AgentStateList,AgentStateSearch,} from "Actions/StatisticsAction";
import WaterMark from 'Static/js/watermark';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
moment.locale("zh-cn");
const { Option, } = Select;
export default class AgentStateRecord extends Component{
    constructor(props, context) {
        super(props, context);
        this.Time=0;
        this.start_time="";
        this.end_time="";
        this.sourceType=1;
        this.columns = [/*{
            title: '序号',
            dataIndex: 'number',
            key: 'number',
            width:"5%",
        },*/{
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
            title: '变更前状态',
            dataIndex: 'pre_status',
            key: 'pre_status',
            width:150,
            sorter: true,
        }, {
            title: '变更后状态',
            dataIndex: 'status',
            key: 'status',
            width:150,
            sorter: true,
        },{
            title: '变更前状态时长',
            dataIndex: 'pre_status_secs',
            key: 'pre_status_secs',
            width:150,
            sorter: true,
        },{
            title: '操作类型',
            dataIndex: 'op_type',
            key: 'op_type',
            width:150,
            sorter: true,
        },{
            title: '操作时间',
            dataIndex: 'time',
            key: 'time',
            width:150,
            sorter: true,
        }];
        this.tableType="agent_status_record";
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
        this.state={
            selectedRowKeys:[],
            visible:false,
        }
    }
    //服务端取数据
    componentWillMount() {
        this.waterMarkText=localStorage.getItem("watermark");
        this.start_time=moment().format("YYYY-MM-DD") ;
        this.end_time=moment().format("YYYY-MM-DD");
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
            sortField: this.sortRank.sorterInfo.field || '',
            sortOrder: this.sortRank.sorterInfo.order || '',
        };
        const agentParams={dept_id:0};
        let params={
            listParams,
            agentParams
        }
        this.props.dispatch(AgentStateList(params));
    }
    componentDidMount(){

    }
    searchInfo(click){
        let dataformat = "YYYY-MM-DD";
        let params={};
        this.props.form.validateFields((err, values) => {
            if (values.searchTime != undefined && values.searchTime.length > 0) {
                this.end_time = values.searchTime[1].format(dataformat);
                this.start_time = values.searchTime[0].format(dataformat);
                let ag_id=[];
                if(values.ag_id==undefined){
                    values.ag_id=[];
                }
                for(let i=0;i<values.ag_id.length;i++){
                    ag_id.push(values.ag_id[i].substring(0,values.ag_id[i].indexOf("+")));
                }
                const condition={
                    start:this.start_time.replace(/-/g,""),
                    end:this.end_time.replace(/-/g,""),
                    agentId:ag_id.join(","),
                };
                this.condition=JSON.stringify(condition);
                if(click=="clickSearch"){
                    this.Pagin.page=1;
                }
                params={
                    condition:JSON.stringify(condition),
                    pageSize: this.Pagin.pageSize,
                    page:this.Pagin.page,
                    sortField: this.sortRank.sorterInfo.field || '',
                    sortOrder: this.sortRank.sorterInfo.order || '',
                }
            }
        });
        this.props.dispatch(AgentStateSearch(params))
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
    ShowSizeChange(current, size) {
        this.Pagin.pageSize=size;
    }
    componentDidUpdate(){
        if(this.waterMarkText){
            WaterMark.addWaterMark(this.waterMarkText,"#fff","20px 黑体","scroll");
        }
    }
    render() {
        let pageSize=this.Pagin.pageSize,page=this.Pagin.page;
        const { getFieldDecorator,} = this.props.form;
        //部门dom
        if(this.props.StatisticsReducer&&this.props.StatisticsReducer.agentAllData){
            this.agent=this.props.StatisticsReducer.agentAllData;
            // console.log("this.agent",this.agent);
            this.dataSource=this.props.StatisticsReducer.agentStateData.rows;
            this.total=this.props.StatisticsReducer.agentStateData.total;
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
                                <Col span={1}/>
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
                    <div className="evaluaBg"> <Table   columns={this.columns}
                             dataSource={this.dataSource}  bordered size="middle"
                             onChange={this.handleTableChange.bind(this)}
                             title={() => '坐席状态记录'}
                             scroll={{x:750}}
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
                             footer={() => <div><a href={`/ticket/im/statis/agent/record.json?condition=${this.condition}&sortField=${this.sortRank.sorterInfo.field||''}&sortOrder=${this.sortRank.sorterInfo.order||''}&export=true`}>
                                 <Button type="primary" style={{"marginRight": "20px"}}>
                                     <i className="fa fa-long-arrow-down"></i>&nbsp;导出</Button>
                             </a></div>}
                    /></div>
                </Card>
            </Layout>
        );
    }
}
AgentStateRecord.contextTypes = {
    router: PropTypes.object,
};
AgentStateRecord = Form.create()(AgentStateRecord);
AgentStateRecord.PropTypes = {
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
const mapStateToProps = AgentStateRecord => AgentStateRecord;

module.exports = connect(mapStateToProps)(AgentStateRecord);