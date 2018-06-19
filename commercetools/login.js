"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_middleware_auth_1 = require("@commercetools/sdk-middleware-auth");
const node_fetch_1 = require("node-fetch");
const Configstore = require('configstore');
const pkg = require('../package.json');
// create a Configstore instance with an unique ID e.g.
// Package name and optionally some default values
const conf = new Configstore(pkg.name);
function login() {
}
console.log("projectKey", conf.get('projectKey'));
const loginMiddelWare = sdk_middleware_auth_1.createAuthMiddlewareForClientCredentialsFlow({
    host: conf.get('authUrl'),
    projectKey: conf.get('projectKey'),
    credentials: {
        clientId: conf.get('clientId'),
        clientSecret: conf.get('clientSecret'),
    },
    scopes: [`manage_products:${conf.get('projectKey')}`, `manage_types:${conf.get('projectKey')}`],
    // Optional if not globally available
    fetch: node_fetch_1.default,
});
exports.default = loginMiddelWare;
