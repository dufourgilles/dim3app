"use strict";
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const WebServer = require("./WebServer");

class MainCtl {
    constructor() {
        this._webServer = new WebServer(this);
    }

    start() {
        console.log("Staring web server");
        return this._webServer.listen(3006);
    }
}

console.log("App staring");
const mainCtl = new MainCtl();
mainCtl.start().then(() => {
    console.log("started");
}).catch(e => {console.log(e)});
