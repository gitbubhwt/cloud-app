/**
 * 坐席监控
 * */
import React, {Component,} from "react";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import moment from 'moment';
import { Row, Col,Layout,Select,Form,Button,Table,Card,TreeSelect, Input,} from "antd";
import {AgentList,AgentMonitSearch,AgentStatus,AgentAll} from "Actions/MonitAction";
import WaterMark from 'Static/js/watermark';
import im_agent_status from '../Config';
moment.locale("zh-cn");
const { Option,} = Select;
const TreeNode = TreeSelect.TreeNode;
import { Link } from 'react-router';
let loop = (dataTreeSource) => dataTreeSource.map((item) => {
    if (item.children && item.children.length) {
        return <TreeNode key={item.dept_name} title={item.dept_name}
                         value={JSON.stringify(item)}>{loop(item.children)}</TreeNode>;
    }
    return <TreeNode key={item.dept_name} title={item.dept_name} value={JSON.stringify(item)}/>
});
export default class AgentSurveillance extends Component{
    constructor(props, context) {
        super(props, context);
        this.columns = [{
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
            width:150,
        },{
            title: '工号',
            dataIndex: 'worker_id',
            key: 'worker_id',
            width:150,
        }, {
            title: '部门',
            dataIndex: 'dept_id',
            key: 'dept_id',
            width:150,
        },{
            title: '状态',
            dataIndex: 'statusDom',
            key: 'statusDom',
            width:150,
        }, {
            title: '状态时长',
            dataIndex: 'status_keep_time',
            key: 'status_keep_time',
            width:150,
        }, {
            title: '当前会话/接待上限',
            dataIndex: 'session_num',
            key: 'session_num',
            width:150,

        },{
            title: '今日无效会话数',
            dataIndex: 'invalid_session_num',
            key: 'invalid_session_num',
            width:150,
        },{
            title: '今日独立会话数',
            dataIndex: 'indep_session_num',
            key: 'indep_session_num',
            width:150,

        }, {
            title: '今日参与转接会话数 ',
            dataIndex: 'dep_session_num',
            key: 'dep_session_num',
            width:150,
        },{
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            width:150,
            render:(text, record) => {
                if(record.status==this.im_agent_status.online){
                    return <span>
                                <Link onClick={this.viewRecord.bind(this,record,this.im_agent_status.busy)} style={{"color":"#108ee9"}}>强制忙碌</Link>&nbsp;&nbsp;
                                <Link onClick={this.viewRecord.bind(this,record,this.im_agent_status.offline)} style={{"color":"#108ee9"}}>强制离线</Link>
                            </span>
                }else if(record.status==this.im_agent_status.busy){
                    return <span>
                                <Link onClick={this.viewRecord.bind(this,record,this.im_agent_status.online)} style={{"color":"#108ee9"}}>强制上线</Link>&nbsp;&nbsp;
                                <Link onClick={this.viewRecord.bind(this,record,this.im_agent_status.offline)} style={{"color":"#108ee9"}}>强制离线</Link>
                            </span>
                }else{
                    return <span>
                                {/*<Link onClick={this.viewRecord.bind(this,record,1)} style={{"color":"#108ee9"}}>强制忙碌</Link>&nbsp;&nbsp;
                                <Link onClick={this.viewRecord.bind(this,record,2)} style={{"color":"#108ee9"}}>强制上线</Link>*/}
                            </span>
                }
            }
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
        this.deptInfo=[];
        this.deptId=0;
        this.dept_name="";
        this.dataSource=[];
        this.state = {
            time:30
        };
        this.handleRefresh=false;
    }
    ShowSizeChange(current, size) {
        this.Pagin.pageSize=size;
    }
    /*分页、排序、筛选变化时触发*/
    handleTableChange (pagination, filters, sorter) {
        this.Pagin={
            page:pagination.current,
            pageSize:pagination.pageSize,
        }
        //this.sortRank.sorterInfo=sorter;
        //this.sortRank.pagination=pagination;
        //this.sortRank.filterInfo=filters;
        this.searchInfo();

    }
    //服务端取数据
    componentWillMount() {
        this.im_agent_status=global.im_agent_status
        this.waterMarkText=localStorage.getItem("watermark");
        this.bodyWidth=document.body.clientWidth-84;
        let condition={
            agentId:"",
            dept_id:"",
        };
        this.condition=JSON.stringify(condition);
        let requestParams={
            listParams:{
                condition:JSON.stringify(condition),
                pageSize:this.Pagin.pageSize,
                page:this.Pagin.page,
            },
            agentParams:{params:{dept_id:0}}
        };
        this.props.dispatch(AgentList(requestParams));
        this.refreshAuto();
    }
    componentDidMount(){
        const tableContent=document.getElementsByClassName("ant-table-content");
        if(tableContent.length>0&&tableContent[0].clientWidth<1500){
            this.columns[0].fixed="left";
            this.columns[1].fixed="left";
            this.columns[2].fixed="left";
        }
    }
    componentDidUpdate(){
        if(this.waterMarkText){
            WaterMark.addWaterMark(this.waterMarkText,"#fff","20px 黑体","scroll");
        }
    }
    viewRecord(record,status){
        const _params={
            //vccId:record.vcc_id,
            user_id:Number(record.ag_id),
            status,
        };
        const params={params:_params};
        this.props.dispatch(AgentStatus(params,this.searchRefresh.bind(this)));
    }

    searchInfo(click){
        let condition={};
        this.props.form.validateFields((err, values) => {
                this.ag_id=values.ag_id.substring(0,values.ag_id.indexOf("+"));
                this.status=values.status;
                if(values.dept_id){
                    this.dept_id=JSON.parse(values.dept_id).dept_id;
                }else {
                    this.dept_id = "";
                }
                if(this.status==4){
                    condition={
                        dept_id:this.dept_id?this.dept_id:"0",
                        agentId:this.ag_id,
                    };
                }else{
                    condition={
                        dept_id:this.dept_id?this.dept_id:"0",
                        status:this.status,
                        agentId:this.ag_id,
                    };
                }

                this.condition=JSON.stringify(condition);
        });
        if(click=="clickSearch"){
            this.Pagin.page=1;
        }
        let _params = {
            condition:JSON.stringify(condition),
            pageSize:this.Pagin.pageSize,
            page:this.Pagin.page,
            tableType:this.tableType,
        };
        this.props.dispatch(AgentMonitSearch(_params));
    }
    //部门变化
    deptChange(e){
        if(e){
            const deptId=JSON.parse(e).dept_id;
            this.dept_name=e;
            this.props.form.setFieldsValue({
                ag_id:"全部"
            });
            this.props.dispatch(AgentAll({params:{dept_id:deptId,code:"12345"}}))
        }else{
            const self=this;
            setTimeout(function(){
                self.props.form.setFieldsValue({
                    dept_id:self.dept_name?self.dept_name:JSON.stringify(self.deptInfo[0]),
                });
            },10)
        }
    }
    searchRefresh(){
        let _params = {
            condition:this.condition,
            tableType:this.tableType,
            page:this.Pagin.page,
            pageSize:this.Pagin.pageSize,
        };
        this.props.dispatch(AgentMonitSearch(_params));
    }
    refresh(){
        this.setState({
            time:30
        });
        this.handleRefresh=true;
        this.searchRefresh();
    }
    refreshAuto(){
        const self=this;
        setInterval(function(){
            if(self.state.time>0){
                self.setState({
                    time:(self.state.time-1)
                })
            }else{
                self.searchRefresh();
                self.setState({
                    time:30
                })
            }
        },1000)
        if(this.handleRefresh){
            this.setState({
                time:30
            });
            this.handleRefresh=false;
        }
    }
    render() {
        let total=0,pageSize=this.Pagin.pageSize,page=this.Pagin.page;
        this.bodyHeight=document.body.clientHeight;
        const { getFieldDecorator,} = this.props.form;
        if(this.props.MonitReducer&&this.props.MonitReducer.deptInfo){
            this.deptInfo=this.props.MonitReducer.deptInfo;
            this.userInfo=this.props.MonitReducer.userInfo;
            this.dataSource=this.props.MonitReducer.agentMonit.rows;
            total=this.props.MonitReducer.agentMonit.total;
            if(total>0){
                for(let i=0;i<this.dataSource.length;i++){
                    if(this.dataSource[i].status==this.im_agent_status.online){
                        this.dataSource[i].statusDom=<div><span style={{"color":"rgb(154, 202, 65)","fontSize":"16px"}}>●</span>&nbsp;&nbsp;&nbsp;在线</div>
                    }else if(this.dataSource[i].status==this.im_agent_status.busy){
                        this.dataSource[i].statusDom=<div><span style={{"color":"red","fontSize":"16px"}}>●</span>&nbsp;&nbsp;&nbsp;忙碌</div>
                    }else{
                        this.dataSource[i].statusDom=<div><span style={{"color":"rgb(204, 204, 204)","fontSize":"16px"}}>●</span>&nbsp;&nbsp;&nbsp;离线</div>

                    }
                }
            }else{
                this.dataSource[0].statusDom=<div/>
            }

            this.userDom=this.userInfo.map(function(item,index){
                if(index==0){
                    return <Option value={item.user_id} key={index}>{item.user_name}</Option>
                }else{
                    return <Option value={item.user_id+"+"+item.user_num+"  "+item.user_name} key={index}>{item.user_num+"  "+item.user_name}</Option>
                }
            })
        }
        return(
            <Layout>
                <div className="configSearch">
                    <Card className="statistics">
                        <Form>
                            <Row>
                                <Col span={3}>
                                    {getFieldDecorator('dept_id',{
                                        initialValue:JSON.stringify(this.deptInfo[0]),
                                        onChange:this.deptChange.bind(this),
                                    })(
                                        <TreeSelect
                                            dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                                            placeholder="请选择参与人"
                                            treeDefaultExpandAll
                                        >
                                            {loop(this.deptInfo)}
                                        </TreeSelect>
                                    )}
                                </Col>
                                <Col span={1} />
                                <Col span={3}>
                                    {getFieldDecorator('ag_id',{
                                        initialValue:""
                                    })(
                                        <Select showSearch>
                                            {this.userDom}
                                        </Select>
                                    )}
                                </Col>
                                <Col span={1} />
                                <Col span={3}>
                                    {getFieldDecorator('status',{
                                        initialValue:"4"
                                    })(
                                        <Select allowClear={false}>
                                            <Option value="4">全部</Option>
                                            <Option value={this.im_agent_status.online}>在线</Option>
                                            <Option value={this.im_agent_status.busy}>忙碌</Option>
                                            <Option value={this.im_agent_status.offline}>离线</Option>
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
                                       title={() =><div><span style={{"paddingRight":"30px"}}>坐席监控</span><Button type="primary" style={{"marginRight": "20px"}} onClick={this.refresh.bind(this)}>
                                           &nbsp;手动刷新</Button>&nbsp;{this.state.time}自动刷新
                                       </div>}
                                       onChange={this.handleTableChange.bind(this)}
                                       scroll={{x:1500}}
                                       pagination={false}
                    /></div>:<div className="evaluaBg"><Table   columns={this.columns}
                                dataSource={this.dataSource}  bordered size="middle"
                                title={() =><div><span style={{"paddingRight":"30px"}}>坐席监控</span><Button type="primary" style={{"marginRight": "20px"}} onClick={this.refresh.bind(this)}>
                                    &nbsp;手动刷新</Button>&nbsp;{this.state.time}自动刷新
                                </div>}
                                onChange={this.handleTableChange.bind(this)}
                                scroll={{x:1500}}
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
                    /></div>}
                </Card>
            </Layout>
        );
    }
}
AgentSurveillance.contextTypes = {
    router: PropTypes.object,
};
AgentSurveillance = Form.create()(AgentSurveillance);
AgentSurveillance.PropTypes = {
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
AgentSurveillance.defaultProps = {
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
const mapStateToProps = AgentSurveillance => AgentSurveillance;
module.exports = connect(mapStateToProps)(AgentSurveillance);