import merge from 'lodash/merge'
import { defaultFieldResolver, defaultTypeResolver, GraphQLFieldResolver, GraphQLTypeResolver } from 'graphql'

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

  const typeResolver: GraphQLTypeResolver<any, any> = (
    value,
    context,
    info,
    abstractType,
  ) => {
    const { name } = abstractType
    const resolver =
      resolvers &&
      resolvers[name] &&
      resolvers[name]!.__resolveType

    if (resolver) {
      return resolver(value, context, info)
    }
    return defaultTypeResolver(value, context, info, abstractType)
  }

  const add = (newResolvers: T) => {
    resolvers = merge({}, resolvers, newResolvers)
  }

  const reset = () => {
    resolvers = baseResolvers
  }

  return {
    fieldResolver,
    typeResolver,
    add,
    reset,
  }
}

export default createFieldResolver
