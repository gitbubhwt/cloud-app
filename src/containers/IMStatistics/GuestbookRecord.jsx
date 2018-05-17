/**
 * 工作量统计
 * */
import React, {Component,} from "react";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import moment from 'moment';
import { Row, Col,Layout,Select,Input,Form,Button,Radio,Icon,Table,Card,DatePicker,Progress,TreeSelect,Modal,notification, } from "antd";
import {GuestbookRecordList,GuestbookRecordSearch,oneRecordTable,RecordStart} from "Actions/StatisticsAction";
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
export default class GuestbookRecord extends Component{
    constructor(props, context) {
        super(props, context);
        this.Time=0;
        this.start_time="";
        this.end_time="";
        this.sourceType=1;
        this.messInfo=true;
        this.columns = [{
            title: '序号',
            dataIndex: 'number',
            key: 'number',
            width:"5%",
        },{
            title: '微信昵称',
            dataIndex: 'nick_name',
            key: 'nick_name',
            width:"15%",
            sorter: true,
        },{
            title: '电话',
            dataIndex: 'phone',
            key: 'phone',
            width:"10%",
            sorter: true,
        },{
            title: '留言内容',
            dataIndex: 'content_dom',
            key: 'content_dom',
            width:"25%",
            sorter: true,
        }, {
            title: '处理状态',
            dataIndex: 'status_dom',
            key: 'status_dom',
            width:"10%",
            sorter: true,
        },{
            title: '来源渠道',
            dataIndex: 'source_type_dom',
            key: 'source_type_dom',
            width:"20%",
            sorter: true,
        },{
            title: '留言时间',
            dataIndex: 'message_time',
            key: 'message_time',
            width:"15%",
            sorter: true,
        },];
        this.oneColumns=[
            {
                title: '留言时间',
                dataIndex: 'message_time',
                key: 'message_time',
                width:"30%",
            },{
                title: '留言内容',
                dataIndex: 'content',
                key: 'content',
                width:"50%",
            },{
                title: '处理状态',
                dataIndex: 'statusDom',
                key: 'statusDom',
                width:"20%",
            },
        ]
        //分页
        this.onShowSizeChange=(value)=> {
            this.Pagin.page=value;
            this.searchInfo();
        };
        this.Pagin={
            page:1,
            pageSize:10,
        };
        this.onePagin={
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
            start:this.start_time,
            end:this.end_time,
        }
        this.condition=JSON.stringify(condition);
        let params={
            condition:JSON.stringify(condition),
            pageSize:10,
            page:1
        }
        this.props.dispatch(GuestbookRecordList(params));
    }
    componentDidMount(){
        if(this.waterMarkText){
            WaterMark.addWaterMark(this.waterMarkText,"#fff");
        }
        document.getElementsByClassName("ant-checkbox-wrapper")[0].style.display="none";
    }
    viewRecord(){

    }
    searchInfo(click){
        let dataformat = "YYYY-MM-DD";
        let params={};
        this.props.form.validateFields((err, values) => {
            if (values.searchTime != undefined && values.searchTime.length > 0) {
                this.end_time = values.searchTime[1].format(dataformat);
                this.start_time = values.searchTime[0].format(dataformat);
                const condition={
                    start:this.start_time,
                    end:this.end_time,
                    source_type: Number(values.source_type),
                    status:Number(values.status),
                };
                if(values.source_type===""){
                    delete condition.source_type
                }
                if(values.status===""){
                    delete condition.status
                }
                this.condition=JSON.stringify(condition);
                if(click=="clickSearch"){
                    this.Pagin.page=1;
                }
                params={
                    condition:JSON.stringify(condition),
                    pageSize: this.Pagin.pageSize,
                    page: this.Pagin.page,
                    sortField: this.sortRank.sorterInfo.field || '',
                    sortOrder: this.sortRank.sorterInfo.order || '',
                }
            }
        });
        this.props.dispatch(GuestbookRecordSearch(params))
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
    Searchclick (e){
        e.preventDefault();
        this.searchInfo();
    }
    //来源渠道变化
    /*sourceTypeChange(e){
        console.log("e",e);
        if(e==0){
            this.sourceType=1;
            this.channelDOM=this.webAllDom;
        }else{
            this.sourceType=2;
            this.channelDOM=this.wechatDom;
        }
        //this.props.dispatch(TypeNode({deptId:deptId}));
        this.props.form.setFieldsValue({
            channel_id:"0+全部"
        });
    }*/
    onSelectChange(selectedRowKeys){
        if(this.state.selectedRowKeys<selectedRowKeys||this.state.selectedRowKeys==0){
            const key=selectedRowKeys[selectedRowKeys.length-1];
            this.setState({ selectedRowKeys:[key] });
        }
        if(selectedRowKeys<this.state.selectedRowKeys){
            this.setState({ selectedRowKeys:[] });
        }
    }
    oneGustRecord(record){
        if(!record){
            record=this.record;
        }else{
            this.record=record;
        }
        const params={
            params:{
                user_id:record.user_id,
                pageSize:this.onePagin.pageSize,
                page:this.onePagin.page,
            }
        };
        this.setState({
            visible: true,
        });
        this.props.dispatch(oneRecordTable(params))
    }
    handleOk = (e) => {
        this.setState({
            visible: false,
        });
    }
    handleCancel = (e) => {
        this.onePagin={
            page:1,
            pageSize:10,
        };
        this.setState({
            visible: false,
        });
    }
    recordAction(){
        const self=this;
        if(this.state.selectedRowKeys.length==0){
            /*console.log("this.messInfo",this.messInfo)
            if(this.messInfo==true){
                this.messInfo=false;*/
                notification.warning({
                    message: "提示",
                    description: "请先勾选留言",
                })
            /*}else{
                setTimeout(function(){
                    self.messInfo=true;
                },5000)
            }*/
        }else{
            const params={
                params:{
                    user_ids:JSON.stringify(this.state.selectedRowKeys)
                }
            };
            this.props.dispatch(RecordStart(params))
        }
    }
    handleTableoneChange (pagination, filters, sorter) {
        this.onePagin={
            page:pagination.current,
            pageSize:pagination.pageSize,
        };
        this.oneGustRecord();
        this.sortRank.pagination=pagination;
    }
    ShowSizeoneChange(current, size) {
        this.onePagin.pageSize=size;
    }
    render() {
        let pageSize=this.Pagin.pageSize,page=this.Pagin.page,onePageSize=this.onePagin.PageSize,onePage=this.onePagin.page;
        const { getFieldDecorator,} = this.props.form;
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange.bind(this),
            getCheckboxProps: record => ({
                disabled: record.source_type == 0,    // Column configuration not to be checked
            }),
        }
        //部门dom
        if(this.props.StatisticsReducer&&this.props.StatisticsReducer.guestRecord){
            this.webAll=this.props.StatisticsReducer.webAll;
            this.wechatAll=this.props.StatisticsReducer.wechatAll;
            this.dataSource=this.props.StatisticsReducer.guestRecord.rows;
            for(let i=0;i<this.dataSource.length;i++){
                if(this.dataSource[i].status==1){
                    this.dataSource[i].status_dom="已处理";
                }else{
                    this.dataSource[i].status_dom="未处理";
                }
                if(this.dataSource[i].source_type==0){
                    this.dataSource[i].content_dom=<div>{this.dataSource[i].content}</div>;
                    this.dataSource[i].source_type_dom=<div><i className="fa fa-television" aria-hidden="true" style={{"color":"#108ee9"}}/>&nbsp;&nbsp;&nbsp;{this.dataSource[i].channel_name}</div>;
                }else{
                    this.dataSource[i].content_dom=<a onClick={this.oneGustRecord.bind(this,this.dataSource[i])}>{this.dataSource[i].content}</a>;
                    this.dataSource[i].source_type_dom=<div><i className="fa fa-weixin" aria-hidden="true" style={{"color":"#7ad27a"}}/>&nbsp;&nbsp;&nbsp;{this.dataSource[i].channel_name}</div>;
                }
            }
            this.total=this.props.StatisticsReducer.guestRecord.total;
        }
        if(this.props.StatisticsReducer&&this.props.StatisticsReducer.oneGustRecord){
            this.oneDataSource=this.props.StatisticsReducer.oneGustRecord.rows;
            for(let i=0;i<this.oneDataSource.length;i++){
                if(this.oneDataSource[i].status==0){
                    this.oneDataSource[i].statusDom="未处理";
                }else{
                    this.oneDataSource[i].statusDom="已处理";
                }
            }
            this.oneTotal=this.props.StatisticsReducer.oneGustRecord.total;
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
                                <Col span={2} style={{"textAlign":"center"}}>来源渠道</Col>
                                <Col span={3}>
                                    {getFieldDecorator('source_type',{
                                        initialValue:"",
                                        //onChange:this.sourceTypeChange.bind(this)
                                    })(
                                        <Select showSearch>
                                            <Option value="">全部</Option>
                                            <Option value="0">网站渠道</Option>
                                            <Option value="1">微信渠道</Option>
                                        </Select>
                                    )}
                                </Col>
                                <Col span={1}/>
                                <Col span={2} style={{"textAlign":"center"}}>处理状态</Col>
                                <Col span={3}>
                                    {getFieldDecorator('status',{
                                        initialValue:""
                                    })(
                                        <Select showSearch>
                                            <Option value="">全部</Option>
                                            <Option value="1">已处理</Option>
                                            <Option value="0">未处理</Option>
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
                    <Table   columns={this.columns}
                             rowSelection={rowSelection}
                             dataSource={this.dataSource}  bordered size="middle"
                             onChange={this.handleTableChange.bind(this)}
                             title={() => '留言记录列表'}
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
                             footer={() => <div><a href={`/ticket/im/get/leave/word.json?condition=${this.condition}&sortField=${this.sortRank.sorterInfo.field||''}&sortOrder=${this.sortRank.sorterInfo.order||''}&export=true`}>
                                 <Button type="primary" style={{"marginRight": "20px"}}>
                                     <i className="fa fa-long-arrow-down"></i>&nbsp;导出</Button>
                             </a><Button type="primary" style={{"marginRight": "20px"}} onClick={this.recordAction.bind(this)}>
                                 发起会话</Button></div>}
                    />
                </Card>
                <Modal title={null} visible={this.state.visible}
                       onOk={this.handleOk} onCancel={this.handleCancel}
                       footer={null}
                >
                    <Table dataSource={this.oneDataSource}
                           onChange={this.handleTableoneChange.bind(this)}
                           columns={this.oneColumns} size="middle"
                           pagination={{
                               current: onePage,
                               total: this.oneTotal,
                               pageSize: onePageSize,
                               size: 'small',
                               showSizeChanger: false,
                               showQuickJumper: false,
                               pageSizeOptions: ['10', '20', '30', '40'],
                               showTotal: function (total, range) {
                                   return `显示 ${range[0]} 到 ${range[1]}，共 ${total} 条记录`;
                               },
                               onShowSizeChange:this.ShowSizeoneChange.bind(this),
                           }}/>
                </Modal>
            </Layout>
        );
    }
}
GuestbookRecord.contextTypes = {
    router: PropTypes.object,
};
GuestbookRecord = Form.create()(GuestbookRecord);
GuestbookRecord.PropTypes = {
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

GuestbookRecord.defaultProps = {
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
const mapStateToProps = GuestbookRecord => GuestbookRecord;

module.exports = connect(mapStateToProps)(GuestbookRecord);