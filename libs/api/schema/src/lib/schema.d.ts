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

export type CategoriesInput = {
  language?: Maybe<Language>
}

export type CategoryInput = {
  id?: Maybe<Scalars['ID']>
  slug?: Maybe<Scalars['String']>
}

export type ContentArticle = {
  __typename?: 'ContentArticle'
  _id?: Maybe<Scalars['ID']>
  title?: Maybe<Scalars['String']>
  slug?: Maybe<Scalars['String']>
}

export type ContentCategory = {
  __typename?: 'ContentCategory'
  title?: Maybe<Scalars['String']>
}

export type ContentItem = {
  __typename?: 'ContentItem'
  _id?: Maybe<Scalars['String']>
  title?: Maybe<Scalars['String']>
  content?: Maybe<Scalars['String']>
  tag?: Maybe<Array<Maybe<Scalars['String']>>>
  category?: Maybe<Scalars['String']>
  content_blob?: Maybe<Scalars['String']>
  content_id?: Maybe<Scalars['String']>
  content_type?: Maybe<Scalars['String']>
  date?: Maybe<Scalars['String']>
  image?: Maybe<Scalars['String']>
  imageText?: Maybe<Scalars['String']>
  lang?: Maybe<Scalars['String']>
  slug?: Maybe<Scalars['String']>
}

export type HelloWorld = {
  __typename?: 'HelloWorld'
  message: Scalars['String']
}

export type HelloWorldInput = {
  name?: Maybe<Scalars['String']>
}

export type ItemInput = {
  _id?: Maybe<Scalars['ID']>
  slug?: Maybe<Scalars['String']>
  type?: Maybe<ItemType>
  language?: Maybe<Language>
}

export enum ItemType {
  Article = 'article',
  Category = 'category',
}

export enum Language {
  Is = 'is',
  En = 'en',
}

export type Mutation = {
  __typename?: 'Mutation'
  root?: Maybe<Scalars['String']>
}

export type Query = {
  __typename?: 'Query'
  getCategories?: Maybe<Array<Maybe<ContentCategory>>>
  getSearchResults: SearchResult
  getSingleItem?: Maybe<ContentItem>
  helloWorld: HelloWorld
  root?: Maybe<Scalars['String']>
}

export type QueryGetCategoriesArgs = {
  input?: Maybe<CategoriesInput>
}

export type QueryGetSearchResultsArgs = {
  query?: Maybe<SearcherInput>
}

export type QueryGetSingleItemArgs = {
  input?: Maybe<ItemInput>
}

export type QueryHelloWorldArgs = {
  input?: Maybe<HelloWorldInput>
}

export type SearcherInput = {
  queryString?: Maybe<Scalars['String']>
  language?: Maybe<Language>
}

export type SearchResult = {
  __typename?: 'SearchResult'
  total?: Maybe<Scalars['Int']>
  items?: Maybe<Array<ContentItem>>
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
  CategoriesInput: CategoriesInput
  Language: Language
  ContentCategory: ResolverTypeWrapper<ContentCategory>
  String: ResolverTypeWrapper<Scalars['String']>
  SearcherInput: SearcherInput
  SearchResult: ResolverTypeWrapper<SearchResult>
  Int: ResolverTypeWrapper<Scalars['Int']>
  ContentItem: ResolverTypeWrapper<ContentItem>
  ItemInput: ItemInput
  ID: ResolverTypeWrapper<Scalars['ID']>
  ItemType: ItemType
  HelloWorldInput: HelloWorldInput
  HelloWorld: ResolverTypeWrapper<HelloWorld>
  Mutation: ResolverTypeWrapper<{}>
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>
  CategoryInput: CategoryInput
  ContentArticle: ResolverTypeWrapper<ContentArticle>
}

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {}
  CategoriesInput: CategoriesInput
  Language: Language
  ContentCategory: ContentCategory
  String: Scalars['String']
  SearcherInput: SearcherInput
  SearchResult: SearchResult
  Int: Scalars['Int']
  ContentItem: ContentItem
  ItemInput: ItemInput
  ID: Scalars['ID']
  ItemType: ItemType
  HelloWorldInput: HelloWorldInput
  HelloWorld: HelloWorld
  Mutation: {}
  Boolean: Scalars['Boolean']
  CategoryInput: CategoryInput
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
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: isTypeOfResolverFn<ParentType>
}

export type ContentItemResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['ContentItem'] = ResolversParentTypes['ContentItem']
> = {
  _id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  content?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  tag?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['String']>>>,
    ParentType,
    ContextType
  >
  category?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  content_blob?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  content_id?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  content_type?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  date?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  imageText?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  lang?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  slug?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
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

export type QueryResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = {
  getCategories?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['ContentCategory']>>>,
    ParentType,
    ContextType,
    RequireFields<QueryGetCategoriesArgs, never>
  >
  getSearchResults?: Resolver<
    ResolversTypes['SearchResult'],
    ParentType,
    ContextType,
    RequireFields<QueryGetSearchResultsArgs, never>
  >
  getSingleItem?: Resolver<
    Maybe<ResolversTypes['ContentItem']>,
    ParentType,
    ContextType,
    RequireFields<QueryGetSingleItemArgs, never>
  >
  helloWorld?: Resolver<
    ResolversTypes['HelloWorld'],
    ParentType,
    ContextType,
    RequireFields<QueryHelloWorldArgs, never>
  >
  root?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
}

export type SearchResultResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['SearchResult'] = ResolversParentTypes['SearchResult']
> = {
  total?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  items?: Resolver<
    Maybe<Array<ResolversTypes['ContentItem']>>,
    ParentType,
    ContextType
  >
  __isTypeOf?: isTypeOfResolverFn<ParentType>
}

export type Resolvers<ContextType = Context> = {
  ContentArticle?: ContentArticleResolvers<ContextType>
  ContentCategory?: ContentCategoryResolvers<ContextType>
  ContentItem?: ContentItemResolvers<ContextType>
  HelloWorld?: HelloWorldResolvers<ContextType>
  Mutation?: MutationResolvers<ContextType>
  Query?: QueryResolvers<ContextType>
  SearchResult?: SearchResultResolvers<ContextType>
}

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = Context> = Resolvers<ContextType>
