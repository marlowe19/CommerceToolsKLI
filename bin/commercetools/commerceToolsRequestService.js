"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const productsServices_1 = require("./productsServices");
const store_1 = require("../lib/store");
const httpRequestService = new productsServices_1.RequestFactory(store_1.default.all);
exports.default = httpRequestService;
