import {CreateSchemaCustomizationArgs, GatsbyNode, PluginOptions} from 'gatsby';

export const createSchemaCustomization: GatsbyNode['createSchemaCustomization'] = async (
  node: CreateSchemaCustomizationArgs,
  options: PluginOptions
) => {
  if (options.downloadImages) {
    node.actions.createTypes(`
      type ${options.typePrefix}Image {
        localFile: File @link
      }
    `);
  }
};
