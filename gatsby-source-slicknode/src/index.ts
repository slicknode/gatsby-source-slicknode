/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/node-apis/
 */
import {GatsbyNode, PluginOptionsSchemaArgs} from 'gatsby';
import {pluginOptionsSchema} from './hooks/plugin-options-schema';

const GatsbySourceSlicknode: GatsbyNode = {
  pluginOptionsSchema,
}
exports.pluginOptionsSchema = require('./hooks/plugin-options-schema').pluginOptionsSchema;
exports.onPreInit = require('./hooks/on-pre-init').onPreInit;
exports.sourceNodes = require('./hooks/source-nodes').sourceNodes;
