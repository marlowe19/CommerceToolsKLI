"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_middleware_auth_1 = require("@commercetools/sdk-middleware-auth");
const sdk_middleware_http_1 = require("@commercetools/sdk-middleware-http");
const sdk_client_1 = require("@commercetools/sdk-client");
const node_fetch_1 = require("node-fetch");
const configStore = require("configstore");
const pkg = require('../package.json');
//console.log(colors.red( figlet.textSync('Commerce tool Kli',{ horizontalLayout:'full'})))
const store = new configStore(pkg.name);
const settings = store.all;
exports.httpMiddelWare = sdk_middleware_http_1.createHttpMiddleware({
    host: 'https://api.sphere.io',
    fetch: node_fetch_1.default
});
exports.loginMiddelware = sdk_middleware_auth_1.createAuthMiddlewareForClientCredentialsFlow({
    host: settings.authUrl,
    projectKey: settings.projectKey,
    credentials: {
        clientId: settings.clientId,
        clientSecret: settings.clientSecret,
    },
    scopes: [`manage_products:${settings.projectKey}`, `manage_types:${settings.projectKey}`],
    // Optional if not globally available
    fetch: node_fetch_1.default,
});
exports.client2 = sdk_client_1.createClient({
    middlewares: [exports.loginMiddelware, exports.httpMiddelWare],
});
