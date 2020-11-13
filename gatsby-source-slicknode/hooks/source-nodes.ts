import {PluginOptions, SourceNodesArgs} from 'gatsby';
import {assertInterfaceType, GraphQLObjectType} from 'graphql';
import {RelayPagination} from './pagination/relay-pagination';

import {
  createDefaultQueryExecutor,
  loadSchema,
  generateDefaultFragments,
  compileNodeQueries,
  buildNodeDefinitions,
  createSchemaCustomization,
  sourceAllNodes,
} from 'gatsby-graphql-source-toolkit';

function getRootListField(type: GraphQLObjectType) {
  const typeName = type.name;
  const parts = typeName.split('_');
  if (parts.length > 1) {
    return parts.shift() + '_list' + parts.join('_');
  } else {
    return `list${typeName}`;
  }
}

const IGNORED_TYPES = [
  'ContentNode',
  'File',
  'Image',
];

async function createSourcingConfig(gatsbyApi: SourceNodesArgs, pluginOptions: PluginOptions) {
  const {
    preview,
    endpoint,
    typePrefix,
  } = pluginOptions;

  if (!endpoint) {
    gatsbyApi.reporter.panic('gatsby-source-slicknode: Plugin option endpoint not configured');
  }

  // Step1. Set up remote schema:
  const execute = createDefaultQueryExecutor(String(endpoint), {
    headers: {
      'x-slicknode-preview': preview ? '1' : '0',
    },
  });
  const schema = await loadSchema(execute);
  const types: GraphQLObjectType[] = schema
    .getPossibleTypes(assertInterfaceType(schema.getType('Node')))
    .filter(
      (type: GraphQLObjectType) => (
        // Ignored types
        !IGNORED_TYPES.includes(type.name) &&

        // Do not include version types
        !type.name.endsWith('_Version')
      )
    );

  // Step2. Configure Gatsby node types
  const gatsbyNodeTypes = types.map((type) => ({
    remoteTypeName: type.name,
    queries: `
      query LIST_${type.name.toUpperCase()}($first: Int, $after: String) {
        ${getRootListField(type)}(first: $first, after: $after){
          edges {
            cursor
            node {
              ..._${type.name}Id_
            }
          }
        }
      }
      fragment _${type.name}Id_ on ${type.name} { __typename id }
    `,
  }));

  console.log('Types', gatsbyNodeTypes);
  // Step3. Provide (or generate) fragments with fields to be fetched
  const fragments = generateDefaultFragments({ schema, gatsbyNodeTypes });
  console.log('Fragments', fragments);

  // Step4. Compile sourcing queries
  const documents = compileNodeQueries({
    schema,
    gatsbyNodeTypes,
    customFragments: fragments,
  })

  return {
    gatsbyApi,
    schema,
    execute,
    paginationAdapters: [
      RelayPagination,
    ],
    gatsbyTypePrefix: `Example`,
    gatsbyNodeDefs: buildNodeDefinitions({ gatsbyNodeTypes, documents }),
  }
}

export async function sourceNodes(gatsbyApi: SourceNodesArgs, options: PluginOptions) {
  const config = await createSourcingConfig(gatsbyApi, options);

  // Step5. Add explicit types to gatsby schema
  await createSchemaCustomization(config);

  // Step6. Source nodes
  await sourceAllNodes(config);
}
