import React, {Component} from 'react';
import Axios from 'axios';
import {randomString, uriDecode, splitHash, getKeyCloakURL} from './utils';


class Keycloak extends Component {
    componentDidMount() {
        const hashInfo = splitHash(window.location.hash);
        this.createUser(hashInfo);
    }
    getUserToken = (username, password, accesToken) => {
        console.log("Get user token");
        const params = new URLSearchParams();
        params.append('client_id', 'iot-proxy');
        params.append('client_secret', '18746b56-70e4-41a4-958f-152a2b7a89ae');
        params.append('username', username);
        params.append('password', password);
        params.append('scope', "openid");
        params.append('grant_type', "password");

        return Axios.post(
            `${this.props.keycloakBaseURI}/auth/realms/gdnet-iot/protocol/openid-connect/token`,
            params,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            }
        )
    }

    createUser = hashInfo => {
        const keycloakBaseURI = getKeyCloakURL(this.props.keycloakBaseURI);
        let state;
        try {
            state = uriDecode(hashInfo.state);
        }catch(e) {
            console.log(hashInfo.state);
            console.log(e);
            return;
        }
        const stateInfo = state.split(":");
        if (stateInfo.length < 2) {
            console.log(hashInfo.state, "invalid");
            return;
        }
        const usernameInfo = stateInfo[1].split("=");
        if (usernameInfo.length < 2) {
            console.log(usernameInfo, "invalid");
            return;
        }
        const username = usernameInfo[1];
        const password = randomString(16);
        Axios.post(
            `${keycloakBaseURI}/auth/admin/realms/gdnet-iot/users`,
            {
                username: username,
                enabled: true,
                credentials: [{type: "password", value: password, temporary: false}]
            },
            {
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `bearer ${hashInfo.access_token}`
                }
            }
        )
        .then(() => this.getUserToken(username, password, hashInfo.access_token))
        .then(res => {
            console.log(res);
            window.location = `/token#username=${username}&access_token=${res.data.access_token}&id_token=${res.data.id_token}&refresh_token=${res.data.refresh_token}`;
        })
        .catch(e => {
            console.log(e);
            //window.location = `/failure#error=${uriEncode(e.message)}`;
        });
    }

    render() {
        return (
            <div>
                ...registering...<br/>
                <a href="/register">Register New Feedim</a>
            </div>
        );
    }
}


export default Keycloak;
