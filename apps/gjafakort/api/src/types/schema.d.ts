import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from 'graphql'
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
  StringTrimmed: any
}

export type Company = {
  __typename?: 'Company'
  ssn: Scalars['String']
  name: Scalars['String']
  application?: Maybe<CompanyApplication>
}

export type ApplicationLog = {
  __typename?: 'ApplicationLog'
  id: Scalars['String']
  state: Scalars['String']
  title: Scalars['String']
  data?: Maybe<Scalars['String']>
  authorSSN?: Maybe<Scalars['String']>
}

export type CompanyApplication = {
  __typename?: 'CompanyApplication'
  id?: Maybe<Scalars['String']>
  name: Scalars['String']
  email: Scalars['String']
  state: Scalars['String']
  companySSN: Scalars['String']
  serviceCategory?: Maybe<Scalars['String']>
  generalEmail: Scalars['String']
  companyDisplayName?: Maybe<Scalars['String']>
  companyName?: Maybe<Scalars['String']>
  exhibition?: Maybe<Scalars['Boolean']>
  operatingPermitForRestaurant?: Maybe<Scalars['Boolean']>
  operatingPermitForVehicles?: Maybe<Scalars['Boolean']>
  operationsTrouble?: Maybe<Scalars['Boolean']>
  phoneNumber: Scalars['String']
  validLicenses?: Maybe<Scalars['Boolean']>
  validPermit?: Maybe<Scalars['Boolean']>
  webpage: Scalars['String']
  logs?: Maybe<Array<Maybe<ApplicationLog>>>
}

export type CreateCompanyApplicationInput = {
  email: Scalars['StringTrimmed']
  generalEmail: Scalars['StringTrimmed']
  phoneNumber: Scalars['StringTrimmed']
  operationsTrouble: Scalars['Boolean']
  companySSN: Scalars['StringTrimmed']
  name: Scalars['StringTrimmed']
  serviceCategory: Scalars['StringTrimmed']
  webpage: Scalars['StringTrimmed']
  companyName: Scalars['StringTrimmed']
  companyDisplayName: Scalars['StringTrimmed']
  operatingPermitForRestaurant: Scalars['Boolean']
  exhibition: Scalars['Boolean']
  operatingPermitForVehicles: Scalars['Boolean']
  validLicenses: Scalars['Boolean']
  validPermit: Scalars['Boolean']
}

export type CreateCompanyApplication = {
  __typename?: 'CreateCompanyApplication'
  application?: Maybe<CompanyApplication>
}

export type Query = {
  __typename?: 'Query'
  companies?: Maybe<Array<Maybe<Company>>>
  company?: Maybe<Company>
  companyApplications?: Maybe<Array<Maybe<CompanyApplication>>>
  root?: Maybe<Scalars['String']>
  userApplication?: Maybe<UserApplication>
}

export type QueryCompanyArgs = {
  ssn: Scalars['String']
}

export type Mutation = {
  __typename?: 'Mutation'
  createCompanyApplication?: Maybe<CreateCompanyApplication>
  createUserApplication?: Maybe<CreateUserApplication>
  root?: Maybe<Scalars['String']>
}

export type MutationCreateCompanyApplicationArgs = {
  input: CreateCompanyApplicationInput
}

export type MutationCreateUserApplicationArgs = {
  input?: Maybe<CreateUserApplicationInput>
}

export type UserApplication = {
  __typename?: 'UserApplication'
  id: Scalars['String']
  mobileNumber: Scalars['String']
  countryCode: Scalars['String']
}

export type CreateUserApplication = {
  __typename?: 'CreateUserApplication'
  application?: Maybe<UserApplication>
}

export type CreateUserApplicationInput = {
  mobile?: Maybe<Scalars['StringTrimmed']>
}

export type ResolverTypeWrapper<T> = Promise<T> | T

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}
export type StitchingResolver<TResult, TParent, TContext, TArgs> =
  | LegacyStitchingResolver<TResult, TParent, TContext, TArgs>
  | NewStitchingResolver<TResult, TParent, TContext, TArgs>
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

