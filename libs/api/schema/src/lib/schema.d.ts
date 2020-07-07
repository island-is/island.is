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

export type Query = {
  __typename?: 'Query'
  articlesInCategory?: Maybe<Array<Maybe<ContentItem>>>
  categories?: Maybe<Array<Maybe<ContentCategory>>>
  getArticle?: Maybe<Article>
  getNamespace?: Maybe<Namespace>
  getNews?: Maybe<News>
  getNewsList: PaginatedNews
  helloWorld: HelloWorld
  root?: Maybe<Scalars['String']>
  searchResults: SearchResult
  singleItem?: Maybe<ContentItem>
}

export type QueryArticlesInCategoryArgs = {
  category?: Maybe<ArticlesInCategoryInput>
}

export type QueryCategoriesArgs = {
  input?: Maybe<CategoriesInput>
}

export type QueryGetArticleArgs = {
  input?: Maybe<GetArticleInput>
}

export type QueryGetNamespaceArgs = {
  input?: Maybe<GetNamespaceInput>
}

export type QueryGetNewsArgs = {
  input: GetNewsInput
}

export type QueryGetNewsListArgs = {
  input?: Maybe<GetNewsListInput>
}

export type QueryHelloWorldArgs = {
  input?: Maybe<HelloWorldInput>
}

export type QuerySearchResultsArgs = {
  query?: Maybe<SearcherInput>
}

export type QuerySingleItemArgs = {
  input?: Maybe<ItemInput>
}

export type Mutation = {
  __typename?: 'Mutation'
  root?: Maybe<Scalars['String']>
}

export type Taxonomy = {
  __typename?: 'Taxonomy'
  title?: Maybe<Scalars['String']>
  slug?: Maybe<Scalars['String']>
  description: Scalars['String']
}

export type Image = {
  __typename?: 'Image'
  url: Scalars['String']
  title?: Maybe<Scalars['String']>
  filename?: Maybe<Scalars['String']>
  contentType?: Maybe<Scalars['String']>
  width?: Maybe<Scalars['Int']>
  height?: Maybe<Scalars['Int']>
}

export type Pagination = {
  __typename?: 'Pagination'
  page: Scalars['Int']
  perPage: Scalars['Int']
  totalResults: Scalars['Int']
  totalPages: Scalars['Int']
}

export type Article = {
  __typename?: 'Article'
  id: Scalars['String']
  slug: Scalars['String']
  title: Scalars['String']
  content?: Maybe<Scalars['String']>
  group?: Maybe<Taxonomy>
  category: Taxonomy
}

export type GetArticleInput = {
  slug?: Maybe<Scalars['String']>
  lang: Scalars['String']
}

export type News = {
  __typename?: 'News'
  id: Scalars['String']
  slug: Scalars['String']
  title: Scalars['String']
  intro: Scalars['String']
  image?: Maybe<Image>
  date: Scalars['String']
  content?: Maybe<Scalars['String']>
}

export type PaginatedNews = {
  __typename?: 'PaginatedNews'
  page: Pagination
  news: Array<News>
}

export type GetNewsInput = {
  slug: Scalars['String']
  lang?: Maybe<Scalars['String']>
}

export type GetNewsListInput = {
  lang?: Maybe<Scalars['String']>
  year?: Maybe<Scalars['Int']>
  month?: Maybe<Scalars['Int']>
  ascending?: Maybe<Scalars['Boolean']>
  page?: Maybe<Scalars['Int']>
  perPage?: Maybe<Scalars['Int']>
}

export type Namespace = {
  __typename?: 'Namespace'
  namespace?: Maybe<Scalars['String']>
  fields?: Maybe<Scalars['String']>
}

export type GetNamespaceInput = {
  namespace?: Maybe<Scalars['String']>
  lang: Scalars['String']
}

export type ContentItem = {
  __typename?: 'ContentItem'
  id?: Maybe<Scalars['ID']>
  title?: Maybe<Scalars['String']>
  content?: Maybe<Scalars['String']>
  tag?: Maybe<Array<Maybe<Scalars['String']>>>
  category?: Maybe<Scalars['String']>
  categorySlug?: Maybe<Scalars['String']>
  categoryDescription?: Maybe<Scalars['String']>
  group?: Maybe<Scalars['String']>
  groupSlug?: Maybe<Scalars['String']>
  contentBlob?: Maybe<Scalars['String']>
  contentId?: Maybe<Scalars['String']>
  contentType?: Maybe<Scalars['String']>
  date?: Maybe<Scalars['String']>
  image?: Maybe<Scalars['String']>
  imageText?: Maybe<Scalars['String']>
  lang?: Maybe<Scalars['String']>
  slug?: Maybe<Scalars['String']>
}

