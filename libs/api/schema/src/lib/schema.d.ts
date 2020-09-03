import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from 'graphql'
import { Context } from './context'
export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
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
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any
}

export type HelloWorld = {
  __typename?: 'HelloWorld'
  message: Scalars['String']
}

export type ContentItem = {
  __typename?: 'ContentItem'
  id: Scalars['ID']
  title?: Maybe<Scalars['String']>
  content?: Maybe<Scalars['String']>
  tag?: Maybe<Array<Scalars['String']>>
  category?: Maybe<Scalars['String']>
  categorySlug?: Maybe<Scalars['String']>
  categoryDescription?: Maybe<Scalars['String']>
  group?: Maybe<Scalars['String']>
  groupSlug?: Maybe<Scalars['String']>
  groupDescription?: Maybe<Scalars['String']>
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
  total: Scalars['Int']
  items: Array<ContentItem>
}

export type ContentCategory = {
  __typename?: 'ContentCategory'
  title?: Maybe<Scalars['String']>
  slug?: Maybe<Scalars['String']>
  description?: Maybe<Scalars['String']>
}

export type Taxonomy = {
  __typename?: 'Taxonomy'
  title?: Maybe<Scalars['String']>
  slug?: Maybe<Scalars['String']>
  description: Scalars['String']
}

export type Article = {
  __typename?: 'Article'
  id: Scalars['String']
  slug: Scalars['String']
  title: Scalars['String']
  content?: Maybe<Scalars['String']>
  group?: Maybe<Taxonomy>
  category: Taxonomy
  relatedArticles: Array<Article>
}

export type AdgerdirTag = {
  __typename?: 'AdgerdirTag'
  id?: Maybe<Scalars['String']>
  title?: Maybe<Scalars['String']>
}

export type AdgerdirPage = {
  __typename?: 'AdgerdirPage'
  id: Scalars['String']
  title: Scalars['String']
  description: Scalars['String']
  longDescription?: Maybe<Scalars['String']>
  content?: Maybe<Scalars['String']>
  objective?: Maybe<Scalars['String']>
  slug: Scalars['String']
  tags: Array<AdgerdirTag>
  link?: Maybe<Scalars['String']>
  linkButtonText?: Maybe<Scalars['String']>
  status: Scalars['String']
  estimatedCostIsk?: Maybe<Scalars['Float']>
  finalCostIsk?: Maybe<Scalars['Float']>
}

export type AdgerdirPages = {
  __typename?: 'AdgerdirPages'
  items: Array<AdgerdirPage>
}

export type Image = {
  __typename?: 'Image'
  url: Scalars['String']
  title: Scalars['String']
  contentType: Scalars['String']
  width: Scalars['Int']
  height: Scalars['Int']
}

export type AdgerdirNews = {
  __typename?: 'AdgerdirNews'
  id: Scalars['String']
  slug: Scalars['String']
  subtitle: Scalars['String']
  title: Scalars['String']
  intro: Scalars['String']
  image?: Maybe<Image>
  date: Scalars['String']
  content?: Maybe<Scalars['String']>
}

export type AdgerdirFrontpage = {
  __typename?: 'AdgerdirFrontpage'
  id: Scalars['String']
  title: Scalars['String']
  description: Scalars['String']
  content?: Maybe<Scalars['String']>
  slices: Array<AdgerdirSlice>
}

export type AdgerdirSlice = AdgerdirGroupSlice | AdgerdirFeaturedNewsSlice

export type AdgerdirGroupSlice = {
  __typename?: 'AdgerdirGroupSlice'
  id: Scalars['ID']
  subtitle?: Maybe<Scalars['String']>
  title: Scalars['String']
  description?: Maybe<Scalars['String']>
  image?: Maybe<Image>
  pages: Array<AdgerdirPage>
}

export type AdgerdirFeaturedNewsSlice = {
  __typename?: 'AdgerdirFeaturedNewsSlice'
  id: Scalars['ID']
  title: Scalars['String']
  featured: Array<AdgerdirNews>
}

export type FrontpageSlide = {
  __typename?: 'FrontpageSlide'
  subtitle?: Maybe<Scalars['String']>
  title?: Maybe<Scalars['String']>
  content?: Maybe<Scalars['String']>
  image?: Maybe<Image>
  link?: Maybe<Scalars['String']>
}

export type FrontpageSliderList = {
  __typename?: 'FrontpageSliderList'
  items: Array<FrontpageSlide>
}

export type News = {
  __typename?: 'News'
  id: Scalars['String']
  slug: Scalars['String']
  title: Scalars['String']
  subtitle: Scalars['String']
  intro: Scalars['String']
  image?: Maybe<Image>
  date: Scalars['String']
  content?: Maybe<Scalars['String']>
}

export type Pagination = {
  __typename?: 'Pagination'
  page: Scalars['Int']
  perPage: Scalars['Int']
  totalResults: Scalars['Int']
  totalPages: Scalars['Int']
}

export type PaginatedNews = {
  __typename?: 'PaginatedNews'
  page: Pagination
  news: Array<News>
}

export type Namespace = {
  __typename?: 'Namespace'
  namespace?: Maybe<Scalars['String']>
  fields?: Maybe<Scalars['String']>
}

export type Link = {
  __typename?: 'Link'
  text: Scalars['String']
  url: Scalars['String']
}

export type TimelineEvent = {
  __typename?: 'TimelineEvent'
  id: Scalars['ID']
  title: Scalars['String']
  date: Scalars['String']
  numerator?: Maybe<Scalars['Int']>
  denominator?: Maybe<Scalars['Int']>
  label: Scalars['String']
  body?: Maybe<Scalars['String']>
  tags: Array<Scalars['String']>
  link: Scalars['String']
}

export type Story = {
  __typename?: 'Story'
  label: Scalars['String']
  title: Scalars['String']
  logo: Image
  readMoreText: Scalars['String']
  date: Scalars['String']
  intro: Scalars['String']
  body?: Maybe<Scalars['String']>
}

export type LinkCard = {
  __typename?: 'LinkCard'
  title: Scalars['String']
  body: Scalars['String']
  link: Scalars['String']
  linkText: Scalars['String']
}

export type NumberBullet = {
  __typename?: 'NumberBullet'
  id: Scalars['ID']
  title: Scalars['String']
  body: Scalars['String']
}

export type AboutPage = {
  __typename?: 'AboutPage'
  title: Scalars['String']
  seoDescription: Scalars['String']
  theme: Scalars['String']
  slices: Array<Slice>
}

