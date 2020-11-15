import {
  assertCompositeType, getNamedType,
  GraphQLCompositeType, GraphQLField, GraphQLNamedType,
  GraphQLSchema, isCompositeType, isEnumType, isObjectType, isScalarType, isUnionType
} from 'graphql';
import {GraphQLSource, RemoteTypeName} from 'gatsby-graphql-source-toolkit/dist/types';

interface IGatsbyNodeType {
  remoteTypeName: string;
}

interface IGenerateFragmentsOptions {

}

export interface IGenerateFragmentsParams {
  schema: GraphQLSchema;
  gatsbyNodeTypes: IGatsbyNodeType[],
  options: IGenerateFragmentsOptions,
}

type FieldFilter = (field: GraphQLField<any, any>) => boolean;

export function generateFragments({
  schema,
  gatsbyNodeTypes,
  options,
}: IGenerateFragmentsParams): Map<RemoteTypeName, GraphQLSource | string> {
  const fragments = new Map<RemoteTypeName, GraphQLSource | string>();

  gatsbyNodeTypes.forEach((nodeType) => {
    const selectionSet = generateSelectionSetForType({
      schema,
      type: assertCompositeType(schema.getType(nodeType.remoteTypeName)),
      options,
    });
    fragments.set(
      nodeType.remoteTypeName,
      `fragment ${nodeType.remoteTypeName} on ${nodeType.remoteTypeName} { remoteTypeName: __typename remoteId: id ${selectionSet} }`,
    );
  });

  return fragments;
}

function generateSelectionSetForType({type, schema, options}: {
  schema: GraphQLSchema,
  type: GraphQLCompositeType,
  options: IGenerateFragmentsOptions,
}): string {
  if (isObjectType(type)) {
    const fields = type.getFields();
    return Object
      .keys(fields)
      .map(fieldName => fields[fieldName])
      // Apply field filters
      .filter(field => {
        return !DEFAULT_FILTERS.find(filter => !filter(field));
      })
      .map(field => generateSelectionSetForField({
        field,
        schema,
        options,
      }))
      .join(' ');
  }

  return '';
}

function generateSelectionSetForField({field, schema, options}: {
  field: GraphQLField<any, any>,
  schema: GraphQLSchema,
  options: IGenerateFragmentsOptions,
}): string {
  const fieldType = getNamedType(field.type);
  if (isScalarType(fieldType) || isEnumType(fieldType)) {
    return field.name;
  } else if (isObjectType(fieldType)) {
    // Check if is node, add reference instead of full fragment
    if (isNode(fieldType)) {
      return `${field.name} { remoteTypeName: __typename remoteId: id }`;
    } else {
      return `${field.name} { ${generateSelectionSetForType({schema, type: fieldType, options})} }`;
    }
  } else if (isCompositeType(fieldType)) {
    const possibleTypes = schema.getPossibleTypes(fieldType);
    return `${field.name} {${possibleTypes.map(t => {
      if (isNode(t)) {
        return `...on ${t.name} { remoteTypeName: __typename remoteId: id }`;
      } else {
        return `...on ${t.name} { ${generateSelectionSetForType({type: t, schema, options})} }`;
      }
    }).join(' ')}}`;
  } else {
    return '';
  }
}

function isNode(type: GraphQLNamedType) {
  if (isObjectType(type) && type.getInterfaces().find(i => i.name === 'Node')) {
    return true;
  }
  return false;
}

const ConnectionFieldFilter: FieldFilter = (field) => {
  const type = getNamedType(field.type);
  return !(type.name.endsWith('Connection') && type.name.startsWith('_'));
};

const VersionsFieldFilter: FieldFilter = (field) => {
  return field.name !== '_versions';
}

const IgnoreTypeFilter = (types: string[]): FieldFilter => (field) => {
  return !types.includes(getNamedType(field.type).name);
};

const IgnoreFieldFilter = (fields: string[]): FieldFilter => (field) => {
  return !fields.includes(field.name);
};

const DEFAULT_FILTERS = [
  ConnectionFieldFilter,
  VersionsFieldFilter,
  IgnoreTypeFilter(['User', 'ContentStatus']),
  IgnoreFieldFilter(['id'])
];
