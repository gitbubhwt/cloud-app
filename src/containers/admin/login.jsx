/*
    登录
*/
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Form, Icon, Card, Button, Input, Row, Col, Transfer } from "antd";
const FormItem = Form.Item;
import axios from "axios";
export default class AddStaff extends Component {
  constructor(props, context) {
    super(props, context);
  }
  //登录
  login() {
    let params = {};
    const self = this;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        axios({
          method: "post",
          url: "/cloud/admin/login",
          data: {
            userName: values.userName,
            password: values.password
          },
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }).then(res => {
          if (res == null) {
            return;
          }
          console.log(res.data);
        });
      }
    });
  }

  render() {
    const formItemLayout = {
      width: "100%"
    };
    const loginBtnStyle = {
      width: "100%"
    };
    const loginForm = {
      marginLeft: "auto",
      marginRight: "auto",
      width: "300px"
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="configSearch">
        <Card
          style={{
            paddingTop: "50px"
          }}
        >
          <Form style={loginForm}>
            <Row>
              <FormItem {...formItemLayout}>
                {getFieldDecorator("userName", {
                  rules: [{ required: true, message: "请输入用户名" }]
                })(
                  <Input
                    prefix={
                      <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    placeholder="用户名"
                  />
                )}
              </FormItem>
            </Row>

            <Row>
              <FormItem {...formItemLayout}>
                {getFieldDecorator("password", {
                  rules: [{ required: true, message: "请输入密码" }]
                })(
                  <Input
                    prefix={
                      <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    type="password"
                    placeholder="密码"
                  />
                )}
              </FormItem>
            </Row>

            <Row>
              <FormItem {...formItemLayout}>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  onClick={this.login.bind(this)}
                  style={loginBtnStyle}
                >
                  登录
                </Button>
              </FormItem>
            </Row>
          </Form>
        </Card>
      </div>
    );
  }
}
AddStaff.contextTypes = {
  router: PropTypes.object
};
AddStaff = Form.create()(AddStaff);
const mapStateToProps = AddStaff => AddStaff;
module.exports = connect(mapStateToProps)(AddStaff);
