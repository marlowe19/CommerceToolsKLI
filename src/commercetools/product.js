"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_request_builder_1 = require("@commercetools/api-request-builder");
function listproductAttributes(attributes) {
}
exports.listproductAttributes = listproductAttributes;
class requestService {
    constructor(settings) {
        this.projectKey = settings.projectKey;
        this.clientSecret = settings.clientSecret;
        this.clientId = settings.clientId;
        this.authUrl = settings.authUrl;
        this.restUrl = settings.restUrl;
        if (this.projectKey) {
            const requestBuilder = api_request_builder_1.createRequestBuilder({ projectKey: this.projectKey });
            this.productProjectionsService = requestBuilder.productProjections;
            this.productsService = requestBuilder.products;
            this.productTypService = requestBuilder.productTypes;
        }
    }
    getProductByIdUri(productId) {
        const request = {
            uri: this.productsService.byId(productId).build(),
            method: "GET",
        };
        return request;
    }
    unpublishById(productId, version) {
        console.log("product version", version);
        let request = {
            uri: this.productsService.byId(productId).build(),
            method: "POST",
            body: JSON.stringify({
                version: version,
                actions: [{ action: 'unpublish' }]
            })
        };
        return request;
    }
    getProductTypes() {
        return {
            uri: this.productTypService.build(),
            method: "GET"
        };
    }
    getProductsByProductType(productTypeId) {
        let request = {
            uri: this.createproductProjectionsService(productTypeId),
            method: "GET"
        };
        console.log("products uri:", request);
        return request;
    }
    createproductProjectionsService(id) {
        return this.productProjectionsService
            .where(`productType(id ="${id}") and published ="false"`).staged(true)
            .build();
    }
}
exports.requestService = requestService;
