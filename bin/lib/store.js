"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const configStore = require("configstore");
const pkg = require('../../package.json');
const store = new configStore(pkg.name);
exports.default = store;
