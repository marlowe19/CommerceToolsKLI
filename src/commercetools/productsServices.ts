import { createRequestBuilder } from "@commercetools/api-request-builder";
import * as colors from "colors";
import fetch from "node-fetch";
import {client2} from "./ctClient";
import loginMiddelWare from "./login";
import requestService from "./commerceToolsRequestService";

export async function  proccesProducts(action: string, request: object, callback) {

    client2.process(
        request,
        (payload) => {

            const results = payload.body.results;
            return Promise.all(
                results.map((product) => {
                        console.log(`${action}:"${product.id}`);
                        callback(product.id, product.version);
                    },
                ),
            );
        },
        { accumulate: false, total: 1000 },
    )
        .then((result) => {
            console.log(`finished ${action}`);
        })
        .catch((error) =>  console.log("Oh Snap an error has occured!  %s", colors.red(error)));

}

export async function searchForProducts(request){


    return client2.execute(request);
}

export class RequestFactory {
    public requestBuilder;
    public productsService;
    public productProjectionsService;
    public productTypService;
    private projectKey: string;
    private clientSecret: string;
    private clientId: string;
    private authUrl: string;
    private restUrl: string;
    constructor(settings) {

        this.projectKey = settings.projectKey;
        this.clientSecret = settings.clientSecret;
        this.clientId = settings.clientId;
        this.authUrl = settings.authUrl;
        this.restUrl = settings.restUrl;
        if (this.projectKey) {

             const requestBuilder = createRequestBuilder({ projectKey: this.projectKey });
             this.productProjectionsService = requestBuilder.productProjections;
             this.productsService = requestBuilder.products;
             this.productTypService = requestBuilder.productTypes;
         }

    }
    public getProductByIdUri(productId: string): object {
        return {
            uri: this.productsService.byId(productId).build(),
            method: "GET",
        };
    }

    public deleteById(productId, version) {
        return {
            uri: this.productsService.byId(productId).withVersion(version).build(),
            method: "DELETE",
            body: JSON.stringify({
                version,
            }),
        };
    }
    public unpublishById(productId: string, version: number) {
        return {
            uri: this.productsService.byId(productId).build(),
            method: "POST",
            body: JSON.stringify({
                version,
                actions: [{action: "unpublish"}],
            }),
        };
    }

    public getProductTypes() {
        return {
            uri: this.productTypService.build(),
            method: "GET",
        };
    }

    public getProductsByProductType(productTypeId: string, staged: boolean, isPublished:boolean) {
        return {
            method: "GET",
            uri: this.createproductProjectionsService(productTypeId, staged, isPublished),

        };
    }

    private createproductProjectionsService(id, isStaged: boolean, isPublished): string {
        return this.productProjectionsService
            .where(`productType(id ="${id}") and published ="${this.convertBooleanToText(isPublished)}"`)
            .staged(isStaged)
            .build();
     }
     private convertBooleanToText(bool){
        return bool ? "true": "false"
     }

}
