/*
    会话路由 - 列表
*/
import React, { Component, } from "react";
import PropTypes from 'prop-types';
import Search from './ConfigSearch';
import { Link } from 'react-router';
import { connect, } from "react-redux";
import { RouteList, RouteDelete, SessionSort, } from 'Actions/ConfigAction';
import { Table, Form, Popconfirm, Card, Button, notification, Layout, } from 'antd';
import WaterMark from 'Static/js/watermark';
export default class SessionRouteList extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            dataSourceChange: 1,
            visible: false,
            selectedRowKeys: [],
        };
        this.columns = [{
            title: '序号',
            dataIndex: 'number',
            key: 'number',
            width: "5%",
        }, {
            title: '排序',
            dataIndex: 'id_i',
            key: 'id_i',
            width: "5%",
            render: (text, record, index) => (
                <span>
                    <div className="ant-table-column-sorter">
                        <a href="javascript:;" className="ant-table-column-sorter-up off" style={{ color: '#aaa' }}
                            onClick={this.onUpClick.bind(this, record, index)}>
                            <i title="↑" className="fa fa-sort-asc"> </i>
                        </a>
                        <a href="javascript:;" className="ant-table-column-sorter-down off" style={{ color: '#aaa' }}
                            onClick={this.onDownClick.bind(this, record, index)}>
                            <i title="↓" className="fa fa-sort-desc"> </i>
                        </a>
                    </div>
                </span>)
        }, {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            width: "5%",
            render: (text, record) => (
                <span>
                    <Link onClick={this.editWorkTime.bind(this, record)}><i className="fa fa-pencil iconColor"></i></Link>
                </span>)
        }, {
            title: '名称',
            dataIndex: 'route_name',
            key: 'route_name',
            width: "20%",
        }, {
            title: '描述',
            dataIndex: 'route_desc',
            key: 'route_desc',
            width: "25%",
        }, {
            title: '最近修改时间',
            dataIndex: 'update_time',
            key: 'update_time',
            width: "20%",
        }, {
            title: '最近修改人',
            dataIndex: 'update_user_name',
            key: 'update_user_name',
            width: "20%",
        },];
        this.dataSource = [];
        this.wh_name = "";
        this.deleteChange = false;
    }
    onUpClick(record, index) {
        // console.log("this.dataSource", this.dataSource);
        if (index == 0) {
            notification.warning({
                message: "提示",
                description: "已经是第一位了",
            });
        } else {
            const lastIndex = index - 1;
            let middle = this.dataSource[lastIndex];
            this.dataSource[lastIndex] = this.dataSource[index];
            this.dataSource[index] = middle;
            let number = this.dataSource[lastIndex].number;
            this.dataSource[lastIndex].number = this.dataSource[index].number;
            this.dataSource[index].number = number;
            this.state.timeDomChange ? this.setState({ timeDomChange: false }) : this.setState({ timeDomChange: true })
        }

    }
    onDownClick(record, index) {
        if (index == (this.dataSource.length - 1)) {
            notification.warning({
                message: "提示",
                description: "已经是最后一位了",
            });
        } else {
            const nextIndex = index + 1;
            let middle = this.dataSource[nextIndex];
            this.dataSource[nextIndex] = this.dataSource[index];
            this.dataSource[index] = middle;
            let number = this.dataSource[nextIndex].number;
            this.dataSource[nextIndex].number = this.dataSource[index].number;
            this.dataSource[index].number = number;
            this.state.timeDomChange ? this.setState({ timeDomChange: false }) : this.setState({ timeDomChange: true })
        }
    }
    
    //搜索
    searchInfo() {
        let _params = {
            route_name: this.wh_name,
        };
        const Reparams = { params: _params };
        this.props.dispatch(RouteList(Reparams));
    }
    //子组件(编辑页面)
    editWorkTime(record) {
        // console.log("record", record);
        let router = this.context.router;
        router.push(`/SessionRouteEdit/${record.key}`);
    }
    //添加页面
    addWorkTime() {
        //打开新的标签页
        let router = this.context.router;
        router.push(`/SessionRouteAdd`);
    }
    //判断是否显示气泡弹框
    handleVisibleChange = (visible) => {
        if (!visible) {
          this.setState({ visible });
          return;
        }
    }
    //删除数据
    deleteWorkTime() {
        if (this.deleteChange) {
            let id = this.state.selectedRowKeys.join(",");
            this.props.dispatch(RouteDelete(id, this.searchInfo.bind(this)));
            this.setState({ selectedRowKeys: [] });
        }
    }
    //删除按钮
    deleteButton() {
        let id = this.state.selectedRowKeys.join(",");
        if (id.length == 0) {
            notification.error({ message: "提示", description: "没有要删除的数据" });
            this.deleteChange = false;
        } else {
            this.deleteChange = true;
            this.setState({
                visible:true
            })
        }
    }
    //选择操作
    onSelectChange = (selectedRowKeys) => {
        // console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }
    componentWillMount() {
        this.waterMarkText = localStorage.getItem("watermark");
        const Reparams = { params: {} };
        this.props.dispatch(RouteList(Reparams));
    }
    componentDidUpdate() {
        if (this.waterMarkText) {
            WaterMark.addWaterMark(this.waterMarkText, "#fff");
        }
    }
    //保存排序
    saveSort() {
        let parmes = {};
        let order_ids = [];
        for (let i = 0; i < this.dataSource.length; i++) {
            order_ids.push(this.dataSource[i].id);
        }
        // console.log("order_ids", order_ids.join(","));
        const Reparams = { params: { order_ids: "[" + order_ids.join(",") + "]" } };
        this.props.dispatch(SessionSort(Reparams));
    }
    render() {
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        if (this.props.StaffReducer && this.props.StaffReducer.listSessionRoute) {
            this.dataSource = this.props.StaffReducer.listSessionRoute;
        }
        const self = this;
        return (
            <Layout>
                <Search group_name={function (res) {
                    self.wh_name = res;
                    self.searchInfo();
                }} />
                <Card style={{ "margin": "0px 10px 10px 10px" }}>
                    <Table className="listTable"
                        columns={this.columns}
                        dataSource={this.dataSource} bordered size="middle"
                        loading={this.loading}
                        title={() => '会话路由列表'}
                        rowSelection={rowSelection}
                        pagination={false}
                        footer={() => <div><Button type="primary" style={{ "marginRight": "20px" }}
                            onClick={this.addWorkTime.bind(this)}>
                            <i className="fa fa-plus-circle"> </i>&nbsp;添加</Button>
                            <Popconfirm placement="topRight" title="确定要删除该记录吗？"
                                visible={this.state.visible}
                                onVisibleChange={this.handleVisibleChange}
                                onConfirm={this.deleteWorkTime.bind(this)}>
                                <Button type="primary" onClick={this.deleteButton.bind(this)}><i className="fa fa-trash-o"></i>&nbsp;删除</Button>
                            </Popconfirm>
                            <Button type="primary" style={{ "marginLeft": "20px" }}
                                onClick={this.saveSort.bind(this)}>
                                <i className="fa fa-plus-circle"></i>&nbsp;保存排序</Button>
                        </div>}
                    />
                </Card>
            </Layout>
        )
    }
}
SessionRouteList.contextTypes = {
    router: PropTypes.object,
};
SessionRouteList = Form.create()(SessionRouteList);
const mapStateToProps = SessionRouteList => SessionRouteList;
module.exports = connect(mapStateToProps)(SessionRouteList);
