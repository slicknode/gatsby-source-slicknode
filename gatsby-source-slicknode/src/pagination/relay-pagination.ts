import {IPaginationAdapter} from 'gatsby-graphql-source-toolkit/dist/config/pagination-adapters';
const DEFAULT_PAGE_SIZE = 10;

export interface IRelayPage {
  edges: { cursor: string; node: object | null }[]
  pageInfo: { hasNextPage: boolean }
}

export const RelayPagination: IPaginationAdapter<IRelayPage, object> = {
  name: "RelayPagination",
  expectedVariableNames: [`first`, `after`],
  start() {
    return {
      variables: { first: DEFAULT_PAGE_SIZE, after: undefined },
      hasNextPage: true,
    }
  },
  next(state, page) {
    const tail = page.edges[page.edges.length - 1]
    const first = Number(state.variables.first) ?? DEFAULT_PAGE_SIZE
    const after = tail?.cursor
    return {
      variables: { first, after },
      hasNextPage: Boolean(page?.pageInfo?.hasNextPage && tail),
    }
  },
  concat(acc, page) {
    return {
      ...acc,
      edges: {
        ...acc.edges,
        ...page.edges,
      },
      pageInfo: page.pageInfo,
    }
  },
  getItems(pageOrResult) {
    return pageOrResult.edges.map(edge => (edge ? edge.node : null))
  },
}