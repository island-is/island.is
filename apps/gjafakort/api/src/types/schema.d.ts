import { GraphQLResolveInfo } from 'graphql'
import { Context } from './context'
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
  id?: Maybe<Scalars['String']>
  name: Scalars['String']
  email: Scalars['String']
  state: Scalars['String']
  companySSN: Scalars['String']
  serviceCategory?: Maybe<Scalars['String']>
  generalEmail: Scalars['String']
  webpage: Scalars['String']
  phoneNumber: Scalars['String']
  approveTerms?: Maybe<Scalars['Boolean']>
  companyName?: Maybe<Scalars['String']>
  companyDisplayName?: Maybe<Scalars['String']>
}

export type Company = {
  __typename?: 'Company'
  ssn: Scalars['String']
  name: Scalars['String']
  application?: Maybe<Application>
}

export type CreateApplication = {
  __typename?: 'createApplication'
  application?: Maybe<Application>
}

export type CreateApplicationInput = {
  email: Scalars['String']
  generalEmail: Scalars['String']
  phoneNumber: Scalars['String']
  approveTerms: Scalars['Boolean']
  ssn: Scalars['String']
  name: Scalars['String']
  serviceCategory: Scalars['String']
  webpage: Scalars['String']
  companyName: Scalars['String']
  companyDisplayName: Scalars['String']
  acknowledgedMuseum: Scalars['Boolean']
  exhibition: Scalars['Boolean']
  followingLaws: Scalars['Boolean']
  operatingPermitForVehicles: Scalars['Boolean']
  validLicenses: Scalars['Boolean']
  validPermit: Scalars['Boolean']
}

export type Mutation = {
  __typename?: 'Mutation'
  createApplication?: Maybe<CreateApplication>
  root?: Maybe<Scalars['String']>
}

export type MutationCreateApplicationArgs = {
  input: CreateApplicationInput
}

export type Query = {
  __typename?: 'Query'
  companies?: Maybe<Array<Maybe<Company>>>
  company?: Maybe<Company>
  root?: Maybe<Scalars['String']>
}

export type QueryCompanyArgs = {
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
  Company: ResolverTypeWrapper<Company>
  String: ResolverTypeWrapper<Scalars['String']>
  Application: ResolverTypeWrapper<Application>
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>
  Mutation: ResolverTypeWrapper<{}>
  CreateApplicationInput: CreateApplicationInput
  createApplication: ResolverTypeWrapper<CreateApplication>
}

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {}
  Company: Company
  String: Scalars['String']
  Application: Application
  Boolean: Scalars['Boolean']
  Mutation: {}
  CreateApplicationInput: CreateApplicationInput
  createApplication: CreateApplication
}

export type ApplicationResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Application'] = ResolversParentTypes['Application']
> = {
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  state?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  companySSN?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  serviceCategory?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  generalEmail?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  webpage?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  phoneNumber?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  approveTerms?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >
  companyName?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  companyDisplayName?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: isTypeOfResolverFn<ParentType>
}

export type CompanyResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Company'] = ResolversParentTypes['Company']
> = {
  ssn?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  application?: Resolver<
    Maybe<ResolversTypes['Application']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: isTypeOfResolverFn<ParentType>
}

export type CreateApplicationResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['createApplication'] = ResolversParentTypes['createApplication']
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
    Maybe<ResolversTypes['createApplication']>,
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
  companies?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['Company']>>>,
    ParentType,
    ContextType
  >
  company?: Resolver<
    Maybe<ResolversTypes['Company']>,
    ParentType,
    ContextType,
    RequireFields<QueryCompanyArgs, 'ssn'>
  >
  root?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
}

export type Resolvers<ContextType = Context> = {
  Application?: ApplicationResolvers<ContextType>
  Company?: CompanyResolvers<ContextType>
  createApplication?: CreateApplicationResolvers<ContextType>
  Mutation?: MutationResolvers<ContextType>
  Query?: QueryResolvers<ContextType>
}

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = Context> = Resolvers<ContextType>
