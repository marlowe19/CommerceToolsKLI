import { createAuthMiddlewareForClientCredentialsFlow } from '@commercetools/sdk-middleware-auth'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'
import { createLoggerMiddleware } from '@commercetools/sdk-middleware-logger'
import { createClient } from '@commercetools/sdk-client'
import fetch from "node-fetch"
import * as configStore from "configstore"
const pkg = require('../package.json');

//console.log(colors.red( figlet.textSync('Commerce tool Kli',{ horizontalLayout:'full'})))

const store = new configStore(pkg.name)
const settings = store.all
export const httpMiddelWare = createHttpMiddleware({
    host: 'https://api.sphere.io',
    fetch
})

export const loginMiddelware = createAuthMiddlewareForClientCredentialsFlow({
    host: settings.authUrl,
    projectKey: settings.projectKey,
    credentials: {
        clientId: settings.clientId,
        clientSecret:settings.clientSecret,
    },
    scopes: [`manage_products:${settings.projectKey}`,`manage_types:${settings.projectKey}`],

    // Optional if not globally available
    fetch,
})

export const client2 = createClient({
    middlewares: [loginMiddelware, httpMiddelWare],

})


