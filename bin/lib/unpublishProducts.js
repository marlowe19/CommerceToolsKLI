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
const commerceToolsRequestService_1 = require("../commercetools/commerceToolsRequestService");
const colors = require("colors");
function unpublishById(id, version) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const request = yield ctClient_1.client2.execute(commerceToolsRequestService_1.default.unpublishById(id, version));
            console.log(colors.blue(`unpublishing by id: ${id}`));
            return request;
        }
        catch (error) {
            console.log(colors.red(`attempt to unpublish by id: ${id} failed`));
        }
    });
}
exports.unpublishById = unpublishById;
