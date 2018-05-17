/*
    网站接入-添加
*/
import React, { Component, } from "react";
import PropTypes from 'prop-types';
import { connect, } from "react-redux";
import { Form, Card, Button, Input, Row, Col, Icon, Upload, Radio, notification } from 'antd';
import { WebChannelSet, } from 'Actions/ConfigAction';
import WaterMark from 'Static/js/watermark';
import publicFunction from '../PublicFunction';
import 'Static/css/webConfit.css';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const { TextArea } = Input;
export default class TrenchWebsite extends Component{
    constructor(props, context) {
        super(props, context);
        this.fileList=[];
        this.state={
            fileList:[],
            changeData:true,
        };
        this.short_name="";
        this.color="#f9514a";
        this.button_name="在线咨询";
        this.button_icon="fa-comment";
        this.button_style=1;
        this.btnColor="#f9514a";
        this.logoShape=1;
        this.borderRadius="50%";
    }
    //保存
    saveWebsite(){
        const self=this;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.logo={};
                if(this.fileList.length==0){
                    notification.warning({
                        'message': '提示',
                        'description': '请上传logo图片！'
                    });
                    return false;
                }
                if(this.fileList.length>0){
                    // console.log("this.fileList[0].response",this.fileList[0].response)
                    if(this.fileList[0].response==undefined){
                        notification.warning({
                            'message': '提示',
                            'description': '请等待logo上传完成再点击保存'
                        });
                        return false;
                    }else{
                        // console.log("this.fileList[0].response",this.fileList[0].response)
                        values.logo={
                            name:this.fileList[0].name,
                            status:this.fileList[0].status,
                            uid:this.fileList[0].uid,
                            url:"http://ektfiles.icsoc.net"+this.fileList[0].response.data
                        }
                    }

                }
            // if(values.button_name.length>8){
            //     notification.warning({
            //         'message': '提示',
            //         'description': '按钮内容不能超过8个字'
            //     });
            //     return false;
            // }
            let button_img;
            if(values.button_icon=="fa-comment"){
                button_img="http://ekt-platform-dev.icsoc.net/bundles/ektim/img/icon/IM_fa-comment.png"
            }else if(values.button_icon=="fa-comment-o"){
                button_img="http://ekt-platform-dev.icsoc.net/bundles/ektim/img/icon/IM_fa-comment-o.png"
            }else if(values.button_icon=="fa-commenting"){
                button_img="http://ekt-platform-dev.icsoc.net/bundles/ektim/img/icon/IM_fa-commenting.png"
            }else if(values.button_icon=="fa-commenting-o"){
                button_img="http://ekt-platform-dev.icsoc.net/bundles/ektim/img/icon/IM_fa-commenting-o.png"
            }else if(values.button_icon=="fa-comments"){
                button_img="http://ekt-platform-dev.icsoc.net/bundles/ektim/img/icon/IM_fa-comments.png"
            }else if(values.button_icon=="fa-comments-o"){
                button_img="http://ekt-platform-dev.icsoc.net/bundles/ektim/img/icon/IM_fa-comments-o.png"
            }
            let params={
                source_name:values.source_name,
                short_name:values.short_name,
                channel_style:JSON.stringify({
                    short_name: values.short_name,
                    logo: values.logo,
                    color: values.color,
                    button_style: values.button_style,
                    button_icon: values.button_icon,
                    button_name: values.button_name,
                    button_img,
                    logo_shape:values.logo_shape,
                })
            }
            // console.log("params",params);
            let router = this.context.router;
            self.props.dispatch(WebChannelSet(params,router))
        }});
    }
    onChange(info) {
        let fileList=info.fileList;
        if(fileList.length>1){
            notification.warning({
                'message': '提示',
                'description': '只能上传一张图片'
            });
            fileList.splice(1,1)
        }
        if(fileList.length==0){
            this.fileList=[];

        }else{
            let lastIndex=fileList.length-1;
            let length=fileList[lastIndex].name.length-4;
            if(fileList[lastIndex].name.lastIndexOf(".gif")==length||fileList[lastIndex].name.lastIndexOf(".jpg")==length||
                fileList[lastIndex].name.lastIndexOf(".jpeg")==length||
                fileList[lastIndex].name.lastIndexOf(".png")==length||
                fileList[lastIndex].name.lastIndexOf(".GIF")==length||
                fileList[lastIndex].name.lastIndexOf(".JPG")==length||
                fileList[lastIndex].name.lastIndexOf(".PNG")==length){
                this.fileList=info.fileList;
                if(this.fileList[0].response&&this.fileList[0].response.data){
                    this.logo="http://ektfiles.icsoc.net"+this.fileList[0].response.data;
                }
            }else{
                notification.warning({
                    'message': '提示',
                    'description': '请选择图片类型为gif|jpg|jpeg|png|GIF|JPG|PNG'
                });
            }
        }
    }
    //实时预览函数
    sourceNameChange(e){
        // console.log(e.target.value);
        //限制来源名称字数
        let self = this;
        let value;
        setTimeout(function(){
            value = self.props.form.getFieldsValue().source_name;
            let source_name = publicFunction.cutStr(value,50);
            self.props.form.setFieldsValue({source_name:source_name});
        },100)
        this.state.changeData?this.setState({changeData:false}):this.setState({changeData:true});
    }
    //企业简称
    shortNameChange(e){
        // console.log(e.target.value);
        this.short_name=e.target.value;
        //限制企业简称字数
        let self = this;
        let value;
        setTimeout(function(){
            value = self.props.form.getFieldsValue().short_name;
            let short_name = publicFunction.cutStr(value,16);
            self.props.form.setFieldsValue({short_name:short_name});
        },100)
        this.state.changeData?this.setState({changeData:false}):this.setState({changeData:true})
    }
    //颜色选择
    colorChange(e){
        // console.log(e.target.value);
        this.color=e.target.value;
        this.btnColor=e.target.value;
        //this.setState({btnColor:e.target.value});
        this.state.changeData?this.setState({changeData:false}):this.setState({changeData:true})
    }
    //按钮样式
    btnStyleChange(e){
        // console.log(e.target.value);
        this.button_style=e.target.value;
        this.state.changeData?this.setState({changeData:false}):this.setState({changeData:true})
    }
    //按钮图标
    btnIconChange(e){
        // console.log(e.target.value);
        this.button_icon=e.target.value;
        this.state.changeData?this.setState({changeData:false}):this.setState({changeData:true})
    }
    //按钮内容
    btnContentChange(e){
        // console.log(e.target.value);
        this.button_name=publicFunction.cutStr(e.target.value,16);
        //限制按钮内容字数
        let self = this;
        let value;
        setTimeout(function(){
            value = self.props.form.getFieldsValue().button_name;
            let button_name = publicFunction.cutStr(value,16);
            self.props.form.setFieldsValue({button_name:button_name});
        },100)
        this.state.changeData?this.setState({changeData:false}):this.setState({changeData:true})
    }
    //复制代码
    copyUrl2(num){
        let Url2;
        if(num==1){
            Url2=document.getElementById("biao1");
        }else if(num==2){
            Url2=document.getElementById("biao2");
        }/*else if(num==3){
            Url2=document.getElementById("biao3");
        }else{
            Url2=document.getElementById("biao4");
        }*/
        Url2.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
    }
    componentWillMount() {
        this.waterMarkText=localStorage.getItem("watermark");
    }
    componentDidMount(){
        if(this.waterMarkText){
            WaterMark.addWaterMark(this.waterMarkText,"#fff");
        }
    }
    buttonColorChange(e){
        this.btnColor=e.target.value;
        this.color=e.target.value;
        this.props.form.setFieldsValue({
            color:e.target.value
        });
        this.state.changeData?this.setState({changeData:false}):this.setState({changeData:true})
        //this.setState({btnColor:e.target.value});
    }
    logoShapeChange(e){
        this.logoShape=e.target.value;
        if(this.logoShape==1){
            this.borderRadius="50%";
        }else{
            this.borderRadius=0;
        }

        this.state.changeData?this.setState({changeData:false}):this.setState({changeData:true})
    }
    render(){
        const formItemLayout={
            labelCol: {span: 4},
            wrapperCol: {span: 16},};
        const formItemLayoutConent={
            labelCol: {span: 8},
            wrapperCol: {span: 16},};
        /*const formItemLayoutColor={
            labelCol: {span: 4},
            wrapperCol: {span: 16},};
        const formItemLayoutLogo={
            labelCol: {span: 6},
            wrapperCol: {span: 18},};*/
        const { getFieldDecorator,} = this.props.form;
        const props = {
            name: 'file',
            action: '/ticket/v1/ticket/upload/files',
            headers: {
                authorization: 'authorization-text',
            },
            listType: 'picture',
            onChange: this.onChange.bind(this),
        };
        //icon图标
        let iconDom="";
        if(this.button_icon=="fa-comment"){
            iconDom=<i className="font icon-line2" aria-hidden="true"></i>
        }else if(this.button_icon=="fa-comment-o"){
            iconDom=<i className="font icon-fill2" aria-hidden="true"></i>
        }else if(this.button_icon=="fa-commenting"){
            iconDom=<i className="font icon-line" aria-hidden="true"></i>
        }else if(this.button_icon=="fa-commenting-o"){
            iconDom=<i className="font icon-fill" aria-hidden="true"></i>
        }else if(this.button_icon=="fa-comments"){
            iconDom=<i className="font icon-line3" aria-hidden="true"></i>
        }else if(this.button_icon=="fa-comments-o"){
            iconDom=<i className="font icon-fill3" aria-hidden="true"></i>
        }
        //按钮样式
        let butDom="";
        if(this.button_style==1){
            butDom=<div className="bottom_style bd_color" style={{"background":this.color}}>
                <div className="bottom_word" style={{"paddingLeft":'0'}}>{iconDom}{this.button_name}</div>
            </div>
        }
        if(this.button_style==2){
            butDom=<div className="side_style bd_color"  style={{"background":this.color}}>
                <div className="bottom_word">{iconDom}</div>
                <div className="side_word">{this.button_name}</div>
            </div>
        }
        if(this.button_style==3){
            butDom=<div className="round_style bd_color"  style={{"background":this.color}}>{iconDom}</div>
        }
        if(this.btnColor=="#f9514a"){
            this.colorDom=<RadioGroup className="colorRadio">
                <RadioButton value="#f9514a" style={{"background":"#f9514a"}}>√</RadioButton>
                <RadioButton value="#ff7c49" style={{"background":"#ff7c49"}}/>
                <RadioButton value="#ffcb15" style={{"background":"#ffcb15"}}/>
                <RadioButton value="#4d98fe" style={{"background":"#4d98fe"}}/>
                <RadioButton value="#1ac4a2" style={{"background":"#1ac4a2"}}/>
                <RadioButton value="#6d8899" style={{"background":"#6d8899"}}/>
            </RadioGroup>
        }else if(this.btnColor=="#ff7c49"){
            this.colorDom=<RadioGroup className="colorRadio">
                <RadioButton value="#f9514a" style={{"background":"#f9514a"}}/>
                <RadioButton value="#ff7c49" style={{"background":"#ff7c49"}}>√</RadioButton>
                <RadioButton value="#ffcb15" style={{"background":"#ffcb15"}}/>
                <RadioButton value="#4d98fe" style={{"background":"#4d98fe"}}/>
                <RadioButton value="#1ac4a2" style={{"background":"#1ac4a2"}}/>
                <RadioButton value="#6d8899" style={{"background":"#6d8899"}}/>
            </RadioGroup>
        }else if(this.btnColor=="#ffcb15"){
            this.colorDom=<RadioGroup className="colorRadio">
                <RadioButton value="#f9514a" style={{"background":"#f9514a"}}/>
                <RadioButton value="#ff7c49" style={{"background":"#ff7c49"}}/>
                <RadioButton value="#ffcb15" style={{"background":"#ffcb15"}}>√</RadioButton>
                <RadioButton value="#4d98fe" style={{"background":"#4d98fe"}}/>
                <RadioButton value="#1ac4a2" style={{"background":"#1ac4a2"}}/>
                <RadioButton value="#6d8899" style={{"background":"#6d8899"}}/>
            </RadioGroup>
        }else if(this.btnColor=="#4d98fe"){
            this.colorDom=<RadioGroup className="colorRadio">
                <RadioButton value="#f9514a" style={{"background":"#f9514a"}}/>
                <RadioButton value="#ff7c49" style={{"background":"#ff7c49"}}/>
                <RadioButton value="#ffcb15" style={{"background":"#ffcb15"}}/>
                <RadioButton value="#4d98fe" style={{"background":"#4d98fe"}}>√</RadioButton>
                <RadioButton value="#1ac4a2" style={{"background":"#1ac4a2"}}/>
                <RadioButton value="#6d8899" style={{"background":"#6d8899"}}/>
            </RadioGroup>
        }else if(this.btnColor=="#1ac4a2"){
            this.colorDom=<RadioGroup className="colorRadio">
                <RadioButton value="#f9514a" style={{"background":"#f9514a"}}/>
                <RadioButton value="#ff7c49" style={{"background":"#ff7c49"}}/>
                <RadioButton value="#ffcb15" style={{"background":"#ffcb15"}}/>
                <RadioButton value="#4d98fe" style={{"background":"#4d98fe"}}/>
                <RadioButton value="#1ac4a2" style={{"background":"#1ac4a2"}}>√</RadioButton>
                <RadioButton value="#6d8899" style={{"background":"#6d8899"}}/>
            </RadioGroup>
        }else if(this.btnColor=="#6d8899"){
            this.colorDom=<RadioGroup className="colorRadio">
                <RadioButton value="#f9514a" style={{"background":"#f9514a"}}/>
                <RadioButton value="#ff7c49" style={{"background":"#ff7c49"}}/>
                <RadioButton value="#ffcb15" style={{"background":"#ffcb15"}}/>
                <RadioButton value="#4d98fe" style={{"background":"#4d98fe"}}/>
                <RadioButton value="#1ac4a2" style={{"background":"#1ac4a2"}}/>
                <RadioButton value="#6d8899" style={{"background":"#6d8899"}}>√</RadioButton>
            </RadioGroup>
        }else{
            this.colorDom=<RadioGroup className="colorRadio">
                <RadioButton value="#f9514a" style={{"background":"#f9514a"}}/>
                <RadioButton value="#ff7c49" style={{"background":"#ff7c49"}}/>
                <RadioButton value="#ffcb15" style={{"background":"#ffcb15"}}/>
                <RadioButton value="#4d98fe" style={{"background":"#4d98fe"}}/>
                <RadioButton value="#1ac4a2" style={{"background":"#1ac4a2"}}/>
                <RadioButton value="#6d8899" style={{"background":"#6d8899"}}/>
            </RadioGroup>
        }
        return(
            <div className="configSearch">
                <Card title="页面样式设置" style={{"paddingTop":"30px"}}>
                    <Form>
                        <Row>
                            <Col span={12}>
                                <Row>
                                    <FormItem label="来源名称" {...formItemLayout}>
                                        {getFieldDecorator('source_name',{
                                            rules: [{
                                                required: true, message: '请输入来源名称',
                                            }],
                                            onChange:this.sourceNameChange.bind(this)
                                        })(
                                            <Input placeholder="请输入来源名称" />
                                        )}
                                    </FormItem>
                                    <FormItem label="企业简称" {...formItemLayout}>
                                        {getFieldDecorator('short_name',{
                                            rules: [{
                                                required: true, message: '请输入企业简称',
                                            }],
                                            onChange:this.shortNameChange.bind(this)
                                        })(
                                            <TextArea rows={4} placeholder="请输入企业简称" />
                                        )}
                                    </FormItem>
                                    <Row>
                                        <Col span={12}>
                                            <FormItem label="企业logo" {...formItemLayoutConent}>
                                                {getFieldDecorator('logo')(
                                                    <Upload {...props} fileList={this.fileList}>
                                                        <Button>
                                                            <Icon type="upload" /> 上传图片
                                                        </Button>
                                                    </Upload>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={12} style={{"lineHeight":"31px"}}>
                                            {/*<FormItem label="按钮样式" {...formItemLayoutLogo}>*/}
                                                {getFieldDecorator('logo_shape',{
                                                    initialValue:this.logoShape,
                                                    onChange:this.logoShapeChange.bind(this)
                                                })(
                                                    <RadioGroup>
                                                        <Radio value={1}>圆形LOGO</Radio>
                                                        <Radio value={2}>方形LOGO</Radio>
                                                    </RadioGroup>
                                                )}
                                            {/*</FormItem>*/}
                                        </Col>
                                    </Row>
                                        <Row>
                                            <Col span={4} className="ant-form-item-label"><label>颜色选择</label></Col>
                                            <Col span={15}>
                                                <FormItem>
                                                    {getFieldDecorator('buttonColor',{
                                                        value:this.btnColor,
                                                        onChange:this.buttonColorChange.bind(this)
                                                    })(
                                                        this.colorDom
                                                    )}
                                                </FormItem>
                                            </Col>
                                            <Col span={5}>
                                                <FormItem>
                                                    {getFieldDecorator('color',{
                                                        //initialValue:"#f9514a",
                                                        initialValue:this.color,
                                                        onChange:this.colorChange.bind(this)
                                                    })(
                                                        <Input style={{"width":"50px"}} type="color"/>
                                                    )}
                                                </FormItem>
                                            </Col>
                                        </Row>
                                    <FormItem label="按钮样式" {...formItemLayout}>
                                        {getFieldDecorator('button_style',{
                                            initialValue:1,
                                            onChange:this.btnStyleChange.bind(this)
                                        })(
                                            <RadioGroup>
                                                <Radio value={1}>底边按钮</Radio>
                                                <Radio value={2}>侧边按钮</Radio>
                                                <Radio value={3}>圆形按钮</Radio>
                                            </RadioGroup>
                                        )}
                                    </FormItem>
                                    <FormItem label="按钮图标" {...formItemLayout}>
                                        {getFieldDecorator('button_icon',{
                                            initialValue:"fa-comment",
                                            onChange:this.btnIconChange.bind(this)
                                        })(
                                            <RadioGroup >
                                                <RadioButton value="fa-comment"><i className="font icon-line2" aria-hidden="true"/></RadioButton>
                                                <RadioButton value="fa-comment-o"><i className="font icon-fill2" aria-hidden="true"/></RadioButton>
                                                <RadioButton value="fa-commenting"><i className="font icon-line" aria-hidden="true"/></RadioButton>
                                                <RadioButton value="fa-commenting-o"><i className="font icon-fill" aria-hidden="true"/></RadioButton>
                                                <RadioButton value="fa-comments"><i className="font icon-line3" aria-hidden="true"/></RadioButton>
                                                <RadioButton value="fa-comments-o"><i className="font icon-fill3" aria-hidden="true"/></RadioButton>
                                            </RadioGroup>
                                        )}
                                    </FormItem>
                                    <Row>
                                        <Col span={12}>
                                            <FormItem label="按钮内容" {...formItemLayoutConent}>
                                                {getFieldDecorator('button_name',{
                                                    initialValue:"在线咨询",
                                                    rules: [{
                                                        required: true, message: '请输入按钮内容',
                                                    }],
                                                    onChange:this.btnContentChange.bind(this)
                                                })(
                                                    <Input placeholder="请输入按钮内容" />
                                                )}
                                            </FormItem>
                                        </Col>
                                    <Col span={12} style={{"lineHeight":"28px"}}>&nbsp;&nbsp;不超过8个汉字</Col>
                                    </Row>
                                </Row>
                                <Row>
                                    <Col span={2} />
                                    <Col span={10}><Button type="primary" onClick={this.saveWebsite.bind(this)}>&nbsp;保存</Button></Col>
                                </Row>
                            </Col>
                            <Col span={12} style={{"background":"#eee","height":"550px"}}>
                                <Row className="webSite">
                                    <div className="userWrap">
                                        <div>
                                            {butDom}
                                        </div>
                                        <Col span={2} />
                                        <Col span={16}>
                                            <div className="usercontent">
                                                <div className="chatbox">
                                                    <div className="chatcon">
                                                        <div className="userchatcon_title bd_color" style={{"background":this.color}}>
                                                            <div className="userchatcon_info">
                                                                {this.logo?<img className="img" style={{"borderRadius":this.borderRadius}} src={this.logo} />:<div/>}
                                                                <div className="nickname">{this.short_name}</div>
                                                            </div>
                                                            <div className='chatcon_operate'>
                                                                <img className='chatcon_voice' src='http://ekt-platform-dev.icsoc.net/bundles/ektim/img/config/voiceopen.png' title='关闭提示音'/>
                                                                <img className='chatcon_exit' src='http://ekt-platform-dev.icsoc.net/bundles/ektim/img/config/close.png' title='最小化'/>
                                                            </div>
                                                        </div>
                                                        <div className="chatmain"></div>
                                                    </div>
                                                    <div className="usersendcon">
                                                        <div className="usersend_titlt">
                                                            <a><i className="fa fa-smile-o iconfont icon-emoji" aria-hidden="true"> </i></a>
                                                            <a><i className="fa fa-folder-o iconfont icon-tupian" aria-hidden="true"> </i></a>
                                                            <a><i className="fa fa-folder-o iconfont icon-wenjian1" aria-hidden="true"> </i></a>
                                                        </div>
                                                        <div className="user_send_content">
                                                            <textarea className="textarea" placeholder="请输入消息内容..."></textarea>
                                                            <button className="send bd_color" style={{"background":this.color}}>发送</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col span={6} />
                                    </div>
                                </Row>
                            </Col>
                        </Row>
                    </Form>
                </Card>
                <Card title="在网站中嵌入代码">
                    <Row>
                        <Col span={22}>保存设置后，请将以下代码添加到你网站的 HTML 源代码中，放在body结束标签之前，保存并发布网站
                        </Col>
                    </Row>
                    {/*<Row className="copyLine">http协议代码块</Row>*/}
                    <Row>
                        <Col span={15} style={{"position":"relative"}}>
                        <TextArea rows={2} id="biao1" className="text_input"/><Button onClick={this.copyUrl2.bind(this,1)} className="copy">复制</Button>
                        </Col>
                    </Row>
                    {/*<Row className="copyLine">https协议代码块</Row>
                    <Row>
                        <Col span={15} style={{"position":"relative"}}>
                            <TextArea rows={2} id="biao3" /><Button onClick={this.copyUrl2.bind(this,3)} className="copy">复制</Button>
                        </Col>
                    </Row>*/}
                    <Row>
                        <Col span={22}>或直接使用以下链接</Col>
                    </Row>
                    {/*<Row className="copyLine">http协议代码块</Row>*/}
                    <Row>
                        <Col span={15} style={{"position":"relative"}}>
                            <TextArea rows={2} id="biao2" className="text_input"/><Button onClick={this.copyUrl2.bind(this,2)} className="copy">复制</Button>
                        </Col>
                    </Row>
                   {/* <Row className="copyLine">https协议代码块</Row>
                    <Row>
                        <Col span={15} style={{"position":"relative"}}>
                            <TextArea rows={2} id="biao4" /><Button onClick={this.copyUrl2.bind(this,4)} className="copy">复制</Button>
                        </Col>
                    </Row>*/}
                    <Row>
                        <Col span={22}>自定义代码嵌入</Col>
                    </Row>
                    <Row style={{"lineHeight":"30px"}}>
                        <Col span={22}>请按照以下说明和示例编写代码，并嵌入到您网站的HTML源代码中，放在body结束标签之前，保存并发布网站</Col>
                    </Row>
                    <Row>1）自定义功能介绍</Row>
                    <p className="pIndent">为了方便您进行更高级的自定义配置，提高用户体验，您可以对三个可选择性参数：thirdId、username、avatar自由配置。 thirdId是用户的唯一标识，可以在坐席端永久的追溯用户的信息，不提供则默认只会临时生成一个有效期为一天的唯一标识；username是用户名，不提供则默认用户名为：{"匿名用户"+"+"+"数字"}；avatar是用户头像，不提供则使用默认头像。仍有疑问，可参考下面示例</p>
                    <Row>2）代码示例</Row>
                    <div className="divIndent">场景一：前端异步获取信息后，传递给im库</div>
                    <p className="pIndent">
                        {`<script type="text/javascript">`}
                        <span className="indent">{`function load(){`}</span>
                            <span className="indent" style={{"textIndent":"6em"}}>{`var obj = {`}</span>
                            <span className="indent" style={{"textIndent":"6em"}}>{`thirdId:'xxx',`}</span>
                            <span className="indent" style={{"textIndent":"6em"}}>{`username:'xxx',`}</span>
                            <span className="indent" style={{"textIndent":"6em"}}>{`avatar:'xxx.jpg',`}</span>
                            <span className="indent" style={{"textIndent":"6em"}}> }</span>
                            <span className="indent" style={{"textIndent":"6em"}}>{`window.IMPACK.init(obj);`}</span>
                            <span className="indent">}</span>
                            <span className="indent">{`</script>`}</span>
                    </p>
                    <p className="pIndent">{`<script src="http://chat.icsoc.net/js/lib/icsoc_chat_lib.js?channel_key=xxx " autoInit="false" onload="load()"></script>`}</p>
                    <div className="divIndent">场景二：后端模版直接渲染</div>
                    <p className="pIndent">{`<script src="http://chat.icsoc.net/js/lib/icsoc_chat_lib.js?channel_key=xxx &username=xxx&thirdId=xxx&avatar=xxx" ></script>`}</p>
                </Card>
            </div>
        )
    }
}
TrenchWebsite.contextTypes = {
    router: PropTypes.object,
};
TrenchWebsite = Form.create()(TrenchWebsite);
const mapStateToProps = TrenchWebsite => TrenchWebsite;
module.exports = connect(mapStateToProps)(TrenchWebsite);