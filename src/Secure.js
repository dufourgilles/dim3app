import React, {Component} from 'react';
import {getSecuredData} from './utils';

class Secure extends Component {
    state = {
        token: ""
    };

    handleChange = (e) => {
        this.setState({token: e.target.value});
    };

    getSecuredData = () => {
        getSecuredData(this.state.token).then(data => {
            console.log(data);
            if (data == null) {
                throw new Error("invalid data");
            }
            alert("Success", data);
        }).catch(e => {
            alert("Access denied");
        });
    };

    render() {
        return (
            <div className="container-fluid">
                <br/><br/>
                Access Token: <input name="token" value={this.state.token} onChange={this.handleChange} />
                <br/><br/>
                <button onClick={this.getSecuredData}>Get Secured Data</button>
            </div>
        );
    }
}


export default Secure;
