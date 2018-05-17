import axios from "axios";
import qs from "qs";
import createError from "axios/lib/core/createError";
import { notification, } from "antd";
const isURLRegex = /^(?:\w+:)\/\//;
axios.interceptors.request.use((config) => {
    if (!isURLRegex.test(config.url)) {

        let pathname = window.location.pathname;
        if (config.method == "post" || config.method == "put") {
            config.headers["Content-Type"] = "application/x-www-form-urlencoded";
            config.data = qs.stringify(config.data);
        }
        // if (pathname.indexOf(window.config.appEnv) > -1) {
        config.url = window.config.appEnv + config.url;
        // }
    }
    return config;
});

axios.interceptors.response.use((response) => {

    let redata = "";
    if (response.data.hasOwnProperty("data")) {
        redata = response.data.data;
    } else if (response.hasOwnProperty("data")) {
        redata = response.data;
    } else {
        redata = response;
    }
    //排除新建工单--code非0的提示
    //  let is_NewTicke_nocode = /\/Ticketmanagement\/NewTicke\/new\//.test(location.hash);

    if (response.data.code !== 0 && response.data.hasOwnProperty("code")) {
        if (response.data.code != 10000) {
            notification.error({
                message: "错误提示",
                description: response.data.message,
                duration: 8,
            });
        }

        let error = new createError(
            response.data.message,
            response.data.code,
            response.data.code,
            response.data.data,
        );
        return Promise.reject(error);
    }
    return redata;
});