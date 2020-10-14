import { rest } from 'msw'
import schema from './schema'
import { resolvers } from './resolvers'
import { handleGraphQLRequest } from './handle'

export interface Context {
  fetch: typeof fetch
}

export const graphqlHandler = rest.post(
  '*/api/graphql',
  async (req, res, ctx) => {
    const query = req.method === 'POST' ? req.body : req.params
    if (typeof query !== 'object') {
      throw new Error('Expected graphql query to be an object.')
    }
    const context = {
      fetch: ctx.fetch,
    }

    const graphqlResponse = await handleGraphQLRequest(query, {
      schema,
      fieldResolver: resolvers.fieldResolver,
      typeResolver: resolvers.typeResolver,
      contextValue: context,
    })

    return res(ctx.json(graphqlResponse))
  },
)
