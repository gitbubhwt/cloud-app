/**
 * 业务受理-会话记录
 * */
import React, {Component,} from "react";
import PropTypes from 'prop-types';
import { connect, } from "react-redux";
import moment from 'moment';
import EmojiConfig from "Static/js/emoji.config";
import emotion_map from 'Static/js/emotions.js';
import Trie from 'Static/js/trie.js';
import {  Layout,Select,Form,Button,Table,Card,Modal, } from "antd";
import {AssignSessionRecordList,SessionChat,} from "Actions/StatisticsAction";
import WaterMark from 'Static/js/watermark';
import { Link } from 'react-router';
moment.locale("zh-cn");
const { Option, } = Select;
export default class AssignSessionRecord extends Component{
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
            title: '客户消息数',
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
        }, {
            title: '会话持续时长',
            dataIndex: 'session_keep_secs',
            key: 'session_keep_secs',
            sorter: true,
            width:150,
        }, {
            title: '来源渠道',
            dataIndex: 'sourceTypeDom',
            key: 'sourceTypeDom',
            sorter: true,
            width:150,
        },{
            title: '会话结果',
            dataIndex: 'session_end_type',
            key: 'session_end_type',
            sorter: true,
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
        this.loading=true;
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
        let src = avatar;
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
            second = now.getSeconds()
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
        this.client_id=this.props.router.params.cle_id;
        const requestParams={
            cle_id:this.client_id,
            page:1,
            pageSize:10,
            sortField: this.sortRank.sorterInfo.field || '',
            sortOrder: this.sortRank.sorterInfo.order || '',

        }
        this.props.dispatch(AssignSessionRecordList(requestParams));
    }
    componentDidMount(){
        if(this.waterMarkText){
            WaterMark.addWaterMark(this.waterMarkText,"#fff");
        }
    }
    searchInfo(click){
        let _params = {}
        if(click=="clickSearch"){
            _params = {
                page: 1,
                pageSize: this.Pagin.pageSize,
                sortField: this.sortRank.sorterInfo.field || '',
                sortOrder: this.sortRank.sorterInfo.order || '',
                cle_id:this.client_id,
            };
            this.Pagin.page=1;
        }else{
            _params = {
                page: this.Pagin.page,
                pageSize: this.Pagin.pageSize,
                sortField: this.sortRank.sorterInfo.field || '',
                sortOrder: this.sortRank.sorterInfo.order || '',
                cle_id:this.client_id,
            };
        }
        this.props.dispatch(AssignSessionRecordList(_params));
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
        this.sortRank.sorterInfo=sorter;
        this.sortRank.pagination=pagination;
        this.sortRank.filterInfo=filters;
        this.searchInfo();
    }
    ShowSizeChange(current, size) {
        this.Pagin.pageSize=size;
    }
    hideModal = () => {
        this.setState({
            visible: false,
        });
        this.sessionDetail=[];
        document.getElementsByClassName("ant-modal-content")[0].style.display="none";
    }
    componentDidUpdate(){
        if(this.state.visible){
            document.getElementsByClassName("ant-modal")[0].style.right="-"+this.modelSite+"px";
        }
    }
    componentWillUpdate(){
        if(this.state.visible){
            document.getElementsByClassName("ant-modal")[0].style.right=this.modelSite+800+"px";
        }
    }
    onRowClick(record, index){
        this.recordMes={
            userName:record.name,
            sourceName:record.sourceName,
            sourceType:record.source_type,
            sourceName:record.sourceName,
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
    render() {
        let total=0,pageSize=this.Pagin.pageSize,page=this.Pagin.page;
        //部门dom
        if(this.props.StatisticsReducer&&this.props.StatisticsReducer.assignReportList){
            this.dataSource=this.props.StatisticsReducer.assignReportList.rows;
            this.total=this.props.StatisticsReducer.assignReportList.total;
            for(let i=0;i<this.dataSource.length;i++){
                if(this.dataSource[i].key==1){
                    this.dataSource[i].sourceTypeDom=<div/>
                }else if(this.dataSource[i].source_type=="1"){
                    this.dataSource[i].sourceTypeDom=<div><i className="fa fa-commenting-o" aria-hidden="true" style={{"color":"#7ad27a"}}/>&nbsp;&nbsp;&nbsp;{this.dataSource[i].source_name}</div>
                }else{
                    this.dataSource[i].sourceTypeDom=<div><i className="fa fa-television" aria-hidden="true" style={{"color":"#108ee9"}}/>&nbsp;&nbsp;&nbsp;{this.dataSource[i].source_name}</div>
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
                <Card style={{"margin":"10px"}}>
                    <Table   columns={this.columns}
                             dataSource={this.dataSource}  bordered size="middle"
                             onChange={this.handleTableChange.bind(this)}
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
                             /*footer={() => <a href={`/ticket/im/client/dialog/report.json?sortField=${this.sortRank.sorterInfo.field||''}&sortOrder=${this.sortRank.sorterInfo.order||''}&export=true`}>
                                 <Button type="primary" style={{"marginRight": "20px"}}>
                                     <i className="fa fa-long-arrow-down"></i>&nbsp;导出</Button>
                             </a>}*/
                    />
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
                                                <span className="username">{this.recordMes.userName}</span>
                                                {this.recordMes.sourceName?<span className="chatcon_from">({this.recordMes.sourceName})</span>:<span/>}

                                                <Link style={{"color":"#00a3d9"}} onClick={this.messageRecord.bind(this)}>&nbsp;&nbsp;<i className="fa fa-eye">&nbsp;&nbsp;查看</i></Link>
                                            </div>
                                        </div>
                                        <div className="channel">
                                            <div className="channer_content">
                                                <div className="channel_01">
                                                    <div className="chan_con">来源信息</div>
                                                    {/*<div className="chan_change" onClick={this.hideMes.bind(this)}><i className="fa fa-angle-up"/>收起</div>*/}
                                                </div>
                                                {this.recordMes.sourceType==1?<ul className="channel_02">

                                                    <li>
                                                        <label>微信公众号名称</label><span className="sourceName">{this.recordMes.sourceName}</span></li>
                                                    <li>
                                                        <label>微信昵称</label><span>{this.recordMes.nickname}</span></li>
                                                    <li>
                                                        <label>性别</label><span className="system">{this.recordMes.sex}</span></li>
                                                    <li>
                                                        <label>关注时间</label><span className="ip">{this.recordMes.subscribe_time}</span></li>
                                                </ul>:<ul className="channel_02 clearfix">

                                                    <li>
                                                        <label>来源渠道</label><span className="sourceName">{this.recordMes.sourceName}</span></li>
                                                    <li>
                                                        <label>来源url</label><span>{this.recordMes.sourceUrl}</span></li>
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
                                                    {/*<div className="chan_change" onClick={this.hideMes.bind(this)}><i className="fa fa-angle-up"/>收起</div>*/}
                                                </div>
                                                <ul className="channel_02">
                                                    {this.historyDom}
                                                    {/*<li>
                                                        <label>微信公众号名称</label><span className="sourceName">{this.recordMes.sourceName}</span></li>
                                                    <li>
                                                        <label>微信昵称</label><span>{this.recordMes.nickname}</span></li>
                                                    <li>
                                                        <label>性别</label><span className="system">{this.recordMes.sex}</span></li>
                                                    <li>
                                                        <label>关注时间</label><span className="ip">{this.recordMes.subscribe_time}</span></li>*/}
                                                </ul>
                                            </div>
                                            <div className="chan_change" onClick={this.hideMes.bind(this)}><i className="fa fa-angle-up"/>收起</div>
                                            <ul className="channel_02"/>

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
AssignSessionRecord.contextTypes = {
    router: PropTypes.object,
};
AssignSessionRecord = Form.create()(AssignSessionRecord);
AssignSessionRecord.PropTypes = {
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
AssignSessionRecord.defaultProps = {
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
const mapStateToProps = AssignSessionRecord => AssignSessionRecord;
module.exports = connect(mapStateToProps)(AssignSessionRecord);