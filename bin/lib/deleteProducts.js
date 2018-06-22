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
const ctClient_1 = require("../commercetools/ctClient");
const commerceToolsRequestService_1 = require("./commerceToolsRequestService");
function proccesProducts(action, request, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        ctClient_1.client2.process(request, (payload) => {
            const results = payload.body.results;
            console.log("results", payload.body);
            return Promise.all(results.map((product) => {
                console.log(`${action}:"${product.id}`);
                callback(product.id, product.version);
            }));
        }, { accumulate: false, total: 40 })
            .then(result => {
            console.log(`finished ${action}`);
        })
            .catch(error => console.log("Oh Snap an error has occured!  %s", colors.red(error)));
    });
}
exports.proccesProducts = proccesProducts;
function deleteById(id, version) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("deleteting product with id", id);
        return yield ctClient_1.client2.execute(commerceToolsRequestService_1.default.deleteById(id, version));
    });
}
exports.deleteById = deleteById;
