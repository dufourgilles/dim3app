"use strict";

const express = require("express");
const http = require("http");
const path = require("path");
const session = require('express-session');

const memoryStore = new session.MemoryStore();
const Keycloak = require('keycloak-connect');
const keycloak = new Keycloak({store: memoryStore });


const STATUS = {
    "INIT": "init",
    "STARTING": "starting",
    "LISTENING": "listening"
};

class WebServer {
    constructor(mainApp) {
        this._mainApp = mainApp;
        this._server = this._createServer();
        this._status = STATUS.INIT;
    }

    _createServer() {
        const server = express();
        server.use(session({
            secret: "Cisco123@",
            resave: false,
            saveUninitialized: true,
            store: memoryStore
        }));


        server.use(keycloak.middleware());
        
        server.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Credentials", "true");
            res.header("Cache-Control", "no-cache");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.header("Access-Control-Allow-Methods", "POST, GET");
            req.ProtoUrl = `${req.protocol}://${req.get("host")}`;
            next();
        });

        const router = express.Router();
        router.get("/*", keycloak.protect(), (req,res) => this.getSecure(req,res));
        server.use("/secure", router);
        console.log("Protecting /secure/*");

        server.get('/register', (req, res) => this.getStatic(req,res));
        server.get('/refresh', (req, res) => this.getStatic(req,res));
        server.get('/keycloak', (req, res) => this.getStatic(req,res));
        server.get('/token', (req, res) => this.getStatic(req,res));
        server.get('/failure', (req, res) => this.getStatic(req,res));

        server.use(express.static(__dirname + "/../build"));
        console.log("serving files in ", __dirname + "/public");
        
        return server;
    }


    get mainApp() {
        return this._mainApp;
    }

    get port() {
        return this._port;
    }

    get host() {
        return this._host;
    }

    get status() {
        return this._status;
    }

    getStatic(req, res) {
        const p = path.join(__dirname, '../build', 'index.html');
        res.sendFile(p, {lastModified: false});
    }

    getSecure(req, res) {
        console.log("Secure Request");
        this._sendJsonResponse(res, { success: true});
    }

    _sendJsonResponse(res, json) {
        return res.status(200).json(json);
    }

    /**
     *
     * @param {string} port
     * @param {string} host
     * @returns {Promise<any>}
     */
    listen(port, host = "0.0.0.0") {
        return new Promise((resolve, reject) => {
            this._status = STATUS.STARTING;
            this._port = port;
            this._host = host;
            this._http = http.createServer(this._server)
                .on("error", e => {
                    if (this._status === STATUS.STARTING) {
                        this._status = STATUS.INIT;
                        reject(e);
                    }
                    console.log("WebServer error", e);
                });

            this._http.listen(
                port,
                host,
                () => {
                    this._status = STATUS.LISTENING;
                    console.log("WebServer listening");
                    resolve();
                });
        });
    }
}

module.exports = WebServer;