export type Slice =
  | PageHeaderSlice
  | TimelineSlice
  | HeadingSlice
  | StorySlice
  | LinkCardSlice
  | LatestNewsSlice
  | MailingListSignupSlice
  | LogoListSlice
  | BulletListSlice

export type PageHeaderSlice = {
  __typename?: 'PageHeaderSlice'
  id: Scalars['ID']
  title: Scalars['String']
  introduction: Scalars['String']
  navigationText: Scalars['String']
  links: Array<Link>
  slices: Array<Slice>
}

export type TimelineSlice = {
  __typename?: 'TimelineSlice'
  id: Scalars['ID']
  title: Scalars['String']
  events: Array<TimelineEvent>
}

export type HeadingSlice = {
  __typename?: 'HeadingSlice'
  id: Scalars['ID']
  title: Scalars['String']
  body: Scalars['String']
}

export type StorySlice = {
  __typename?: 'StorySlice'
  id: Scalars['ID']
  readMoreText: Scalars['String']
  stories: Array<Story>
}

export type LinkCardSlice = {
  __typename?: 'LinkCardSlice'
  id: Scalars['ID']
  title: Scalars['String']
  cards: Array<LinkCard>
}

export type LatestNewsSlice = {
  __typename?: 'LatestNewsSlice'
  id: Scalars['ID']
  title: Scalars['String']
  news: Array<News>
}

export type MailingListSignupSlice = {
  __typename?: 'MailingListSignupSlice'
  id: Scalars['ID']
  title: Scalars['String']
  description?: Maybe<Scalars['String']>
  inputLabel: Scalars['String']
  buttonText: Scalars['String']
}

export type LogoListSlice = {
  __typename?: 'LogoListSlice'
  id: Scalars['ID']
  title: Scalars['String']
  body: Scalars['String']
  images: Array<Image>
}

export type BulletListSlice = {
  __typename?: 'BulletListSlice'
  id: Scalars['ID']
  bullets: Array<BulletEntry>
}

export type BulletEntry = IconBullet | NumberBulletGroup

export type IconBullet = {
  __typename?: 'IconBullet'
  id: Scalars['ID']
  title: Scalars['String']
  body: Scalars['String']
  icon: Image
  url?: Maybe<Scalars['String']>
  linkText?: Maybe<Scalars['String']>
}

export type NumberBulletGroup = {
  __typename?: 'NumberBulletGroup'
  id: Scalars['ID']
  defaultVisible: Scalars['Int']
  bullets: Array<NumberBullet>
}

export type LinkList = {
  __typename?: 'LinkList'
  title?: Maybe<Scalars['String']>
  links: Array<Link>
}

export type LandingPage = {
  __typename?: 'LandingPage'
  title: Scalars['String']
  slug: Scalars['String']
  introduction: Scalars['String']
  image?: Maybe<Image>
  actionButton?: Maybe<Link>
  links?: Maybe<LinkList>
  content?: Maybe<Scalars['String']>
}

export type GenericPage = {
  __typename?: 'GenericPage'
  title: Scalars['String']
  slug: Scalars['String']
  intro?: Maybe<Scalars['String']>
  mainContent?: Maybe<Scalars['String']>
  sidebar?: Maybe<Scalars['String']>
  misc?: Maybe<Scalars['String']>
}

export type Menu = {
  __typename?: 'Menu'
  title: Scalars['String']
  links: Array<Link>
}

export type AdgerdirTags = {
  __typename?: 'AdgerdirTags'
  items: Array<AdgerdirTag>
}

export type LifeEventPage = {
  __typename?: 'LifeEventPage'
  title: Scalars['String']
  slug: Scalars['String']
  intro: Scalars['String']
  image: Image
  body: Scalars['JSON']
}

export type Application = {
  __typename?: 'Application'
  id: Scalars['ID']
  created: Scalars['DateTime']
  modified: Scalars['DateTime']
  applicant: Scalars['String']
  assignee: Scalars['String']
  externalId?: Maybe<Scalars['String']>
  state: ApplicationStateEnum
  attachments?: Maybe<Scalars['JSON']>
  typeId: ApplicationTypeIdEnum
  answers: Scalars['JSON']
  externalData: Scalars['JSON']
}

export enum ApplicationStateEnum {
  Draft = 'DRAFT',
  Beingprocessed = 'BEINGPROCESSED',
  Needsinformation = 'NEEDSINFORMATION',
  Pending = 'PENDING',
  Approved = 'APPROVED',
  Manualapproved = 'MANUALAPPROVED',
  Rejected = 'REJECTED',
  Unknown = 'UNKNOWN',
}

export enum ApplicationTypeIdEnum {
  ExampleForm = 'ExampleForm',
  ExampleForm2 = 'ExampleForm2',
  ExampleForm3 = 'ExampleForm3',
  FamilyAndPets = 'FamilyAndPets',
  ParentalLeave = 'ParentalLeave',
}

export type PresignedPost = {
  __typename?: 'PresignedPost'
  url: Scalars['String']
  fields: Scalars['JSON']
}

export type Document = {
  __typename?: 'Document'
  id: Scalars['ID']
  date: Scalars['DateTime']
  subject: Scalars['String']
  senderName: Scalars['String']
  senderNatReg: Scalars['String']
  opened: Scalars['Boolean']
}

export type Query = {
  __typename?: 'Query'
  helloWorld: HelloWorld
  searchResults: SearchResult
  singleItem?: Maybe<ContentItem>
  categories: Array<ContentCategory>
  articlesInCategory: Array<ContentItem>
  getArticle?: Maybe<Article>
  getNews?: Maybe<News>
  getNewsList: PaginatedNews
  getNamespace?: Maybe<Namespace>
  getAboutPage: AboutPage
  getLandingPage?: Maybe<LandingPage>
  getGenericPage?: Maybe<GenericPage>
  getAdgerdirPage?: Maybe<AdgerdirPage>
  getAdgerdirPages: AdgerdirPages
  getAdgerdirTags?: Maybe<AdgerdirTags>
  getFrontpageSliderList?: Maybe<FrontpageSliderList>
  getAdgerdirFrontpage?: Maybe<AdgerdirFrontpage>
  getMenu?: Maybe<Menu>
  getLifeEventPage?: Maybe<LifeEventPage>
  getApplication?: Maybe<Application>
  getApplicationsByType?: Maybe<Array<Application>>
  getDocument?: Maybe<Document>
}

export type QueryHelloWorldArgs = {
  input: HelloWorldInput
}

