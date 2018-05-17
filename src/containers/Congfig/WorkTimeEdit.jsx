import React, { Component, } from "react";
import PropTypes from 'prop-types';
import { connect, } from "react-redux";
import 'moment/locale/zh-cn';
import { Form, Card, Button, Input, Row, Col, Checkbox, TimePicker, DatePicker, Table, Popconfirm, notification, } from 'antd';
const { RangePicker } = DatePicker;
import { WorkTimeGet, WorkTimeSet, } from 'Actions/ConfigAction';
import WaterMark from 'Static/js/watermark';
import publicFunction from '../PublicFunction';
const FormItem = Form.Item;
import moment from 'moment';
export default class WorkTimeEdit extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            timeDomChange: true,
        };
        this.workTimeDomOne = [];
        this.numberOne = 1;
        this.workTimeDomTwo = [];
        this.numberTwo = 1;
        this.workTimeDomThree = [];
        this.numberThree = 1;
        this.workTimeDomFour = [];
        this.numberFour = 1;
        this.workTimeDomFive = [];
        this.numberFive = 1;
        this.workTimeDomSix = [];
        this.numberSix = 1;
        this.workTimeDomSeven = [];
        this.numberSeven = 1;
        this.index = 0;
        this.firstData = true;
        this.working = {
            0: [{
                from: "09:00",
                to: "18:00"
            }], 1: [{
                from: "09:00",
                to: "18:00"
            }], 2: [{
                from: "09:00",
                to: "18:00"
            }], 3: [{
                from: "09:00",
                to: "18:00"
            }], 4: [{
                from: "09:00",
                to: "18:00"
            }], 5: [{
                from: "09:00",
                to: "18:00"
            }], 6: [{
                from: "09:00",
                to: "18:00"
            }]
        };
        this.dataSource = [];
        this.wh_name = "";
        this.wh_settings = {};
    }
    componentWillMount() {
        this.waterMarkText = localStorage.getItem("watermark");
        this.props.dispatch(WorkTimeGet(this.props.routeParams.id))
    }
    componentDidMount() {
        if (this.waterMarkText) {
            WaterMark.addWaterMark(this.waterMarkText, "#fff");
        }
    }
    onChange(checkedValues) {
    }
    //添加时间段Dom
    addTime(site) {
        if (site == "one") {
            this.numberOne += 1;
            if (!this.working[1]) {
                this.working[1] = [];
            }
            this.working[1].push({ from: "09:00", to: "18:00" });
        }
        if (site == "two") {
            this.numberTwo += 1;
            if (!this.working[2]) {
                this.working[2] = [];
            }
            this.working[2].push({ from: "09:00", to: "18:00" });
        }
        if (site == "three") {
            this.numberThree += 1;
            if (!this.working[3]) {
                this.working[3] = [];
            }
            this.working[3].push({ from: "09:00", to: "18:00" });
        }
        if (site == "four") {
            this.numberFour += 1;
            if (!this.working[4]) {
                this.working[4] = [];
            }
            this.working[4].push({ from: "09:00", to: "18:00" });

        }
        if (site == "five") {
            this.numberFive += 1;
            if (!this.working[5]) {
                this.working[5] = [];
            }
            this.working[5].push({ from: "09:00", to: "18:00" });
        }
        if (site == "six") {
            this.numberSix += 1;
            if (!this.working[6]) {
                this.working[6] = [];
            }
            this.working[6].push({ from: "09:00", to: "18:00" });
        }
        if (site == "seven") {
            this.numberSeven += 1;
            if (!this.working[0]) {
                this.working[0] = [];
            }
            this.working[0].push({ from: "09:00", to: "18:00" });
        }
        this.state.timeDomChange ? this.setState({ timeDomChange: false }) : this.setState({ timeDomChange: true })

    }
    //删除时间段
    deleteTime(site, i) {
        if (site == "one") {
            this.numberOne -= 1;
            this.working[1].splice(i, 1);
        }
        if (site == "two") {
            this.numberTwo -= 1;
            this.working[2].splice(i, 1);
        }
        if (site == "three") {
            this.numberThree -= 1;
            this.working[3].splice(i, 1);
        }
        if (site == "four") {
            this.numberFour -= 1;
            this.working[4].splice(i, 1);
        }
        if (site == "five") {
            this.numberFive -= 1;
            this.working[5].splice(i, 1);
        }
        if (site == "six") {
            this.numberSix -= 1;
            this.working[6].splice(i, 1);
        }
        if (site == "seven") {
            this.numberSeven -= 1;
            this.working[0].splice(i, 1);
        }
        this.state.timeDomChange ? this.setState({ timeDomChange: false }) : this.setState({ timeDomChange: true })
    }
    //时间框变化
    timeChange(timeSite, time, string) {
        let index = Number(timeSite.substring(6));
        if (timeSite.indexOf("one_") > -1) {
            if (timeSite.indexOf("_1_") > -1) {
                this.working[1][index].from = string;
            } else {
                this.working[1][index].to = string;
            }
        }
        if (timeSite.indexOf("two_") > -1) {
            if (timeSite.indexOf("_1_") > -1) {
                this.working[2][index].from = string;
            } else {
                this.working[2][index].to = string;
            }
        }
        if (timeSite.indexOf("three_") > -1) {
            index = Number(timeSite.substring(8));
            if (timeSite.indexOf("_1_") > -1) {
                this.working[3][index].from = string;
            } else {
                this.working[3][index].to = string;
            }
        }
        if (timeSite.indexOf("four_") > -1) {
            index = Number(timeSite.substring(7));
            if (timeSite.indexOf("_1_") > -1) {
                this.working[4][index].from = string;
            } else {
                this.working[4][index].to = string;
            }
        }
        if (timeSite.indexOf("five_") > -1) {
            index = Number(timeSite.substring(7));
            if (timeSite.indexOf("_1_") > -1) {
                this.working[5][index].from = string;
            } else {
                this.working[5][index].to = string;
            }
        }
        if (timeSite.indexOf("six_") > -1) {
            index = Number(timeSite.substring(6));
            if (timeSite.indexOf("_1_") > -1) {
                this.working[6][index].from = string;
            } else {
                this.working[6][index].to = string;
            }
        }
        if (timeSite.indexOf("seven_") > -1) {
            index = Number(timeSite.substring(8));
            if (timeSite.indexOf("_1_") > -1) {
                this.working[0][index].from = string;
            } else {
                this.working[0][index].to = string;
            }
        }
    }
    cfunEdit() {
        this.props.dispatch(WorkTimeGet(this.props.routeParams.id, this.cfun.bind(this)));
    }
    cfun() {
        this.firstData = true;
        this.state.timeDomChange ? this.setState({ timeDomChange: false }) : this.setState({ timeDomChange: true })
    }
    //保存
    saveClick() {
        let wh_name = "";
        let time = [];
        let working = {};
        let rest = [];
        const self = this;
        this.props.form.validateFields((err, values) => {
        if (!err) {
            wh_name = values.wh_name;
            time = values.time;
        
            for (let i = 0; i < time.length; i++) {
                working[time[i]] = this.working[time[i]];
            }
            for (let i = 0; i < this.dataSource.length; i++) {
                if (self.dataSource[i].name == "") {
                    notification.warning({
                        message: "提示",
                        description: "请填写节假日名称！",
                    });
                    return false;
                }
                if (self.dataSource[i].from_to.length == 0 || self.dataSource[i].from_to[0] == "" || self.dataSource[i].from_to[1] == "") {
                    notification.warning({
                        message: "提示",
                        description: "请填写节假日时间段！",
                    });
                    return false;
                }
                rest.push({ name: this.dataSource[i].name, from: this.dataSource[i].from_to[0], to: this.dataSource[i].from_to[1] });
            }
            const wh_settings = {
                working: working,
                rest: rest
            };
            const params = {
                wh_name: wh_name,
                wh_settings: JSON.stringify(wh_settings)
            }
            let router = this.context.router;
            router.path="WorkTimeEdit";
            this.props.dispatch(WorkTimeSet(params, router, this.cfunEdit.bind(this)));
        }
    });
}
    //工作名称字数限制
    textArearChange(){
        let self = this;
        let value;
        setTimeout(function(){
            value = self.props.form.getFieldsValue().wh_name;
            let wh_name = publicFunction.cutStr(value,50);
            self.props.form.setFieldsValue({wh_name:wh_name});
        },100)
    }
    //添加节假日设置
    addRest() {
        let key = Math.random()
        this.dataSource.push({ name: "", from_to: [], key: key });
        this.state.timeDomChange ? this.setState({ timeDomChange: false }) : this.setState({ timeDomChange: true })
    }
    //删除节假日设置
    deleteRest(text, record, index) {
        this.dataSource.splice(this.index, 1);
        this.state.timeDomChange ? this.setState({ timeDomChange: false }) : this.setState({ timeDomChange: true })
    }
    onRowClick(record, index) {
        this.index = index;
    }
    //节假日名称
    restName(index, e) {
        //限制字数
        this.dataSource[index].name = publicFunction.cutStr(e.target.value,50);        
        this.state.timeDomChange ? this.setState({ timeDomChange: false }) : this.setState({ timeDomChange: true })
    }
    //节假日时段
    restTime(index, time, string) {
        this.dataSource[index].from_to = string;
        this.dataSource[index].fromTo = time;
        this.state.timeDomChange ? this.setState({ timeDomChange: false }) : this.setState({ timeDomChange: true })
    }
    render() {
        if (this.props.StaffReducer && this.props.StaffReducer.workTimeData && this.firstData && this.props.StaffReducer.workTimeData.id == this.props.routeParams.id) {
            let workTimeData = this.props.StaffReducer.workTimeData;
            this.wh_name = workTimeData.wh_name;
            this.wh_settings = JSON.parse(workTimeData.wh_settings);
            let rest = this.wh_settings.rest;
            this.dataSource = [];
            for (let i = 0; i < rest.length; i++) {
                this.dataSource.push({ key: i, name: rest[i].name, from_to: [rest[i].from, rest[i].to], fromTo: [moment(rest[i].from, "YYYY-MM-DD HH:mm:ss"), moment(rest[i].to, "YYYY-MM-DD HH:mm:ss")] })
            }
            this.working = this.wh_settings.working;
            this.radio = [];
            for (let key in this.working) {
                this.radio.push(Number(key));
            }
            this.numberOne = this.working[1] ? this.working[1].length : 1;
            if (!this.working[1]) {
                this.working[1] = [];
                this.working[1].push({ from: "09:00", to: "18:00" });
            }
            if (!this.working[2]) {
                this.working[2] = [];
                this.working[2].push({ from: "09:00", to: "18:00" });
            }
            if (!this.working[3]) {
                this.working[3] = [];
                this.working[3].push({ from: "09:00", to: "18:00" });
            }
            if (!this.working[4]) {
                this.working[4] = [];
                this.working[4].push({ from: "09:00", to: "18:00" });
            }
            if (!this.working[5]) {
                this.working[5] = [];
                this.working[5].push({ from: "09:00", to: "18:00" });
            }
            if (!this.working[6]) {
                this.working[6] = [];
                this.working[6].push({ from: "09:00", to: "18:00" });
            }
            if (!this.working[0]) {
                this.working[0] = [];
                this.working[0].push({ from: "09:00", to: "18:00" });
            }

            this.numberTwo = this.working[2] ? this.working[2].length : 1;
            this.numberThree = this.working[3] ? this.working[3].length : 1;
            this.numberFour = this.working[4] ? this.working[4].length : 1;
            this.numberFive = this.working[5] ? this.working[5].length : 1;
            this.numberSix = this.working[6] ? this.working[6].length : 1;
            this.numberSeven = this.working[0] ? this.working[0].length : 1;
            this.firstData = false;

        }
        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 8 },
        };
        const formItemLayoutTime = {
            labelCol: { span: 2 },
            wrapperCol: { span: 20 },
        };
        const { getFieldDecorator, } = this.props.form;
        //设置时间dom
        const format = 'HH:mm';
        this.workTimeDomOne = [];
        this.workTimeDomTwo = [];
        this.workTimeDomThree = [];
        this.workTimeDomFour = [];
        this.workTimeDomFive = [];
        this.workTimeDomSix = [];
        this.workTimeDomSeven = [];
        if (this.props.StaffReducer && this.props.StaffReducer.workTimeData) {
            for (let i = 0; i < this.numberOne; i++) {
                if (i == 0) {
                    this.workTimeDomOne.push(<Row key={`a+${i}`}>
                        <Col span={3}><TimePicker defaultValue={moment(this.working[1][0].from, format)} format={format}
                            onChange={this.timeChange.bind(this, `one_1_${i}`)} /></Col>
                        <Col span={1} style={{ "textAlign": "center" }}>~</Col>
                        <Col span={3}><TimePicker defaultValue={moment(this.working[1][0].to, format)} format={format}
                            onChange={this.timeChange.bind(this, `one_2_${i}`)} /></Col>
                        <Col span={1} className="iconFont" style={{ "textAlign": "center" }}><i className="fa fa-plus-circle" aria-hidden="true"
                            onClick={this.addTime.bind(this, "one")}></i></Col>
                    </Row>)
                } else {
                    this.workTimeDomOne.push(<div key={`a+${i}`}><Col span={3}></Col><Row>
                        <Col span={3}><TimePicker defaultValue={moment(this.working[1][i].from, format)} format={format}
                            onChange={this.timeChange.bind(this, `one_1_${i}`)} /></Col>
                        <Col span={1} style={{ "textAlign": "center" }}>~</Col>
                        <Col span={3}><TimePicker defaultValue={moment(this.working[1][i].to, format)} format={format}
                            onChange={this.timeChange.bind(this, `one_2_${i}`)} /></Col>
                        <Col span={1} className="iconFont" style={{ "textAlign": "center" }}><i className="fa fa-minus-circle" aria-hidden="true" onClick={this.deleteTime.bind(this, "one", i)}></i></Col>
                    </Row></div>)
                }
            }
            for (let i = 0; i < this.numberTwo; i++) {
                if (i == 0) {
                    this.workTimeDomTwo.push(<Row key={`a+${i}`}>
                        <Col span={3}><TimePicker defaultValue={moment(this.working[2][0].from, format)} format={format}
                            onChange={this.timeChange.bind(this, `two_1_${i}`)} /></Col>
                        <Col span={1} style={{ "textAlign": "center" }}>~</Col>
                        <Col span={3}><TimePicker defaultValue={moment(this.working[2][0].to, format)} format={format}
                            onChange={this.timeChange.bind(this, `two_2_${i}`)} /></Col>
                        <Col span={1} className="iconFont" style={{ "textAlign": "center" }}><i className="fa fa-plus-circle" aria-hidden="true"
                            onClick={this.addTime.bind(this, "two")}> </i></Col>
                    </Row>)
                } else {
                    this.workTimeDomTwo.push(<div key={`a+${i}`}><Col span={3}> </Col><Row>
                        <Col span={3}><TimePicker defaultValue={moment(this.working[2][i].from, format)} format={format}
                            onChange={this.timeChange.bind(this, `two_1_${i}`)} /></Col>
                        <Col span={1} style={{ "textAlign": "center" }}>~</Col>
                        <Col span={3}><TimePicker defaultValue={moment(this.working[2][i].to, format)} format={format}
                            onChange={this.timeChange.bind(this, `two_2_${i}`)} /></Col>
                        <Col span={1} className="iconFont" style={{ "textAlign": "center" }}><i className="fa fa-minus-circle" aria-hidden="true" onClick={this.deleteTime.bind(this, "two", i)}> </i></Col>
                    </Row></div>)
                }
            }
            for (let i = 0; i < this.numberThree; i++) {
                if (i == 0) {
                    this.workTimeDomThree.push(<Row key={`a+${i}`}>
                        <Col span={3}><TimePicker defaultValue={moment(this.working[3][0].from, format)} format={format}
                            onChange={this.timeChange.bind(this, `three_1_${i}`)} /></Col>
                        <Col span={1} style={{ "textAlign": "center" }}>~</Col>
                        <Col span={3}><TimePicker defaultValue={moment(this.working[3][0].to, format)} format={format}
                            onChange={this.timeChange.bind(this, `three_2_${i}`)} /></Col>
                        <Col span={1} className="iconFont" style={{ "textAlign": "center" }}><i className="fa fa-plus-circle" aria-hidden="true"
                            onClick={this.addTime.bind(this, "three")}> </i></Col>
                    </Row>)
                } else {
                    this.workTimeDomThree.push(<div key={`a+${i}`}><Col span={3}></Col><Row>
                        <Col span={3}><TimePicker defaultValue={moment(this.working[3][i].from, format)} format={format}
                            onChange={this.timeChange.bind(this, `three_1_${i}`)} /></Col>
                        <Col span={1} style={{ "textAlign": "center" }}>~</Col>
                        <Col span={3}><TimePicker defaultValue={moment(this.working[3][i].to, format)} format={format}
                            onChange={this.timeChange.bind(this, `three_2_${i}`)} /></Col>
                        <Col span={1} className="iconFont" style={{ "textAlign": "center" }}><i className="fa fa-minus-circle" aria-hidden="true" onClick={this.deleteTime.bind(this, "three", i)}> </i></Col>
                    </Row></div>)
                }
            }
            for (let i = 0; i < this.numberFour; i++) {
                if (i == 0) {
                    this.workTimeDomFour.push(<Row key={`a+${i}`}>
                        <Col span={3}><TimePicker defaultValue={moment(this.working[4][0].from, format)} format={format}
                            onChange={this.timeChange.bind(this, `four_1_${i}`)} /></Col>
                        <Col span={1} style={{ "textAlign": "center" }}>~</Col>
                        <Col span={3}><TimePicker defaultValue={moment(this.working[4][0].to, format)} format={format}
                            onChange={this.timeChange.bind(this, `four_2_${i}`)} /></Col>
                        <Col span={1} className="iconFont" style={{ "textAlign": "center" }}><i className="fa fa-plus-circle" aria-hidden="true"
                            onClick={this.addTime.bind(this, "four")}> </i></Col>
                    </Row>)
                } else {
                    this.workTimeDomFour.push(<div key={`a+${i}`}><Col span={3}> </Col><Row>
                        <Col span={3}><TimePicker defaultValue={moment(this.working[4][i].from, format)} format={format}
                            onChange={this.timeChange.bind(this, `four_1_${i}`)} /></Col>
                        <Col span={1} style={{ "textAlign": "center" }}>~</Col>
                        <Col span={3}><TimePicker defaultValue={moment(this.working[4][i].to, format)} format={format}
                            onChange={this.timeChange.bind(this, `four_2_${i}`)} /></Col>
                        <Col span={1} className="iconFont" style={{ "textAlign": "center" }}><i className="fa fa-minus-circle" aria-hidden="true" onClick={this.deleteTime.bind(this, "four", i)}> </i></Col>
                    </Row></div>)
                }
            }
            for (let i = 0; i < this.numberFive; i++) {
                if (i == 0) {
                    this.workTimeDomFive.push(<Row key={`a+${i}`}>
                        <Col span={3}><TimePicker defaultValue={moment(this.working[5][0].from, format)} format={format}
                            onChange={this.timeChange.bind(this, `five_1_${i}`)} /></Col>
                        <Col span={1} style={{ "textAlign": "center" }}>~</Col>
                        <Col span={3}><TimePicker defaultValue={moment(this.working[5][0].to, format)} format={format}
                            onChange={this.timeChange.bind(this, `five_2_${i}`)} /></Col>
                        <Col span={1} className="iconFont" style={{ "textAlign": "center" }}><i className="fa fa-plus-circle" aria-hidden="true"
                            onClick={this.addTime.bind(this, "five")}> </i></Col>
                    </Row>)
                } else {
                    this.workTimeDomFive.push(<div key={`a+${i}`}><Col span={3}> </Col><Row>
                        <Col span={3}><TimePicker defaultValue={moment(this.working[5][i].from, format)} format={format}
                            onChange={this.timeChange.bind(this, `five_1_${i}`)} /></Col>
                        <Col span={1} style={{ "textAlign": "center" }}>~</Col>
                        <Col span={3}><TimePicker defaultValue={moment(this.working[5][i].to, format)} format={format}
                            onChange={this.timeChange.bind(this, `five_2_${i}`)} /></Col>
                        <Col span={1} className="iconFont" style={{ "textAlign": "center" }}><i className="fa fa-minus-circle" aria-hidden="true" onClick={this.deleteTime.bind(this, "five", i)}> </i></Col>
                    </Row></div>)
                }
            }
            for (let i = 0; i < this.numberSix; i++) {
                if (i == 0) {
                    this.workTimeDomSix.push(<Row key={`a+${i}`}>
                        <Col span={3}><TimePicker defaultValue={moment(this.working[6][0].from, format)} format={format}
                            onChange={this.timeChange.bind(this, `six_1_${i}`)} /></Col>
                        <Col span={1} style={{ "textAlign": "center" }}>~</Col>
                        <Col span={3}><TimePicker defaultValue={moment(this.working[6][0].to, format)} format={format}
                            onChange={this.timeChange.bind(this, `six_2_${i}`)} /></Col>
                        <Col span={1} className="iconFont" style={{ "textAlign": "center" }}><i className="fa fa-plus-circle" aria-hidden="true"
                            onClick={this.addTime.bind(this, "six")}> </i></Col>
                    </Row>)
                } else {
                    this.workTimeDomSix.push(<div key={`a+${i}`}><Col span={3}> </Col><Row>
                        <Col span={3}><TimePicker defaultValue={moment(this.working[6][i].from, format)} format={format}
                            onChange={this.timeChange.bind(this, `six_1_${i}`)} /></Col>
                        <Col span={1} style={{ "textAlign": "center" }}>~</Col>
                        <Col span={3}><TimePicker defaultValue={moment(this.working[6][i].to, format)} format={format}
                            onChange={this.timeChange.bind(this, `six_2_${i}`)} /></Col>
                        <Col span={1} className="iconFont" style={{ "textAlign": "center" }}><i className="fa fa-minus-circle" aria-hidden="true" onClick={this.deleteTime.bind(this, "six", i)}> </i></Col>
                    </Row></div>)
                }
            }
            for (let i = 0; i < this.numberSeven; i++) {
                if (i == 0) {
                    this.workTimeDomSeven.push(<Row key={`a+${i}`}>
                        <Col span={3}><TimePicker defaultValue={moment(this.working[0][0].from, format)} format={format}
                            onChange={this.timeChange.bind(this, `seven_1_${i}`)} /></Col>
                        <Col span={1} style={{ "textAlign": "center" }}>~</Col>
                        <Col span={3}><TimePicker defaultValue={moment(this.working[0][0].to, format)} format={format}
                            onChange={this.timeChange.bind(this, `seven_2_${i}`)} /></Col>
                        <Col span={1} className="iconFont" style={{ "textAlign": "center" }}><i className="fa fa-plus-circle" aria-hidden="true"
                            onClick={this.addTime.bind(this, "seven")}> </i></Col>
                    </Row>)
                } else {
                    this.workTimeDomSeven.push(<div key={`a+${i}`}><Col span={3}> </Col><Row>
                        <Col span={3}><TimePicker defaultValue={moment(this.working[0][i].from, format)} format={format}
                            onChange={this.timeChange.bind(this, `seven_1_${i}`)} /></Col>
                        <Col span={1} style={{ "textAlign": "center" }}>~</Col>
                        <Col span={3}><TimePicker defaultValue={moment(this.working[0][i].to, format)} format={format}
                            onChange={this.timeChange.bind(this, `seven_2_${i}`)} /></Col>
                        <Col span={1} className="iconFont" style={{ "textAlign": "center" }}><i className="fa fa-minus-circle" aria-hidden="true" onClick={this.deleteTime.bind(this, "seven", i)} /></Col>
                    </Row></div>)
                }
            }
        }

        let column = [{
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            width: "30%",
            render: (text, record, index) => <Input placeholder="节假日名称" value={text} onChange={this.restName.bind(this, index)} />,
        }, {
            title: '时段',
            dataIndex: 'fromTo',
            key: 'fromTo',
            width: "30%",
            render: (text, record, index) => <RangePicker
                showTime={{ defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')] }}
                format="YYYY-MM-DD HH:mm:ss"
                onChange={this.restTime.bind(this, index)}
                value={text}
            />,
        }, {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            width: "10%",
            render: (text, record, index) => (
                <span>
                    <Popconfirm placement="topRight" title="确定要删除该记录吗？"
                        onConfirm={() => this.deleteRest(text, record, index)}>
                        <a href="#" className="iconColor"><i className="fa fa-trash-o"> </i></a>
                    </Popconfirm>
                </span>
            )
        }]
        return (
            <div className="configSearch">
                <Card style={{ "paddingTop": "30px" }}>
                    <Form>
                        <Row>
                            <FormItem label="名称" {...formItemLayout}>
                                {getFieldDecorator('wh_name', {
                                    initialValue: this.wh_name,
                                    rules: [{
                                        required: true, message: '请输入工作时间名称!',
                                    }],
                                    onChange:this.textArearChange.bind(this),
                                })(
                                    <Input placeholder="请输入工作时间名称"/>
                                    )}

                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem label="工作时间设置" {...formItemLayoutTime}>
                                {getFieldDecorator('time', {
                                    initialValue: this.radio,
                                    rules: [{
                                        required: true, message: '请选择工作时间!',
                                    }],
                                })(
                                    <Checkbox.Group onChange={this.onChange.bind(this)}>
                                        <Row key={Math.random()}>
                                            <Col span={3}><Checkbox value={1}>星期一</Checkbox></Col>
                                            {this.workTimeDomOne}
                                        </Row>
                                        <Row key={Math.random()}>
                                            <Col span={3}><Checkbox value={2}>星期二</Checkbox></Col>
                                            {this.workTimeDomTwo}
                                        </Row>
                                        <Row key={Math.random()}>
                                            <Col span={3}><Checkbox value={3}>星期三</Checkbox></Col>
                                            {this.workTimeDomThree}
                                        </Row>
                                        <Row key={Math.random()}>
                                            <Col span={3}><Checkbox value={4}>星期四</Checkbox></Col>
                                            {this.workTimeDomFour}
                                        </Row>
                                        <Row key={Math.random()}>
                                            <Col span={3}><Checkbox value={5}>星期五</Checkbox></Col>
                                            {this.workTimeDomFive}
                                        </Row>
                                        <Row key={Math.random()}>
                                            <Col span={3}><Checkbox value={6}>星期六</Checkbox></Col>
                                            {this.workTimeDomSix}
                                        </Row>
                                        <Row key={Math.random()}>
                                            <Col span={3}><Checkbox value={0}>星期日</Checkbox></Col>
                                            {this.workTimeDomSeven}
                                        </Row>
                                    </Checkbox.Group>,
                                )}
                            </FormItem>
                        </Row>
                        <Row>
                            <Col span={2}>节假日设置:</Col>
                            <Col span={22}><Table size="middle" className="tableConfig" onRowClick={this.onRowClick.bind(this)} columns={column} dataSource={this.dataSource} bordered pagination={false} /></Col>
                        </Row>
                        <Row>
                            <Col span={2} />
                            <Col span={1} className="iconFont"><i className="fa fa-plus-circle" aria-hidden="true"
                                onClick={this.addRest.bind(this)}> </i></Col>
                        </Row>
                        <Row>
                            <Col span={2} />
                            <Col span={1}><Button type="primary" onClick={this.saveClick.bind(this)}>&nbsp;保存</Button></Col>
                        </Row>

                    </Form>
                </Card>
            </div>
        )
    }
}
WorkTimeEdit.contextTypes = {
    router: PropTypes.object,
};
WorkTimeEdit = Form.create()(WorkTimeEdit);
const mapStateToProps = WorkTimeEdit => WorkTimeEdit;
module.exports = connect(mapStateToProps)(WorkTimeEdit);
