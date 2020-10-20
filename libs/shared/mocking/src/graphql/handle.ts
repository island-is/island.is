import {
  graphql,
  GraphQLFieldResolver,
  GraphQLSchema,
  GraphQLTypeResolver,
} from 'graphql'

interface GraphQLRequest {
  query: string
  variables?: Record<string, unknown>
  operationName?: string
}

interface Options<Context> {
  schema: GraphQLSchema
  fieldResolver: GraphQLFieldResolver<unknown, Context>
  typeResolver?: GraphQLTypeResolver<unknown, Context>
  contextValue?: Context
}

const runGraphQLRequest = <Context>(
  request: GraphQLRequest,
  options: Options<Context>,
) => {
  const { schema, fieldResolver, typeResolver, contextValue = {} } = options
  return graphql({
    schema,
    source: request.query,
    contextValue,
    variableValues: request.variables,
    operationName: request.operationName,
    fieldResolver,
    typeResolver,
  })
}

export const handle = <Context>(
  query: GraphQLRequest | Array<GraphQLRequest>,
  options: Options<Context>,
) => {
  if (Array.isArray(query)) {
    // A batched query using the BatchHttpLink.
    return Promise.all(
      query.map((subQuery) => runGraphQLRequest(subQuery, options)),
    )
  } else {
    return runGraphQLRequest(query, options)
  }
}