export type QuerySearchResultsArgs = {
  query: SearcherInput
}

export type QuerySingleItemArgs = {
  input: ItemInput
}

export type QueryCategoriesArgs = {
  input: CategoriesInput
}

export type QueryArticlesInCategoryArgs = {
  category: ArticlesInCategoryInput
}

export type QueryGetArticleArgs = {
  input: GetArticleInput
}

export type QueryGetNewsArgs = {
  input: GetNewsInput
}

export type QueryGetNewsListArgs = {
  input: GetNewsListInput
}

export type QueryGetNamespaceArgs = {
  input: GetNamespaceInput
}

export type QueryGetAboutPageArgs = {
  input: GetAboutPageInput
}

export type QueryGetLandingPageArgs = {
  input: GetLandingPageInput
}

export type QueryGetGenericPageArgs = {
  input: GetGenericPageInput
}

export type QueryGetAdgerdirPageArgs = {
  input: GetAdgerdirPageInput
}

export type QueryGetAdgerdirPagesArgs = {
  input: GetAdgerdirPagesInput
}

export type QueryGetAdgerdirTagsArgs = {
  input: GetAdgerdirTagsInput
}

export type QueryGetFrontpageSliderListArgs = {
  input: GetFrontpageSliderListInput
}

export type QueryGetAdgerdirFrontpageArgs = {
  input: GetAdgerdirFrontpageInput
}

export type QueryGetMenuArgs = {
  input: GetMenuInput
}

export type QueryGetLifeEventPageArgs = {
  input: GetLifeEventPageInput
}

export type QueryGetApplicationArgs = {
  input: GetApplicationInput
}

export type QueryGetApplicationsByTypeArgs = {
  input: GetApplicationsByTypeInput
}

export type QueryGetDocumentArgs = {
  input: GetDocumentInput
}

export type HelloWorldInput = {
  name?: Maybe<Scalars['String']>
}

export type SearcherInput = {
  queryString?: Maybe<Scalars['String']>
  language?: Maybe<ContentLanguage>
  size?: Maybe<Scalars['Int']>
  page?: Maybe<Scalars['Int']>
}

export enum ContentLanguage {
  Is = 'is',
  En = 'en',
}

export type ItemInput = {
  id?: Maybe<Scalars['ID']>
  slug?: Maybe<Scalars['String']>
  type?: Maybe<ItemType>
  language?: Maybe<ContentLanguage>
}

export enum ItemType {
  Article = 'article',
  Category = 'category',
}

export type CategoriesInput = {
  language?: Maybe<ContentLanguage>
}

export type ArticlesInCategoryInput = {
  slug?: Maybe<Scalars['String']>
  language?: Maybe<ContentLanguage>
}

