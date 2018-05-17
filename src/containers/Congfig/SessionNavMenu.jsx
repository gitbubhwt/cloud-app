/*
    导航菜单
*/
import React, { Component, } from "react";
import PropTypes from 'prop-types';
import { connect, } from "react-redux";
import { Form, Card, Button, Input, Row, Col, Table, Popconfirm, Select, notification, } from 'antd';
import { SessionNavMenuGet, SessionNavMenuSet, } from 'Actions/ConfigAction';
import WaterMark from 'Static/js/watermark';
import publicFunction from '../PublicFunction';
const FormItem = Form.Item;
const Option = Select.Option;
export default class SessionNavMenu extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            timeDomChange: true,
        };
        this.isRender = false;
        this.index = 0;
        this.sessionNavMenuData = {};
        this.dataSource = [];
        this.firstData = true;
        this.groupAll = [];
        this.dataSourceLength = 0;
        this.column = [{
            title: '排序',
            dataIndex: 'id_i',
            key: 'id_i',
            width: '10%',
            render: (text, record, index) => {
                if (index < this.dataSourceLength) {
                    return <span>
                        <div className="ant-table-column-sorter">
                            <a href="javascript:;" className="ant-table-column-sorter-up off" style={{ color: '#aaa' }}
                                onClick={this.onUpClick.bind(this, record, index)}>
                                <i title="↑" className="fa fa-sort-asc"></i>
                            </a>
                            <a href="javascript:;" className="ant-table-column-sorter-down off" style={{ color: '#aaa' }}
                                onClick={this.onDownClick.bind(this, record, index)}>
                                <i title="↓" className="fa fa-sort-desc"></i>
                            </a>
                        </div>
                    </span>
                } else { return <span></span> }
            }
        }, {
            title: '菜单名称',
            dataIndex: 'menuName',
            key: 'menuName',
            width: '40%',
            render: (text, record, index) => <Input placeholder="菜单名称" value={text} onChange={this.optionName.bind(this, index)} />,
        }, {
            title: '接入坐席组',
            dataIndex: 'group_id_name',
            key: 'group_id_name',
            width: '40%',
            render: (text, record, index) => {
                let groupAllDom = this.groupAll.map(function (item, index) {
                    return (<Option value={item.id + "+" + item.group_name} key={index}>{item.group_name}</Option>)
                })
                return <Select placeholder="请选择坐席组" value={text} onChange={this.optionGroup.bind(this, index)} style={{ width: 200 }}>
                    {groupAllDom}
                </Select>
            },
        }, {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            width: '10%',
            render: (text, record, index) => (
                <span>
                    <Popconfirm placement="topRight" title="确定要删除该记录吗？"
                        onConfirm={() => this.deleteEvaluate(index)}>
                        <a href="#" className="iconColor"><i className="fa fa-trash-o"></i></a>
                    </Popconfirm>
                </span>
            )
        }]
    }
    //向上排序
    onUpClick(record, index) {
        if (index == 0) {
            notification.warning({
                message: "提示",
                description: "已经是第一位了",
            });
        } else {
            this.dataSource[index].key--;
            this.dataSource[index - 1].key++;
            const lastIndex = index - 1;
            let middle = this.dataSource[lastIndex];
            this.dataSource[lastIndex] = this.dataSource[index];
            this.dataSource[index] = middle;
            this.state.timeDomChange ? this.setState({ timeDomChange: false }) : this.setState({ timeDomChange: true })
        }

    }
    //向下排序
    onDownClick(record, index) {

        if (index == (this.dataSource.length - 1)) {
            notification.warning({
                message: "提示",
                description: "已经是最后一位了",
            });
        } else {
            if (index == this.dataSourceLength - 1) {
                notification.warning({
                    message: "提示",
                    description: "新添加的数据不能排序",
                });
                return false;
            }
            this.dataSource[index].key++;
            this.dataSource[index + 1].key--;
            const nextIndex = index + 1;
            let middle = this.dataSource[nextIndex];
            this.dataSource[nextIndex] = this.dataSource[index];
            this.dataSource[index] = middle;
            this.state.timeDomChange ? this.setState({ timeDomChange: false }) : this.setState({ timeDomChange: true })
        }
    }
    componentWillMount() {
        this.waterMarkText = localStorage.getItem("watermark");
        this.props.dispatch(SessionNavMenuGet());
    }
    componentDidUpdate() {
        if (this.waterMarkText) {
            WaterMark.addWaterMark(this.waterMarkText, "#fff");
        }
    }
    //设置引导语
    textAreaChange(e){
        let self = this;
        let value;
        setTimeout(function(e){
            value = self.props.form.getFieldsValue().nav_menu_welcome_text;
            // console.log(value);
            let nav_menu_welcome_text = publicFunction.cutStr(value,50);
            // console.log(nav_menu_welcome_text);
            self.props.form.setFieldsValue({nav_menu_welcome_text:nav_menu_welcome_text});
        },100)
    }
    //菜单名称输入值的变化
    optionName(index, e) {
        //限制字数
        this.dataSource[index].menuName = publicFunction.cutStr(e.target.value,50);
        this.state.timeDomChange ? this.setState({ timeDomChange: false }) : this.setState({ timeDomChange: true })
    }
    //下拉选择坐席组
    optionGroup(index, e) {
        this.dataSource[index].group_id_name = e;
        this.dataSource[index].groupId = e.substring(0, e.indexOf("+"));
        this.dataSource[index].group_name = e.substring(e.indexOf("+") + 1);
        this.state.timeDomChange ? this.setState({ timeDomChange: false }) : this.setState({ timeDomChange: true })
    }
    cfun() {
        this.dataSourceLength = this.dataSource.length;
        this.state.timeDomChange ? this.setState({ timeDomChange: false }) : this.setState({ timeDomChange: true })
    }
    //保存
    saveSessionNavmenu() {
        const self = this;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let nav_menu_options = [];
                for (let i = 0; i < self.dataSource.length; i++) {
                    if (self.dataSource[i].menuName == "") {
                        notification.warning({
                            message: "提示",
                            description: "请设置导航菜单名称",
                        });
                        return false;
                    }
                    if (self.dataSource[i].group_id_name == "") {
                        notification.warning({
                            message: "提示",
                            description: "请设置接入坐席组",
                        });
                        return false;
                    }
                    nav_menu_options.push({
                        menuName: self.dataSource[i].menuName,
                        groupId: self.dataSource[i].groupId,
                        group_name: self.dataSource[i].group_name,
                    })
                }
                const parames = {
                    nav_menu_welcome_text: values.nav_menu_welcome_text,
                    nav_menu_options: JSON.stringify(nav_menu_options),
                };
                self.props.dispatch(SessionNavMenuSet(parames, this.cfun.bind(this)));
            }
        });
    }
    onRowClick(record, index) {
        this.index = index;
    }
    //添加
    addConfig() {
        const length = this.dataSource.length + 1;
        if (length > 20) {
            notification.warning({
                message: "提示",
                description: "菜单项最多可添加20条数据",
            });
            return false;
        }
        this.dataSource.push({
            key: length,
            menuName: "",
            groupId: "",
            group_name: "",
            group_id_name: ""
        });
        this.state.timeDomChange ? this.setState({ timeDomChange: false }) : this.setState({ timeDomChange: true })
    }
    //删除
    deleteEvaluate(index) {
        this.dataSource.splice(index, 1);
        for (let i = index; i < this.dataSource.length; i++) {
            this.dataSource[i].number = i + 1;
            this.dataSource[i].key = i + 1;
        }
        if (index <= (this.dataSourceLength - 1)) {
            this.dataSourceLength--;
        }
        this.state.timeDomChange ? this.setState({ timeDomChange: false }) : this.setState({ timeDomChange: true })
    }
    render() {
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };
        const { getFieldDecorator, } = this.props.form;
        if (this.props.StaffReducer && this.props.StaffReducer.NavMenuData && this.firstData) {
            if (this.props.StaffReducer.NavMenuData.length > 0) {
                this.sessionNavMenuData = this.props.StaffReducer.NavMenuData[0];
            }
            this.groupAll = this.props.StaffReducer.groupAllData;
            if (!this.sessionNavMenuData.nav_menu_options) {
                this.dataSource = [];
            } else {
                this.dataSource = JSON.parse(this.sessionNavMenuData.nav_menu_options);
            }
            let groupId = [];
            //取两个接口中groupId与id相同时的group_name值
            for (let i = 0; i < this.groupAll.length; i++) {
                groupId.push(this.groupAll[i].id);
                for (let j = 0; j < this.dataSource.length; j++) {
                    if (this.dataSource[j].groupId == this.groupAll[i].id) {
                        this.dataSource[j].group_name = this.groupAll[i].group_name;
                    }
                }
            }
            let groupIdString = groupId.join(",");
            this.dataSourceLength = this.dataSource.length;
            for (let i = 0; i < this.dataSource.length; i++) {
                if (groupIdString.indexOf(this.dataSource[i].groupId) == -1) {
                    this.dataSource[i].group_id_name = ""
                } else {
                    this.dataSource[i].group_id_name = this.dataSource[i].groupId + "+" + this.dataSource[i].group_name
                }
                this.dataSource[i].key = i + 1;
            }
            this.isRender = true;
            this.firstData = false;
        }
        return (
            <div className="configSearch">
                {this.isRender ? <Card style={{ "paddingTop": "30px" }}>
                    <Form>
                        <Row>
                            <Col span={12}>
                                <FormItem label="引导语" {...formItemLayout}>
                                    {getFieldDecorator('nav_menu_welcome_text', {
                                        initialValue: this.sessionNavMenuData.nav_menu_welcome_text,
                                        rules: [{
                                            required: true, message: '请设置导航菜单引导语',
                                        }],
                                        onChange:this.textAreaChange.bind(this),
                                    })(
                                        <Input placeholder="请设置导航菜单引导语" />
                                        )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={2} />
                            <Col span={10}>
                                <Table size="middle" className="tableConfig" onRowClick={this.onRowClick.bind(this)} columns={this.column} dataSource={this.dataSource} bordered={true} pagination={false} />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={2} />
                            <Col span={5}><a><i className="fa fa-plus-circle" aria-hidden="true"
                                onClick={this.addConfig.bind(this, "one")}>&nbsp;添加</i></a></Col>
                        </Row>
                        <Row>
                            <Col span={2} />
                            <Col span={10}><Button type="primary" onClick={this.saveSessionNavmenu.bind(this)}>{/*<i
                                    className="fa fa-check"></i>*/}&nbsp;保存</Button></Col>
                        </Row>

                    </Form>
                </Card> : ""}
            </div>
        )
    }
}
SessionNavMenu.contextTypes = {
    router: PropTypes.object,
};
SessionNavMenu = Form.create()(SessionNavMenu);
const mapStateToProps = SessionNavMenu => SessionNavMenu;
module.exports = connect(mapStateToProps)(SessionNavMenu);
