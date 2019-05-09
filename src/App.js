import React, {Component} from 'react';
import {Redirect, Route, Switch} from 'react-router';
import AppHeader from './AppHeader';
import Register from './Register';
import Keycloak from './Keycloak';
import Token from './Token';
import Failure from './Failure';
import Refresh from './Refresh';
import Secure from "./Secure";
import {getKeyCloakURL} from './utils';

import "./app.css";

const KeyCloakURI="https://192.168.2.5:8443";

class App extends Component {
    state = {
        keycloakBaseURI: KeyCloakURI
    };

    componentDidMount() {
        const keycloakBaseURI = getKeyCloakURL(KeyCloakURI);
        this.setState({keycloakBaseURI});
    }

    handleKeycloakChange = (e) => {
        this.setState({keycloakBaseURI: e.target.value});
    };

    render() {
        const keycloakBaseURI = getKeyCloakURL(this.state.keycloakBaseURI);
        return (
            <div className="container-fluid">
              <div className="row">
                <AppHeader/>
                <div className="container-fluid keycloak-info">
                    Keycloak: <input name="keycloakBaseURI" value={this.state.keycloakBaseURI} onChange={this.handleKeycloakChange} size={keycloakBaseURI.length + 1}/>
                </div>
              </div>
                <div className="row">
                    <Switch>
                        <Route path="/register" render={ routeProps => (<Register {...routeProps} keycloakBaseURI={keycloakBaseURI} />)}/>
                        <Route path="/keycloak" render={ routeProps => (<Keycloak {...routeProps} keycloakBaseURI={keycloakBaseURI} />)}/>
                        <Route path="/refresh" render={ routeProps => ( <Refresh {...routeProps} keycloakBaseURI={keycloakBaseURI} /> ) }/>
                        <Route path="/token" component={Token}/>
                        <Route path="/failure" component={Failure}/>
                        <Redirect from="/" to="/register"/>
                    </Switch>
                </div>
                <div className="row">
                    <Secure />
                </div>
            </div>
        );
    }
}

export default App;
