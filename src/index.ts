#!/usr/bin/env node

import { createRequestBuilder } from "@commercetools/api-request-builder";
import * as clear from "clear";
import * as colors from "colors";
import * as program from "commander";
import * as csv from "csv";
import * as figlet from "figlet";
import * as inquirer from "inquirer";
import * as  _ from "lodash";
import {client2} from "./commercetools/ctClient";
import {proccesProducts, RequestFactory, searchForProducts} from "./commercetools/productsServices";
import {configQuestions, confirmation} from "./inquirer/questions";
import {publishById} from "./lib/publishProducts";
import  store from "./lib/store";
const pkg = require("../package.json");
import * as prettyjson from "prettyjson";
import {deleteById} from "./commercetools/deleteProducts";
// clear()
// console.log(colors.red( figlet.textSync('Commerce tool Kli',{ horizontalLayout:'full'})))

const projectKey = store.get("projectKey");
const clientId = store.get("clientId");
const clientSecret = store.get("clientSecret");
const restUrl = store.get("apiUrl");
const authUrl = store.get("authUrl");

program.command("config")
    .description("configure project")
    .action(  (args)=> {
        inquirer.prompt(configQuestions).then((answers) => {
            console.log("answers", answers);

            store.set("clientId", answers.clientId);
            store.set("clientSecret", answers.clientSecret);
            store.set("apiUrl", answers.restApiUrl);
            store.set("authUrl", answers.authUrl);
            store.set("projectKey", answers.projectKey);

            console.log("settings", store.all);
        });
    });

const httpRequestService = new RequestFactory(store.all);

program.command("list")
    .alias("ls")
    .description(" list product attributes")
    .option("-i, --id [value]", "Product id")
    .action(function() {

});
program.command("unpublish")
    .description("unpublish products")
    .option("-i --productId <id>]", "unpublish by id")
    .option("-p, --productType <value>")
    .action( async (args)=> {
        clear();
        if (!projectKey) {
            console.log(colors.red('no projectkey set please run "ctkli config"'));
            process.exit(9);

        }
        if (args.productId) {
            try {
                const product = await getProductById(args.productId);
                console.log("version:", product.version);
                const result =  await unpublishById(args.productId, product.version);

                console.log("====== %s", colors.green(result));

            } catch (error) {
                console.log("====== %s", colors.red(error));
            }

        }
        if (args.productType) {
            if (typeof(args.productType) == "boolean") {
                console.log("====== %s", colors.red("Please provide a valid product Type"), "=============");
                process.exit(1);
            }

            try {
                const productTypes = await getProductTypes();

                const allTypes = _.map(productTypes, "name");
                const ctProductType = _.pick(_.find(productTypes, {name: args.productType}), ["id", "name"]);

                // noinspection TypeScriptUnresolvedVariable
                // @ts-ignore
                if (ctProductType.id) {
                    // noinspection TypeScriptUnresolvedVariable
                    // @ts-ignore
                    const result = await changeProductStateByProductType(ctProductType.name, ctProductType.id,
                        "unpublish",
                        // @ts-ignore
                        httpRequestService.getProductsByProductType(ctProductType.id, false, true));
                }

            } catch (error) {
                console.log("====== %s", colors.red(error), "=============");
            }

        }

    });

