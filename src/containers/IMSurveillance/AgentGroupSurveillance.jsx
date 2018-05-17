/**
 * 坐席组监控
 * */
import React, {Component,} from "react";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { Layout,Form,Button,Table,Card,} from "antd";
import {AgentGroupList,} from "Actions/MonitAction";
import WaterMark from 'Static/js/watermark';
export default class AgentGroupSurveillance extends Component{
    constructor(props, context) {
        super(props, context);
        this.columns = [{
            title: '坐席组名称',
            dataIndex: 'group_name',
            key: 'group_name',
            width:150,
        },{
            title: '在线坐席数',
            dataIndex: 'online_num',
            key: 'online_num',
            width:150,
        }, {
            title: '当前会话数',
            dataIndex: 'session_num',
            key: 'session_num',
            width:150,
        },{
            title: '排队数',
            dataIndex: 'queue_num',
            key: 'queue_num',
            width:150,
        },{
            title: '今日完成会话数',
            dataIndex: 'end_session_num',
            key: 'end_session_num',
            width:150,
        }, {
            title: '今日排队放弃数',
            dataIndex: 'giveup_queue_num',
            key: 'giveup_queue_num',
            width:150,
        }, {
            title: '平均首次响应时长',
            dataIndex: 'avg_response_secs',
            key: 'avg_response_secs',
            width:150,
        }, {
            title: '平均会话持续时长 ',
            dataIndex: 'avg_session_secs',
            key: 'avg_session_secs',
            width:150,
        },  ];
        this.sortRank={
            filterInfo: {},
            sorterInfo: {},
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
        this.props.dispatch(AgentGroupList());
        this.refreshAuto();
    }
    componentDidMount(){
        if(this.waterMarkText){
            WaterMark.addWaterMark(this.waterMarkText,"#fff");
        }
    }
    refreshAuto(){
        const self=this;
        setInterval(function(){
            if(self.state.time>0){
                self.setState({
                    time:(self.state.time-1)
                })
            }else{
                self.props.dispatch(AgentGroupList());
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
    refresh(){
        this.setState({
            time:30
         });
        this.handleRefresh=true;
        this.props.dispatch(AgentGroupList());
    }
    render() {
        this.bodyHeight=document.body.clientHeight;
        if(this.props.MonitReducer&&this.props.MonitReducer.agentGroupMonit){
            this.dataSource=this.props.MonitReducer.agentGroupMonit;
        }
        return(
            <Layout>
                <Card style={{"margin":"10px"}}>
                    <Table   columns={this.columns}
                             dataSource={this.dataSource}  bordered size="middle"
                             title={() =><div><span style={{"paddingRight":"30px"}}>坐席组监控</span><Button type="primary" style={{"marginRight": "20px"}} onClick={this.refresh.bind(this)}>
                                 &nbsp;手动刷新</Button>&nbsp;{this.state.time}自动刷新
                                 </div>}
                             pagination={false}
                             scroll={{x:1200,}}
                    />
                </Card>
            </Layout>
        );
    }
}
AgentGroupSurveillance.contextTypes = {
    router: PropTypes.object,
};
AgentGroupSurveillance = Form.create()(AgentGroupSurveillance);
AgentGroupSurveillance.PropTypes = {
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
AgentGroupSurveillance.defaultProps = {
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
const mapStateToProps = AgentGroupSurveillance => AgentGroupSurveillance;
module.exports = connect(mapStateToProps)(AgentGroupSurveillance);