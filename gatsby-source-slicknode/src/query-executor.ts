import fetch, {RequestInit as FetchOptions} from 'node-fetch';
import {IQueryExecutionArgs, IQueryExecutor} from 'gatsby-graphql-source-toolkit/dist/types';

const MAX_QUERY_RETRIES = 5;

interface IExecutorParams {
  endpoint: string;
  fetchOptions: FetchOptions;
}

export function createExecutor(params: IExecutorParams): IQueryExecutor {
  async function execute(args: IQueryExecutionArgs) {
    const { query, variables, operationName } = args

    const response = await fetch(params.endpoint, {
      method: 'POST',
      ...params.fetchOptions,
      headers: {
        ...(params?.fetchOptions?.headers || {}),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables, operationName }),
    });
    if ([429].includes(response.status)) {
      throw new Error('Too many requests');
    }
    return await response.json();
  }

  return async (args: IQueryExecutionArgs) => {
    let retries = 0;
    while (retries < MAX_QUERY_RETRIES) {
      try {
        return await execute(args);
      } catch (e) {
        if (retries + 1 >= MAX_QUERY_RETRIES) {
          return {
            data: null,
            errors: [
              {message: e.message},
            ],
          };
        }
        // Retry with exponential backoff
        await new Promise(resolve => setTimeout(resolve, (retries + 1)**2 * 1000));
      }
      retries++;
    }
  };
}