export type IsTypeOfResolverFn<T = {}> = (
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
  StringTrimmed: ResolverTypeWrapper<Scalars['StringTrimmed']>
  Company: ResolverTypeWrapper<Company>
  String: ResolverTypeWrapper<Scalars['String']>
  ApplicationLog: ResolverTypeWrapper<ApplicationLog>
  CompanyApplication: ResolverTypeWrapper<CompanyApplication>
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>
  CreateCompanyApplicationInput: CreateCompanyApplicationInput
  CreateCompanyApplication: ResolverTypeWrapper<CreateCompanyApplication>
  Query: ResolverTypeWrapper<{}>
  Mutation: ResolverTypeWrapper<{}>
  UserApplication: ResolverTypeWrapper<UserApplication>
  CreateUserApplication: ResolverTypeWrapper<CreateUserApplication>
  CreateUserApplicationInput: CreateUserApplicationInput
}

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  StringTrimmed: Scalars['StringTrimmed']
  Company: Company
  String: Scalars['String']
  ApplicationLog: ApplicationLog
  CompanyApplication: CompanyApplication
  Boolean: Scalars['Boolean']
  CreateCompanyApplicationInput: CreateCompanyApplicationInput
  CreateCompanyApplication: CreateCompanyApplication
  Query: {}
  Mutation: {}
  UserApplication: UserApplication
  CreateUserApplication: CreateUserApplication
  CreateUserApplicationInput: CreateUserApplicationInput
}

export interface StringTrimmedScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['StringTrimmed'], any> {
  name: 'StringTrimmed'
}

export type CompanyResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Company'] = ResolversParentTypes['Company']
> = {
  ssn?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  application?: Resolver<
    Maybe<ResolversTypes['CompanyApplication']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type ApplicationLogResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['ApplicationLog'] = ResolversParentTypes['ApplicationLog']
> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  state?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  data?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  authorSSN?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type CompanyApplicationResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['CompanyApplication'] = ResolversParentTypes['CompanyApplication']
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
  companyDisplayName?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  companyName?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  exhibition?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >
  operatingPermitForRestaurant?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >
  operatingPermitForVehicles?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >
  operationsTrouble?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >
  phoneNumber?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  validLicenses?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >
  validPermit?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >
  webpage?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  logs?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['ApplicationLog']>>>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type CreateCompanyApplicationResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['CreateCompanyApplication'] = ResolversParentTypes['CreateCompanyApplication']
> = {
  application?: Resolver<
    Maybe<ResolversTypes['CompanyApplication']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
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
  companyApplications?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['CompanyApplication']>>>,
    ParentType,
    ContextType
  >
  root?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  userApplication?: Resolver<
    Maybe<ResolversTypes['UserApplication']>,
    ParentType,
    ContextType
  >
}

export type MutationResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']
> = {
  createCompanyApplication?: Resolver<
    Maybe<ResolversTypes['CreateCompanyApplication']>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateCompanyApplicationArgs, 'input'>
  >
  createUserApplication?: Resolver<
    Maybe<ResolversTypes['CreateUserApplication']>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateUserApplicationArgs, never>
  >
  root?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
}

export type UserApplicationResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['UserApplication'] = ResolversParentTypes['UserApplication']
> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  mobileNumber?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  countryCode?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type CreateUserApplicationResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['CreateUserApplication'] = ResolversParentTypes['CreateUserApplication']
> = {
  application?: Resolver<
    Maybe<ResolversTypes['UserApplication']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type Resolvers<ContextType = Context> = {
  StringTrimmed?: GraphQLScalarType
  Company?: CompanyResolvers<ContextType>
  ApplicationLog?: ApplicationLogResolvers<ContextType>
  CompanyApplication?: CompanyApplicationResolvers<ContextType>
  CreateCompanyApplication?: CreateCompanyApplicationResolvers<ContextType>
  Query?: QueryResolvers<ContextType>
  Mutation?: MutationResolvers<ContextType>
  UserApplication?: UserApplicationResolvers<ContextType>
  CreateUserApplication?: CreateUserApplicationResolvers<ContextType>
}

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = Context> = Resolvers<ContextType>
