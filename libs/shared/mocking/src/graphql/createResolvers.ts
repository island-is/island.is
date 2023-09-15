import merge from 'lodash/merge'
import {
  defaultFieldResolver,
  defaultTypeResolver,
  GraphQLFieldResolver,
  GraphQLScalarType,
  GraphQLTypeResolver,
} from 'graphql'

export type ResolverMap = Record<
  string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | Record<string, ((...args: any) => any) | undefined>
  | GraphQLScalarType
  | undefined
  | any
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resolver = (resolvers?.[parentName] as any)?.[fieldName]

    if (typeof resolver === 'function') {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resolver = (resolvers?.[name] as any)?.__resolveType

    if (typeof resolver === 'function') {
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
