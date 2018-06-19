#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const colors = require("colors");
const inquirer = require("inquirer");
const program = require("commander");
const product_1 = require("./commercetools/product");
const _ = require("lodash");
const configStore = require("configstore");
const clear = require("clear");
const questions_1 = require("./inquirer/questions");
const ctClient_1 = require("./commercetools/ctClient");
const pkg = require('./package.json');
const prettyjson = require("prettyjson");
clear();
//console.log(colors.red( figlet.textSync('Commerce tool Kli',{ horizontalLayout:'full'})))
const store = new configStore(pkg.name);
const projectKey = store.get('projectKey');
const clientId = store.get('clientId');
const clientSecret = store.get('clientSecret');
const restUrl = store.get('apiUrl');
const authUrl = store.get('authUrl');
program.command('config')
    .description('configure project')
    .action(function (args) {
    inquirer.prompt(questions_1.configQuestions).then(answers => {
        // Use user feedback for... whatever!!
        console.log("answers", answers);
        store.set('clientId', answers.clientId);
        store.set('clientSecret', answers.clientSecret);
        store.set('apiUrl', answers.restApiUrl);
        store.set('authUrl', answers.authUrl);
        store.set('projectKey', answers.projectKey);
        console.log("settings", store.all);
    });
});
const httpRequestService = new product_1.requestService(store.all);
//process.env["CT_KLI_COMMERCE_TOOLS_PROJECT_KEY"] = "grandvision-dev-1"
//console.log("env",process.env)
program.command('list')
    .alias('ls')
    .description(' list product attributes')
    .option('-i, --id [value]', 'Product id')
    .action(function () {
});
program.command('unpublish [id]')
    .description('unpublish products')
    .option('-i --productId [value]', 'unpublish by id')
    .option('-p, --productType [value]')
    .action(function (id, args) {
    return __awaiter(this, void 0, void 0, function* () {
        clear();
        if (!projectKey) {
            console.log(colors.red('no projectkey set please run "ctkli config"'));
            process.exit(9);
        }
        if (id) {
            try {
                const product = yield getProductById(id);
                console.log("version:", product.version);
                const result = yield unpublishById(id, product.version);
                console.log('====== %s', colors.green(result));
            }
            catch (error) {
                console.log('====== %s', colors.red(error));
            }
        }
        if (args.productType) {
            if (typeof (args.productType) == "boolean") {
                console.log('====== %s', colors.red('Please provide a valid product Type'), "=============");
                process.exit(1);
            }
            try {
                let productTypes = yield getProductTypes();
                const allTypes = _.map(productTypes, 'name');
                let productType = _.pick(_.find(productTypes, { name: args.productType }), ['id', 'name']);
                if (productType.id) {
                    let result = yield changeProductStateByProductType(productType.name, productType.id, "unpublish", httpRequestService.getProductsByProductType(productType.id));
                }
            }
            catch (error) {
                console.log('====== %s', colors.red(error), "=============");
            }
        }
    });
});
program.command('product <id>')
    .alias('ls')
    .description(' list product attributes')
    .option('-n, --productname', 'show name')
    .option('-s, --sku', 'show sku')
    .option('-d, --productdescription', 'show description')
    .option('-r, --raw', 'show raw json result')
    .action(function (productId, args) {
    if (!projectKey) {
        console.log(store.all);
        console.log(colors.red('no projectkey set please run "ctkli config"'));
        process.exit(9);
    }
    let arr = [];
    console.log('======Getting product with id: %s', colors.red(productId), "=============");
    console.log("request", httpRequestService.getProductByIdUri(productId));
    ctClient_1.client2.execute(httpRequestService.getProductByIdUri(productId))
        .then(result => {
        if (args.sku) {
            console.log('sku: %s', colors.bold(getAttribute("sku", result.body)));
        }
        if (args.productname) {
            console.log('name: %s', colors.bold(getCurrent("name", result.body)));
        }
        if (args.raw) {
            console.log(result.body);
        }
        if (args.productdescription) {
            console.log('description: %s', colors.bold(getCurrent("description", result.body)));
        }
        else {
        }
        if (!args.sku && !args.productname && !args.productdescription && !args.raw) {
            console.log(prettyjson.render(result.body, { keysColor: 'blue' }));
        }
    })
        .catch(error => console.log('Oh Snap an error has occured!  %s', colors.red(error)));
});
program.parse(process.argv);
function getAttribute(attribute, product) {
    return product.masterData["current"].masterVariant[attribute];
}
function getCurrent(attribute, product) {
    return product.masterData["current"][attribute];
}
function unpublishById(id, version) {
    return __awaiter(this, void 0, void 0, function* () {
        let request = yield ctClient_1.client2.execute(httpRequestService.unpublishById(id, version));
        console.log('description: %s', colors.bold(`unpublishing by id: ${id}`));
        return request;
    });
}
function changeProductStateByProductType(name, id, action, request) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('description: %s', colors.bold(`${action} by product type: ${name}`));
        ctClient_1.client2.process(request, (payload) => {
            console.log("payload", payload);
            const results = payload.body.results;
            return Promise.all(results.map(product => {
                console.log("unpublishing:", product.id);
                //unpublishById(product.id,product.version)
            }));
        }, { accumulate: false, total: 40 })
            .then(result => {
            console.log('finished unpublishing');
        })
            .catch(error => console.log('Oh Snap an error has occured!  %s', colors.red(error)));
    });
}
function getProductById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let response = yield ctClient_1.client2.execute(httpRequestService.getProductByIdUri(id));
        return response.body;
    });
}
function getProductTypes() {
    return __awaiter(this, void 0, void 0, function* () {
        let response = yield ctClient_1.client2.execute(httpRequestService.getProductTypes());
        if (response.status === 200) {
            console.log("success");
        }
        return response.body.results;
    });
}
