"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var plugin_options_schema_1 = require("./hooks/plugin-options-schema");
var GatsbySourceSlicknode = {
    pluginOptionsSchema: plugin_options_schema_1.pluginOptionsSchema,
};
exports.pluginOptionsSchema = require('./hooks/plugin-options-schema').pluginOptionsSchema;
exports.onPreInit = require('./hooks/on-pre-init').onPreInit;
exports.sourceNodes = require('./hooks/source-nodes').sourceNodes;