export type GetArticleInput = {
  slug?: Maybe<Scalars['String']>
  lang: Scalars['String']
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

export type GetNamespaceInput = {
  namespace?: Maybe<Scalars['String']>
  lang: Scalars['String']
}

export type GetAboutPageInput = {
  lang: Scalars['String']
}

export type GetLandingPageInput = {
  slug: Scalars['String']
  lang: Scalars['String']
}

export type GetGenericPageInput = {
  slug: Scalars['String']
  lang: Scalars['String']
}

export type GetAdgerdirPageInput = {
  slug?: Maybe<Scalars['String']>
  lang: Scalars['String']
}

export type GetAdgerdirPagesInput = {
  lang?: Maybe<Scalars['String']>
  perPage?: Maybe<Scalars['Int']>
}

export type GetAdgerdirTagsInput = {
  lang?: Maybe<Scalars['String']>
}

export type GetFrontpageSliderListInput = {
  lang?: Maybe<Scalars['String']>
}

export type GetAdgerdirFrontpageInput = {
  lang: Scalars['String']
}

export type GetMenuInput = {
  name: Scalars['String']
  lang: Scalars['String']
}

export type GetLifeEventPageInput = {
  slug: Scalars['String']
  lang: Scalars['String']
}

export type GetApplicationInput = {
  id: Scalars['String']
}

export type GetApplicationsByTypeInput = {
  typeId: ApplicationTypeIdEnum
}

export type GetDocumentInput = {
  id: Scalars['String']
}

export type Mutation = {
  __typename?: 'Mutation'
  createApplication?: Maybe<Application>
  updateApplication?: Maybe<Application>
  updateApplicationExternalData?: Maybe<Application>
  addAttachment?: Maybe<Application>
  deleteAttachment?: Maybe<Application>
  createUploadUrl: PresignedPost
}

export type MutationCreateApplicationArgs = {
  input: CreateApplicationInput
}

export type MutationUpdateApplicationArgs = {
  input: UpdateApplicationInput
}

export type MutationUpdateApplicationExternalDataArgs = {
  input: UpdateApplicationExternalDataInput
}

export type MutationAddAttachmentArgs = {
  input: AddAttachmentInput
}

export type MutationDeleteAttachmentArgs = {
  input: DeleteAttachmentInput
}

export type MutationCreateUploadUrlArgs = {
  filename: Scalars['String']
}

export type CreateApplicationInput = {
  applicant: Scalars['String']
  assignee: Scalars['String']
  externalId?: Maybe<Scalars['String']>
  state: CreateApplicationDtoStateEnum
  attachments?: Maybe<Scalars['JSON']>
  typeId: CreateApplicationDtoTypeIdEnum
  answers: Scalars['JSON']
}

export enum CreateApplicationDtoStateEnum {
  Draft = 'DRAFT',
  Beingprocessed = 'BEINGPROCESSED',
  Needsinformation = 'NEEDSINFORMATION',
  Pending = 'PENDING',
  Approved = 'APPROVED',
  Manualapproved = 'MANUALAPPROVED',
  Rejected = 'REJECTED',
  Unknown = 'UNKNOWN',
}

export enum CreateApplicationDtoTypeIdEnum {
  ExampleForm = 'ExampleForm',
  ExampleForm2 = 'ExampleForm2',
  ExampleForm3 = 'ExampleForm3',
  FamilyAndPets = 'FamilyAndPets',
  ParentalLeave = 'ParentalLeave',
}

export type UpdateApplicationInput = {
  id: Scalars['String']
  typeId: UpdateApplicationDtoTypeIdEnum
  applicant?: Maybe<Scalars['String']>
  assignee?: Maybe<Scalars['String']>
  externalId?: Maybe<Scalars['String']>
  state?: Maybe<UpdateApplicationDtoStateEnum>
  attachments?: Maybe<Scalars['JSON']>
  answers?: Maybe<Scalars['JSON']>
}

export enum UpdateApplicationDtoTypeIdEnum {
  ExampleForm = 'ExampleForm',
  ExampleForm2 = 'ExampleForm2',
  ExampleForm3 = 'ExampleForm3',
  FamilyAndPets = 'FamilyAndPets',
  ParentalLeave = 'ParentalLeave',
}

export enum UpdateApplicationDtoStateEnum {
  Draft = 'DRAFT',
  Beingprocessed = 'BEINGPROCESSED',
  Needsinformation = 'NEEDSINFORMATION',
  Pending = 'PENDING',
  Approved = 'APPROVED',
  Manualapproved = 'MANUALAPPROVED',
  Rejected = 'REJECTED',
  Unknown = 'UNKNOWN',
}

export type UpdateApplicationExternalDataInput = {
  id: Scalars['String']
  dataProviders: Array<DataProvider>
}

export type DataProvider = {
  id: Scalars['String']
  type: DataProviderDtoTypeEnum
}

export enum DataProviderDtoTypeEnum {
  ExpectedDateOfBirth = 'ExpectedDateOfBirth',
  ExampleFails = 'ExampleFails',
  ExampleSucceeds = 'ExampleSucceeds',
}

export type AddAttachmentInput = {
  id: Scalars['String']
  key: Scalars['String']
  url: Scalars['String']
}

export type DeleteAttachmentInput = {
  id: Scalars['String']
  key: Scalars['String']
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
  HelloWorld: ResolverTypeWrapper<HelloWorld>
  String: ResolverTypeWrapper<Scalars['String']>
  ContentItem: ResolverTypeWrapper<ContentItem>
  ID: ResolverTypeWrapper<Scalars['ID']>
  SearchResult: ResolverTypeWrapper<SearchResult>
  Int: ResolverTypeWrapper<Scalars['Int']>
  ContentCategory: ResolverTypeWrapper<ContentCategory>
  Taxonomy: ResolverTypeWrapper<Taxonomy>
  Article: ResolverTypeWrapper<Article>
  AdgerdirTag: ResolverTypeWrapper<AdgerdirTag>
  AdgerdirPage: ResolverTypeWrapper<AdgerdirPage>
  Float: ResolverTypeWrapper<Scalars['Float']>
  AdgerdirPages: ResolverTypeWrapper<AdgerdirPages>
  Image: ResolverTypeWrapper<Image>
  AdgerdirNews: ResolverTypeWrapper<AdgerdirNews>
  AdgerdirFrontpage: ResolverTypeWrapper<
    Omit<AdgerdirFrontpage, 'slices'> & {
      slices: Array<ResolversTypes['AdgerdirSlice']>
    }
  >
  AdgerdirSlice:
    | ResolversTypes['AdgerdirGroupSlice']
    | ResolversTypes['AdgerdirFeaturedNewsSlice']
  AdgerdirGroupSlice: ResolverTypeWrapper<AdgerdirGroupSlice>
  AdgerdirFeaturedNewsSlice: ResolverTypeWrapper<AdgerdirFeaturedNewsSlice>
  FrontpageSlide: ResolverTypeWrapper<FrontpageSlide>
  FrontpageSliderList: ResolverTypeWrapper<FrontpageSliderList>
  News: ResolverTypeWrapper<News>
  Pagination: ResolverTypeWrapper<Pagination>
  PaginatedNews: ResolverTypeWrapper<PaginatedNews>
  Namespace: ResolverTypeWrapper<Namespace>
  Link: ResolverTypeWrapper<Link>
  TimelineEvent: ResolverTypeWrapper<TimelineEvent>
  Story: ResolverTypeWrapper<Story>
  LinkCard: ResolverTypeWrapper<LinkCard>
  NumberBullet: ResolverTypeWrapper<NumberBullet>
  AboutPage: ResolverTypeWrapper<
    Omit<AboutPage, 'slices'> & { slices: Array<ResolversTypes['Slice']> }
  >
  Slice:
    | ResolversTypes['PageHeaderSlice']
    | ResolversTypes['TimelineSlice']
    | ResolversTypes['HeadingSlice']
    | ResolversTypes['StorySlice']
    | ResolversTypes['LinkCardSlice']
    | ResolversTypes['LatestNewsSlice']
    | ResolversTypes['MailingListSignupSlice']
    | ResolversTypes['LogoListSlice']
    | ResolversTypes['BulletListSlice']
  PageHeaderSlice: ResolverTypeWrapper<
    Omit<PageHeaderSlice, 'slices'> & { slices: Array<ResolversTypes['Slice']> }
  >
  TimelineSlice: ResolverTypeWrapper<TimelineSlice>
  HeadingSlice: ResolverTypeWrapper<HeadingSlice>
  StorySlice: ResolverTypeWrapper<StorySlice>
  LinkCardSlice: ResolverTypeWrapper<LinkCardSlice>
  LatestNewsSlice: ResolverTypeWrapper<LatestNewsSlice>
  MailingListSignupSlice: ResolverTypeWrapper<MailingListSignupSlice>
  LogoListSlice: ResolverTypeWrapper<LogoListSlice>
  BulletListSlice: ResolverTypeWrapper<
    Omit<BulletListSlice, 'bullets'> & {
      bullets: Array<ResolversTypes['BulletEntry']>
    }
  >
  BulletEntry:
    | ResolversTypes['IconBullet']
    | ResolversTypes['NumberBulletGroup']
  IconBullet: ResolverTypeWrapper<IconBullet>
  NumberBulletGroup: ResolverTypeWrapper<NumberBulletGroup>
  LinkList: ResolverTypeWrapper<LinkList>
  LandingPage: ResolverTypeWrapper<LandingPage>
  GenericPage: ResolverTypeWrapper<GenericPage>
  Menu: ResolverTypeWrapper<Menu>
  AdgerdirTags: ResolverTypeWrapper<AdgerdirTags>
  LifeEventPage: ResolverTypeWrapper<LifeEventPage>
  JSON: ResolverTypeWrapper<Scalars['JSON']>
  Application: ResolverTypeWrapper<Application>
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>
  ApplicationStateEnum: ApplicationStateEnum
  ApplicationTypeIdEnum: ApplicationTypeIdEnum
  PresignedPost: ResolverTypeWrapper<PresignedPost>
  Document: ResolverTypeWrapper<Document>
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>
  Query: ResolverTypeWrapper<{}>
  HelloWorldInput: HelloWorldInput
  SearcherInput: SearcherInput
  ContentLanguage: ContentLanguage
  ItemInput: ItemInput
  ItemType: ItemType
  CategoriesInput: CategoriesInput
  ArticlesInCategoryInput: ArticlesInCategoryInput
  GetArticleInput: GetArticleInput
  GetNewsInput: GetNewsInput
  GetNewsListInput: GetNewsListInput
  GetNamespaceInput: GetNamespaceInput
  GetAboutPageInput: GetAboutPageInput
  GetLandingPageInput: GetLandingPageInput
  GetGenericPageInput: GetGenericPageInput
  GetAdgerdirPageInput: GetAdgerdirPageInput
  GetAdgerdirPagesInput: GetAdgerdirPagesInput
  GetAdgerdirTagsInput: GetAdgerdirTagsInput
  GetFrontpageSliderListInput: GetFrontpageSliderListInput
  GetAdgerdirFrontpageInput: GetAdgerdirFrontpageInput
  GetMenuInput: GetMenuInput
  GetLifeEventPageInput: GetLifeEventPageInput
  GetApplicationInput: GetApplicationInput
  GetApplicationsByTypeInput: GetApplicationsByTypeInput
  GetDocumentInput: GetDocumentInput
  Mutation: ResolverTypeWrapper<{}>
  CreateApplicationInput: CreateApplicationInput
  CreateApplicationDtoStateEnum: CreateApplicationDtoStateEnum
  CreateApplicationDtoTypeIdEnum: CreateApplicationDtoTypeIdEnum
  UpdateApplicationInput: UpdateApplicationInput
  UpdateApplicationDtoTypeIdEnum: UpdateApplicationDtoTypeIdEnum
  UpdateApplicationDtoStateEnum: UpdateApplicationDtoStateEnum
  UpdateApplicationExternalDataInput: UpdateApplicationExternalDataInput
  DataProvider: DataProvider
  DataProviderDtoTypeEnum: DataProviderDtoTypeEnum
  AddAttachmentInput: AddAttachmentInput
  DeleteAttachmentInput: DeleteAttachmentInput
}

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  HelloWorld: HelloWorld
  String: Scalars['String']
  ContentItem: ContentItem
  ID: Scalars['ID']
  SearchResult: SearchResult
  Int: Scalars['Int']
  ContentCategory: ContentCategory
  Taxonomy: Taxonomy
  Article: Article
  AdgerdirTag: AdgerdirTag
  AdgerdirPage: AdgerdirPage
  Float: Scalars['Float']
  AdgerdirPages: AdgerdirPages
  Image: Image
  AdgerdirNews: AdgerdirNews
  AdgerdirFrontpage: Omit<AdgerdirFrontpage, 'slices'> & {
    slices: Array<ResolversParentTypes['AdgerdirSlice']>
  }
  AdgerdirSlice:
    | ResolversParentTypes['AdgerdirGroupSlice']
    | ResolversParentTypes['AdgerdirFeaturedNewsSlice']
  AdgerdirGroupSlice: AdgerdirGroupSlice
  AdgerdirFeaturedNewsSlice: AdgerdirFeaturedNewsSlice
  FrontpageSlide: FrontpageSlide
  FrontpageSliderList: FrontpageSliderList
  News: News
  Pagination: Pagination
  PaginatedNews: PaginatedNews
  Namespace: Namespace
  Link: Link
  TimelineEvent: TimelineEvent
  Story: Story
  LinkCard: LinkCard
  NumberBullet: NumberBullet
  AboutPage: Omit<AboutPage, 'slices'> & {
    slices: Array<ResolversParentTypes['Slice']>
  }
  Slice:
    | ResolversParentTypes['PageHeaderSlice']
    | ResolversParentTypes['TimelineSlice']
    | ResolversParentTypes['HeadingSlice']
    | ResolversParentTypes['StorySlice']
    | ResolversParentTypes['LinkCardSlice']
    | ResolversParentTypes['LatestNewsSlice']
    | ResolversParentTypes['MailingListSignupSlice']
    | ResolversParentTypes['LogoListSlice']
    | ResolversParentTypes['BulletListSlice']
  PageHeaderSlice: Omit<PageHeaderSlice, 'slices'> & {
    slices: Array<ResolversParentTypes['Slice']>
  }
  TimelineSlice: TimelineSlice
  HeadingSlice: HeadingSlice
  StorySlice: StorySlice
  LinkCardSlice: LinkCardSlice
  LatestNewsSlice: LatestNewsSlice
  MailingListSignupSlice: MailingListSignupSlice
  LogoListSlice: LogoListSlice
  BulletListSlice: Omit<BulletListSlice, 'bullets'> & {
    bullets: Array<ResolversParentTypes['BulletEntry']>
  }
  BulletEntry:
    | ResolversParentTypes['IconBullet']
    | ResolversParentTypes['NumberBulletGroup']
  IconBullet: IconBullet
  NumberBulletGroup: NumberBulletGroup
  LinkList: LinkList
  LandingPage: LandingPage
  GenericPage: GenericPage
  Menu: Menu
  AdgerdirTags: AdgerdirTags
  LifeEventPage: LifeEventPage
  JSON: Scalars['JSON']
  Application: Application
  DateTime: Scalars['DateTime']
  PresignedPost: PresignedPost
  Document: Document
  Boolean: Scalars['Boolean']
  Query: {}
  HelloWorldInput: HelloWorldInput
  SearcherInput: SearcherInput
  ItemInput: ItemInput
  CategoriesInput: CategoriesInput
  ArticlesInCategoryInput: ArticlesInCategoryInput
  GetArticleInput: GetArticleInput
  GetNewsInput: GetNewsInput
  GetNewsListInput: GetNewsListInput
  GetNamespaceInput: GetNamespaceInput
  GetAboutPageInput: GetAboutPageInput
  GetLandingPageInput: GetLandingPageInput
  GetGenericPageInput: GetGenericPageInput
  GetAdgerdirPageInput: GetAdgerdirPageInput
  GetAdgerdirPagesInput: GetAdgerdirPagesInput
  GetAdgerdirTagsInput: GetAdgerdirTagsInput
  GetFrontpageSliderListInput: GetFrontpageSliderListInput
  GetAdgerdirFrontpageInput: GetAdgerdirFrontpageInput
  GetMenuInput: GetMenuInput
  GetLifeEventPageInput: GetLifeEventPageInput
  GetApplicationInput: GetApplicationInput
  GetApplicationsByTypeInput: GetApplicationsByTypeInput
  GetDocumentInput: GetDocumentInput
  Mutation: {}
  CreateApplicationInput: CreateApplicationInput
  UpdateApplicationInput: UpdateApplicationInput
  UpdateApplicationExternalDataInput: UpdateApplicationExternalDataInput
  DataProvider: DataProvider
  AddAttachmentInput: AddAttachmentInput
  DeleteAttachmentInput: DeleteAttachmentInput
}

