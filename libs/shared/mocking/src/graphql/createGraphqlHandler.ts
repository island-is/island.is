import { rest } from 'msw'
import { GraphQLSchema } from 'graphql'
import { Resolvers } from './createResolvers'
import { handle } from './handle'

type Options<T> = {
  mask?: RegExp | string
  resolvers: Resolvers<T>
  schema: GraphQLSchema
}

export const createGraphqlHandler = <T>({
  mask = '*/api/graphql',
  resolvers,
  schema,
}: Options<T>) =>
  rest.post(mask, async (req, res, ctx) => {
    const query = req.method === 'POST' ? req.body : req.params
    if (typeof query !== 'object') {
      throw new Error('Expected graphql query to be an object.')
    }
    const context = {
      fetch: ctx.fetch,
    }

    const graphqlResponse = await handle(query, {
      schema,
      fieldResolver: resolvers.fieldResolver,
      typeResolver: resolvers.typeResolver,
      contextValue: context,
    })

    return res(ctx.json(graphqlResponse))
  })
