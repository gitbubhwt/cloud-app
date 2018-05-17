/**
 * 会话记录
 * */
import React, {Component,} from "react";
import PropTypes from 'prop-types';
import { connect, } from "react-redux";
import moment from 'moment';
import EmojiConfig from "Static/js/emoji.config";
import emotion_map from 'Static/js/emotions.js';
import Trie from 'Static/js/trie.js';
import { Row, Col,Layout,Select,Form,Button,Table,Card,DatePicker,Modal, } from "antd";
import {SessionRecordList,SessionRecordSearch,SessionChat,} from "Actions/StatisticsAction";
import WaterMark from 'Static/js/watermark';
import publicFunction from '../PublicFunction';
import { Link } from 'react-router';
import "Static/css/agent-chat.css";
const { RangePicker } = DatePicker;
moment.locale("zh-cn");
const { Option, } = Select;
export default class SessionRecord extends Component{
    constructor(props, context) {
        super(props, context);
        this.Time=0;
        this.start_time="";
        this.end_time="";
        this.children = {};
        this.empty=1;
        this.words=0;
        this.recordMes={};
        this.trie=new Trie();
        this.history=[];
        this.columns = [{
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            width:100,
            render:(text, record)=> {
                if(record.key==1){
                    return <span/>
                }else{
                            return <span>
                            <Link onClick={this.viewRecord.bind(this,record)} style={{"color":"#b3b3b3","fontSize":"14px"}}><i className="fa fa-eye"/></Link>
                        </span>
                }
        }
        }, {
            title: '访客姓名',
            dataIndex: 'name',
            key: 'name',
            sorter: true,
            width:150,
        },{
            title: '坐席工号',
            dataIndex: 'worker_id',
            key: 'worker_id',
            sorter: true,
            width:150,
        },{
            title: '访客消息数',
            dataIndex: 'client_news_num',
            key: 'client_news_num',
            sorter: true,
            width:150,
        }, {
            title: '坐席消息数',
            dataIndex: 'agent_news_num',
            key: 'agent_news_num',
            sorter: true,
            width:150,
        },{
            title: '开始时间',
            dataIndex: 'session_start_time',
            key: 'session_start_time',
            sorter: true,
            width:150,
        },{
            title: '结束时间',
            dataIndex: 'session_end_time',
            key: 'session_end_time',
            sorter: true,
            width:150,
        }, {
            title: '首次响应时长',
            dataIndex: 'first_response_secs',
            key: 'first_response_secs',
            sorter: true,
            width:150,
        }, {
            title: '会话持续时长',
            dataIndex: 'session_keep_secs',
            key: 'session_keep_secs',
            sorter: true,
            width:150,
        },{
            title: '建立方式',
            dataIndex: 'session_create_type',
            key: 'session_create_type',
            sorter: true,
            width:150,
        },{
            title: '会话结果',
            dataIndex: 'session_end_type',
            key: 'session_end_type',
            sorter: true,
            width:150,
        }, {
            title: '来源渠道',
            dataIndex: 'sourceTypeDom',
            key: 'sourceTypeDom',
            sorter: true,
            width:190,
        },{
            title: '是否评价 ',
            dataIndex: 'is_evaluate',
            key: 'is_evaluate',
            sorter: true,
            width:150,
        }, {
            title: '评价结果 ',
            dataIndex: 'evaluate',
            key: 'evaluate',
            sorter: true,
            width:150,
        },{
            title:"评价备注",
            dataIndex: 'evaluate_explain_data',
            key: 'evaluate_explain_data',
            sorter: true,
            width:240,
        }];
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
        this.Dom=[];
        this.historyDom=[];
        /*this.tableType="session_record";*/
        this.state = {
            visible: false,
        };
    }
    // 生成表情对象
    getEmojiObj(len) {
        let l = len - 60
        window.emojiObj = [];

        for (var i = 1; i <= 60; i++) {
            if (i < 10) {
                window.emojiObj['emo_0' + i] = 'http://ekt-platform-dev.icsoc.net/bundles/ektim/img/emo_0' + i + '.gif';
            } else {
                window.emojiObj['emo_' + i] = 'http://ekt-platform-dev.icsoc.net/bundles/ektim/img/emo_' + i + '.gif';
            }
        }

        for (var i = 1; i <= l; i++) {
            window.emojiObj['emo_' + (60+i)] = 'http://ekt-platform-dev.icsoc.net/bundles/ektim/img/wx_' + i + '.png';
        }
    }
    escapeHTML(str) {
        return (str + "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
    }

    // 聊天会话url地址解析
    parseUrl(content) {
            return content.replace(/((https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|])/g, (string) => {
                return `${string}<a style="color:#02a3d9;" href="${string}" target="_blank">下载</a>`
            })
    }
    // 聊天会话表情解析
    parseEmoji(content) {
        return content.replace(/\[([\u4e00-\u9fa5_a-zA-Z0-9]{1,3})\]/g, (string) => {
            let content
            let html = string
            let index = EmojiConfig.indexOf(string.replace('[', '').replace(']', ''))
            if (index != -1) {
                content = window.emojiObj['emo_' + this.fillZero(index + 1)]
                html = '<img src=' + content + ' />'
            }
            return html
        })
    }
    //弹出窗口build
    initialBuild(){
        var list = [];
        for (var k in emotion_map) {
            if (emotion_map.hasOwnProperty(k)) list.push(k);
        }
        this.emotion_list=this.keys(emotion_map);
        this.trie.build(this.emotion_list);
    }
    keys(map){
        var list = [];
        for (var k in map) {
            if (map.hasOwnProperty(k)) list.push(k);
        }
        return list;
    }
    qqWechatEmotionParser(str) {
        const self=this;
        var indices = this.trie.search(str);
        let result=str;
        if(indices.length>0){
            result=""
        }
        indices./*reverse().*/map(function(idx) {
                var pos = idx[0],
                    emotion = self.emotion_list[idx[1]],
                    img = '<img src="' + emotion_map[emotion] + '" alt="' + emotion + '">';
            result+=img;
            });
        return result;

    }
    fillZero(num) {
        return num > 9 ? String(num) : '0' + String(num)
    }
    viewRecord(record){
        this.setState({ visible: true});
        setTimeout(function(){
            document.getElementsByClassName("ant-modal-content")[0].style.display="block";

        },500)
        if(document.getElementsByClassName("channel").length>0){
            document.getElementsByClassName("channel")[0].style.display="none";
        }
        const params={
            params:{
                sid:record.sid,
                ag_id:record.ag_id,
            }
        }
        this.initialBuild();
        this.getEmojiObj(165);
        this.props.dispatch(SessionChat(params,this.cfun.bind(this)))
    }
    cfun(){
        const self=this;
        setTimeout(function(){
            if(self.props.StatisticsReducer&&self.props.StatisticsReducer.sessionDetail){
                self.agent_avatar=self.props.StatisticsReducer.sessionDetail.agent_avatar;
                self.user_avatar=self.props.StatisticsReducer.sessionDetail.user_avatar;
                self.sessionDetail=self.props.StatisticsReducer.sessionDetail.content;
                self.cle_name=self.props.StatisticsReducer.sessionDetail.cle_name;
                self.channel_name=self.props.StatisticsReducer.sessionDetail.cle_name;
                self.history=self.props.StatisticsReducer.sessionDetail.history;
                self.historyDom=[];
            }
            self.setState({ visible: true});
        },10)
    }
    //处理发送信息类型
    showItem(data){
        //显示消息内容
        let text;
        let content = data.content;

        switch(data.msgType) {
            case 0:
                text = this.getText(content)
            break
            case 1:
                text = this.getVedio(data)
            break
            case 2:
                text = this.getImg(data)
            break
            case 3:
                text = this.getText(content)
            break
            case 4:
                text = this.getFile(data)
            break
            case 5:
                text = this.getRadio(data)
            break
            case 201:
                text = this.getText(content)
            break
            case 204:
                text = this.getText(content)
            break
            case 205:
                text = this.getText(content)
            break
            default:
                text = ''
    }
    data.content = text ? text : content;
    var html = this.getContainer(data);
    return html;
    }
    getText(content){
        return this.parseUrl(this.escapeHTML(content));
    }

    getImg(data){
        let small = data.content
        let url = data.content
        if(data.content.indexOf(',') != -1) {
            url = (data.content.split(','))[0]
            small = url + '?x-oss-process=image/resize,h_240'
        }
        return `<a href="${url}" target="_blank" title="点击查看原图"><img rel="noreferrer" src="${small}" /></a>`;
    }
    getFile(data){
        let html, url, name
        let content = data.content
        if(data.content.indexOf(',') != -1) {
            content= (data.content.split(','))
            url = content[0]
            name = content[1]
        } else {
            return content
        }
        let nameArray = name.split('.')
        let suffix = nameArray[nameArray.length-1]
        switch(suffix){
            case 'doc':
            case 'docx':
                html = `
                    <i class="icon iconfont icon-word" style='color:#5b75b7'></i>
                `
                break
            case 'xls':
            case 'xlsx':
                html = `
                    <i class="icon iconfont icon-excel1" style='color:#508b37'></i>
                `
                break
            case 'pdf':
                html = `
                    <i class="icon iconfont icon-pdf2" style='color:#f2493a'></i>
                `
                break
            default:
                html = ''
        }
        return html +
            `<div class="msg-download">
            <span title="${name}">${name}</span>
            <a class="file-download" href="${url}" download  target="_blank" style="font-size: 12px;">下载</a>
        </div>`
    }
    getRadio(data){
        return `
            <audio src="${data.content}" controls>
                您的浏览器不支持 audio 标签。
            </audio>
        `
    }
    getVedio(data){
        return `
            <video src="${data.content}" controls>
                您的浏览器不支持 video 标签。
            </video>

        `
    }
    getContainer(data){
        let html = '';
        let avatar="";
        if(data.from==1){
            avatar=this.agent_avatar||"http://ekt-platform-dev.icsoc.net/bundles/ektim/img/user1.png";
        }else{
            avatar=this.user_avatar||"http://ekt-platform-dev.icsoc.net/bundles/ektim/img/client.png";
        }
        let src = avatar
        let date = data.createTime ? (new Date(data.createTime*1000)) : (new Date())
        let content = this.qqWechatEmotionParser(this.parseEmoji(data.content || ''));
        let dateString = this.getTime(date, 'YY-MM-DD-HH-MM-SS')
        //如果为图片，则去掉背景色
        if (data.msgType == 2) {
            data.style = '';
        }

        //如果为文件，则为默认背景色
        if (data.msgType == 4) {
            data.style = '#eef0f1';
        }
        if(data.msgType == 0) {
            content = content.replace(/\n/g, '<br />')
        }
        switch(data.className) {
            case 'tipmsg':
            case 'histipmsg':
                html = `
                    <div class="tipmsg">
                        <div class="msgtime">
                            <span>--${dateString}--</span>
                        </div>
                        <div class="msgText">
                            <span>${content}</span>
                        </div>
                    </div>
                `;
                break;
            default:
                html = `
                    <div class="${data.className}" data-seq="${data.seq}" >
                        <div class="msgcon">
                            <img rel="noreferrer" src="${src}" class="img" />
                            <div class="msgmain">
                                <div class="msgtime">${dateString}</div>
                                <div class="messageText" style="background:${data.style}">
                                    <div class="chatmsg">${content}</div>
                                    ${data.className == 'sendmsg' ? `<img class="send-status" src="${loadingImg}" />` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
        }
        return html;
    }
    getTime(date, type) {
        if (!date || date == 0) return ''
        let time
        let now = new Date(date),
            year = now.getFullYear(),
            month = now.getMonth() + 1,
            day = now.getDate(),
            hour = now.getHours(),
            min = now.getMinutes(),
            second = now.getSeconds();
        switch (type) {
            case 'YY-MM-DD-HH-MM-SS':
                if (now.toDateString() === new Date().toDateString()) {
                    time = this.fillZero(hour) + ':' + this.fillZero(min) +':'+this.fillZero(second)
                } else {
                    time = year + '-' + this.fillZero(month) + '-' + this.fillZero(day) + ' '
                        + this.fillZero(hour) + ':' + this.fillZero(min) +':'+this.fillZero(second)
                }
                break
            case 'MM-DD HH:MM:SS':
                const dataMonth=new Date().getMonth()+1;
                const dataDay=new Date().getDate();
                /*if (now.toDateString() === new Date().toDateString()) {
                    time = this.fillZero(hour) + ':' + this.fillZero(min) +':'+this.fillZero(second)
                } else {*/
                if(dataMonth==month&&dataDay==day){
                    time = this.fillZero(hour) + ':' + this.fillZero(min) +':'+this.fillZero(second)
                }else{
                    time = this.fillZero(month) + '-' + this.fillZero(day) + ' '
                        + this.fillZero(hour) + ':' + this.fillZero(min) +':'+this.fillZero(second)
                }

                //}
                break
            default:
                if (now.toDateString() === new Date().toDateString()) {
                    time = this.fillZero(hour) + ':' + this.fillZero(min)
                } else {
                    time = month + '-' + day + ' ' + this.fillZero(hour) + ':' + this.fillZero(min);
                }
        }
        return time
    }
    //服务端取数据
    componentWillMount() {
        this.waterMarkText=localStorage.getItem("watermark");
        this.modelSite=document.body.clientWidth-800;
        //this.getEmojiObj(60);
        this.start_time=moment().format("YYYY-MM-DD");
        this.end_time=moment().format("YYYY-MM-DD");
        let condition={
            start:this.start_time.replace(/-/g,""),
            end:this.end_time.replace(/-/g,""),
            agentId:"",
        };
        this.condition=JSON.stringify(condition);
        this.condition=JSON.stringify(condition);
        const requestParams={
                condition:JSON.stringify(condition),
                page:1,
                pageSize:10,
                sortField: this.sortRank.sorterInfo.field || '',
                sortOrder: this.sortRank.sorterInfo.order || '',

        }
        this.props.dispatch(SessionRecordList(requestParams));
    }
    searchInfo(click){
        let dataformat = "YYYY-MM-DD";
        let condition={};
        this.props.form.validateFields((err, values) => {
            if (values.searchTime != undefined && values.searchTime.length > 0) {
                this.end_time = values.searchTime[1].format(dataformat);
                this.start_time = values.searchTime[0].format(dataformat);
                let ag_id=[];
                for(let i=0;i<values.ag_id.length;i++){
                        ag_id.push(values.ag_id[i].substring(0,values.ag_id[i].indexOf("+")));
                }
                condition={
                    start:this.start_time.replace(/-/g,""),
                    end:this.end_time.replace(/-/g,""),
                    agentId:ag_id.join(",")
                };
                this.condition=JSON.stringify(condition);
            }
        });
        if(click=="clickSearch"){
            this.Pagin.page=1;
        }
        let _params = {
            condition:JSON.stringify(condition),
            page: this.Pagin.page,
            pageSize: this.Pagin.pageSize,
            sortField: this.sortRank.sorterInfo.field || '',
            sortOrder: this.sortRank.sorterInfo.order || '',
        };
        this.props.dispatch(SessionRecordSearch(_params));
    }
    /*分页、排序、筛选变化时触发*/
    handleTableChange (pagination, filters, sorter) {
        this.Pagin={
            page:pagination.current,
            pageSize:pagination.pageSize,
        }
        if(sorter.field=="cle_name"){
            sorter.field="cle_id";
        }
        if(sorter.field=="ag_name"){
            sorter.field="ag_id";
        }
        if(sorter.field=="evaluate_explain_data"){
            sorter.field="evaluate_explain";
        }
        this.sortRank.sorterInfo=sorter;
        this.sortRank.pagination=pagination;
        this.sortRank.filterInfo=filters;
        this.searchInfo();
    }
    ShowSizeChange(current, size) {
        this.Pagin.pageSize=size;
    }
    //隐藏查看
    hideModal = () => {
        this.setState({
            visible: false,
        });
        this.sessionDetail=[];
        document.getElementsByClassName("ant-modal-content")[0].style.display="none";
    }
    componentDidUpdate(){
        if(this.waterMarkText){
            WaterMark.addWaterMark(this.waterMarkText,"#fff","20px 黑体","scroll");
        }
        if(this.state.visible){
            document.getElementsByClassName("ant-modal")[0].style.right="-"+this.modelSite+"px";
        }
        //来源渠道、评价备注title设置
        const antTbody=document.getElementsByClassName("ant-table-tbody");
        for(let i=0;i<this.dataSource.length;i++){
            if(this.total>0&&antTbody.length&&antTbody.length>0){
                antTbody[0].getElementsByTagName("tr")[i].getElementsByTagName("td")[11].title=this.dataSource[i].source_name?this.dataSource[i].source_name:"";
                antTbody[0].getElementsByTagName("tr")[i].getElementsByTagName("td")[14].title=this.dataSource[i].evaluate_explain?this.dataSource[i].evaluate_explain:"";
            }
        }
    }
    componentWillUpdate(){
        if(this.state.visible){
            document.getElementsByClassName("ant-modal")[0].style.right=this.modelSite+800+"px";
        }
    }
    onRowClick(record, index){
        let sourceName = record.sourceName? '(' + record.sourceName + ')' : '';
        let sourceInfo = record.name+sourceName;
        this.recordMes={
            userName:record.name,
            sourceInfo:sourceInfo,
            channelName:record.sourceName,
            sourceType:record.source_type,
            sourceUrl:window.decodeURIComponent(record.sourceUrl),
            system:record.system,
            ip:record.ip,
            ipLocation:record.ipLocation,
            subscribe_time:this.getTime(record.subscribe_time?new Date(record.subscribe_time*1000):"",'YY-MM-DD-HH-MM-SS'),
            nickname:record.nickname,
            sex:record.sex==1?"男":"女",
        };
    }
    messageRecord(){
        document.getElementsByClassName("channel")[0].style.display="block";
    }
    hideMes(){
        document.getElementsByClassName("channel")[0].style.display="none";
    }
    unescapeHTML(str) {
        return (str + "").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&apos;/g, "'");
    }

    componentDidMount(){      
        //固定列
        const tableContent=document.getElementsByClassName("ant-table-content");
        if(tableContent.length>0&&tableContent[0].clientWidth<2340){
            this.columns[0].fixed="left";
            this.columns[1].fixed="left";
            this.columns[2].fixed="left";
        }

    }
    render() {
        let total=0,pageSize=this.Pagin.pageSize,page=this.Pagin.page;
        const { getFieldDecorator,} = this.props.form;
        //部门dom
        if(this.props.StatisticsReducer&&this.props.StatisticsReducer.userInfo){
            this.userInfo=this.props.StatisticsReducer.userInfo;
            this.dataSource=this.props.StatisticsReducer.reportList.rows;
            this.total=this.props.StatisticsReducer.reportList.total;
            this.userDom=[];
            this.userDom=this.userInfo.map(function(item,index){
                    return <Option value={item.user_id + "+" + item.user_num + "  " + item.user_name}
                                   key={index}>{item.user_num + "  " + item.user_name}</Option>
            });

            for(let i=0;i<this.dataSource.length;i++){
                //判断微信和网站渠道
                if(this.dataSource[i].key==1){
                    this.dataSource[i].sourceTypeDom=<div/>
                }else if(this.dataSource[i].source_type=="1"){
                    this.dataSource[i].sourceTypeDom=<div><i className="fa fa-commenting-o" aria-hidden="true" style={{"color":"#7ad27a"}}/>&nbsp;&nbsp;&nbsp;{publicFunction.suolve(this.dataSource[i].source_name,16)}</div>
                }else{
                    this.dataSource[i].sourceTypeDom=<div><i className="fa fa-television" aria-hidden="true" style={{"color":"#108ee9"}}/>&nbsp;&nbsp;&nbsp;{publicFunction.suolve(this.dataSource[i].source_name,16)}</div>
                }
                
                //过多隐藏评价备注
                if(this.total>0&&this.dataSource[i].evaluate_explain&&publicFunction.getByteLen(this.dataSource[i].evaluate_explain)>30){
                    this.dataSource[i].evaluate_explain_data=publicFunction.suolve(this.dataSource[i].evaluate_explain,30);
                }else{
                    this.dataSource[i].evaluate_explain_data=this.dataSource[i].evaluate_explain;
                }
            }
        }
        if(this.sessionDetail){
            this.Dom=[];
            if(this.sessionDetail===undefined){
                this.sessionDetail=[];
            }
            if(this.sessionDetail){
                for(let i=0;i<this.sessionDetail.length;i++){
                    let uid=this.sessionDetail[i];
                    // console.log(uid);
                    for(let j=uid.length-1;j>-1;j--){
                        if(uid[j].msgType==201){
                            this.Dom.push(
                                <div key={i+"+"+j}>
                                    <div className="tipmsg">
                                        <div className="msgtime">
                                            <span>--{this.getTime(uid[j].createTime ? (new Date(uid[j].createTime*1000)) : (new Date()), 'YY-MM-DD-HH-MM-SS')}--</span>
                                        </div>
                                        <div className="msgText">
                                            <span>{uid[j].content}</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        }else{
                            if(uid[j].from==0){
                                uid[j].content = this.unescapeHTML(uid[j].content);
                            }
                            uid[j].content=this.showItem(uid[j]);
                            uid[j].from==0?
                                this.Dom.push(
                                <div className="receivemsg" data-seq="undefined" key={i+"+"+j}>
                                    <div dangerouslySetInnerHTML={{__html: uid[j].content}} />
                                </div>
                            ):this.Dom.push(
                                <div className="sendmsg" data-seq="undefined" key={i+"+"+j}>
                                    <div dangerouslySetInnerHTML={{__html: uid[j].content}} />
                                </div>
                            );
                        }
                    }
                }
            }else{
                this.Dom.push(
                    <div className="receivemsg" data-seq="undefined" key="noContent"/>
                )
            }
        }
        if(this.history.length>0){
            this.historyDom = [];
            for(let i=0;i<this.history.length;i++){
                let dateString = this.getTime(this.history[i].timeStamp, 'MM-DD HH:MM:SS');
                let urlPath = window.decodeURIComponent(this.history[i].url);
                let channelContent = this.history[i].summary?this.history[i].summary:urlPath;
                this.historyDom.push(
                    <li key={i}>
                        <label>{dateString}</label><span className="sourceName" title={channelContent}><a href={urlPath} target="_blank" className="channel_url">{channelContent}</a></span></li>)
            }

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
                                <Col span={1} style={{"textAlign":"center"}}>坐席</Col>
                                <Col span={3}>
                                    {getFieldDecorator('ag_id',{
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
                    {this.total==0?<div className="evaluaBg"><Table   columns={this.columns}
                                            dataSource={this.dataSource}  bordered size="middle"
                                            onChange={this.handleTableChange.bind(this)}
                                            title={() => "会话记录"}
                                            scroll={{x:2340}}
                                            onRowClick={this.onRowClick.bind(this)}
                                            pagination={false}
                                            footer={() => <a href={`/ticket/im/statis/session/record.json?condition=${this.condition}&sortField=${this.sortRank.sorterInfo.field||''}&sortOrder=${this.sortRank.sorterInfo.order||''}&export=true`}>
                                                <Button type="primary" style={{"marginRight": "20px"}}>
                                                    <i className="fa fa-long-arrow-down"></i>&nbsp;导出</Button>
                                            </a>}
                    /></div>:<div className="evaluaBg"><Table   columns={this.columns}
                                dataSource={this.dataSource}  bordered size="middle"
                                onChange={this.handleTableChange.bind(this)}
                                title={() => "会话记录"}
                                scroll={{x:2340}}
                                onRowClick={this.onRowClick.bind(this)}
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
                                footer={() => <a href={`/ticket/im/statis/session/record.json?condition=${this.condition}&sortField=${this.sortRank.sorterInfo.field||''}&sortOrder=${this.sortRank.sorterInfo.order||''}&export=true`}>
                                    <Button type="primary" style={{"marginRight": "20px"}}>
                                        <i className="fa fa-long-arrow-down"></i>&nbsp;导出</Button>
                                </a>}
                    /></div>}

                </Card>
                <div className="modalDisplay">
                    <Modal
                        className="modalAction"
                        style={{"postion":"absolute","margin":0,"right":"100px"}}
                        visible={this.state.visible}
                        onCancel={this.hideModal}
                        footer={null}
                        width={800}
                    >
                        <div className="main show" data-uid="1231" data-imid="1" data-source="0">
                            <div className="content">
                                <div className="chatbox">
                                    <div className="chatcon">
                                        <div className="chatcon_title">
                                            <div className="chatcon_info">
                                            {this.recordMes.sourceType==1?<i className="fa fa-commenting-o" aria-hidden="true" style={{"color":"#7ad27a"}}/>:<i className="fa fa-television" aria-hidden="true" style={{"color":"#108ee9"}}/>}
                                                
                                                <span className="username" title={this.recordMes.sourceInfo}>{this.recordMes.sourceInfo}</span>
                                                <Link style={{"color":"#00a3d9"}} onClick={this.messageRecord.bind(this)}>&nbsp;&nbsp;<i className="fa fa-eye">&nbsp;&nbsp;查看</i></Link>
                                            </div>
                                        </div>
                                        <div className="channel">
                                            <div className="channer_content">
                                                <div className="channel_01">
                                                    <div className="chan_con">来源信息</div>
                                                </div>
                                                {this.recordMes.sourceType==1?<ul className="channel_02">

                                                    <li>
                                                        <label>微信公众号名称</label><span className="sourceName" title={this.recordMes.channelName}>{this.recordMes.channelName}</span></li>
                                                    <li>
                                                        <label>微信昵称</label><span>{this.recordMes.nickname}</span></li>
                                                    <li>
                                                        <label>性别</label><span className="system">{this.recordMes.sex}</span></li>
                                                    <li>
                                                        <label>关注时间</label><span className="ip">{this.recordMes.subscribe_time}</span></li>
                                                </ul>:<ul className="channel_02 clearfix">

                                                    <li>
                                                        <label>来源渠道</label><span className="sourceName" title={this.recordMes.channelName}>{this.recordMes.channelName}</span></li>
                                                    <li>
                                                        <label>来源url</label><span title={this.recordMes.sourceUrl}>{this.recordMes.sourceUrl}</span></li>
                                                    <li>
                                                        <label>系统</label><span className="system">{this.recordMes.system}</span></li>
                                                    <li>
                                                        <label>IP地址</label><span className="ip">{this.recordMes.ip}</span></li>
                                                    <li>
                                                        <label>IP所在地</label><span className="ipLocation">{this.recordMes.ipLocation}</span></li>
                                                </ul>}

                                            </div>

                                            <div className="channer_content" style={{"left":"45%"}}>
                                                <div className="channel_01">
                                                    <div className="chan_con">浏览轨迹</div>
                                                </div>
                                                <ul className="channel_02" style={{height:"140px"}}>
                                                    {this.historyDom}
                                                </ul>
                                            </div>
                                            <div className="chan_change" onClick={this.hideMes.bind(this)}><i className="fa fa-angle-up"/>收起</div>
                                            {<ul className="channel_02"/>}

                                        </div>
                                    </div>
                                    <div className="chatmain">
                                        {this.state.visible?this.Dom:<div/>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal>
                </div>
            </Layout>
        );
    }
}
SessionRecord.contextTypes = {
    router: PropTypes.object,
};
SessionRecord = Form.create()(SessionRecord);
SessionRecord.PropTypes = {
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
SessionRecord.defaultProps = {
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
const mapStateToProps = SessionRecord => SessionRecord;
module.exports = connect(mapStateToProps)(SessionRecord);