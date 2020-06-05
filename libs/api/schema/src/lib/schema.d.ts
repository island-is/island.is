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

export type Article = {
  __typename?: 'Article'
  id: Scalars['String']
  slug: Scalars['String']
  title: Scalars['String']
  content?: Maybe<Scalars['String']>
}

export type GetArticleInput = {
  slug?: Maybe<Scalars['String']>
  lang: Scalars['String']
}

export type GetNamespaceInput = {
  namespace?: Maybe<Scalars['String']>
  lang: Scalars['String']
}

export type HelloWorld = {
  __typename?: 'HelloWorld'
  message: Scalars['String']
}

export type HelloWorldInput = {
  name?: Maybe<Scalars['String']>
}

export type Mutation = {
  __typename?: 'Mutation'
  root?: Maybe<Scalars['String']>
}

export type Namespace = {
  __typename?: 'Namespace'
  namespace: Scalars['String']
  fields: Scalars['String']
}

export type Query = {
  __typename?: 'Query'
  getArticle?: Maybe<Article>
  getNamespace?: Maybe<Namespace>
  article: Array<SearchResult>
  category?: Maybe<ContentCategory>
  helloWorld: HelloWorld
  root?: Maybe<Scalars['String']>
  search: Array<SearchResult>
}

export type QueryGetArticleArgs = {
  input?: Maybe<GetArticleInput>
}

export type QueryGetNamespaceArgs = {
  input?: Maybe<GetNamespaceInput>
}

export type QueryHelloWorldArgs = {
  input?: Maybe<HelloWorldInput>
export type QueryArticleArgs = {
  input?: Maybe<ArticleInput>
}

export type QueryCategoryArgs = {
  input?: Maybe<CategoryInput>
}

export type QueryHelloWorldArgs = {
  input?: Maybe<HelloWorldInput>
}

export type QuerySearchArgs = {
  query?: Maybe<SearcherInput>
}

export type SearcherInput = {
  content?: Maybe<Scalars['String']>
  title?: Maybe<Scalars['String']>
  tag?: Maybe<Scalars['String']>
}

export type SearchResult = {
  __typename?: 'SearchResult'
  _id?: Maybe<Scalars['String']>
  title?: Maybe<Scalars['String']>
  content?: Maybe<Scalars['String']>
  tag?: Maybe<Array<Maybe<Scalars['String']>>>
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
  GetArticleInput: GetArticleInput
  String: ResolverTypeWrapper<Scalars['String']>
  Article: ResolverTypeWrapper<Article>
  GetNamespaceInput: GetNamespaceInput
  Namespace: ResolverTypeWrapper<Namespace>
  HelloWorldInput: HelloWorldInput
  HelloWorld: ResolverTypeWrapper<HelloWorld>
  SearcherInput: SearcherInput
  String: ResolverTypeWrapper<Scalars['String']>
  SearchResult: ResolverTypeWrapper<SearchResult>
  CategoryInput: CategoryInput
  ContentCategory: ResolverTypeWrapper<ContentCategory>
  HelloWorldInput: HelloWorldInput
  HelloWorld: ResolverTypeWrapper<HelloWorld>
  SearcherInput: SearcherInput
  Mutation: ResolverTypeWrapper<{}>
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>
  ContentArticle: ResolverTypeWrapper<ContentArticle>
}

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {}
  GetArticleInput: GetArticleInput
  String: Scalars['String']
  Article: Article
  GetNamespaceInput: GetNamespaceInput
  Namespace: Namespace
  HelloWorldInput: HelloWorldInput
  HelloWorld: HelloWorld
  SearcherInput: SearcherInput
  String: Scalars['String']
  SearchResult: SearchResult
  CategoryInput: CategoryInput
  ContentCategory: ContentCategory
  HelloWorldInput: HelloWorldInput
  HelloWorld: HelloWorld
  SearcherInput: SearcherInput
  Mutation: {}
  Boolean: Scalars['Boolean']
  ContentArticle: ContentArticle
}

export type ContentArticleResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['ContentArticle'] = ResolversParentTypes['ContentArticle']
> = {
  _id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  slug?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: isTypeOfResolverFn<ParentType>
}

export type ContentCategoryResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['ContentCategory'] = ResolversParentTypes['ContentCategory']
> = {
  _id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  slug?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: isTypeOfResolverFn<ParentType>
}

export type ArticleResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Article'] = ResolversParentTypes['Article']
> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  content?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: isTypeOfResolverFn<ParentType>
}

export type HelloWorldResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['HelloWorld'] = ResolversParentTypes['HelloWorld']
> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: isTypeOfResolverFn<ParentType>
}

export type MutationResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']
> = {
  root?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
}

export type NamespaceResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Namespace'] = ResolversParentTypes['Namespace']
> = {
  namespace?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  fields?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: isTypeOfResolverFn<ParentType>
}

export type QueryResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = {
  getArticle?: Resolver<
    Maybe<ResolversTypes['Article']>,
    ParentType,
    ContextType,
    RequireFields<QueryGetArticleArgs, never>
  >
  getNamespace?: Resolver<
    Maybe<ResolversTypes['Namespace']>,
    ParentType,
    ContextType,
    RequireFields<QueryGetNamespaceArgs, never>
  >
  helloWorld?: Resolver<
    ResolversTypes['HelloWorld'],
    ParentType,
    ContextType,
    RequireFields<QueryHelloWorldArgs, never>
  >
  root?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  search?: Resolver<
    Array<ResolversTypes['SearchResult']>,
    ParentType,
    ContextType,
    RequireFields<QuerySearchArgs, never>
  >
}

export type SearchResultResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['SearchResult'] = ResolversParentTypes['SearchResult']
> = {
  _id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  content?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  tag?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['String']>>>,
    ParentType,
    ContextType
  >
  __isTypeOf?: isTypeOfResolverFn<ParentType>
}

export type Resolvers<ContextType = any> = {
  Article?: ArticleResolvers<ContextType>
  HelloWorld?: HelloWorldResolvers<ContextType>
  Mutation?: MutationResolvers<ContextType>
  Namespace?: NamespaceResolvers<ContextType>
  Query?: QueryResolvers<ContextType>
  SearchResult?: SearchResultResolvers<ContextType>
}

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = Context> = Resolvers<ContextType>
