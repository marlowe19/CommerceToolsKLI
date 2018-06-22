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
const clear = require("clear");
const colors = require("colors");
const program = require("commander");
const inquirer = require("inquirer");
const _ = require("lodash");
const ctClient_1 = require("./commercetools/ctClient");
const productsServices_1 = require("./commercetools/productsServices");
const questions_1 = require("./inquirer/questions");
const publishProducts_1 = require("./lib/publishProducts");
const store_1 = require("./lib/store");
const pkg = require("../package.json");
const prettyjson = require("prettyjson");
const deleteProducts_1 = require("./commercetools/deleteProducts");
// clear()
// console.log(colors.red( figlet.textSync('Commerce tool Kli',{ horizontalLayout:'full'})))
const projectKey = store_1.default.get("projectKey");
const clientId = store_1.default.get("clientId");
const clientSecret = store_1.default.get("clientSecret");
const restUrl = store_1.default.get("apiUrl");
const authUrl = store_1.default.get("authUrl");
program.command("config")
    .description("configure project")
    .action((args) => {
    inquirer.prompt(questions_1.configQuestions).then((answers) => {
        console.log("answers", answers);
        store_1.default.set("clientId", answers.clientId);
        store_1.default.set("clientSecret", answers.clientSecret);
        store_1.default.set("apiUrl", answers.restApiUrl);
        store_1.default.set("authUrl", answers.authUrl);
        store_1.default.set("projectKey", answers.projectKey);
        console.log("settings", store_1.default.all);
    });
});
const httpRequestService = new productsServices_1.RequestFactory(store_1.default.all);
program.command("list")
    .alias("ls")
    .description(" list product attributes")
    .option("-i, --id [value]", "Product id")
    .action(function () {
});
program.command("unpublish")
    .description("unpublish products")
    .option("-i --productId <id>]", "unpublish by id")
    .option("-p, --productType <value>")
    .action((args) => __awaiter(this, void 0, void 0, function* () {
    clear();
    if (!projectKey) {
        console.log(colors.red('no projectkey set please run "ctkli config"'));
        process.exit(9);
    }
    if (args.productId) {
        try {
            const product = yield getProductById(args.productId);
            console.log("version:", product.version);
            const result = yield unpublishById(args.productId, product.version);
            console.log("====== %s", colors.green(result));
        }
        catch (error) {
            console.log("====== %s", colors.red(error));
        }
    }
    if (args.productType) {
        if (typeof (args.productType) == "boolean") {
            console.log("====== %s", colors.red("Please provide a valid product Type"), "=============");
            process.exit(1);
        }
        try {
            const productTypes = yield getProductTypes();
            const allTypes = _.map(productTypes, "name");
            const ctProductType = _.pick(_.find(productTypes, { name: args.productType }), ["id", "name"]);
            // noinspection TypeScriptUnresolvedVariable
            // @ts-ignore
            if (ctProductType.id) {
                // noinspection TypeScriptUnresolvedVariable
                // @ts-ignore
                const result = yield changeProductStateByProductType(ctProductType.name, ctProductType.id, "unpublish", 
                // @ts-ignore
                httpRequestService.getProductsByProductType(ctProductType.id, false, true));
            }
        }
        catch (error) {
            console.log("====== %s", colors.red(error), "=============");
        }
    }
}));
program.command("delete").alias("delete products").description("delete products")
    .option("-i,--productId <id>", "delete by id")
    .option("-t,--productType <name>", "delete by product type")
    .action((args) => __awaiter(this, void 0, void 0, function* () {
    if (!projectKey) {
        console.log(colors.red('no projectkey set please run "commercetools config"'));
        process.exit(9);
    }
    if (args.productId) {
        try {
            const product = yield getProductById(args.productId);
            console.log(product.version);
            const result = yield deleteProducts_1.deleteById(args.productId, product.version);
            console.log("====== %s", colors.green(result));
        }
        catch (error) {
            console.log("====== %s", colors.red(error));
        }
    }
    if (args.productType) {
        if (typeof (args.productType) === "boolean") {
            console.log("====== %s", colors.red("Please provide a valid product Type"), "=============");
            process.exit(1);
        }
        try {
            const productTypes = yield getProductTypes();
            const allTypes = _.map(productTypes, "name");
            const ctProductType = _.pick(_.find(productTypes, { name: args.productType }), ["id", "name"]);
            // noinspection TypeScriptUnresolvedVariable
            // @ts-ignore
            console.log(`ProductType id of`, colors.blue(ctProductType.name), "is", colors.yellow(ctProductType.id));
            // @ts-ignore
            if (ctProductType.id) {
                // noinspection TypeScriptUnresolvedVariable
                // @ts-ignore
                const searchResult = yield productsServices_1.searchForProducts(httpRequestService.getProductsByProductType(ctProductType.id, true, false));
                const total = searchResult.body.total;
                if (total > 0) {
                    console.log("found:", colors.blue(total), "products");
                    inquirer.prompt(questions_1.confirmation(total, "delete")).then((answers) => __awaiter(this, void 0, void 0, function* () {
                        console.log("answers", answers);
                        if (answers.delete) {
                            const result = yield productsServices_1.proccesProducts("deleting", 
                            // @ts-ignore
                            httpRequestService.getProductsByProductType(ctProductType.id, true, false), deleteProducts_1.deleteById);
                        }
                        else {
                        }
                    }));
                }
                else {
                    console.log("Oh Snap, i can only delete unpublished items found %s", colors.red(total), "please unpublish products first homie!");
                    process.exit(1);
                }
            }
        }
        catch (error) {
            console.log("====== %s", colors.red(error), "=============");
        }
    }
}));
program.command("products:publish").alias("publish").description("publish products")
    .option("-i,--productId <id>", "publish by id")
    .option("-t,--productType <name>", "publish by product type")
    .action((id, args) => __awaiter(this, void 0, void 0, function* () {
    if (!projectKey) {
        console.log(colors.red('no projectkey set please run "commercetools config"'));
        process.exit(9);
    }
    if (args.id) {
        try {
            const product = yield getProductById(id);
            const result = yield publishProducts_1.publishById(id, product.version);
            console.log("====== %s", colors.green(result));
        }
        catch (error) {
            console.log("====== %s", colors.red(error));
        }
    }
}));
program.command("product <id>")
    .alias("ls")
    .description(" list product attributes")
    .option("-n, --productname", "show name")
    .option("-s, --sku", "show sku")
    .option("-d, --productdescription", "show description")
    .option("-r, --raw", "show raw json result")
    .action(function (productId, args) {
    if (!projectKey) {
        console.log(colors.red('no projectkey set please run "ctkli config"'));
        process.exit(9);
    }
    const arr = [];
    console.log("======Getting product with id: %s", colors.red(productId), "=============");
    ctClient_1.client2.execute(httpRequestService.getProductByIdUri(productId))
        .then((result) => {
        if (args.sku) {
            console.log("sku: %s", colors.bold(getAttribute("sku", result.body)));
        }
        if (args.productname) {
            console.log("name: %s", colors.bold(getCurrent("name", result.body)));
        }
        if (args.raw) {
            console.log(result.body);
        }
        if (args.productdescription) {
            console.log("description: %s", colors.bold(getCurrent("description", result.body)));
        }
        else {
        }
        if (!args.sku && !args.productname && !args.productdescription && !args.raw) {
            console.log(prettyjson.render(result.body, { keysColor: "blue" }));
        }
    })
        .catch((error) => console.log("Oh Snap an error has occured!  %s", colors.red(error)));
});
program.parse(process.argv);
function getAttribute(attribute, product) {
    return product.masterData.current.masterVariant[attribute];
}
function getCurrent(attribute, product) {
    return product.masterData.current[attribute];
}
function unpublishById(id, version) {
    return __awaiter(this, void 0, void 0, function* () {
        const request = yield ctClient_1.client2.execute(httpRequestService.unpublishById(id, version));
        console.log("description: %s", colors.bold(`unpublishing by id: ${id}`));
        return request;
    });
}
function changeProductStateByProductType(name, id, action, request) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("description: %s", colors.bold(`${action} by product type: ${name}`));
        ctClient_1.client2.process(request, (payload) => {
            console.log("payload", payload);
            const results = payload.body.results;
            return Promise.all(results.map((product) => {
                console.log("unpublishing:", product.id);
                unpublishById(product.id, product.version);
            }));
        }, { accumulate: false, total: 1000 })
            .then((result) => {
            console.log("finished unpublishing");
        })
            .catch((error) => console.log("Oh Snap an error has occured!  %s", colors.red(error)));
    });
}
function getProductById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield ctClient_1.client2.execute(httpRequestService.getProductByIdUri(id));
        return response.body;
    });
}
exports.getProductById = getProductById;
function getProductTypes() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield ctClient_1.client2.execute(httpRequestService.getProductTypes());
        if (response.statusCode === 200) {
            console.log("success");
        }
        return response.body.results;
    });
}
exports.getProductTypes = getProductTypes;
