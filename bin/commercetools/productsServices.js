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
const api_request_builder_1 = require("@commercetools/api-request-builder");
const colors = require("colors");
const ctClient_1 = require("./ctClient");
function proccesProducts(action, request, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        ctClient_1.client2.process(request, (payload) => {
            const results = payload.body.results;
            return Promise.all(results.map((product) => {
                console.log(`${action}:"${product.id}`);
                callback(product.id, product.version);
            }));
        }, { accumulate: false, total: 1000 })
            .then((result) => {
            console.log(`finished ${action}`);
        })
            .catch((error) => console.log("Oh Snap an error has occured!  %s", colors.red(error)));
    });
}
exports.proccesProducts = proccesProducts;
function searchForProducts(request) {
    return __awaiter(this, void 0, void 0, function* () {
        return ctClient_1.client2.execute(request);
    });
}
exports.searchForProducts = searchForProducts;
class RequestFactory {
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
        return {
            uri: this.productsService.byId(productId).build(),
            method: "GET",
        };
    }
    deleteById(productId, version) {
        return {
            uri: this.productsService.byId(productId).withVersion(version).build(),
            method: "DELETE",
            body: JSON.stringify({
                version,
            }),
        };
    }
    unpublishById(productId, version) {
        return {
            uri: this.productsService.byId(productId).build(),
            method: "POST",
            body: JSON.stringify({
                version,
                actions: [{ action: "unpublish" }],
            }),
        };
    }
    getProductTypes() {
        return {
            uri: this.productTypService.build(),
            method: "GET",
        };
    }
    getProductsByProductType(productTypeId, staged, isPublished) {
        return {
            method: "GET",
            uri: this.createproductProjectionsService(productTypeId, staged, isPublished),
        };
    }
    createproductProjectionsService(id, isStaged, isPublished) {
        return this.productProjectionsService
            .where(`productType(id ="${id}") and published ="${this.convertBooleanToText(isPublished)}"`)
            .staged(isStaged)
            .build();
    }
    convertBooleanToText(bool) {
        return bool ? "true" : "false";
    }
}
exports.RequestFactory = RequestFactory;
