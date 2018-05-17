import React from 'react';

import style from './index.less';

import ErrorImg from 'Static/images/404.png'
class Error extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="error-page">
                <img src={ErrorImg} />
            </div>
        )
    }
}

export default Error