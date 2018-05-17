/**
 * 渠道监控
 * */
import React, {Component,} from "react";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import moment from 'moment';
import {Layout,Form,Button,Table,Card,} from "antd";
import {ChannelMonitList,} from "Actions/MonitAction";
import WaterMark from 'Static/js/watermark';
moment.locale("zh-cn");
export default class ChannelSurveillance extends Component{
    constructor(props, context) {
        super(props, context);
        this.columns = [{
            title: '来源渠道',
            dataIndex: 'channelName',
            key: 'channelName',
            width:150,
        },{
            title: '当前会话数',
            dataIndex: 'session_num',
            key: 'session_num',
            width:150,
        }, {
            title: '当前排队数',
            dataIndex: 'queue_num',
            key: 'queue_num',
            width:150,
        },{
            title: '今日无效会话数',
            dataIndex: 'invalid_session_num',
            key: 'invalid_session_num',
            width:150,
        },{
            title: '今日完成会话数',
            dataIndex: 'end_session_num',
            key: 'end_session_num',
            width:150,
        },  {
            title: '今日服务客户数',
            dataIndex: 'serve_user_num',
            key: 'serve_user_num',
            width:150,
        },{
            title: '今日排队放弃数',
            dataIndex: 'giveup_queue_num',
            key: 'giveup_queue_num',
            width:150,
        }, {
            title: '今日新增留言数',
            dataIndex: 'add_msg_num',
            key: 'add_msg_num',
            width:150,
        }, {
            title: '今日处理留言数',
            dataIndex: 'deal_msg_num',
            key: 'deal_msg_num',
            width:150,
        }, ];
        this.tableType="source_monitor";
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
        this.dataSource=[];
        this.state = {
            time:30
        };
        this.handleRefresh=false;
    }
    //服务端取数据
    componentWillMount() {
        this.waterMarkText=localStorage.getItem("watermark");
        let parames={
            pageSize:this.Pagin.pageSize,
            page:this.Pagin.page,
        };
        this.props.dispatch(ChannelMonitList(parames));
        this.refreshAuto();
    }
    componentDidUpdate(){
        if(this.waterMarkText){
            WaterMark.addWaterMark(this.waterMarkText,"#fff","20px 黑体","scroll");
        }
    }
    refresh(){
        this.setState({
            time:30
        });
        this.handleRefresh=true;
        const parames={
            pageSize:this.Pagin.pageSize,
            page:this.Pagin.page,};
        this.props.dispatch(ChannelMonitList(parames));
    }
    refreshAuto(){
        const self=this;
        setInterval(function(){
            if(self.state.time>0){
                self.setState({
                    time:(self.state.time-1)
                })
            }else{
                let parames={
                    pageSize:self.Pagin.pageSize,
                    page:self.Pagin.page,
                };
                self.props.dispatch(ChannelMonitList(parames));
                self.setState({
                    time:30
                })
            }
        },1000);
        if(this.handleRefresh){
            this.setState({
                time:30
            });
            this.handleRefresh=false;
        }
    }
    handleTableChange (pagination, filters, sorter) {
        this.Pagin={
            page:pagination.current,
            pageSize:pagination.pageSize,
        };
        //this.sortRank.sorterInfo=sorter;
        //this.sortRank.pagination=pagination;
        //this.sortRank.filterInfo=filters;
        //this.refreshAuto();
        this.searchInfo();
    }
    searchInfo(){
        let _params = {
            pageSize:this.Pagin.pageSize,
            page:this.Pagin.page,
        };
        this.props.dispatch(ChannelMonitList(_params));
    }
    ShowSizeChange(current, size) {
        this.Pagin.pageSize=size;
    }
    render() {
        let total=0,pageSize=this.Pagin.pageSize,page=this.Pagin.page;
        this.bodyHeight=document.body.clientHeight;
        if(this.props.MonitReducer&&this.props.MonitReducer.channelMonit){
            this.dataSource=this.props.MonitReducer.channelMonit.rows;
            total=this.props.MonitReducer.channelMonit.total;
            for(let i=0;i<this.dataSource.length;i++){
                if(this.dataSource[i].source_type==0){
                    this.dataSource[i].channelName=<div><i className="fa fa-television" aria-hidden="true" style={{"color":"#108ee9"}}/>&nbsp;&nbsp;&nbsp;{this.dataSource[i].source_name}</div>;
                }else if(this.dataSource[i].source_type==1){
                    this.dataSource[i].channelName=<div><i className="fa fa-weixin" aria-hidden="true" style={{"color":"#26d272"}}/>&nbsp;&nbsp;&nbsp;{this.dataSource[i].source_name}</div>;
                }else if(this.dataSource[i].source_type==2){
                    this.dataSource[i].channelName=<div><i className="fa fa-android" aria-hidden="true" style={{"color":"#15a9ff"}}/>&nbsp;&nbsp;&nbsp;{this.dataSource[i].source_name}</div>;
                }else{
                    this.dataSource[i].channelName=<div><i className="fa fa-apple" aria-hidden="true" style={{"color":"#8392a5"}}/>&nbsp;&nbsp;&nbsp;{this.dataSource[i].source_name}</div>;
                }

            }
        }
        return(
            <Layout>
                <Card style={{"margin":"10px"}}>
                    <Table   columns={this.columns}
                             dataSource={this.dataSource}  bordered size="middle"
                             title={() => <div><span style={{"paddingRight":"30px"}}>接入渠道监控</span><Button type="primary" style={{"marginRight": "20px"}} onClick={this.refresh.bind(this)}>
                                 &nbsp;手动刷新</Button>&nbsp;{this.state.time}自动刷新
                                 </div>}
                             onChange={this.handleTableChange.bind(this)}
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
                             scroll={{x:1350,}}

                    />
                </Card>
            </Layout>
        );
    }
}
ChannelSurveillance.contextTypes = {
    router: PropTypes.object,
};
ChannelSurveillance = Form.create()(ChannelSurveillance);
ChannelSurveillance.PropTypes = {
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
ChannelSurveillance.defaultProps = {
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
const mapStateToProps = ChannelSurveillance => ChannelSurveillance;
module.exports = connect(mapStateToProps)(ChannelSurveillance);