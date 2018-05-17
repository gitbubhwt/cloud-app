/*
    会话路由 - 添加
*/
import React, { Component, } from "react";
import PropTypes from 'prop-types';
import { connect, } from "react-redux";
import {
    Form,
    Card,
    Button,
    Input,
    Row,
    Col,
    Transfer,
    Switch,
    InputNumber,
    Radio,
    Checkbox,
    TimePicker,
    DatePicker,
    Alert, Table, Popconfirm, Tabs, Select, notification,
} from 'antd';
const { TextArea } = Input;
const { MonthPicker, RangePicker } = DatePicker;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
import { SessionRouteGet, SessionRouteSet, StaffAdd, StaffGroup, } from 'Actions/ConfigAction';
import WaterMark from 'Static/js/watermark';
import publicFunction from '../PublicFunction';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
import moment from 'moment';
export default class SessionRouteAdd extends Component {
    constructor(props, context) {

        super(props, context);
        this.state = {
            timeDomChange: true,
        };
        this.webDisabled = false;
        this.wechatDisabled = false;
        this.WebChannelData = [];
        this.WechatData = [];
        this.WorkAllData = [];
        this.WebChannelDom = "";
        this.WechatDom = "";
        this.WorkAllDom = "";
        this.actionData = [];
        this.actionDom = "";
        this.actionName = 1;
        this.NavMenuData = [];
        this.actionNameData = [{ id: 1, action_name: "坐席组" }, { id: 2, action_name: "坐席" }, { id: 3, action_name: "导航菜单" }];
    }