export type SearchResult = {
  __typename?: 'SearchResult'
  total?: Maybe<Scalars['Int']>
  items: Array<ContentItem>
}

export type SearcherInput = {
  queryString?: Maybe<Scalars['String']>
  language?: Maybe<ContentLanguage>
  size?: Maybe<Scalars['Int']>
  page?: Maybe<Scalars['Int']>
}

export type CategoryInput = {
  id?: Maybe<Scalars['ID']>
  slug?: Maybe<Scalars['String']>
}

export type ContentCategory = {
  __typename?: 'ContentCategory'
  title?: Maybe<Scalars['String']>
  slug?: Maybe<Scalars['String']>
  description?: Maybe<Scalars['String']>
}

export type ItemInput = {
  id?: Maybe<Scalars['ID']>
  slug?: Maybe<Scalars['String']>
  type?: Maybe<ItemType>
  language?: Maybe<ContentLanguage>
}

export type CategoriesInput = {
  language?: Maybe<ContentLanguage>
}

export type ArticlesInCategoryInput = {
  slug?: Maybe<Scalars['String']>
  language?: Maybe<ContentLanguage>
}

export type ContentArticle = {
  __typename?: 'ContentArticle'
  id?: Maybe<Scalars['ID']>
  title?: Maybe<Scalars['String']>
  slug?: Maybe<Scalars['String']>
}

export enum ContentLanguage {
  Is = 'is',
  En = 'en',
}

export enum ItemType {
  Article = 'article',
  Category = 'category',
}

export type HelloWorld = {
  __typename?: 'HelloWorld'
  message: Scalars['String']
}

export type HelloWorldInput = {
  name?: Maybe<Scalars['String']>
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
  Query: ResolverTypeWrapper<{}>
  String: ResolverTypeWrapper<Scalars['String']>
  Mutation: ResolverTypeWrapper<{}>
  Taxonomy: ResolverTypeWrapper<Taxonomy>
  Image: ResolverTypeWrapper<Image>
  Int: ResolverTypeWrapper<Scalars['Int']>
  Pagination: ResolverTypeWrapper<Pagination>
  Article: ResolverTypeWrapper<Article>
  GetArticleInput: GetArticleInput
  News: ResolverTypeWrapper<News>
  PaginatedNews: ResolverTypeWrapper<PaginatedNews>
  GetNewsInput: GetNewsInput
  GetNewsListInput: GetNewsListInput
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>
  Namespace: ResolverTypeWrapper<Namespace>
  GetNamespaceInput: GetNamespaceInput
  ContentItem: ResolverTypeWrapper<ContentItem>
  ID: ResolverTypeWrapper<Scalars['ID']>
  SearchResult: ResolverTypeWrapper<SearchResult>
  SearcherInput: SearcherInput
  CategoryInput: CategoryInput
  ContentCategory: ResolverTypeWrapper<ContentCategory>
  ItemInput: ItemInput
  CategoriesInput: CategoriesInput
  ArticlesInCategoryInput: ArticlesInCategoryInput
  ContentArticle: ResolverTypeWrapper<ContentArticle>
  ContentLanguage: ContentLanguage
  ItemType: ItemType
  HelloWorld: ResolverTypeWrapper<HelloWorld>
  HelloWorldInput: HelloWorldInput
}

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {}
  String: Scalars['String']
  Mutation: {}
  Taxonomy: Taxonomy
  Image: Image
  Int: Scalars['Int']
  Pagination: Pagination
  Article: Article
  GetArticleInput: GetArticleInput
  News: News
  PaginatedNews: PaginatedNews
  GetNewsInput: GetNewsInput
  GetNewsListInput: GetNewsListInput
  Boolean: Scalars['Boolean']
  Namespace: Namespace
  GetNamespaceInput: GetNamespaceInput
  ContentItem: ContentItem
  ID: Scalars['ID']
  SearchResult: SearchResult
  SearcherInput: SearcherInput
  CategoryInput: CategoryInput
  ContentCategory: ContentCategory
  ItemInput: ItemInput
  CategoriesInput: CategoriesInput
  ArticlesInCategoryInput: ArticlesInCategoryInput
  ContentArticle: ContentArticle
  ContentLanguage: ContentLanguage
  ItemType: ItemType
  HelloWorld: HelloWorld
  HelloWorldInput: HelloWorldInput
}

