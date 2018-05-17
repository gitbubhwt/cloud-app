/*
    自动消息
*/
import React, { Component, } from "react";
import PropTypes from 'prop-types';
import { connect, } from "react-redux";
import { Form, Card, Button, Input, Row, Col, Transfer, Switch, InputNumber, notification, } from 'antd';
const { TextArea } = Input;
import { SessionAutoMessageGet, SessionAutoMessageSet, } from 'Actions/ConfigAction';
import WaterMark from 'Static/js/watermark';
import publicFunction from '../PublicFunction';
const FormItem = Form.Item;
export default class SessionAutoMessage extends Component{
    constructor(props, context) {
        super(props, context);
        this.state = {

        }
        this.sessionAutoData={
            is_enable_welcome:"0",
            is_enable_agent_no_response_setting:"0",
            is_enable_client_no_response_setting:"0",
            is_enable_timeout_close_session:"0",
            max_num_queue:"30",
            is_enable_auto_revert_message:"1",
        };
        this.isRender=false;
    }
    componentWillMount(){
        this.waterMarkText=localStorage.getItem("watermark");
        this.props.dispatch(SessionAutoMessageGet())
    }
    componentDidUpdate(){
        if(this.waterMarkText){
            WaterMark.addWaterMark(this.waterMarkText,"#fff");
        }
    }
    //设置的提示语
    textAreaChange(type){
        const self=this;
        let value;
        setTimeout(function () {
            switch (type){
                //企业欢迎语
                case "welcome_text":
                    value=self.props.form.getFieldValue("welcome_text");
                    const welcome_text=publicFunction.cutStr(value,400);
                    self.props.form.setFieldsValue({welcome_text});
                    break;
                //坐席无应答提示语
                case "agent_no_response_text":
                    value=self.props.form.getFieldValue("agent_no_response_text");
                    const agent_no_response_text=publicFunction.cutStr(value,400);
                    self.props.form.setFieldsValue({agent_no_response_text});
                    break;
                //超时结束会话提示语
                case "timeout_text":
                    value=self.props.form.getFieldValue("timeout_text");
                    const timeout_text=publicFunction.cutStr(value,400);
                    self.props.form.setFieldsValue({timeout_text});
                    break;
                //客户无应答提示语
                case "client_no_response_text":
                    value=self.props.form.getFieldValue("client_no_response_text");
                    const client_no_response_text=publicFunction.cutStr(value,400);
                    self.props.form.setFieldsValue({client_no_response_text});
                    break;
                //排队提示语
                case "queue_text":
                    value=self.props.form.getFieldValue("queue_text");
                    const queue_text=publicFunction.cutStr(value,50);
                    self.props.form.setFieldsValue({queue_text});
                    break;
                //留言提示语
                case "message_text":
                    value=self.props.form.getFieldValue("message_text");
                    const message_text=publicFunction.cutStr(value,50);
                    self.props.form.setFieldsValue({message_text});
                    break;
            }
        }, 100)


    }
    //保存
    saveSessionAutoMessage(){
        const self=this;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if(values.is_enable_agent_no_response_setting===undefined){
                    values.is_enable_agent_no_response_setting=this.sessionAutoData.is_enable_agent_no_response_setting
                }
                if(values.is_enable_client_no_response_setting===undefined){
                    values.is_enable_client_no_response_setting=this.sessionAutoData.is_enable_client_no_response_setting
                }
                if(values.is_enable_timeout_close_session===undefined){
                    values.is_enable_timeout_close_session=this.sessionAutoData.is_enable_timeout_close_session
                }
                if(values.is_enable_welcome===undefined){
                    values.is_enable_welcome=this.sessionAutoData.is_enable_welcome
                }
                if(values.is_enable_auto_revert_message===undefined){
                    values.is_enable_auto_revert_message=this.sessionAutoData.is_enable_auto_revert_message
                }
                values.is_enable_agent_no_response_setting=Number(values.is_enable_agent_no_response_setting);
                values.is_enable_client_no_response_setting=Number(values.is_enable_client_no_response_setting);
                values.is_enable_timeout_close_session=Number(values.is_enable_timeout_close_session);
                values.is_enable_welcome=Number(values.is_enable_welcome);
                values.is_enable_auto_revert_message=Number(values.is_enable_auto_revert_message);
                self.props.dispatch(SessionAutoMessageSet(values));
            }});
    }
    render(){
        // console.log("render");
        const formItemLayout = {
            labelCol: {span: 20},
            wrapperCol: {span: 4},
        };
        const formItemLayoutTime = {
            labelCol: {span: 10},
            wrapperCol: {span: 14},
        };
        const formItemLayoutText={
            labelCol: {span: 5},
            wrapperCol: {span: 19},
        }
        const { getFieldDecorator,} = this.props.form;
        if(this.props.StaffReducer&&this.props.StaffReducer.sessionAutoData){
            if(this.props.StaffReducer.sessionAutoData.length>0){
                this.sessionAutoData=this.props.StaffReducer.sessionAutoData[0];
            }
            this.isRender=true;
        }
        return(
            <div>
            {this.isRender ? <div className="configSearch">
                    <Card style={{"paddingTop":"30px"}}>
                        <Form>
                            <Row>
                                <Col span={3}>
                                    <FormItem label="企业欢迎语" {...formItemLayout}>
                                        {getFieldDecorator('is_enable_welcome')(
                                            <Switch size="small" defaultChecked={this.sessionAutoData.is_enable_welcome=="1"?true:false}/>
                                        )}
                                    </FormItem>

                                </Col>
                                <Col span={1} />
                                <Col span={20} className="messageColor messageLineHeight">
                                    每段会话开始时，系统自动向客户发送一条消息
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Row>
                                        <Col span={5} />
                                        <Col span={19}>
                                            <FormItem label="" >
                                                {getFieldDecorator('welcome_text',{
                                                    initialValue:this.sessionAutoData.welcome_text,
                                                    rules: [{
                                                        required: true, message: '消息内容不得为空',
                                                    }],
                                                    onChange:this.textAreaChange.bind(this,"welcome_text"),
                                                })(
                                                    <TextArea rows={4} />
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={3}>
                                    <FormItem label="坐席无应答消息" {...formItemLayout}>
                                        {getFieldDecorator('is_enable_agent_no_response_setting')(
                                            <Switch size="small" defaultChecked={this.sessionAutoData.is_enable_agent_no_response_setting=="1"?true:false}/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={1} />
                                <Col span={20}  className="messageColor messageLineHeight">
                                    坐席一段时间没有响应客户的消息，系统自动向客户发送一段消息
                                </Col>
                            </Row>
                            <Row>
                                <Col span={6}>
                                    <FormItem label="坐席无应答时间" {...formItemLayoutTime}>
                                        {getFieldDecorator('agent_no_response_secs',{
                                            initialValue:this.sessionAutoData.agent_no_response_secs,
                                        })(
                                            <InputNumber min={0} max={18000}/>
                                        )}
                                        <span className="ant-form-text"> 秒</span>
                                    </FormItem>
                                </Col>

                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Row>
                                        <Col span={5} />
                                        <Col span={19}>
                                            <FormItem label="" >
                                                {getFieldDecorator('agent_no_response_text',{
                                                    initialValue:this.sessionAutoData.agent_no_response_text,
                                                    rules: [{
                                                        required: true, message: '消息内容不得为空',
                                                    }],
                                                    onChange:this.textAreaChange.bind(this,"agent_no_response_text"),
                                                })(
                                                    <TextArea rows={4} />

                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={3}>
                                    <FormItem label="客户无应答消息" {...formItemLayout}>
                                        {getFieldDecorator('is_enable_client_no_response_setting')(
                                            <Switch size="small" defaultChecked={this.sessionAutoData.is_enable_client_no_response_setting=="1"?true:false}/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={1} />
                                <Col span={20} className="messageColor messageLineHeight">
                                    客户一段时间没有响应坐席的消息，系统自动向客户发送一段消息
                                </Col>
                            </Row>
                            <Row>
                                <Col span={6}>
                                    <FormItem label="客户无应答时间" {...formItemLayoutTime}>
                                        {getFieldDecorator('client_no_response_secs',{
                                            initialValue:this.sessionAutoData.client_no_response_secs,
                                        })(
                                            <InputNumber min={0} max={18000}/>
                                        )}
                                        <span className="ant-form-text"> 秒</span>
                                    </FormItem>
                                </Col>

                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Row>
                                        <Col span={5} />
                                        <Col span={19}>
                                            <FormItem label="" >
                                                {getFieldDecorator('client_no_response_text',{
                                                    initialValue:this.sessionAutoData.client_no_response_text,
                                                    rules: [{
                                                        required: true, message: '消息内容不得为空',
                                                    }],
                                                    onChange:this.textAreaChange.bind(this,"client_no_response_text"),
                                                })(
                                                    <TextArea rows={4} />
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={3}>
                                    <FormItem label="超时结束会话" {...formItemLayout}>
                                        {getFieldDecorator('is_enable_timeout_close_session')(
                                            <Switch size="small" defaultChecked={this.sessionAutoData.is_enable_timeout_close_session=="1"?true:false}/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={1}/>
                                <Col span={20} className="messageColor messageLineHeight">
                                    当会话在一段时间内没有新消息产生后，系统自动向客户发送一段消息，并结束当前的会话
                                </Col>
                            </Row>
                            <Row>
                                <Col span={6}>
                                    <FormItem label="超时时间" {...formItemLayoutTime}>
                                        {getFieldDecorator('timeout_secs',{
                                            initialValue:this.sessionAutoData.timeout_secs,
                                        })(
                                            <InputNumber min={0} max={18000}/>
                                        )}
                                        <span className="ant-form-text"> 秒</span>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Row>
                                        <Col span={5}/>
                                        <Col span={19}>
                                            <FormItem label="" >
                                                {getFieldDecorator('timeout_text',{
                                                    initialValue:this.sessionAutoData.timeout_text,
                                                    rules: [{
                                                        required: true, message: '消息内容不得为空',
                                                    }],
                                                    onChange:this.textAreaChange.bind(this,"timeout_text"),
                                                })(

                                                    <TextArea rows={4} />
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={3}>
                                    <FormItem label="排队自动转留言" {...formItemLayout}>
                                        {getFieldDecorator('is_enable_auto_revert_message')(
                                            <Switch size="small" defaultChecked={this.sessionAutoData.is_enable_auto_revert_message=="1"?true:false}/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={1}/>
                                <Col span={20} className="messageColor messageLineHeight">
                                    当排队人数达到上限值后，新增访客会自动进入留言
                                </Col>
                            </Row>
                            <Row>
                                <Col span={6}>
                                    <FormItem label="排队人数上限" {...formItemLayoutTime}>
                                        {getFieldDecorator('max_num_queue',{
                                            initialValue:this.sessionAutoData.max_num_queue,
                                        })(
                                            <InputNumber formatter={value => {const val=parseInt(`${value}`);
                                            // console.log("value",value);
                                            // console.log("val",val)
                                            if (value===""){
                                                return value;
                                            }else if(val.toString()==="NaN"||val.toString()==0){
                                                return 1;
                                            }else{
                                                return val;
                                            }}} min={1}/>
                                        )}
                                        <span className="ant-form-text"> 人</span>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row style={{"marginTop": "24px"}}>
                                <Col span={12}>
                                    <FormItem label="排队提示语" {...formItemLayoutText} className="messageColor" style={{"marginBottom":"0"}}>
                                        {getFieldDecorator('queue_text',{
                                            initialValue:this.sessionAutoData.queue_text,
                                            rules: [{
                                                required: true, message: '消息内容不得为空',
                                            }],
                                            onChange:this.textAreaChange.bind(this,"queue_text"),
                                        })(
                                            <TextArea rows={4} />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row style={{"lineHeight":"20px"}}>
                                <Col span={20}>
                                    <Row>
                                    <Col span={3} />
                                    <Col span={21}  className="messageColor">
                                        当坐席超过接待上线后，客户进入排队状态，可以看到设置的提示语，并显示排队人数
                                    </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row style={{"marginTop": "24px"}}>
                                <Col span={12}>
                                    <FormItem label="留言提示语" {...formItemLayoutText}  className="messageColor" style={{"marginBottom":"0"}}>
                                        {getFieldDecorator('message_text',{
                                            initialValue:this.sessionAutoData.message_text,
                                            rules: [{
                                                required: true, message: '消息内容不得为空',
                                            }],
                                            onChange:this.textAreaChange.bind(this,"message_text"),
                                        })(
                                            <TextArea rows={4} />
                                        )}

                                    </FormItem>
                                </Col>
                            </Row>
                            <Row style={{"lineHeight":"20px"}}>
                                <Col span={20}>
                                    <Row>
                                        <Col span={3} />
                                        <Col span={21} className="messageColor">
                                            当人工坐席不在线或非工作时间时，系统自动推送留言提示语，允许客户留言
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={2}/>
                                <Col span={10}><Button type="primary" onClick={this.saveSessionAutoMessage.bind(this)}>{/*<i className="fa fa-check" ></i>*/}&nbsp;保存</Button></Col>
                            </Row>
                        </Form>
                    </Card>
                </div>:<div className="configSearch"><Card style={{"paddingTop":"30px"}}/></div>}
            </div>

        )
    }
}
SessionAutoMessage.contextTypes = {
    router: PropTypes.object,
};
SessionAutoMessage = Form.create()(SessionAutoMessage);
const mapStateToProps = SessionAutoMessage => SessionAutoMessage;
module.exports = connect(mapStateToProps)(SessionAutoMessage);
