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
const unpublishProducts_1 = require("./lib/unpublishProducts");
it('should return status code 200', function () {
    return __awaiter(this, void 0, void 0, function* () {
        let data = yield unpublishProducts_1.unpublishById("c6acb44c-b608-4ed2-bbdd-0a77a8b4598c", 5);
        console.log("data", data);
        expect(data.statusCode).toBe(200);
        //return expect().toBeUndefined()
    });
});
