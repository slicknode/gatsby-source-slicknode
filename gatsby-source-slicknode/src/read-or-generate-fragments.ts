import {GraphQLSource, RemoteTypeName} from 'gatsby-graphql-source-toolkit/dist/types';
import path from 'path';
import {Source, parse, print} from 'graphql';
import fs from 'fs-extra';
import {generateFragments, IGenerateFragmentsParams} from './generate-fragments';

/**
 * Utility function that tries to load fragments from given path
 * and generates default fragments when some of the fragments do not exist
 */
export async function readOrGenerateFragments(
  fragmentsDir: string,
  config: IGenerateFragmentsParams
): Promise<Map<RemoteTypeName, GraphQLSource>> {
  const defaultFragments = generateFragments(config)
  const result = new Map<RemoteTypeName, GraphQLSource>()

  await fs.ensureDir(fragmentsDir)
  for (const [remoteTypeName, fragment] of defaultFragments) {
    const fileName = path.join(fragmentsDir, `${remoteTypeName}.graphql`)
    let source
    try {
      source = new Source(fs.readFileSync(fileName).toString(), fileName)
    } catch (e) {
      fs.writeFileSync(fileName, print(parse(fragment as GraphQLSource)));
      source = new Source(String(fragment), fileName);
    }
    result.set(remoteTypeName, source)
  }

  return result
}