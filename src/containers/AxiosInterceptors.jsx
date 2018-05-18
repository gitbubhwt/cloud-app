import axios from "axios";
import qs from "qs";
import createError from "axios/lib/core/createError";
import { notification } from "antd";
import { hashHistory } from "react-router";

const isURLRegex = /^(?:\w+:)\/\//;
axios.interceptors.request.use(config => {
  if (config.headers["Content-Type"] == "application/x-www-form-urlencoded") {
    config.data = qs.stringify(config.data);
  }
  return config;
});

axios.interceptors.response.use(response => {
  let redata = "";
  if (response.data.hasOwnProperty("data")) {
    redata = response.data.data;
  } else if (response.hasOwnProperty("data")) {
    redata = response.data;
  } else {
    redata = response;
  }

  if (response.data.hasOwnProperty("code") && response.data.code != 0) {
    if (response.data.code == -1) {
      //token invalid
      console.log("token invalid", response.data);
      hashHistory.push("Login");
      return null;
    } else if (response.data.code == 500) {
      notification.error({
        message: "错误提示",
        description: response.data.message,
        duration: 8
      });
      let error = new createError(
        response.data.message,
        response.data.code,
        response.data.code,
        response.data.data
      );
      return Promise.reject(error);
    } else {
      notification.warning({
        message: "警告",
        description: redata,
        duration: 8
      });
    }
  }
  return redata;
});
