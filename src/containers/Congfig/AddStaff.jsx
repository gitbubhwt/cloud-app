/*
    员工组管理-添加
*/
import React, { Component, } from "react";
import PropTypes from 'prop-types';
import { connect, } from "react-redux";
import { Form, Card, Button, Input, Row, Col, Transfer, } from 'antd';
import { StaffAdd, StaffSet, StaffEdit, StaffUpdate, } from 'Actions/ConfigAction';
import WaterMark from 'Static/js/watermark';
import publicFunction from '../PublicFunction';
import qs from 'qs'
const FormItem = Form.Item;
export default class AddStaff extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            mockData: [],
            targetKeys: [],
        }
        this.firstData = true;
        this.changTarget = false;
        this.request=true;
    }
    componentWillMount() {
        this.waterMarkText = localStorage.getItem("watermark");
        this.key = Math.random();
        let path = this.props.route.path;
        if (path == "AddStaff") {
            this.props.dispatch(StaffAdd());
        } else {
            let params = { group_id: this.props.routeParams.id };
            this.props.dispatch(StaffEdit(params))
        }
        this.groupId = "";
    }
    componentDidMount() {
        if (this.waterMarkText) {
            WaterMark.addWaterMark(this.waterMarkText, "#fff");
        }
    }
    filterOption = (inputValue, option) => {
        return option.description.indexOf(inputValue) > -1;
    }
    handleChange = (targetKeys, direction, moveKeys) => {
        this.setState({ targetKeys });
        this.changTarget = true;
        this.firstData = false;
    }
    addCfun(id) {
        this.groupId = id;
    }
    editCfun() {
        // this.changTarget = false;
        this.request=true;
    }
     //员工组名称字数限制
    textArearChange(){
        let self = this;
        let value;
        setTimeout(function(){
            value = self.props.form.getFieldsValue().group_name;
            let group_name = publicFunction.cutStr(value,50);
            self.props.form.setFieldsValue({group_name:group_name});
        },100)
    }
    //保存
    addStaff() {
        let params = {};
        const self = this;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                params = values;
                let path = self.props.route.path;
                let targetDatas = self.state.targetKeys;
                let newData = [],totalData = [];
                for(let i=0;i<targetDatas.length;i++){
                    let newObject = new Object();
                    newData = targetDatas[i].split(",");
                    newObject.user_id = newData[0];
                    newObject.user_name = newData[1];
                    newObject.user_num = newData[2];
                    totalData.push(newObject);
                }
                
                params.users = JSON.stringify(totalData);
                params.code = "68d6c9739fcc0bffe971a46b26319e93be07ed71";
                params.state = "6edf4ecce92f43888515e6f5ef89f694";
                params.session_state = "ce0bc17ac6c0da054f25b644c7ba8247bf29d481e220c34619aeab9febba6466.ba01e8aaf6a341053ecdfeb70a3eb3a2";

                // code=68d6c9739fcc0bffe971a46b26319e93be07ed71&state=6edf4ecce92f43888515e6f5ef89f694&session_state=ce0bc17ac6c0da054f25b644c7ba8247bf29d481e220c34619aeab9febba6466.ba01e8aaf6a341053ecdfeb70a3eb3a2
                // params.user_ids = self.state.targetKeys.join(",");

                let router = self.context.router;
                if (path == "AddStaff") {
                    self.props.dispatch(StaffSet(params, router, self.addCfun.bind(this)));
                } else {
                    if (!this.changTarget) {
                        if (self.props.StaffReducer.selectStaff) {
                            params.user_ids = self.props.StaffReducer.selectStaff.group_users.join(",");
                            let targetKeys = self.props.StaffReducer.selectStaff.group_users;
                            self.setState({ targetKeys })
                        } else {
                            params.group_id = [];
                        }
                    } else {
                        params.group_id = self.state.targetKeys;
                    }
                    if (self.props.StaffReducer.selectStaff) {
                        params.group_id = self.props.StaffReducer.selectStaff.group_id;
                    } else {
                        params.group_id = self.groupId;
                    }
                    if(this.request){
                        this.request=false;
                        this.props.dispatch(StaffUpdate(params,self.editCfun.bind(this)));
                    }
                }
            }
        });

    }

    render() {
        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 5 },
        };
        const { getFieldDecorator, } = this.props.form;
        let mockData = [];
        let targetKeys = [];
        let group_name = "";
        if (this.props.StaffReducer && this.props.StaffReducer.staffAll) {
            mockData = this.props.StaffReducer.staffAll;
            if (this.firstData) {
                if (this.props.StaffReducer.selectStaff) {
                    targetKeys = this.props.StaffReducer.selectStaff.group_users;
                }
                for (let i = 0; i < mockData.length; i++) {
                    mockData[i].key = mockData[i].user_id+","+mockData[i].user_name+","+mockData[i].user_num;
                    // mockData[i].key = mockData[i].user_id;
                }
            } else {
                targetKeys = this.state.targetKeys;
            }
        }
        if (this.props.StaffReducer && this.props.StaffReducer.selectStaff) {
            group_name = this.props.StaffReducer.selectStaff.group_name;
        }
        return (
            <div className="configSearch">
                <Card style={{ "paddingTop": "30px" }}>
                    <Form>
                        <Row>
                            <FormItem label="员工组名称" {...formItemLayout}>
                                {getFieldDecorator('group_name', {
                                    initialValue: group_name,
                                    rules: [{
                                        required: true, message: '请输入员工组名称!',
                                    }],
                                    onChange:this.textArearChange.bind(this),
                                })(
                                    <Input placeholder="员工组名称" />
                                    )}
                            </FormItem>
                        </Row>
                        <Row>
                            <Col span={2} style={{ "color": " rgba(0, 0, 0, 0.85)" }}>选择员工：</Col>
                            <Col span={22}>
                                <Transfer
                                    dataSource={mockData}
                                    showSearch
                                    listStyle={{
                                        width: 350,
                                        height: 350,
                                    }}
                                    operations={['添加>>', '<<删除']}
                                    targetKeys={targetKeys}
                                    onChange={this.handleChange}
                                    render={item => `${item.user_name}-${item.user_num}`}
                                    titles={['待添加的坐席', '已添加的坐席']}
                                    searchPlaceholder={"坐席名称、工号搜索"}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={2}><Button type="primary" onClick={this.addStaff.bind(this)}>&nbsp;保存</Button></Col>
                        </Row>
                    </Form>
                </Card>
            </div>
        )
    }
}
AddStaff.contextTypes = {
    router: PropTypes.object,
};
AddStaff = Form.create()(AddStaff);
const mapStateToProps = AddStaff => AddStaff;
module.exports = connect(mapStateToProps)(AddStaff);
