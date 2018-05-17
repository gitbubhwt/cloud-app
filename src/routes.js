import React from 'react' // 引入react
import { Route, IndexRoute, browserHistory } from 'react-router' // 引入react路由

import app from './containers/app'
import error from './containers/error'

import StaffManagement from './containers/Congfig/StaffManagement'
import AddStaff from './containers/Congfig/AddStaff'
import TrenchWebsiteAdd from './containers/Congfig/TrenchWebsiteAdd'
import TrenchWebsiteEdit from './containers/Congfig/TrenchWebsiteEdit'
import TrenchWebsiteList from './containers/Congfig/TrenchWebsiteList'
import TrenchWechatList from './containers/Congfig/TrenchWechatList'
import SessionAutoMessage from './containers/Congfig/SessionAutoMessage'
import SessionAssign from './containers/Congfig/SessionAssign'
import SessionEvaluate from './containers/Congfig/SessionEvaluate'
import SessionNavMenu from './containers/Congfig/SessionNavMenu'
import SessionRouteAdd from './containers/Congfig/SessionRouteAdd'
import SessionRouteEdit from './containers/Congfig/SessionRouteEdit'
import SessionRouteList from './containers/Congfig/SessionRouteList'
import WorkTimeAdd from './containers/Congfig/WorkTimeAdd'
import WorkTimeEdit from './containers/Congfig/WorkTimeEdit'
import WorkTimeList from './containers/Congfig/WorkTimeList'
import WorkloadStatistic from './containers/IMStatistics/WorkloadStatistics'
import SessionRecord from './containers/IMStatistics/SessionRecord'
import AssignSessionRecord from './containers/IMStatistics/AssignSessionRecord'
import HistoryRecord from './containers/IMStatistics/HistoryRecord'
import GuestbookRecord from './containers/IMStatistics/GuestbookRecord'
import SessionStatistics from './containers/IMStatistics/SessionStatistics'
import EvaluateStatistics from './containers/IMStatistics/EvaluateStatistics'
import PerformStatistics from './containers/IMStatistics/PerformStatistics'
import AgentStatusRecord from './containers/IMStatistics/AgentStateRecord'
import AgentSurveillance from './containers/IMSurveillance/AgentSurveillance'
import AgentGroupSurveillance from './containers//IMSurveillance/AgentGroupSurveillance'
import ChannelSurveillance from './containers//IMSurveillance/ChannelSurveillance'

// import ajax from "Utils/ajax";

//TODO
//访问权限验证要自己根据项目规则来实现
const requireAuth = (nextState, replace) => {
    return false
    const token = sessionStorage.getItem('token');
    if (token) {
        ajax.defaults.headers.common['access-token-id'] = token;
    } else if (nextState.location.pathname !== `/login`) {
        // replace(`/login`);
    }
}

const validErrorRoute = (nextState, replace) => {
    replace(`/error`);
}

export default (
    //注意：带参数的路径一般要写在路由规则的底部
    //因为route匹配到匹配路由后，将不会再向下匹配
    //TODO
    <Route path="/" component={app} onEnter={requireAuth}>
        <IndexRoute component={StaffManagement} /> //当没有完整路由时，显示声明加载默认子组件
        <Route path="error" component={error} />
        {/*员工组管理 - 列表*/}
        <Route path="StaffManagement" component={StaffManagement} />
        {/*员工组管理 - 添加*/}
        <Route path="AddStaff" component={AddStaff} />
        {/*员工组管理 - 编辑*/}
        <Route path="EditStaff(/:id)" component={AddStaff} />
        {/*网站接入 - 添加*/}
        <Route path="TrenchWebsiteAdd" component={TrenchWebsiteAdd} />
        {/*网站接入 - 编辑*/}
        <Route path="TrenchWebsiteEdit(/:id)" component={TrenchWebsiteEdit} />
        {/*网站接入-列表*/}
        <Route path="TrenchWebsiteList" component={TrenchWebsiteList} />
        {/*微信接入- 列表*/}
        <Route path="TrenchWechatList(/:id)" component={TrenchWechatList} />
        {/*自动消息*/}
        <Route path="SessionAutoMessage" component={SessionAutoMessage} />
        {/*会话分配*/}
        <Route path="SessionAssign" component={SessionAssign} />
        {/*满意度评价*/}
        <Route path="SessionEvaluate" component={SessionEvaluate} />
        {/*导航菜单 */}
        <Route path="SessionNavMenu" component={SessionNavMenu} />
        {/*会话路由 - 添加*/}
        <Route path="SessionRouteAdd" component={SessionRouteAdd} />
        {/*会话路由 - 编辑*/}
        <Route path="SessionRouteEdit(/:id)" component={SessionRouteEdit} />
        {/*会话路由 - 列表*/}
        <Route path="SessionRouteList" component={SessionRouteList} />
        {/*工作时间 - 添加*/}
        <Route path="WorkTimeAdd" component={WorkTimeAdd} />
        {/*工作时间 - 编辑*/}
        <Route path="WorkTimeEdit(/:id)" component={WorkTimeEdit} />
        {/*工作时间 - 列表*/}
        <Route path="WorkTimeList" component={WorkTimeList} />
        {/*工作量统计 */}
        <Route path="WorkloadStatistic" component={WorkloadStatistic} />
        {/*会话记录 */}
        <Route path="SessionRecord" component={SessionRecord} />
        {/*会话记录(业务受理)*/}
        <Route path="AssignSessionRecord(/:cle_id)" component={AssignSessionRecord} />
        {/*会话历史记录(工作台)*/}
        <Route path="HistoryRecord(/:third_id)" component={HistoryRecord} />
        {/*留言记录*/}
        <Route path="GuestbookRecord" component={GuestbookRecord} />
        {/*会话统计(现在去掉这个页面了)*/}
        <Route path="SessionStatistics" component={SessionStatistics} />
        {/*满意度统计*/}
        <Route path="EvaluateStatistics" component={EvaluateStatistics} />
        {/*绩效统计*/}
        <Route path="PerformStatistics" component={PerformStatistics} />
        {/*坐席状态记录*/}
        <Route path="AgentStatusRecord" component={AgentStatusRecord} />
        {/*坐席监控*/}
        <Route path="AgentSurveillance" component={AgentSurveillance} />
        {/*员工组监控(现在去掉这个页面了)*/}
        <Route path="AgentGroupSurveillance" component={AgentGroupSurveillance} />
        {/*接入渠道监控*/}
        <Route path="ChannelSurveillance" component={ChannelSurveillance} />

        <Route path="*" onEnter={validErrorRoute} />
    </Route>
)