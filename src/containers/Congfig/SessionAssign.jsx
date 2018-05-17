/*
    会话分配
*/
import React, { Component, } from "react";
import PropTypes from 'prop-types';
import { connect, } from "react-redux";
import { Form, Card, Button, Input, Row, Col, Transfer, Switch, InputNumber, Radio, } from 'antd';
const { TextArea } = Input;
import { SessionAssignGet, SessionAssignSet, } from 'Actions/ConfigAction';
import WaterMark from 'Static/js/watermark';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
export default class SessionAssign extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
        }
        this.isRender = false;
        this.sessionAssignData = {
            assign_strategy: "",
            is_enable_memory_assign: "0",
        };
    }
    componentWillMount() {
        this.waterMarkText = localStorage.getItem("watermark");
        this.props.dispatch(SessionAssignGet())
    }
    componentDidUpdate() {
        if (this.waterMarkText) {
            WaterMark.addWaterMark(this.waterMarkText, "#fff");
        }
    }
    saveSessionAssign() {
        const self = this;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (values.is_enable_memory_assign === undefined) {
                    values.is_enable_memory_assign = this.sessionAssignData.is_enable_memory_assign
                }
                values.is_enable_memory_assign = Number(values.is_enable_memory_assign);
                self.props.dispatch(SessionAssignSet(values));
            }
        });
    }
    render() {
        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 22 },
        };
        const { getFieldDecorator, } = this.props.form;
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };
        if (this.props.StaffReducer && this.props.StaffReducer.sessionAssignData) {
            if (this.props.StaffReducer.sessionAssignData.length > 0) {
                this.sessionAssignData = this.props.StaffReducer.sessionAssignData[0];
            }
            this.isRender = true;
        }
        return (
            <div className="configSearch">
                {this.isRender ? <Card style={{ "paddingTop": "30px" }}>
                    <Form>
                        <Row>
                            <FormItem label="分配策略" {...formItemLayout}>
                                {getFieldDecorator('assign_strategy', {
                                    initialValue: this.sessionAssignData.assign_strategy,
                                })(
                                    <RadioGroup >
                                        <Radio value="current_least_sessions" style={radioStyle}>当前会话数量最少优先<span className="marginFont"></span><span className="messageColor">当有新会话进来时，优先分配给当前会话数最少的的坐席</span></Radio>
                                        {/*<Radio disabled value="today_least_sessions" style={radioStyle}>当日会话数量最少优先<span className="marginFont"></span><span className="messageColor">当有新会话进来时，优先分配给当日会话数最少的坐席，维持各坐席接待量平衡</span></Radio>*/}
                                    </RadioGroup>
                                    )}
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem label="记忆分配" {...formItemLayout}>
                                {getFieldDecorator('is_enable_memory_assign')(
                                    <Switch size="small" defaultChecked={this.sessionAssignData.is_enable_memory_assign == "1" ? true : false} />
                                )}
                                <span className="messageColor"><span className="marginFont" />24h内，咨询过的用户，再次咨询时，优先分配给接待过的坐席</span>
                            </FormItem>
                        </Row>
                        <Row>
                            <Col span={2} />
                            <Col span={10}><Button type="primary" onClick={this.saveSessionAssign.bind(this)}>&nbsp;保存</Button></Col>
                        </Row>

                    </Form>
                </Card> : <Card />}

            </div>
        )
    }
}
SessionAssign.contextTypes = {
    router: PropTypes.object,
};
SessionAssign = Form.create()(SessionAssign);
const mapStateToProps = SessionAssign => SessionAssign;
module.exports = connect(mapStateToProps)(SessionAssign);
