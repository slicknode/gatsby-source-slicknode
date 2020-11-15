import {GatsbyNode} from 'gatsby';
import {createRemoteFileNode} from 'gatsby-source-filesystem';

export const onCreateNode: GatsbyNode['onCreateNode'] = async (
  {
    node,
    actions: {createNode},
    createNodeId,
    getCache,
    reporter,
  },
  options,
) => {
  if (
    options && options.downloadImages &&
    node.remoteTypeName === 'Image'
  ) {
    const fileNode = await createRemoteFileNode({
      url: String(node.url),
      parentNodeId: node.id,
      createNode,
      createNodeId,
      getCache,
    } as any);
    if (fileNode) {
      (node as any).localFile = fileNode.id;
    }
  }
};
