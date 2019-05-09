import React, {Component} from 'react';
import {randomString, uriEncode} from './utils';

class Register extends Component {
    state = {
        serialNumber: ""
    }

    handleChange = (e) => {
        this.setState({serialNumber: e.target.value});
    };

    submit = () => {
        const arr = window.location.href.split("/");
        window.location = `${this.props.keycloakBaseURI}/auth/realms/gdnet-iot/protocol/openid-connect/auth?` +
        "response_type=id_token%20token&" + 
        "client_id=iot-proxy&" + 
        "redirect_uri=" + uriEncode(`${arr[0]}//${arr[2]}/keycloak`) + "&" +
        `nonce=${randomString(16)}&` +
        "state=" + uriEncode(`authenticating:username=${this.state.serialNumber}`);
    };

    render() {
        return (
            <div className="container-fluid">
                Feedim S/N :
                <input 
                type="text" 
                name="serialnumber" 
                value={this.state.serialNumber} 
                onChange={this.handleChange} />
                <button onClick={this.submit}>Submit</button>
            </div>
        );
    }
}


export default Register;
