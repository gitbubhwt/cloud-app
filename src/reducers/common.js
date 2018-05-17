import { COMMON } from 'Constants/ActionTypes' // 引入action类型常量名

const { FINALLY } = COMMON
// 初始化state数据
const initialState = {

}

// 通过dispatch action进入
// 根据不同的action type进行state的更新
export default function update(state = initialState, action) {
    switch (action.type) {
        case `${FINALLY}`:
            console.log('COMMON_FINALLY')
        default:
            return state
    }
}