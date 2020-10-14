import { graphql, GraphQLFieldResolver, GraphQLSchema, GraphQLTypeResolver } from 'graphql'

interface GraphQLRequest {
  query: string
  variables?: Record<string, any>
  operationName?: string
}

interface Context {
  fetch: typeof fetch
}

interface Options<C> {
  schema: GraphQLSchema
  fieldResolver: GraphQLFieldResolver<any, any>
  typeResolver?: GraphQLTypeResolver<any, any>
  contextValue?: C
}

const runGraphQLRequest = (request: GraphQLRequest, options: Options<any>) => {
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

export const handleGraphQLRequest = (
  query: Record<string, any> | Array<Record<string, any>>,
  options: Options<any>,
) => {
  if (Array.isArray(query)) {
    // A batched query using the BatchHttpLink.
    return Promise.all(
      query.map((subQuery) =>
        runGraphQLRequest(subQuery as GraphQLRequest, options),
      ),
    )
  } else {
    return runGraphQLRequest(query as GraphQLRequest, options)
  }
}
