import { GraphQLResolveInfo } from 'graphql'
import { Context } from './src/types/context'
export type Maybe<T> = T | null
export type RequireFields<T, K extends keyof T> = {
  [X in Exclude<keyof T, K>]?: T[X]
} &
  { [P in K]-?: NonNullable<T[P]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
}

export type Application = {
  __typename?: 'Application'
  id: Scalars['String']
  email: Scalars['String']
  state: Scalars['String']
}

export type CreateApplicationInput = {
  ssn: Scalars['String']
  email: Scalars['String']
}

export type CreateApplicationPayload = {
  __typename?: 'createApplicationPayload'
  application?: Maybe<Application>
}

export type Mutation = {
  __typename?: 'Mutation'
  createApplication?: Maybe<CreateApplicationPayload>
  root?: Maybe<Scalars['String']>
}

export type MutationCreateApplicationArgs = {
  input: CreateApplicationInput
}

export type Query = {
  __typename?: 'Query'
  getApplication?: Maybe<Application>
  root?: Maybe<Scalars['String']>
}

export type QueryGetApplicationArgs = {
  ssn: Scalars['String']
}

export type ResolverTypeWrapper<T> = Promise<T> | T

export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>

export type isTypeOfResolverFn<T = {}> = (
  obj: T,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>

export type NextResolverFn<T> = () => Promise<T>

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Query: ResolverTypeWrapper<{}>
  String: ResolverTypeWrapper<Scalars['String']>
  Application: ResolverTypeWrapper<Application>
  Mutation: ResolverTypeWrapper<{}>
  createApplicationInput: CreateApplicationInput
  createApplicationPayload: ResolverTypeWrapper<CreateApplicationPayload>
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>
}

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {}
  String: Scalars['String']
  Application: Application
  Mutation: {}
  createApplicationInput: CreateApplicationInput
  createApplicationPayload: CreateApplicationPayload
  Boolean: Scalars['Boolean']
}

export type ApplicationResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Application'] = ResolversParentTypes['Application']
> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  state?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: isTypeOfResolverFn<ParentType>
}

export type CreateApplicationPayloadResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['createApplicationPayload'] = ResolversParentTypes['createApplicationPayload']
> = {
  application?: Resolver<
    Maybe<ResolversTypes['Application']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: isTypeOfResolverFn<ParentType>
}

export type MutationResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']
> = {
  createApplication?: Resolver<
    Maybe<ResolversTypes['createApplicationPayload']>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateApplicationArgs, 'input'>
  >
  root?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
}

export type QueryResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = {
  getApplication?: Resolver<
    Maybe<ResolversTypes['Application']>,
    ParentType,
    ContextType,
    RequireFields<QueryGetApplicationArgs, 'ssn'>
  >
  root?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
}

export type Resolvers<ContextType = Context> = {
  Application?: ApplicationResolvers<ContextType>
  createApplicationPayload?: CreateApplicationPayloadResolvers<ContextType>
  Mutation?: MutationResolvers<ContextType>
  Query?: QueryResolvers<ContextType>
}

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = Context> = Resolvers<ContextType>
