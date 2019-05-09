import React, {Component} from 'react';
import {splitHash,uriDecode} from './utils';
import './token.css';

class Token extends Component {
    render() {
        const hashInfo = splitHash(window.location.hash);
        const successMessage = `Successfully Registered ${uriDecode(hashInfo.username)}`;
        return (
            <div className="container-fluid">
                <div className="token-header">
                    {successMessage}
                </div>
                <div className="token-title">ID Token:</div>
                <div className="token-value">
                    {hashInfo.id_token}
                </div>
                <div className="token-title">Access Token:</div>
                <div className="token-value">
                    {hashInfo.access_token}
                </div>
                <div className="token-title">Refresh Token:</div>
                <div className="token-value">
                    {hashInfo.refresh_token}
                </div>
                <div className="register-link">
                    <a href="/register">Register New Feedim</a>
                </div>
                <div className="register-link">
                    <a href={`/refresh#token=${hashInfo.refresh_token}`}>Refresh Token</a>
                </div>
            </div>
        );
    }
}


export default Token;