    componentWillMount() {
        this.waterMarkText = localStorage.getItem("watermark");
        this.props.dispatch(SessionRouteGet());

    }
    componentDidUpdate() {
        if (this.waterMarkText) {
            WaterMark.addWaterMark(this.waterMarkText, "#fff");
        }
    }
    cancel() {
        let router = this.context.router;
        router.push("/SessionRouteList");
    }
    save() {
        const self = this;
        this.props.form.validateFields((err, values) => {
            if (err) {
                if (err.assign_type || err.assign_type_id) {
                    notification.warning({
                        message: "提示",
                        description: "请选择分配类型！",
                    });
                    return false;
                }
            }
            if (!err) {
                if ((!values.web_channels || values.web_channels.length == 0) && (!values.webchat_channels || values.webchat_channels.length == 0)) {
                    notification.warning({
                        message: "提示",
                        description: "至少选择一个渠道设置！",
                    });
                    return false;
                }
                let parames = {
                    rid: 0,
                    route_name: values.route_name,
                    route_desc: values.route_desc,
                    assign_type: values.assign_type,
                }
                if (values.assign_type != 3) {
                    parames.assign_type_id = values.assign_type_id.substring(0, values.assign_type_id.indexOf("+"));
                    parames.assign_type_id_name = values.assign_type_id.substring(values.assign_type_id.indexOf("  ") + 2);

                    if (values.assign_type == 2) {
                        parames.assign_type_id_name = values.assign_type_id.substring(values.assign_type_id.indexOf("  ") + 2)
                    } else {
                        parames.assign_type_id_name = values.assign_type_id.substring(values.assign_type_id.indexOf("+") + 1)
                    }
                }

                let conditions = [];
                if (values.working_hours) {
                    let value = [];
                    let value_name = {};
                    let arr = values.working_hours.split("+");
                    value.push(Number(arr[0]));
                    value_name[arr[0]] = arr[1];
                    conditions.push({
                        field_name: "时间设置",
                        field: "working_hours",
                        value,
                        value_name,
                    })
                }
                if (values.web_channels && values.web_channels.length > 0) {
                    let value = [];
                    let value_name = {};
                    for (let i = 0; i < values.web_channels.length; i++) {
                        let arr = values.web_channels[i].split("+");
                        value.push(Number(arr[0]));
                        value_name[arr[0]] = arr[1];
                    }
                    conditions.push({
                        field_name: "网站渠道",
                        field: "web_channels",
                        value,
                        value_name,
                    })
                }


                if (values.webchat_channels && values.webchat_channels.length > 0) {
                    let value = [];
                    let value_name = {};
                    for (let i = 0; i < values.webchat_channels.length; i++) {
                        let arr = values.webchat_channels[i].split("+");
                        value.push(Number(arr[0]));
                        value_name[arr[0]] = arr[1];
                    }
                    conditions.push({
                        field_name: "微信渠道",
                        field: "webchat_channels",
                        value,
                        value_name,
                    })
                }
                parames.conditions = JSON.stringify(conditions);
                let router = self.context.router;
                self.props.dispatch(SessionRouteSet(parames, router));
            }
        });

    }
    staffCfun() {
        this.actionData = this.props.StaffReducer.staffAll;
        this.state.timeDomChange ? this.setState({ timeDomChange: false }) : this.setState({ timeDomChange: true })
    }
    staffGroupCfun() {
        this.actionData = this.props.StaffReducer.staffGroupAll;
        this.state.timeDomChange ? this.setState({ timeDomChange: false }) : this.setState({ timeDomChange: true })
    }
    //选择路由分配类型
    actionChange(e) {
        this.actionName = e;
        this.props.form.setFieldsValue({
            assign_type_id: "",
        });
        if (e == 2) {
            if (!this.props.StaffReducer.staffAll) {
                this.props.dispatch(StaffAdd(this.staffCfun.bind(this)));
            } else {
                this.actionData = this.props.StaffReducer.staffAll;
                this.state.timeDomChange ? this.setState({ timeDomChange: false }) : this.setState({ timeDomChange: true })
            }
        }
        if (e == 1) {
            if (!this.props.StaffReducer.staffGroupAll) {
                this.props.dispatch(StaffGroup(this.staffGroupCfun.bind(this)));
            } else {
                this.actionData = this.props.StaffReducer.staffGroupAll;
                this.state.timeDomChange ? this.setState({ timeDomChange: false }) : this.setState({ timeDomChange: true })
            }
        }
        if (e == 3) {
            this.actionData = this.NavMenuData;
            this.state.timeDomChange ? this.setState({ timeDomChange: false }) : this.setState({ timeDomChange: true })
        }
    }
      //限制路由名称和描述的字数
    textArearChange(type){
        let self = this;
        let value;
        setTimeout(function(){
           switch(type) {
                //路由名称
                case "route_name":
                   value=self.props.form.getFieldValue("route_name");
                    const route_name=publicFunction.cutStr(value,50);
                    self.props.form.setFieldsValue({route_name});
                    break; 
                //路由描述
                case "route_desc":
                   value=self.props.form.getFieldValue("route_desc");
                    const route_desc=publicFunction.cutStr(value,400);
                    self.props.form.setFieldsValue({route_desc});
                    break; 
           }
        },100)
        
    }
    //切换网页渠道
    webChannelChange(e) {
        if (e.length > 0) {
            this.wechatDisabled = true;
        } else {
            this.wechatDisabled = false;
        }
        this.state.timeDomChange ? this.setState({ timeDomChange: false }) : this.setState({ timeDomChange: true })
    }
     //切换微信渠道
    wechatChannelChange(e) {
        if (e.length > 0) {
            this.webDisabled = true;
        } else {
            this.webDisabled = false;
        }
        this.state.timeDomChange ? this.setState({ timeDomChange: false }) : this.setState({ timeDomChange: true })
    }
    render() {
        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 8 },
        };
        const { getFieldDecorator, } = this.props.form;
        //RouteData.assign_type路由分配类型 1--坐席组 ，2--坐席 3--导航菜单
        if (this.props.StaffReducer && this.props.StaffReducer.WebChannelData) {
            this.WebChannelData = this.props.StaffReducer.WebChannelData;//网站渠道
            this.WechatData = this.props.StaffReducer.WechatData;//微信渠道
            this.WorkAllData = this.props.StaffReducer.WorkAllData;//工作时间
            if (this.props.StaffReducer.NavMenuData.length > 0 && this.props.StaffReducer.NavMenuData[0].nav_menu_options != "") {
                this.NavMenuData = JSON.parse(this.props.StaffReducer.NavMenuData[0].nav_menu_options);
            }
        }
        this.WebChannelDom = this.WebChannelData.map(function (item, index) {
            return (<Row key={"Row" + index}><Checkbox value={item.id + "+" + item.source_name} key={index}>{item.source_name}</Checkbox></Row>)
        })
        this.WechatDom = this.WechatData.map(function (item, index) {
            return (<Row key={"Row" + index}><Checkbox value={item.id + "+" + item.nick_name} key={index}>{item.nick_name}</Checkbox></Row>)
        })
        this.WorkAllDom = this.WorkAllData.map(function (item, index) {
            return <Option value={item.id + "+" + item.wh_name} key={index}>{item.wh_name}</Option>
        })
        if (this.actionName == 2) {
            this.actionDom = this.actionData.map(function (item, index) {
                return <Option value={item.user_id + "+" + item.user_num + "  " + item.user_name} key={index}>{item.user_num + "  " + item.user_name}</Option>
            })
        } else if (this.actionName == 1) {
            this.actionDom = this.actionData.map(function (item, index) {
                return <Option value={item.id + "+" + item.group_name} key={index}>{item.group_name}</Option>
            })
        } else if (this.actionName == 3) {
            this.actionDom = this.actionData.map(function (item, index) {
                return <Option value={item.group_id + "+" + item.name} key={index}>{item.name}</Option>
            })
        }
        if (this.NavMenuData.length > 0) {
            this.actionNameData = [{ id: "1", action_name: "坐席组" }, { id: "2", action_name: "坐席" }, { id: "3", action_name: "导航菜单" }];
        } else {
            this.actionNameData = [{ id: "1", action_name: "坐席组" }, { id: "2", action_name: "坐席" }];
        }
        this.actionNameDom = this.actionNameData.map(function (item, index) {
            return <Option value={item.id} key={index}>{item.action_name}</Option>
        })
        return (
            <div className="configSearch">
                <Card style={{ "paddingTop": "30px" }}>
                    <Form>
                        <Row>
                            <FormItem label="名称" {...formItemLayout}>
                                {getFieldDecorator('route_name', {
                                    rules: [{
                                        required: true, message: '请输入名称',
                                    }],
                                    onChange:this.textArearChange.bind(this,'route_name'),
                                })(
                                    <Input placeholder="请输入名称" />
                                    )}
                            </FormItem>
                            <FormItem label="描述" {...formItemLayout}>
                                {getFieldDecorator('route_desc', {
                                    onChange:this.textArearChange.bind(this,'route_desc'),
                                })(
                                    <TextArea rows={4} placeholder="请输入描述" />
                                    )}
                            </FormItem>
                        </Row>
                    </Form>
                    <Row className="divider">
                        <Col span={3}>
                            <h3>设置会话满足条件</h3>
                        </Col>
                    </Row>
                    <Form>
                        <Row>
                            <FormItem label="时间设置" {...formItemLayout}>
                                {getFieldDecorator('working_hours', {
                                    rules: [{
                                        required: true, message: '请选择时间设置',
                                    }],
                                })(
                                    <Select placeholder="请选择时间设置" showSearch>
                                        {this.WorkAllDom}
                                    </Select>
                                    )}

                            </FormItem>
                            <Row>
                                <Col span={2} style={{ "color": "rgba(0, 0, 0, 0.85)" }}>渠道设置：</Col>
                                <Col span={8}>
                                    <Tabs type="card" className="RouterAdd">
                                        <TabPane tab="网页" key="1" disabled={this.webDisabled}>
                                            {getFieldDecorator('web_channels', {
                                            })(
                                                <Checkbox.Group onChange={this.webChannelChange.bind(this)}>
                                                    {this.WebChannelDom}
                                                </Checkbox.Group>)}
                                        </TabPane>
                                        <TabPane tab="微信" key="2" disabled={this.wechatDisabled}>
                                            {getFieldDecorator('webchat_channels', {
                                            })(
                                                <Checkbox.Group onChange={this.wechatChannelChange.bind(this)}>
                                                    {this.WechatDom}
                                                </Checkbox.Group>)}
                                        </TabPane>
                                    </Tabs>
                                </Col>
                            </Row>
                        </Row>
                    </Form>
                    <Row className="divider">
                        <Col span={3}>
                            <h3>执行以下分配动作</h3>
                        </Col>
                    </Row>
                    <Form>
                        <Row>
                            <Col span={5}>
                                {getFieldDecorator('assign_type', {
                                    rules: [{
                                        required: true, message: '请选择分配类型',
                                    }],
                                })(
                                    <Select onChange={this.actionChange.bind(this)} placeholder="请选择分配类型">
                                        {this.actionNameDom}
                                    </Select>)}
                            </Col>
                            <Col span={3} />
                            {this.actionName != 3 ? <Col span={5}>
                                {getFieldDecorator('assign_type_id', {
                                    rules: [{
                                        required: true, message: '请选择分配类型',
                                    }],
                                })(
                                    <Select placeholder="请选择分配类型" showSearch>
                                        {this.actionDom}
                                    </Select>)}
                            </Col> : <Col span={5}>{getFieldDecorator('assign_type_id', {
                            })(<Select placeholder="请选择分配类型" showSearch style={{ "visibility": "hidden" }}>
                                {this.actionDom}
                            </Select>)}</Col>}
                        </Row>
                    </Form>
                    <Row>
                        <Col span={1} />
                        <Col span={2}><Button type="primary" onClick={this.cancel.bind(this)}>&nbsp;取消</Button></Col>
                        <Col span={1} />
                        <Col span={10}><Button type="primary" onClick={this.save.bind(this)}>&nbsp;保存</Button></Col>
                    </Row>
                </Card>
            </div>
        )
    }
}
SessionRouteAdd.contextTypes = {
    router: PropTypes.object,
};
SessionRouteAdd = Form.create()(SessionRouteAdd);
const mapStateToProps = SessionRouteAdd => SessionRouteAdd;
module.exports = connect(mapStateToProps)(SessionRouteAdd);