export type HelloWorldResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['HelloWorld'] = ResolversParentTypes['HelloWorld']
> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type ContentItemResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['ContentItem'] = ResolversParentTypes['ContentItem']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  content?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  tag?: Resolver<
    Maybe<Array<ResolversTypes['String']>>,
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
  groupDescription?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
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
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
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

export type TaxonomyResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Taxonomy'] = ResolversParentTypes['Taxonomy']
> = {
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  slug?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>
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
  relatedArticles?: Resolver<
    Array<ResolversTypes['Article']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type AdgerdirTagResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['AdgerdirTag'] = ResolversParentTypes['AdgerdirTag']
> = {
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type AdgerdirPageResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['AdgerdirPage'] = ResolversParentTypes['AdgerdirPage']
> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  longDescription?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  content?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  objective?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  tags?: Resolver<Array<ResolversTypes['AdgerdirTag']>, ParentType, ContextType>
  link?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  linkButtonText?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  estimatedCostIsk?: Resolver<
    Maybe<ResolversTypes['Float']>,
    ParentType,
    ContextType
  >
  finalCostIsk?: Resolver<
    Maybe<ResolversTypes['Float']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type AdgerdirPagesResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['AdgerdirPages'] = ResolversParentTypes['AdgerdirPages']
> = {
  items?: Resolver<
    Array<ResolversTypes['AdgerdirPage']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type ImageResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Image'] = ResolversParentTypes['Image']
> = {
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  contentType?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  width?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  height?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type AdgerdirNewsResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['AdgerdirNews'] = ResolversParentTypes['AdgerdirNews']
> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  subtitle?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  intro?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  image?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType>
  date?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  content?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type AdgerdirFrontpageResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['AdgerdirFrontpage'] = ResolversParentTypes['AdgerdirFrontpage']
> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  content?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  slices?: Resolver<
    Array<ResolversTypes['AdgerdirSlice']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type AdgerdirSliceResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['AdgerdirSlice'] = ResolversParentTypes['AdgerdirSlice']
> = {
  __resolveType: TypeResolveFn<
    'AdgerdirGroupSlice' | 'AdgerdirFeaturedNewsSlice',
    ParentType,
    ContextType
  >
}

export type AdgerdirGroupSliceResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['AdgerdirGroupSlice'] = ResolversParentTypes['AdgerdirGroupSlice']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  subtitle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  description?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  image?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType>
  pages?: Resolver<
    Array<ResolversTypes['AdgerdirPage']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type AdgerdirFeaturedNewsSliceResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['AdgerdirFeaturedNewsSlice'] = ResolversParentTypes['AdgerdirFeaturedNewsSlice']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  featured?: Resolver<
    Array<ResolversTypes['AdgerdirNews']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type FrontpageSlideResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['FrontpageSlide'] = ResolversParentTypes['FrontpageSlide']
> = {
  subtitle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  content?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  image?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType>
  link?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type FrontpageSliderListResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['FrontpageSliderList'] = ResolversParentTypes['FrontpageSliderList']
> = {
  items?: Resolver<
    Array<ResolversTypes['FrontpageSlide']>,
    ParentType,
    ContextType
  >
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

export type LinkResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Link'] = ResolversParentTypes['Link']
> = {
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type TimelineEventResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['TimelineEvent'] = ResolversParentTypes['TimelineEvent']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  date?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  numerator?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  denominator?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  body?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  tags?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>
  link?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type StoryResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Story'] = ResolversParentTypes['Story']
> = {
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  logo?: Resolver<ResolversTypes['Image'], ParentType, ContextType>
  readMoreText?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  date?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  intro?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  body?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type LinkCardResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['LinkCard'] = ResolversParentTypes['LinkCard']
> = {
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  body?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  link?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  linkText?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type NumberBulletResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['NumberBullet'] = ResolversParentTypes['NumberBullet']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  body?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type AboutPageResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['AboutPage'] = ResolversParentTypes['AboutPage']
> = {
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  seoDescription?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  theme?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  slices?: Resolver<Array<ResolversTypes['Slice']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type SliceResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Slice'] = ResolversParentTypes['Slice']
> = {
  __resolveType: TypeResolveFn<
    | 'PageHeaderSlice'
    | 'TimelineSlice'
    | 'HeadingSlice'
    | 'StorySlice'
    | 'LinkCardSlice'
    | 'LatestNewsSlice'
    | 'MailingListSignupSlice'
    | 'LogoListSlice'
    | 'BulletListSlice',
    ParentType,
    ContextType
  >
}

export type PageHeaderSliceResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['PageHeaderSlice'] = ResolversParentTypes['PageHeaderSlice']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  introduction?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  navigationText?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  links?: Resolver<Array<ResolversTypes['Link']>, ParentType, ContextType>
  slices?: Resolver<Array<ResolversTypes['Slice']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type TimelineSliceResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['TimelineSlice'] = ResolversParentTypes['TimelineSlice']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  events?: Resolver<
    Array<ResolversTypes['TimelineEvent']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type HeadingSliceResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['HeadingSlice'] = ResolversParentTypes['HeadingSlice']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  body?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type StorySliceResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['StorySlice'] = ResolversParentTypes['StorySlice']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  readMoreText?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  stories?: Resolver<Array<ResolversTypes['Story']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type LinkCardSliceResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['LinkCardSlice'] = ResolversParentTypes['LinkCardSlice']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  cards?: Resolver<Array<ResolversTypes['LinkCard']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type LatestNewsSliceResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['LatestNewsSlice'] = ResolversParentTypes['LatestNewsSlice']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  news?: Resolver<Array<ResolversTypes['News']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type MailingListSignupSliceResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['MailingListSignupSlice'] = ResolversParentTypes['MailingListSignupSlice']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  description?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  inputLabel?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  buttonText?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type LogoListSliceResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['LogoListSlice'] = ResolversParentTypes['LogoListSlice']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  body?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  images?: Resolver<Array<ResolversTypes['Image']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type BulletListSliceResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['BulletListSlice'] = ResolversParentTypes['BulletListSlice']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  bullets?: Resolver<
    Array<ResolversTypes['BulletEntry']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type BulletEntryResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['BulletEntry'] = ResolversParentTypes['BulletEntry']
> = {
  __resolveType: TypeResolveFn<
    'IconBullet' | 'NumberBulletGroup',
    ParentType,
    ContextType
  >
}

export type IconBulletResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['IconBullet'] = ResolversParentTypes['IconBullet']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  body?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  icon?: Resolver<ResolversTypes['Image'], ParentType, ContextType>
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  linkText?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type NumberBulletGroupResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['NumberBulletGroup'] = ResolversParentTypes['NumberBulletGroup']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  defaultVisible?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  bullets?: Resolver<
    Array<ResolversTypes['NumberBullet']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type LinkListResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['LinkList'] = ResolversParentTypes['LinkList']
> = {
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  links?: Resolver<Array<ResolversTypes['Link']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type LandingPageResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['LandingPage'] = ResolversParentTypes['LandingPage']
> = {
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  introduction?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  image?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType>
  actionButton?: Resolver<
    Maybe<ResolversTypes['Link']>,
    ParentType,
    ContextType
  >
  links?: Resolver<Maybe<ResolversTypes['LinkList']>, ParentType, ContextType>
  content?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type GenericPageResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['GenericPage'] = ResolversParentTypes['GenericPage']
> = {
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  intro?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  mainContent?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  sidebar?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  misc?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type MenuResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Menu'] = ResolversParentTypes['Menu']
> = {
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  links?: Resolver<Array<ResolversTypes['Link']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type AdgerdirTagsResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['AdgerdirTags'] = ResolversParentTypes['AdgerdirTags']
> = {
  items?: Resolver<
    Array<ResolversTypes['AdgerdirTag']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type LifeEventPageResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['LifeEventPage'] = ResolversParentTypes['LifeEventPage']
> = {
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  intro?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  image?: Resolver<ResolversTypes['Image'], ParentType, ContextType>
  body?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export interface JsonScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON'
}

export type ApplicationResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Application'] = ResolversParentTypes['Application']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  created?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  modified?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  applicant?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  assignee?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  externalId?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  state?: Resolver<
    ResolversTypes['ApplicationStateEnum'],
    ParentType,
    ContextType
  >
  attachments?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>
  typeId?: Resolver<
    ResolversTypes['ApplicationTypeIdEnum'],
    ParentType,
    ContextType
  >
  answers?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>
  externalData?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export interface DateTimeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime'
}

export type PresignedPostResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['PresignedPost'] = ResolversParentTypes['PresignedPost']
> = {
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  fields?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type DocumentResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Document'] = ResolversParentTypes['Document']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  subject?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  senderName?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  senderNatReg?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  opened?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type QueryResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = {
  helloWorld?: Resolver<
    ResolversTypes['HelloWorld'],
    ParentType,
    ContextType,
    RequireFields<QueryHelloWorldArgs, 'input'>
  >
  searchResults?: Resolver<
    ResolversTypes['SearchResult'],
    ParentType,
    ContextType,
    RequireFields<QuerySearchResultsArgs, 'query'>
  >
  singleItem?: Resolver<
    Maybe<ResolversTypes['ContentItem']>,
    ParentType,
    ContextType,
    RequireFields<QuerySingleItemArgs, 'input'>
  >
  categories?: Resolver<
    Array<ResolversTypes['ContentCategory']>,
    ParentType,
    ContextType,
    RequireFields<QueryCategoriesArgs, 'input'>
  >
  articlesInCategory?: Resolver<
    Array<ResolversTypes['ContentItem']>,
    ParentType,
    ContextType,
    RequireFields<QueryArticlesInCategoryArgs, 'category'>
  >
  getArticle?: Resolver<
    Maybe<ResolversTypes['Article']>,
    ParentType,
    ContextType,
    RequireFields<QueryGetArticleArgs, 'input'>
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
    RequireFields<QueryGetNewsListArgs, 'input'>
  >
  getNamespace?: Resolver<
    Maybe<ResolversTypes['Namespace']>,
    ParentType,
    ContextType,
    RequireFields<QueryGetNamespaceArgs, 'input'>
  >
  getAboutPage?: Resolver<
    ResolversTypes['AboutPage'],
    ParentType,
    ContextType,
    RequireFields<QueryGetAboutPageArgs, 'input'>
  >
  getLandingPage?: Resolver<
    Maybe<ResolversTypes['LandingPage']>,
    ParentType,
    ContextType,
    RequireFields<QueryGetLandingPageArgs, 'input'>
  >
  getGenericPage?: Resolver<
    Maybe<ResolversTypes['GenericPage']>,
    ParentType,
    ContextType,
    RequireFields<QueryGetGenericPageArgs, 'input'>
  >
  getAdgerdirPage?: Resolver<
    Maybe<ResolversTypes['AdgerdirPage']>,
    ParentType,
    ContextType,
    RequireFields<QueryGetAdgerdirPageArgs, 'input'>
  >
  getAdgerdirPages?: Resolver<
    ResolversTypes['AdgerdirPages'],
    ParentType,
    ContextType,
    RequireFields<QueryGetAdgerdirPagesArgs, 'input'>
  >
  getAdgerdirTags?: Resolver<
    Maybe<ResolversTypes['AdgerdirTags']>,
    ParentType,
    ContextType,
    RequireFields<QueryGetAdgerdirTagsArgs, 'input'>
  >
  getFrontpageSliderList?: Resolver<
    Maybe<ResolversTypes['FrontpageSliderList']>,
    ParentType,
    ContextType,
    RequireFields<QueryGetFrontpageSliderListArgs, 'input'>
  >
  getAdgerdirFrontpage?: Resolver<
    Maybe<ResolversTypes['AdgerdirFrontpage']>,
    ParentType,
    ContextType,
    RequireFields<QueryGetAdgerdirFrontpageArgs, 'input'>
  >
  getMenu?: Resolver<
    Maybe<ResolversTypes['Menu']>,
    ParentType,
    ContextType,
    RequireFields<QueryGetMenuArgs, 'input'>
  >
  getLifeEventPage?: Resolver<
    Maybe<ResolversTypes['LifeEventPage']>,
    ParentType,
    ContextType,
    RequireFields<QueryGetLifeEventPageArgs, 'input'>
  >
  getApplication?: Resolver<
    Maybe<ResolversTypes['Application']>,
    ParentType,
    ContextType,
    RequireFields<QueryGetApplicationArgs, 'input'>
  >
  getApplicationsByType?: Resolver<
    Maybe<Array<ResolversTypes['Application']>>,
    ParentType,
    ContextType,
    RequireFields<QueryGetApplicationsByTypeArgs, 'input'>
  >
  getDocument?: Resolver<
    Maybe<ResolversTypes['Document']>,
    ParentType,
    ContextType,
    RequireFields<QueryGetDocumentArgs, 'input'>
  >
}

export type MutationResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']
> = {
  createApplication?: Resolver<
    Maybe<ResolversTypes['Application']>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateApplicationArgs, 'input'>
  >
  updateApplication?: Resolver<
    Maybe<ResolversTypes['Application']>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateApplicationArgs, 'input'>
  >
  updateApplicationExternalData?: Resolver<
    Maybe<ResolversTypes['Application']>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateApplicationExternalDataArgs, 'input'>
  >
  addAttachment?: Resolver<
    Maybe<ResolversTypes['Application']>,
    ParentType,
    ContextType,
    RequireFields<MutationAddAttachmentArgs, 'input'>
  >
  deleteAttachment?: Resolver<
    Maybe<ResolversTypes['Application']>,
    ParentType,
    ContextType,
    RequireFields<MutationDeleteAttachmentArgs, 'input'>
  >
  createUploadUrl?: Resolver<
    ResolversTypes['PresignedPost'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateUploadUrlArgs, 'filename'>
  >
}

export type Resolvers<ContextType = Context> = {
  HelloWorld?: HelloWorldResolvers<ContextType>
  ContentItem?: ContentItemResolvers<ContextType>
  SearchResult?: SearchResultResolvers<ContextType>
  ContentCategory?: ContentCategoryResolvers<ContextType>
  Taxonomy?: TaxonomyResolvers<ContextType>
  Article?: ArticleResolvers<ContextType>
  AdgerdirTag?: AdgerdirTagResolvers<ContextType>
  AdgerdirPage?: AdgerdirPageResolvers<ContextType>
  AdgerdirPages?: AdgerdirPagesResolvers<ContextType>
  Image?: ImageResolvers<ContextType>
  AdgerdirNews?: AdgerdirNewsResolvers<ContextType>
  AdgerdirFrontpage?: AdgerdirFrontpageResolvers<ContextType>
  AdgerdirSlice?: AdgerdirSliceResolvers<ContextType>
  AdgerdirGroupSlice?: AdgerdirGroupSliceResolvers<ContextType>
  AdgerdirFeaturedNewsSlice?: AdgerdirFeaturedNewsSliceResolvers<ContextType>
  FrontpageSlide?: FrontpageSlideResolvers<ContextType>
  FrontpageSliderList?: FrontpageSliderListResolvers<ContextType>
  News?: NewsResolvers<ContextType>
  Pagination?: PaginationResolvers<ContextType>
  PaginatedNews?: PaginatedNewsResolvers<ContextType>
  Namespace?: NamespaceResolvers<ContextType>
  Link?: LinkResolvers<ContextType>
  TimelineEvent?: TimelineEventResolvers<ContextType>
  Story?: StoryResolvers<ContextType>
  LinkCard?: LinkCardResolvers<ContextType>
  NumberBullet?: NumberBulletResolvers<ContextType>
  AboutPage?: AboutPageResolvers<ContextType>
  Slice?: SliceResolvers<ContextType>
  PageHeaderSlice?: PageHeaderSliceResolvers<ContextType>
  TimelineSlice?: TimelineSliceResolvers<ContextType>
  HeadingSlice?: HeadingSliceResolvers<ContextType>
  StorySlice?: StorySliceResolvers<ContextType>
  LinkCardSlice?: LinkCardSliceResolvers<ContextType>
  LatestNewsSlice?: LatestNewsSliceResolvers<ContextType>
  MailingListSignupSlice?: MailingListSignupSliceResolvers<ContextType>
  LogoListSlice?: LogoListSliceResolvers<ContextType>
  BulletListSlice?: BulletListSliceResolvers<ContextType>
  BulletEntry?: BulletEntryResolvers<ContextType>
  IconBullet?: IconBulletResolvers<ContextType>
  NumberBulletGroup?: NumberBulletGroupResolvers<ContextType>
  LinkList?: LinkListResolvers<ContextType>
  LandingPage?: LandingPageResolvers<ContextType>
  GenericPage?: GenericPageResolvers<ContextType>
  Menu?: MenuResolvers<ContextType>
  AdgerdirTags?: AdgerdirTagsResolvers<ContextType>
  LifeEventPage?: LifeEventPageResolvers<ContextType>
  JSON?: GraphQLScalarType
  Application?: ApplicationResolvers<ContextType>
  DateTime?: GraphQLScalarType
  PresignedPost?: PresignedPostResolvers<ContextType>
  Document?: DocumentResolvers<ContextType>
  Query?: QueryResolvers<ContextType>
  Mutation?: MutationResolvers<ContextType>
}

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = Context> = Resolvers<ContextType>

export interface IntrospectionResultData {
  __schema: {
    types: {
      kind: string
      name: string
      possibleTypes: {
        name: string
      }[]
    }[]
  }
}
const result: IntrospectionResultData = {
  __schema: {
    types: [
      {
        kind: 'UNION',
        name: 'AdgerdirSlice',
        possibleTypes: [
          {
            name: 'AdgerdirGroupSlice',
          },
          {
            name: 'AdgerdirFeaturedNewsSlice',
          },
        ],
      },
      {
        kind: 'UNION',
        name: 'Slice',
        possibleTypes: [
          {
            name: 'PageHeaderSlice',
          },
          {
            name: 'TimelineSlice',
          },
          {
            name: 'HeadingSlice',
          },
          {
            name: 'StorySlice',
          },
          {
            name: 'LinkCardSlice',
          },
          {
            name: 'LatestNewsSlice',
          },
          {
            name: 'MailingListSignupSlice',
          },
          {
            name: 'LogoListSlice',
          },
          {
            name: 'BulletListSlice',
          },
        ],
      },
      {
        kind: 'UNION',
        name: 'BulletEntry',
        possibleTypes: [
          {
            name: 'IconBullet',
          },
          {
            name: 'NumberBulletGroup',
          },
        ],
      },
    ],
  },
}
export default result
