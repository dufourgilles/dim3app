import React, {Component} from 'react';
import {splitHash, uriDecode} from './utils';

class Failure extends Component {
    render() {
        const hashInfo = splitHash(window.location.hash);
        return (
            <div className="container-fluid">
                <h3>
                    Error
                </h3>
                <div>
                    {uriDecode(hashInfo.error)}
                </div>
                <a href="/register">Register New Feedim</a>
            </div>
        );
    }
}

export default Failure;
