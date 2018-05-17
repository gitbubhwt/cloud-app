import React, { Component, } from "react";
import PropTypes from 'prop-types';
import Search from './ConfigSearch';
import { Link } from 'react-router';
import { connect, } from "react-redux";
import { StaffList, StaffDelete } from 'Actions/ConfigAction';
import { Table, Form, Popconfirm, Card, Button, notification, Layout, } from 'antd';
import WaterMark from 'Static/js/watermark';

export default class StaffManagement extends Component {
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
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            width: "5%",
            render: (text, record) => (
                <span>
                    <Link onClick={this.editStaff.bind(this, record)}><i className="fa fa-pencil iconColor"> </i></Link>
                </span>)
        }, {
            title: '名称',
            dataIndex: 'group_name',
            key: 'group_name',
            sorter: true,
            width: "40%",
        }, {
            title: '员工数',
            dataIndex: 'count_users',
            key: 'count_users',
            sorter: true,
            width: "10%",
        }, {
            title: '最近修改时间',
            dataIndex: 'update_time',
            key: 'update_time',
            sorter: true,
            width: "20%",
        }, {
            title: '最近修改人',
            dataIndex: 'update_user_name',
            key: 'update_user_name',
            sorter: true,
            width: "20%",
        },];
        //分页
        this.onShowSizeChange = (value) => {
            this.Pagin.page = value;
            this.searchInfo();
        };
        this.Pagin = {
            page: 1,
            pageSize: 10,
        };
        this.sortRank = {
            filterInfo: {},
            sorterInfo: {},
            pagination: {},
        };
        this.dataSource = [];
        this.group_name = "";
        this.deleteChange = false;

    }
    /*分页、排序、筛选变化时触发*/
    handleTableChange(pagination, filters, sorter) {
        this.Pagin = {
            page: pagination.current,
            pageSize: pagination.pageSize,
        }
        this.sortRank.sorterInfo = sorter;
        this.sortRank.pagination = pagination;
        this.sortRank.filterInfo = filters;
        this.searchInfo();

    }
    ShowSizeChange(current, size) {
        this.Pagin.pageSize = size;
    }
    //搜索
    searchInfo() {
        let _params = {
            pageSize: this.Pagin.pageSize,
            page: this.Pagin.page,
            sortField: this.sortRank.sorterInfo.field || '',
            sortOrder: this.sortRank.sorterInfo.order || '',
            group_name: this.group_name,
        };
        const Reparams = { params: _params };
        this.props.dispatch(StaffList(Reparams));
    }
    //子组件
    editStaff(record) {
        // console.log("record", record);
        let router = this.context.router;
        router.push(`/EditStaff/${record.key}`);
    }
    addStaff() {
        //打开新的标签页
        let router = this.context.router;
        router.push(`/AddStaff`);
    }
    //判断是都先死气泡弹框
    handleVisibleChange = (visible) =>{
        if (!visible) {
            this.setState({ visible });
            return;
        }
    }
    deleteStaff() {
        if (this.deleteChange) {
            let id = this.state.selectedRowKeys.join(",");
            let length = this.state.selectedRowKeys.length;
            let total = this.props.StaffReducer.listStaff.total;
            if ((total - length) % this.Pagin.pageSize == 0) {
                this.Pagin.page = this.Pagin.page - 1;
            }
            this.props.dispatch(StaffDelete(id, this.searchInfo.bind(this)));
            this.setState({ selectedRowKeys: [] });
        }
    }
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
        const _params = { page: 1, pageSize: 10 };
        const Reparams = { params: _params };
        this.props.dispatch(StaffList(Reparams));
    }
    componentDidMount() {
        if (this.waterMarkText) {
            WaterMark.addWaterMark(this.waterMarkText, "#fff");
        }
    }
    render() {
        //分页
        let total = 0, pageSize = this.Pagin.pageSize, page = this.Pagin.page;
        //选择操作
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        if (this.props.StaffReducer && this.props.StaffReducer.listStaff) {
            this.dataSource = this.props.StaffReducer.listStaff.rows;
            total = this.props.StaffReducer.listStaff.total;
        }
        const self = this;
        return (
            <Layout>
                <Search group_name={function (res) {
                    self.group_name = res;
                    self.Pagin.page = 1;
                    self.searchInfo();
                }} />
                <Card style={{ "margin": "0px 10px 10px 10px" }}>
                    <Table columns={this.columns}
                        dataSource={this.dataSource} bordered size="middle"
                        onChange={this.handleTableChange.bind(this)}
                        loading={this.loading}
                        title={() => '员工组列表'}
                        rowSelection={rowSelection}
                        pagination={{
                            current: page,
                            total: total,
                            pageSize: pageSize,
                            size: 'small',
                            showSizeChanger: true,
                            showQuickJumper: true,
                            pageSizeOptions: ['10', '20', '30', '40'],
                            showTotal: function (total, range) {
                                return `显示 ${range[0]} 到 ${range[1]}，共 ${total} 条记录`;
                            },
                            onShowSizeChange: this.ShowSizeChange.bind(this),
                        }}
                        footer={() => <div><Button type="primary" style={{ "marginRight": "20px" }}
                            onClick={this.addStaff.bind(this)}>
                            <i className="fa fa-plus-circle" />&nbsp;添加员工组</Button>
                            <Popconfirm placement="topRight" title="确定要删除该记录吗？"
                                visible={this.state.visible}
                                onVisibleChange={this.handleVisibleChange}
                                onConfirm={this.deleteStaff.bind(this)}>
                                <Button type="primary" onClick={this.deleteButton.bind(this)}><i className="fa fa-trash-o" />&nbsp;删除</Button>
                            </Popconfirm>
                        </div>}
                    />
                </Card>
            </Layout>
        )
    }
}
StaffManagement.contextTypes = {
    router: PropTypes.object,
};
StaffManagement = Form.create()(StaffManagement);
const mapStateToProps = StaffManagement => StaffManagement;
module.exports = connect(mapStateToProps)(StaffManagement);
