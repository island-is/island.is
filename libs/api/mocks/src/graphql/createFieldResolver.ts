import merge from 'lodash/merge'
import { defaultFieldResolver, GraphQLFieldResolver } from 'graphql'

type Resolvers = Record<string, Record<string, any> | undefined>

const createFieldResolver = <T extends Resolvers>(baseResolvers: T) => {
  let resolvers = baseResolvers

  const fieldResolver: GraphQLFieldResolver<any, any> = (
    obj,
    args,
    context,
    info,
  ) => {
    const { fieldName, parentType } = info
    const resolver =
      resolvers &&
      resolvers[parentType.name] &&
      resolvers[parentType.name]![fieldName]

    if (resolver) {
      return resolver(obj, args, context, info)
    }
    return defaultFieldResolver(obj, args, context, info)
  }

  const add = (newResolvers: T) => {
    resolvers = merge({}, resolvers, newResolvers)
  }

  const reset = () => {
    resolvers = baseResolvers
  }

  return {
    fieldResolver,
    add,
    reset,
  }
}

export default createFieldResolver
