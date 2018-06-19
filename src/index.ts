#!/usr/bin/env node

import * as colors from "colors";
import * as csv from "csv";
import * as inquirer from "inquirer"
import * as program from "commander"
import loginMiddelWare from "./commercetools/login"
import { createRequestBuilder } from '@commercetools/api-request-builder'
import {requestService} from "./commercetools/product";
import fetch from "node-fetch"
import * as  _ from "lodash"
import * as configStore from "configstore"
import * as figlet from "figlet"
import * as clear from "clear"
import {configQuestions} from "./inquirer/questions";
import {client2} from "./commercetools/ctClient";
const pkg = require('../package.json');
import * as prettyjson from "prettyjson"
clear()
//console.log(colors.red( figlet.textSync('Commerce tool Kli',{ horizontalLayout:'full'})))

const store = new configStore(pkg.name)
const projectKey = store.get('projectKey')
const clientId = store.get('clientId')
const clientSecret = store.get('clientSecret')
const restUrl = store.get('apiUrl')
const authUrl = store.get('authUrl')

program.command('config')
    .description('configure project')
    .action( function(args){
        inquirer.prompt(configQuestions).then(answers => {
            // Use user feedback for... whatever!!
            console.log("answers", answers)


            store.set('clientId',answers.clientId)
            store.set('clientSecret',answers.clientSecret)
            store.set('apiUrl',answers.restApiUrl)
            store.set('authUrl',answers.authUrl)
            store.set('projectKey',answers.projectKey)

            console.log("settings", store.all)
        });
    })


const httpRequestService = new requestService(store.all)



program.command('list')
    .alias('ls')
    .description(' list product attributes')
    .option('-i, --id [value]', 'Product id')
    .action(function(){




})
program.command('unpublish [id]')
    .description('unpublish products')
    .option('-i --productId [value]','unpublish by id')
    .option('-p, --productType [value]')
    .action( async function (id, args) {
        clear()
        if(!projectKey){
            console.log(colors.red('no projectkey set please run "ctkli config"'))
            process.exit(9)

        }
        if(id){
            try{
                const product = await getProductById(id)
               console.log("version:",product.version)
                const result =  await unpublishById(id, product.version)

                console.log('====== %s', colors.green(result))

            }catch(error){
                console.log('====== %s', colors.red(error))
            }


        }
        if(args.productType){
            if(typeof(args.productType) == "boolean"){
                console.log('====== %s', colors.red('Please provide a valid product Type'),"=============");
             process.exit(1)
            }

            try{
                let productTypes = await getProductTypes()


                const allTypes= _.map(productTypes,'name');
                let ctProductType = _.pick(_.find(productTypes,{name:args.productType}),['id','name'])

                // noinspection TypeScriptUnresolvedVariable
                // @ts-ignore
                if(ctProductType.id){
                    // noinspection TypeScriptUnresolvedVariable
                    // @ts-ignore
                    let result = await changeProductStateByProductType(ctProductType.name,ctProductType.id,
                        "unpublish",
                        // @ts-ignore
                        httpRequestService.getProductsByProductType(ctProductType.id))
                }

            }catch (error){
                console.log('====== %s', colors.red(error),"=============");
            }


        }

    })




program.command('product <id>')
    .alias('ls')
    .description(' list product attributes')
    .option('-n, --productname', 'show name')
    .option('-s, --sku', 'show sku')
    .option('-d, --productdescription', 'show description')
    .option('-r, --raw', 'show raw json result')

    .action(function(productId,args){
        if(!projectKey){
            console.log(store.all)
            console.log(colors.red('no projectkey set please run "ctkli config"'))
            process.exit(9)

        }
        let arr = []

        console.log('======Getting product with id: %s', colors.red(productId),"=============");

    console.log("request",httpRequestService.getProductByIdUri(productId))

        client2.execute(httpRequestService.getProductByIdUri(productId))
            .then(result => {

                if(args.sku){
                    console.log('sku: %s', colors.bold(getAttribute("sku", result.body)));
                }
                if(args.productname){
                    console.log('name: %s', colors.bold(getCurrent("name", result.body)));
                }
                if(args.raw){
                    console.log(result.body)
                }
                if(args.productdescription){
                    console.log('description: %s', colors.bold(getCurrent("description", result.body)));
                }else{

                }

                if (!args.sku && !args.productname && !args.productdescription && !args.raw){
                    console.log(prettyjson.render(result.body,{keysColor:'blue'}))
                }

            })
            .catch(error =>  console.log('Oh Snap an error has occured!  %s', colors.red(error)))
    })



program.parse(process.argv);


function getAttribute(attribute:string,product){


   return product.masterData["current"].masterVariant[attribute]
}

function getCurrent(attribute:string,product){


    return product.masterData["current"][attribute]
}

async function unpublishById(id,version){

     let request = await client2.execute(httpRequestService.unpublishById(id,version))
    console.log('description: %s', colors.bold(`unpublishing by id: ${id}`));

    return request

}

async function  changeProductStateByProductType(name,id,action,request){

    console.log('description: %s', colors.bold(`${action} by product type: ${name}`));

    client2.process(
        request,
        (payload) => {
            console.log("payload",payload)
            const results = payload.body.results
            return Promise.all(
                results.map(product =>
                    {
                        console.log("unpublishing:",product.id)
                        //unpublishById(product.id,product.version)
                    }
                ),
            )
        },
        { accumulate: false, total: 40 },
    )
        .then(result => {
            console.log('finished unpublishing')
        })
        .catch(error =>  console.log('Oh Snap an error has occured!  %s', colors.red(error)))


}




async function getProductById(id){

  let response =  await client2.execute(httpRequestService.getProductByIdUri(id))

    return response.body
}

async  function getProductTypes(){
    let response = await client2.execute(httpRequestService.getProductTypes())

    if(response.status === 200){
        console.log("success")
    }
    return response.body.results
}