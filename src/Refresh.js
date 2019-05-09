import React, {Component} from 'react';
import Axios from 'axios';
import {uriEncode, refreshToken, splitHash, getKeyCloakURL} from './utils';


class Refresh extends Component {
    state = {
        refreshToken: "",
        readOnly: false
    };

    componentDidMount() {
        const hashInfo = splitHash(window.location.hash);
        if (hashInfo != null && hashInfo.token != null) {
            this.setState({refreshToken: hashInfo.token});
        }
    }

    handleChange = (e) => {
        this.setState({refreshToken: e.target.value});
    }

    submit = () => {
        this.setState({readOnly: true});
        refreshToken(getKeyCloakURL(this.props.keycloakBaseURI), this.state.refreshToken)
        .then(res => {
            console.log(res);
            window.location = `/token#username=token_refresh&access_token=${res.data.access_token}&id_token=${res.data.id_token}&refresh_token=${res.data.refresh_token}`;
        })
        .catch(e => {
            console.log(e);
            //window.location = `/failure#error=${uriEncode(e.message)}`;
        })
    }

    render() {
        let tokenInput;
        if (this.state.readOnly) {
            tokenInput = (
                <input 
                    type="text" 
                    name="refreshToken" 
                    value={this.state.refreshToken} 
                    readOnly />
            )
        }
        else {
            tokenInput = (
                <input 
                    type="text" 
                    name="refreshToken" 
                    value={this.state.refreshToken} 
                    onChange={this.handleChange} />
            )
        }

        return (
            <div className="container-fluid">
                Refresh Token :
                {tokenInput}
                <button onClick={this.submit}>Submit</button>
                <br/><a href="/register">Register New Feedim</a>
            </div>
        );
    }
}


export default Refresh;
