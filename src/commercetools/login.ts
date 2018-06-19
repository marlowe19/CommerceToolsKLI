import { createClient } from '@commercetools/sdk-client'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'
import { createRequestBuilder } from '@commercetools/api-request-builder'
import { createAuthMiddlewareForClientCredentialsFlow } from '@commercetools/sdk-middleware-auth'
import fetch from "node-fetch"
const Configstore = require('configstore');
const pkg = require('../../package.json');

// create a Configstore instance with an unique ID e.g.
// Package name and optionally some default values
const conf = new Configstore(pkg.name);

function login(){

}
console.log("projectKey",conf.get('projectKey'))
const loginMiddelWare = createAuthMiddlewareForClientCredentialsFlow({
    host: conf.get('authUrl'),
    projectKey: conf.get('projectKey'),
    credentials: {
        clientId: conf.get('clientId'),
        clientSecret: conf.get('clientSecret'),
    },
    scopes: [`manage_products:${conf.get('projectKey')}`, `manage_types:${conf.get('projectKey')}`],

    // Optional if not globally available
    fetch,
})
export default loginMiddelWare