program.command("delete").alias("delete products").description("delete products")
    .option("-i,--productId <id>", "delete by id")
    .option("-t,--productType <name>", "delete by product type")
    .action( async (args) => {
        if (!projectKey) {
            console.log(colors.red('no projectkey set please run "commercetools config"'));
            process.exit(9);

        }
        if (args.productId) {
            try {
                const product = await getProductById(args.productId);
                console.log(product.version);
                const result =  await deleteById(args.productId, product.version);

                console.log("====== %s", colors.green(result));

            } catch (error) {
                console.log("====== %s", colors.red(error));
            }

        }
        if (args.productType) {
                if (typeof(args.productType) === "boolean") {
                    console.log("====== %s", colors.red("Please provide a valid product Type"), "=============");
                    process.exit(1);
                }

                try {
                    const productTypes = await getProductTypes();

                    const allTypes = _.map(productTypes, "name");
                    const ctProductType = _.pick(_.find(productTypes, {name: args.productType}), ["id", "name"]);

                    // noinspection TypeScriptUnresolvedVariable
                    // @ts-ignore
                    console.log(`ProductType id of`, colors.blue(ctProductType.name),"is",colors.yellow(ctProductType.id));
                    // @ts-ignore
                    if (ctProductType.id) {
                        // noinspection TypeScriptUnresolvedVariable
                        // @ts-ignore
                        const  searchResult = await searchForProducts(httpRequestService.getProductsByProductType(ctProductType.id,true,false))
                        const total = searchResult.body.total
                        if (total > 0){
                            console.log("found:", colors.blue(total), "products")
                            inquirer.prompt(confirmation(total, "delete")).then(async (answers) => {
                                console.log("answers", answers);
                                if(answers.delete){
                                    const result = await proccesProducts("deleting",
                                        // @ts-ignore
                                        httpRequestService.getProductsByProductType(ctProductType.id,true,false), deleteById);
                                }else{

                                }

                            });
                        } else {
                            console.log("Oh Snap, i can only delete unpublished items found %s", colors.red(total),"please unpublish products first homie!")
                            process.exit(1)
                        }

                    }

                } catch (error) {
                    console.log("====== %s", colors.red(error), "=============");
                }
        }
    });

program.command("products:publish").alias("publish").description("publish products")
    .option("-i,--productId <id>", "publish by id")
    .option("-t,--productType <name>", "publish by product type")
    .action( async (id, args) => {
        if (!projectKey) {
            console.log(colors.red('no projectkey set please run "commercetools config"'));
            process.exit(9);

        }
        if (args.id) {
            try {
                const product = await getProductById(id);

                const result =  await publishById(id, product.version);

                console.log("====== %s", colors.green(result));

            } catch (error) {
                console.log("====== %s", colors.red(error));
            }

        }
});

program.command("product <id>")
    .alias("ls")
    .description(" list product attributes")
    .option("-n, --productname", "show name")
    .option("-s, --sku", "show sku")
    .option("-d, --productdescription", "show description")
    .option("-r, --raw", "show raw json result")
    .action(function(productId, args) {
        if (!projectKey) {
            console.log(colors.red('no projectkey set please run "ctkli config"'));
            process.exit(9);

        }
        const arr = [];

        console.log("======Getting product with id: %s", colors.red(productId), "=============");

        client2.execute(httpRequestService.getProductByIdUri(productId))
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
                } else {

                }

                if (!args.sku && !args.productname && !args.productdescription && !args.raw) {
                    console.log(prettyjson.render(result.body, {keysColor: "blue"}));
                }

            })
            .catch((error) =>  console.log("Oh Snap an error has occured!  %s", colors.red(error)));
    });

program.parse(process.argv);

function getAttribute(attribute: string, product) {

   return product.masterData.current.masterVariant[attribute];
}

function getCurrent(attribute: string, product) {

    return product.masterData.current[attribute];
}

async function unpublishById(id, version) {

     const request = await client2.execute(httpRequestService.unpublishById(id, version));
     console.log("description: %s", colors.bold(`unpublishing by id: ${id}`));

     return request;

}

async function  changeProductStateByProductType(name, id, action, request) {

    console.log("description: %s", colors.bold(`${action} by product type: ${name}`));

    client2.process(
        request,
        (payload) => {
            console.log("payload", payload);
            const results = payload.body.results;
            return Promise.all(
                results.map((product) => {
                        console.log("unpublishing:", product.id);
                        unpublishById(product.id, product.version);
                    },
                ),
            );
        },
        { accumulate: false, total: 1000 },
    )
        .then((result) => {
            console.log("finished unpublishing");
        })
        .catch((error) =>  console.log("Oh Snap an error has occured!  %s", colors.red(error)));

}

export async function getProductById(id) {

  const response =  await client2.execute(httpRequestService.getProductByIdUri(id));

  return response.body;
}

export async  function getProductTypes() {
    const response = await client2.execute(httpRequestService.getProductTypes());

    if (response.statusCode === 200) {
        console.log("success");
    }
    return response.body.results;
}