export type QueryResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = {
  articlesInCategory?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['ContentItem']>>>,
    ParentType,
    ContextType,
    RequireFields<QueryArticlesInCategoryArgs, never>
  >
  categories?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['ContentCategory']>>>,
    ParentType,
    ContextType,
    RequireFields<QueryCategoriesArgs, never>
  >
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
  getNews?: Resolver<
    Maybe<ResolversTypes['News']>,
    ParentType,
    ContextType,
    RequireFields<QueryGetNewsArgs, 'input'>
  >
  getNewsList?: Resolver<
    ResolversTypes['PaginatedNews'],
    ParentType,
    ContextType,
    RequireFields<QueryGetNewsListArgs, never>
  >
  helloWorld?: Resolver<
    ResolversTypes['HelloWorld'],
    ParentType,
    ContextType,
    RequireFields<QueryHelloWorldArgs, never>
  >
  root?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  searchResults?: Resolver<
    ResolversTypes['SearchResult'],
    ParentType,
    ContextType,
    RequireFields<QuerySearchResultsArgs, never>
  >
  singleItem?: Resolver<
    Maybe<ResolversTypes['ContentItem']>,
    ParentType,
    ContextType,
    RequireFields<QuerySingleItemArgs, never>
  >
}

export type MutationResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']
> = {
  root?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
}

export type TaxonomyResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Taxonomy'] = ResolversParentTypes['Taxonomy']
> = {
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  slug?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type ImageResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Image'] = ResolversParentTypes['Image']
> = {
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  filename?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  contentType?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  width?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  height?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type PaginationResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Pagination'] = ResolversParentTypes['Pagination']
> = {
  page?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  perPage?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  totalResults?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  totalPages?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type ArticleResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Article'] = ResolversParentTypes['Article']
> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  content?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  group?: Resolver<Maybe<ResolversTypes['Taxonomy']>, ParentType, ContextType>
  category?: Resolver<ResolversTypes['Taxonomy'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type NewsResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['News'] = ResolversParentTypes['News']
> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  intro?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  image?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType>
  date?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  content?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type PaginatedNewsResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['PaginatedNews'] = ResolversParentTypes['PaginatedNews']
> = {
  page?: Resolver<ResolversTypes['Pagination'], ParentType, ContextType>
  news?: Resolver<Array<ResolversTypes['News']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type NamespaceResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Namespace'] = ResolversParentTypes['Namespace']
> = {
  namespace?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  fields?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type ContentItemResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['ContentItem'] = ResolversParentTypes['ContentItem']
> = {
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  content?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  tag?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['String']>>>,
    ParentType,
    ContextType
  >
  category?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  categorySlug?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  categoryDescription?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  group?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  groupSlug?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  contentBlob?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  contentId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  contentType?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  date?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  imageText?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  lang?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  slug?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type SearchResultResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['SearchResult'] = ResolversParentTypes['SearchResult']
> = {
  total?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  items?: Resolver<
    Array<ResolversTypes['ContentItem']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type ContentCategoryResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['ContentCategory'] = ResolversParentTypes['ContentCategory']
> = {
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  slug?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  description?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type ContentArticleResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['ContentArticle'] = ResolversParentTypes['ContentArticle']
> = {
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  slug?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type HelloWorldResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['HelloWorld'] = ResolversParentTypes['HelloWorld']
> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type Resolvers<ContextType = Context> = {
  Query?: QueryResolvers<ContextType>
  Mutation?: MutationResolvers<ContextType>
  Taxonomy?: TaxonomyResolvers<ContextType>
  Image?: ImageResolvers<ContextType>
  Pagination?: PaginationResolvers<ContextType>
  Article?: ArticleResolvers<ContextType>
  News?: NewsResolvers<ContextType>
  PaginatedNews?: PaginatedNewsResolvers<ContextType>
  Namespace?: NamespaceResolvers<ContextType>
  ContentItem?: ContentItemResolvers<ContextType>
  SearchResult?: SearchResultResolvers<ContextType>
  ContentCategory?: ContentCategoryResolvers<ContextType>
  ContentArticle?: ContentArticleResolvers<ContextType>
  HelloWorld?: HelloWorldResolvers<ContextType>
}

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = Context> = Resolvers<ContextType>
