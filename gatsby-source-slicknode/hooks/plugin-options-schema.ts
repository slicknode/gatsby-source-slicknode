import {PluginOptionsSchemaArgs} from 'gatsby';

export function pluginOptionsSchema({Joi}: PluginOptionsSchemaArgs) {
  return Joi.object({
    // The Slicknode GraphQL API endpoint
    endpoint: Joi.string()
      .description('The Slicknode GraphQL-API endpoint')
      .required(),

    typePrefix: Joi.string()
      .description('The type prefix to prepend to GraphQL types')
      .default('Slicknode'),

    // If true, data will be loaded in preview mode
    preview: Joi.boolean()
      .default(false)
      .description('Load content from the API in preview state'),
  });
}
