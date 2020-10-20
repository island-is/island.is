import merge from 'lodash/merge'
import {
  defaultFieldResolver,
  defaultTypeResolver,
  GraphQLFieldResolver,
  GraphQLTypeResolver,
} from 'graphql'

export type ResolverMap = Record<
  string,
  Record<string, (...args: unknown[]) => unknown> | undefined
>

export type NewResolvers<Resolvers> = {
  [R in keyof Resolvers]?: {
    [F in keyof Resolvers[R]]?: Resolvers[R][F]
  }
}

export type Resolvers<T> = {
  fieldResolver: GraphQLFieldResolver<unknown, unknown>
  typeResolver: GraphQLTypeResolver<unknown, unknown>
  add: (newResolvers: NewResolvers<T>) => void
  reset: () => void
}

export const createResolvers = <T extends ResolverMap>(
  baseResolvers: T,
): Resolvers<T> => {
  let resolvers = baseResolvers

  const fieldResolver: GraphQLFieldResolver<unknown, unknown> = (
    obj,
    args,
    context,
    info,
  ) => {
    const { fieldName, parentType } = info
    const parentName = parentType.name
    const resolver = resolvers?.[parentName]?.[fieldName]

    if (resolver) {
      return resolver(obj, args, context, info)
    }
    return defaultFieldResolver(obj, args, context, info)
  }

  const typeResolver: GraphQLTypeResolver<unknown, unknown> = (
    value,
    context,
    info,
    abstractType,
  ) => {
    const { name } = abstractType
    const resolver = resolvers?.[name]?.__resolveType

    if (resolver) {
      return resolver(value, context, info) as string
    }
    return defaultTypeResolver(value, context, info, abstractType)
  }

  const add = (newResolvers: NewResolvers<T>) => {
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
