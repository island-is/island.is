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
    const isQueryIsh =
      (typeof query === 'object' && query?.query) ||
      (Array.isArray(query) && query.every((query) => query.query))
    if (!isQueryIsh) {
      throw new Error('Expected one or more GraphQL queries.')
    }

    const context = {
      fetch: ctx.fetch,
    }

    type Query = Parameters<typeof handle>[0]
    const graphqlResponse = await handle(query as Query, {
      schema,
      fieldResolver: resolvers.fieldResolver,
      typeResolver: resolvers.typeResolver,
      contextValue: context,
    })

    return res(ctx.json(graphqlResponse))
  })
