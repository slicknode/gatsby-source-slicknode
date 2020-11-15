import {GatsbyNode} from 'gatsby';

export const pluginOptionsSchema: GatsbyNode['pluginOptionsSchema'] = ({Joi}) => {
  return Joi.object({
    // The Slicknode GraphQL API endpoint
    endpoint: Joi.string()
      .description('The Slicknode GraphQL-API endpoint')
      .required(),

    typePrefix: Joi.string()
      .description('The type prefix to prepend to GraphQL types')
      .default('Slicknode_'),

    // If true, data will be loaded in preview mode
    preview: Joi.boolean()
      .default(false)
      .description('Load content from the API in preview state'),

    fragmentsPath: Joi.string()
      .default('slicknode-fragments')
      .description('Path to the directory where Slicknode source plugin stores fragments'),

    downloadImages: Joi.boolean()
      .default(true)
      .description('Download images to local file system and create file node (for gatsby-image etc.)'),
  });
}
