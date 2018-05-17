/**
 * 工作量统计
 * */
import React, {Component,} from "react";
import PropTypes from 'prop-types';
import { connect, } from "react-redux";
import moment from 'moment';
import { Row, Col,Layout,Select,Input,Form,Button,Radio,Icon,Table,Card,DatePicker,Progress,TreeSelect, } from "antd";
import {HistoryRecordList,} from "Actions/StatisticsAction";
import { Link } from 'react-router';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
moment.locale("zh-cn");
const { Option, OptGroup } = Select;
export default class HistoryRecord extends Component{
    constructor(props, context) {
        super(props, context);
        this.Time=0;
        this.start_time="";
        this.end_time="";
        this.columns = [{
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            width:'20%',
            render:(text, record,index) => (
                <span>
                    <Link onClick={this.viewRecord.bind(this,record,index)}><i className="fa fa-eye"></i></Link>
                </span>)
        },{
            title: '问题分类',
            dataIndex: 'ticket_types',
            key: 'ticket_types',
            width:'25%',
            sorter: true,
        },{
            title: '工单状态',
            dataIndex: 'ticket_status',
            key: 'ticket_status',
            width:'25%',
            sorter: true,
        },{
            title: '工单发起时间',
            dataIndex: 'create_time',
            key: 'create_time',
            width:'30%',
            sorter: true,
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
        this.loading=true;
        this.deptInfo=[];
        this.userDom=[];
        this.dataSource=[];
        this.total=0;
        this.state = {

        };
    }
    //服务端取数据
    componentWillMount() {
        // console.log(this.props.router.params);
        this.third_id=this.props.router.params.third_id;
        const requestParams={
            params:{
                session_uuid:this.third_id,
                page:1,
                pageSize:10,
            }
        }
        this.props.dispatch(HistoryRecordList(requestParams));
    }
    searchInfo(){
        let _params = {
            session_uuid:this.third_id,
            pageSize: this.Pagin.pageSize,
            page: this.Pagin.page,
            sortField: this.sortRank.sorterInfo.field || '',
            sortOrder: this.sortRank.sorterInfo.order || '',
        };
        const requestParams={
            params:_params
        }
        // console.log("_params",_params);
        this.props.dispatch(HistoryRecordList(requestParams));
    }
    viewRecord(record,index){
        // console.log("record",record);
        // console.log("index",index);
        // console.log("this.dataSource",this.dataSource);
        window.parent.parent.addTab('工单查看'+record.ticket_no,"/ticket/m/ektticket#/Ticketmanagement/TicketListToview/" + record.flow_id + "/" + 5 + "/" +record.ticket_no,'menu_icon');
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
    render() {
        let total=0,pageSize=this.Pagin.pageSize,page=this.Pagin.page;
        //部门dom
        if(this.props.StatisticsReducer&&this.props.StatisticsReducer.historyTicket){
            this.dataSource=this.props.StatisticsReducer.historyTicket.rows;
            this.total=this.props.StatisticsReducer.historyTicket.total;
        }
        return(
            <Layout>
                <Card style={{"margin":"0px 10px 10px 10px"}}>
                    <Table   columns={this.columns}
                             dataSource={this.dataSource}  bordered size="middle"
                             onChange={this.handleTableChange.bind(this)}
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
                    />
                </Card>
            </Layout>
        );
    }
}
HistoryRecord.contextTypes = {
    router: PropTypes.object,
};
HistoryRecord = Form.create()(HistoryRecord);
HistoryRecord.PropTypes = {
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

HistoryRecord.defaultProps = {
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
const mapStateToProps = HistoryRecord => HistoryRecord;

module.exports = connect(mapStateToProps)(HistoryRecord);