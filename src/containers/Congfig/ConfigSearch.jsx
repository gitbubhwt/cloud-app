import React, { Component, } from "react";
import PropTypes from 'prop-types';
import { Form, Card, Button, Input, Row, Col, } from 'antd';
import WaterMark from 'Static/js/watermark';
const Search = Input.Search;
export default class ConfigSearch extends Component {
    constructor(props, context) {
        super(props, context);
    }

    search() {
        let search = this.props.form.getFieldValue("search");
        this.props.group_name(search);
    }
    componentDidMount() {
        if (this.waterMarkText) {
            WaterMark.addWaterMark(this.waterMarkText, "#fff");
        }
    }
    componentWillMount() {
        this.waterMarkText = localStorage.getItem("watermark");
    }
    render() {
        const { getFieldDecorator, } = this.props.form;
        return (
            <div className="configSearch">
                <Card>
                    <Form>
                        <Row>
                            <Col span={2} style={{ "textAlign": "center" }}>查询条件</Col>
                            <Col span={5}>
                                {getFieldDecorator('search')(
                                    <Search placeholder="查询条件" onSearch={this.search.bind(this)} />
                                )}
                            </Col>
                            <Col span={2}>
                                <Button type="primary" onClick={this.search.bind(this)}><i className="fa fa-search" />&nbsp;搜索</Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </div>
        )
    }
}
ConfigSearch.contextTypes = {
    router: PropTypes.object,
};
ConfigSearch = Form.create()(ConfigSearch);
module.exports = ConfigSearch;
