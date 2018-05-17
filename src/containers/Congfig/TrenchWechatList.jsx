/*
    微信接入-列表
*/
import React, { Component, } from "react";
import PropTypes from 'prop-types';
import Search from './ConfigSearch';
import { Link } from 'react-router';
import { connect, } from "react-redux";
import { WechatList, WorkDelete, WeChatAdd } from 'Actions/ConfigAction';
import { Table, Form, Card, Button, notification, Layout, } from 'antd';
import WaterMark from 'Static/js/watermark';
export default class TrenchWechatList extends Component {
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
        }, {
            title: '公众号名称',
            dataIndex: 'nick_name',
            key: 'nick_name',
            sorter: true,
        }, {
            title: '最近修改时间',
            dataIndex: 'update_time',
            key: 'update_time',
            sorter: true,
        }, {
            title: '最近修改人',
            dataIndex: 'update_user_name',
            key: 'update_user_name',
            sorter: true,
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
        this.wh_name = "";
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
            nick_name: this.wh_name,
        };
        const Reparams = { params: _params };
        this.props.dispatch(WechatList(Reparams));
    }
    addWorkTime() {
        //请求微信接口
        this.props.dispatch(WeChatAdd());
    }
    deleteWorkTime() {
        if (this.deleteChange) {
            let id = this.state.selectedRowKeys.join(",");
            let length = this.state.selectedRowKeys.length;
            let total = this.props.StaffReducer.listWechat.total;
            if ((total - length) % this.Pagin.pageSize == 0) {
                this.Pagin.page = this.Pagin.page - 1;
            }
            this.props.dispatch(WorkDelete(id, this.searchInfo.bind(this)));
            this.setState({ selectedRowKeys: [] });
        }
    }
    //选择操作
    onSelectChange = (selectedRowKeys) => {
        // console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }
    componentWillMount() {
        this.waterMarkText = localStorage.getItem("watermark");
        if (this.props.routeParams.id) {
            notification.success({
                message: "提示",
                description: "添加成功！",
            });
        }
        const _params = { page: 1, pageSize: 10 };
        const Reparams = { params: _params };
        this.props.dispatch(WechatList(Reparams));
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
        if (this.props.StaffReducer && this.props.StaffReducer.listWechat) {
            this.dataSource = this.props.StaffReducer.listWechat.rows;
            total = this.props.StaffReducer.listWechat.total;
        }
        const self = this;
        return (
            <Layout>
                <Search group_name={function (res) {
                    self.wh_name = res;
                    self.Pagin.page = 1;
                    self.searchInfo();
                }} />
                <Card style={{ "margin": "0px 10px 10px 10px" }}>
                    <Table columns={this.columns}
                        dataSource={this.dataSource} bordered size="middle"
                        onChange={this.handleTableChange.bind(this)}
                        loading={this.loading}
                        title={() => '已绑定的微信公众号'}
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
                            onClick={this.addWorkTime.bind(this)}>
                            <i className="fa fa-plus-circle" />
                            &nbsp;添加</Button>
                        </div>}
                    />
                </Card>
            </Layout>
        )
    }
}
TrenchWechatList.contextTypes = {
    router: PropTypes.object,
};
TrenchWechatList = Form.create()(TrenchWechatList);
const mapStateToProps = TrenchWechatList => TrenchWechatList;
module.exports = connect(mapStateToProps)(TrenchWechatList);
