/*
    满意度评价
*/
import React, { Component, } from "react";
import PropTypes from 'prop-types';
import { connect, } from "react-redux";
import { Form, Card, Button, Input, Row, Col, Switch, Table, Popconfirm, notification, } from 'antd';
import { SessionEvaluateGet, SessionEvaluateSet, } from 'Actions/ConfigAction';
import WaterMark from 'Static/js/watermark';
import publicFunction from '../PublicFunction';
const FormItem = Form.Item;
const { TextArea } = Input;
export default class SessionEvaluate extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            timeDomChange: true,
            // visible: false,
            // textArearContent: 0,
        }
        this.isRender = false;
        this.index = 0;
        this.sessionEvaluateData = {};
        this.dataSource = [];
        this.firstData = true;
        this.dataSourceLength = 0;
        this.selectOption = [];
        this.selectedRowKeys = [0, 1];
        // this.textLength = 0;
        this.data = [{
            key: 0,
            grade: <i className="fa fa-star statisifyicon" aria-hidden="true" />,
            content: "",
        }, {
            key: 1,
            grade: <div>
                <i className="fa fa-star statisifyicon" aria-hidden="true" />
                <i className="fa fa-star statisifyicon" aria-hidden="true" />
            </div>,
            content: "",
        }, {
            key: 2,
            grade: <div>
                <i className="fa fa-star statisifyicon" aria-hidden="true" />
                <i className="fa fa-star statisifyicon" aria-hidden="true" />
                <i className="fa fa-star statisifyicon" aria-hidden="true" />
            </div>,
            content: "",
        }, {
            key: 3,
            grade: <div>
                <i className="fa fa-star statisifyicon" aria-hidden="true" />
                <i className="fa fa-star statisifyicon" aria-hidden="true" />
                <i className="fa fa-star statisifyicon" aria-hidden="true" />
                <i className="fa fa-star statisifyicon" aria-hidden="true" />
            </div>,
            content: "",
        }, {
            key: 4,
            grade: <div>
                <i className="fa fa-star statisifyicon" aria-hidden="true" />
                <i className="fa fa-star statisifyicon" aria-hidden="true" />
                <i className="fa fa-star statisifyicon" aria-hidden="true" />
                <i className="fa fa-star statisifyicon" aria-hidden="true" />
                <i className="fa fa-star statisifyicon" aria-hidden="true" />
            </div>,
            content: "",
        }, {
            key: 5,
            grade: <div>
                <i className="fa fa-star statisifyicon" aria-hidden="true" />
                <i className="fa fa-star statisifyicon" aria-hidden="true" />
                <i className="fa fa-star statisifyicon" aria-hidden="true" />
                <i className="fa fa-star statisifyicon" aria-hidden="true" />
                <i className="fa fa-star statisifyicon" aria-hidden="true" />
                <i className="fa fa-star statisifyicon" aria-hidden="true" />
            </div>,
            content: "",
        },];
        this.messageContent = {
            "0": [],
            "1": [],
            "2": ["不满意，非常失望", "一般，还行吧", "满意，点个赞"],
            "3": ["不满意，非常失望", "不满意，不开心", "满意，不错", "满意，点个赞"],
            "4": ["不满意，非常失望", "不满意，不开心", "一般，还行吧", "满意，不错", "满意，点个赞"],
            "5": ["不满意，非常失望", "不满意，不开心", "一般，还行吧", "满意，还不错", "满意，不错", "非常满意，点个赞"]
        };
    }
    componentWillMount() {
        this.waterMarkText = localStorage.getItem("watermark");
        this.props.dispatch(SessionEvaluateGet())
    }
    componentDidUpdate() {
        if (this.waterMarkText) {
            WaterMark.addWaterMark(this.waterMarkText, "#fff");
        }
    }
    optionName(index, e) {
        this.dataSource[index].option_name = e.target.value;
        this.state.timeDomChange ? this.setState({ timeDomChange: false }) : this.setState({ timeDomChange: true })
    }
    cfun() {
        this.props.dispatch(SessionEvaluateGet());
        this.dataSourceLength = this.dataSource.length;
        this.firstData = true;
    }
    //保存
    saveSessionEvaluate() {
        const self = this;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let option_names = [];
                //if (values.is_enable_evaluate === undefined) {
                values.is_enable_evaluate = this.sessionEvaluateData.is_enable_evaluate
                //}
                //if (values.is_enable_eva_descrip === undefined) {
                values.is_enable_eva_descrip = this.sessionEvaluateData.is_enable_eva_descrip
                //}
                values.is_enable_evaluate = Number(values.is_enable_evaluate);
                values.is_enable_eva_descrip = Number(values.is_enable_eva_descrip);
                for (let i = 0; i < self.selectedRowKeys.length; i++) {
                    if (self.data[i].content == "") {
                        notification.warning({
                            message: "提示",
                            description: "请设置满意度评价选项",
                        });
                        return false;
                    } else {
                        option_names.push({
                            id: self.data[i].id ? self.data[i].id : 0,
                            option_name: self.data[i].content,
                            option_order: i + 1,
                        })
                    }
                }
                const parames = {
                    is_enable_evaluate: values.is_enable_evaluate,
                    evaluate_text: values.evaluate_text,
                    is_enable_eva_descrip: values.is_enable_eva_descrip,
                    eva_descript_text: values.eva_descript_text,
                    option_names: JSON.stringify(option_names),
                };
                self.props.dispatch(SessionEvaluateSet(parames, this.cfun.bind(this)));
            }
        });
    }
    //设置列属性
    onRowClick(record, index) {
        this.index = index;
    }
    //提示内容变化
    onChangeValueTable(index, e) {
        if(publicFunction.getByteLen(e.target.value)>50){
            this.data[index].content = publicFunction.cutStr(e.target.value,50);
        }else{
            this.data[index].content =e.target.value;
        }
        this.state.dataChange ? this.setState({ dataChange: false }) : this.setState({ dataChange: true });
    }
    //选中操作
    onSelectChange = (selectedRowKeys, e) => {
        //this.select = true;
        if (selectedRowKeys.length == 2) {
            selectedRowKeys = [0, 1, 2];
        }
        this.selectedRowKeys = selectedRowKeys;
        if (selectedRowKeys.length == 6) {
            for (let i = 0; i < 6; i++) {
                this.data[i].content = this.messageContent[5][i];
            }
        } else {
            for (let i = 0; i < 6; i++) {
                if (i < 3) {
                    this.data[i].content = this.messageContent[2][i];
                } else {
                    this.data[i].content = "";
                }
            }
        }
        this.state.dataChange ? this.setState({ dataChange: false }) : this.setState({ dataChange: true });
    }
    // 用户手动选择/取消选择某列的回调
    onSelectOption = (record, selected, selectedRows) => {
        let length = selectedRows.length;
        this.select = true;
        let arr = [];
        let key = record.key;
        for (let i = 0; i <= key; i++) {
            arr.push(i);
            this.data[i].content = this.messageContent[key][i];
        }
        for (let i = key + 1; i < 6; i++) {
            this.data[i].content = "";
        }
        this.selectedRowKeys = arr;
        this.state.dataChange ? this.setState({ dataChange: false }) : this.setState({ dataChange: true });
    }
    onSelectAll = () => {

    }
    //设置提示语
    textArearChange(type) {
        let self = this;
        // let textarearOld = self.props.form.getFieldsValue().eva_descript_text;
        // setTimeout(function () {
        //     let textarear = self.props.form.getFieldsValue().eva_descript_text;
        //     let length = textarear.length;
        //     if (length > 300) {
        //         self.setState({
        //             visible: true,
        //         });
        //         self.props.form.setFieldsValue({
        //             eva_descript_text: textarearOld
        //         })
        //         length = textarearOld.length;
        //     }
        //     // self.textLength = length;
        //     self.setState({ textArearContent: length });

        // }, 100)

        let value;
        setTimeout(function () {
            switch (type){
                //满意度引导语
                case "evaluate_text":
                    value=self.props.form.getFieldValue("evaluate_text");
                    const evaluate_text=publicFunction.cutStr(value,50);
                    self.props.form.setFieldsValue({evaluate_text});
                    break;
                //描述提示语
                case "eva_descript_text":
                    value=self.props.form.getFieldValue("eva_descript_text");
                    const eva_descript_text=publicFunction.cutStr(value,50);
                    self.props.form.setFieldsValue({eva_descript_text});
                    break;
            }
        }, 100)

    }
    //评价描述开关
    oncheckChange(checked) {
        this.sessionEvaluateData.is_enable_eva_descrip = checked;
    }
    //满意度启用开关
    oncheckEvaluteChange(checked) {
        this.sessionEvaluateData.is_enable_evaluate = checked;
    }
    render() {
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };
        this.columns = [{
            title: '满意度等级',
            dataIndex: 'grade',
            width: "40%"
        }, {
            title: '提示内容',
            dataIndex: 'content',
            width: "60%",
            render: (text, record, index) => {
                if (index < this.selectedRowKeys.length) {
                    return <div><span className="ant-form-item-required" /><Input placeholder="提示内容"
                        onChange={this.onChangeValueTable.bind(this, index)} value={text} style={{ "width": "92%" }} /></div>
                } else {
                    return <div><span className="ant-form-item-required" style={{ "visibility": "hidden" }} /><Input placeholder="提示内容"
                        onChange={this.onChangeValueTable.bind(this, index)} value={text} style={{ "width": "92%" }} /></div>
                }
            }
        }
        ];
        const { getFieldDecorator, } = this.props.form;
        if (this.props.StaffReducer && this.props.StaffReducer.sessionEvaluateData && this.firstData) {
            this.sessionEvaluateData = this.props.StaffReducer.sessionEvaluateData;//接口返回数据
            this.dataSource = JSON.parse(this.sessionEvaluateData.option_names);
            // this.textLength = this.sessionEvaluateData.eva_descript_text.length;
            this.selectedRowKeys = [];
            if (this.dataSource.length == 0) {
                this.selectedRowKeys = [0, 1, 2, 3, 4];
                for (let i = 0; i < 5; i++) {
                    this.data[i].content = this.messageContent["4"][i];
                    this.data[i].id = 0;
                }
            } else {
                for (let i = 0; i < this.dataSource.length; i++) {
                    this.data[i].content = this.dataSource[i].option_name;
                    this.data[i].id = this.dataSource[i].id;
                    this.selectedRowKeys.push(i);
                }
                for (let j = this.dataSource.length; j < 6; j++) {
                    this.data[j].content = "";
                    this.data[j].id = 0;
                }
            }
            this.dataSourceLength = this.dataSource.length;
            this.isRender = true;
            this.firstData = false;
        }
        const rowSelection = {
            selectedRowKeys: this.selectedRowKeys,
            onSelect: this.onSelectOption,
            onChange: this.onSelectChange,
            onSelectAll: this.onSelectAll,
            getCheckboxProps: record => ({
                disabled: record.key < 2,
            }),
        };
        return (
            <div className="configSearch">
                {this.isRender ? <Card style={{ "paddingTop": "30px" }}>
                    <Form>
                        <Row>
                            <Col span={12}>
                                <FormItem label="满意度启用" {...formItemLayout}>
                                    {getFieldDecorator('is_enable_evaluate')(
                                        <Switch size="small"
                                            onChange={this.oncheckEvaluteChange.bind(this)}
                                            defaultChecked={this.sessionEvaluateData.is_enable_evaluate == "1" ? true : false} />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem label="引导语" {...formItemLayout}>
                                    {getFieldDecorator('evaluate_text', {
                                        initialValue: this.sessionEvaluateData.evaluate_text,
                                        rules: [{
                                            required: true, message: '请设置满意度评价引导语',
                                        }],
                                        onChange:this.textArearChange.bind(this,'evaluate_text'),
                                    })(
                                        <Input placeholder="您对本次服务满意吗"/>
                                        )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={2}>
                                提示：
                                </Col>
                            <Col span={22}>
                                请选择最高评价星级，例如选择三星，则访客最多可选择三星
                                </Col>
                        </Row>
                        <Row>
                            <Col span={2} />
                            <Col span={15}>
                                <Table columns={this.columns} dataSource={this.data} bordered rowSelection={rowSelection}
                                    pagination={false} onRowClick={this.onRowClick.bind(this)} size="small" />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem label="评价描述" {...formItemLayout}>
                                    {getFieldDecorator('is_enable_eva_descrip',
                                    )(
                                        <span>
                                            <Switch size="small"
                                                onChange={this.oncheckChange.bind(this)}
                                                defaultChecked={this.sessionEvaluateData.is_enable_eva_descrip == "1" ? true : false} />
                                            &nbsp;&nbsp;&nbsp;评价描述仅针对网页和手机端生效，开启后，客户可以对本次服务添加描述内容
                                            </span>
                                        )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem label="描述提示语" {...formItemLayout}>
                                    {getFieldDecorator('eva_descript_text', {
                                        initialValue: this.sessionEvaluateData.eva_descript_text,
                                        onChange: this.textArearChange.bind(this,'eva_descript_text'),
                                        rules: [{
                                            required: true, message: '请设置描述提示语',
                                        }]
                                    })(
                                        <TextArea placeholder="请设置描述提示语" rows={4} />
                                        )}
                                </FormItem>
                            </Col>
                        </Row>
                        {/*<Row>
                        //     <Col span={2} />
                        //     <Col span={22}>您一共输入了<span className="statisifyColor">{this.textLength}</span>个字,还可以输入<span
                        //         className="statisifyColor">{300 - this.textLength}</span>个字</Col>
                        // </Row>*/} 
                        <Row>
                            <Col span={2} />
                            <Col span={10}><Button type="primary" onClick={this.saveSessionEvaluate.bind(this)}>&nbsp;保存</Button></Col>
                        </Row>
                    </Form>
                </Card> : ""}
            </div>
        )
    }
}
SessionEvaluate.contextTypes = {
    router: PropTypes.object,
};
SessionEvaluate = Form.create()(SessionEvaluate);
const mapStateToProps = SessionEvaluate => SessionEvaluate;
module.exports = connect(mapStateToProps)(SessionEvaluate);
