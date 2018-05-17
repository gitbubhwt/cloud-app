import { LOGIN } from 'Constants/ActionTypes'

const initialState = {
    style: {
        showPass: false,
    },
    tokenInfo: {},
    refreshTokenInfo: {}
}

//抽象数据结构,并对数据进行处理的地方
const login = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case `${LOGIN.SUBMIT}_SUCCESS`:
            return {
                ...state,
                tokenInfo: action.res.data
            }
        case `${LOGIN.GET_ACCESS_TOKEN}_SUCCESS`:
            return {
                ...state,
                accessToken: action.res.data
            }
        case `${LOGIN.REFRESH_ACCESS_TOKEN}_SUCCESS`:
            return {
                ...state,
                refreshTokenInfo: action.res.data
            }
        case `${LOGIN.HAS_BINDED}_SUCCESS`:
            return {
                ...state,
                bindInfo: action.res.data
            }
        default:
            return state
    }
};

export default login