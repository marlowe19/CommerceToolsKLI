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
const ctClient_1 = require("../commercetools/ctClient");
const colors = require("colors");
const product_1 = require("../commercetools/product");
const store_1 = require("./store");
const httpRequestService = new product_1.requestService(store_1.default.all);
function unpublishById(id, version) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let request = yield ctClient_1.client2.execute(httpRequestService.unpublishById(id, version));
            console.log('description: %s', colors.bold(`unpublishing by id: ${id}`));
            return request;
        }
        catch (error) {
            let request = yield ctClient_1.client2.execute(httpRequestService.unpublishById(id, version));
            console.log('description: %s', colors.bold(`unpublishing by id: ${id}`));
            console.log("the type", typeof (error));
            return "hallo";
        }
    });
}
exports.unpublishById = unpublishById;
