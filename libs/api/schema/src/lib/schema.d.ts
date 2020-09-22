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

export type Image = {
  __typename?: 'Image'
  typename: Scalars['String']
  id: Scalars['ID']
  url: Scalars['String']
  title: Scalars['String']
  contentType: Scalars['String']
  width: Scalars['Int']
  height: Scalars['Int']
}

export type Html = {
  __typename?: 'Html'
  typename: Scalars['String']
  id: Scalars['ID']
  document: Scalars['JSON']
}

export type TimelineEvent = {
  __typename?: 'TimelineEvent'
  id: Scalars['ID']
  title: Scalars['String']
  date: Scalars['String']
  numerator?: Maybe<Scalars['Int']>
  denominator?: Maybe<Scalars['Int']>
  label: Scalars['String']
  body?: Maybe<Html>
  tags?: Maybe<Array<Scalars['String']>>
  link: Scalars['String']
}

export type TimelineSlice = {
  __typename?: 'TimelineSlice'
  typename: Scalars['String']
  id: Scalars['ID']
  title: Scalars['String']
  events: Array<TimelineEvent>
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

export type NumberBullet = {
  __typename?: 'NumberBullet'
  id: Scalars['ID']
  title: Scalars['String']
  body: Scalars['String']
}

export type Statistic = {
  __typename?: 'Statistic'
  id: Scalars['ID']
  value: Scalars['String']
  label: Scalars['String']
}

export type QuestionAndAnswer = {
  __typename?: 'QuestionAndAnswer'
  id: Scalars['ID']
  question: Scalars['String']
  answer?: Maybe<Html>
}

export type TabContent = {
  __typename?: 'TabContent'
  tabTitle: Scalars['String']
  contentTitle?: Maybe<Scalars['String']>
  image?: Maybe<Image>
  body?: Maybe<Html>
}

export type ArticleCategory = {
  __typename?: 'ArticleCategory'
  title: Scalars['String']
  slug: Scalars['String']
  description?: Maybe<Scalars['String']>
}

export type ArticleGroup = {
  __typename?: 'ArticleGroup'
  title: Scalars['String']
  slug: Scalars['String']
  description?: Maybe<Scalars['String']>
}

export type ArticleSubgroup = {
  __typename?: 'ArticleSubgroup'
  title: Scalars['String']
  importance?: Maybe<Scalars['Float']>
  slug: Scalars['String']
}

export type OrganizationTag = {
  __typename?: 'OrganizationTag'
  id: Scalars['ID']
  title: Scalars['String']
}

export type Organization = {
  __typename?: 'Organization'
  id: Scalars['ID']
  title: Scalars['String']
  description?: Maybe<Scalars['String']>
  slug: Scalars['String']
  tag?: Maybe<Array<OrganizationTag>>
  link?: Maybe<Scalars['String']>
}

export type SubArticle = {
  __typename?: 'SubArticle'
  title: Scalars['String']
  slug: Scalars['String']
  body: Array<Slice>
}

export type Slice =
  | TimelineSlice
  | MailingListSignupSlice
  | HeadingSlice
  | LinkCardSlice
  | StorySlice
  | LogoListSlice
  | LatestNewsSlice
  | BulletListSlice
  | Statistics
  | ProcessEntry
  | FaqList
  | EmbeddedVideo
  | SectionWithImage
  | TabSection
  | Html
  | Image

export type MailingListSignupSlice = {
  __typename?: 'MailingListSignupSlice'
  typename: Scalars['String']
  id: Scalars['ID']
  title: Scalars['String']
  description?: Maybe<Scalars['String']>
  inputLabel: Scalars['String']
  buttonText: Scalars['String']
}

export type HeadingSlice = {
  __typename?: 'HeadingSlice'
  typename: Scalars['String']
  id: Scalars['ID']
  title: Scalars['String']
  body: Scalars['String']
}

export type LinkCardSlice = {
  __typename?: 'LinkCardSlice'
  typename: Scalars['String']
  id: Scalars['ID']
  title: Scalars['String']
  cards: Array<LinkCard>
}

export type StorySlice = {
  __typename?: 'StorySlice'
  typename: Scalars['String']
  id: Scalars['ID']
  readMoreText: Scalars['String']
  stories: Array<Story>
}

export type LogoListSlice = {
  __typename?: 'LogoListSlice'
  typename: Scalars['String']
  id: Scalars['ID']
  title: Scalars['String']
  body: Scalars['String']
  images: Array<Image>
}

export type LatestNewsSlice = {
  __typename?: 'LatestNewsSlice'
  typename: Scalars['String']
  id: Scalars['ID']
  title: Scalars['String']
  news: Array<News>
}

export type BulletListSlice = {
  __typename?: 'BulletListSlice'
  typename: Scalars['String']
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

export type Statistics = {
  __typename?: 'Statistics'
  typename: Scalars['String']
  id: Scalars['ID']
  title: Scalars['String']
  statistics: Array<Statistic>
}

export type ProcessEntry = {
  __typename?: 'ProcessEntry'
  typename: Scalars['String']
  id: Scalars['ID']
  type: Scalars['String']
  processTitle: Scalars['String']
  processLink: Scalars['String']
  buttonText: Scalars['String']
}

export type FaqList = {
  __typename?: 'FaqList'
  typename: Scalars['String']
  id: Scalars['ID']
  title: Scalars['String']
  questions: Array<QuestionAndAnswer>
}

export type EmbeddedVideo = {
  __typename?: 'EmbeddedVideo'
  typename: Scalars['String']
  id: Scalars['ID']
  title: Scalars['String']
  url: Scalars['String']
}

export type SectionWithImage = {
  __typename?: 'SectionWithImage'
  typename: Scalars['String']
  id: Scalars['ID']
  title: Scalars['String']
  image?: Maybe<Image>
  html: Html
}

export type TabSection = {
  __typename?: 'TabSection'
  typename: Scalars['String']
  id: Scalars['ID']
  title: Scalars['String']
  tabs: Array<TabContent>
}

export type Article = {
  __typename?: 'Article'
  id: Scalars['ID']
  title: Scalars['String']
  slug: Scalars['String']
  shortTitle?: Maybe<Scalars['String']>
  intro?: Maybe<Scalars['String']>
  containsApplicationForm?: Maybe<Scalars['Boolean']>
  importance?: Maybe<Scalars['Float']>
  body: Array<Slice>
  category?: Maybe<ArticleCategory>
  group?: Maybe<ArticleGroup>
  subgroup?: Maybe<ArticleSubgroup>
  organization?: Maybe<Array<Organization>>
  subArticles: Array<SubArticle>
  relatedArticles?: Maybe<Array<Article>>
}

export type AdgerdirTag = {
  __typename?: 'AdgerdirTag'
  id: Scalars['ID']
  title: Scalars['String']
}

export type AdgerdirPage = {
  __typename?: 'AdgerdirPage'
  id: Scalars['ID']
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

export type Organizations = {
  __typename?: 'Organizations'
  items: Array<Organization>
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
  pages?: Maybe<Array<AdgerdirPage>>
}

export type AdgerdirPages = {
  __typename?: 'AdgerdirPages'
  items: Array<AdgerdirPage>
}

export type AdgerdirFrontpage = {
  __typename?: 'AdgerdirFrontpage'
  id: Scalars['ID']
  slug: Scalars['String']
  title: Scalars['String']
  description?: Maybe<Scalars['String']>
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

export type FrontpageSlider = {
  __typename?: 'FrontpageSlider'
  title: Scalars['String']
  subtitle: Scalars['String']
  content: Scalars['String']
  link?: Maybe<Scalars['String']>
  animationJson?: Maybe<Scalars['String']>
}

export type FrontpageSliderList = {
  __typename?: 'FrontpageSliderList'
  items: Array<FrontpageSlider>
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
  namespace: Scalars['String']
  fields: Scalars['String']
}

export type Link = {
  __typename?: 'Link'
  text: Scalars['String']
  url: Scalars['String']
}

export type PageHeader = {
  __typename?: 'PageHeader'
  typename: Scalars['String']
  id: Scalars['ID']
  title: Scalars['String']
  introduction: Scalars['String']
  navigationText: Scalars['String']
  links: Array<Link>
  slices: Array<TimelineSlice>
}

export type AboutPage = {
  __typename?: 'AboutPage'
  id: Scalars['ID']
  title: Scalars['String']
  seoDescription: Scalars['String']
  theme: Scalars['String']
  pageHeader: PageHeader
  slices: Array<Slice>
}

export type LinkList = {
  __typename?: 'LinkList'
  title: Scalars['String']
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
  content: Array<Slice>
}

export type AlertBanner = {
  __typename?: 'AlertBanner'
  id: Scalars['ID']
  showAlertBanner: Scalars['Boolean']
  bannerVariant: Scalars['String']
  title?: Maybe<Scalars['String']>
  description?: Maybe<Scalars['String']>
  link?: Maybe<Link>
  isDismissable: Scalars['Boolean']
  dismissedForDays: Scalars['Int']
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
  id: Scalars['ID']
  title: Scalars['String']
  slug: Scalars['String']
  intro: Scalars['String']
  image?: Maybe<Image>
  thumbnail?: Maybe<Image>
  content: Array<Slice>
  category?: Maybe<ArticleCategory>
}

export type PaginatedAdgerdirNews = {
  __typename?: 'PaginatedAdgerdirNews'
  page: Pagination
  news: Array<AdgerdirNews>
}

export type OrganizationTags = {
  __typename?: 'OrganizationTags'
  items: Array<OrganizationTag>
}

export type Url = {
  __typename?: 'Url'
  id: Scalars['ID']
  title?: Maybe<Scalars['String']>
  page: UrlPage
  urlsList: Array<Scalars['String']>
}

export type UrlPage = Article | ArticleCategory | News | LifeEventPage

export type AboutSubPage = {
  __typename?: 'AboutSubPage'
  id: Scalars['ID']
  title: Scalars['String']
  slug: Scalars['String']
  description: Scalars['String']
  subDescription: Scalars['String']
  slices: Array<Slice>
}

export type SearchResult = {
  __typename?: 'SearchResult'
  total: Scalars['Int']
  items: Array<Items>
}

export type Items = Article | LifeEventPage | News | AboutPage

export type ContentItem = {
  __typename?: 'ContentItem'
  id: Scalars['ID']
  title?: Maybe<Scalars['String']>
  content?: Maybe<Scalars['String']>
  tag?: Maybe<Array<Scalars['String']>>
  category?: Maybe<Scalars['String']>
  categorySlug?: Maybe<Scalars['String']>
  categoryDescription?: Maybe<Scalars['String']>
  containsApplicationForm?: Maybe<Scalars['Boolean']>
  importance?: Maybe<Scalars['Float']>
  group?: Maybe<Scalars['String']>
  subgroup?: Maybe<Scalars['String']>
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

export type WebSearchAutocomplete = {
  __typename?: 'WebSearchAutocomplete'
  total: Scalars['Int']
  completions: Array<Scalars['String']>
}

export type Application = {
  __typename?: 'Application'
  id: Scalars['ID']
  created: Scalars['DateTime']
  modified: Scalars['DateTime']
  applicant: Scalars['String']
  assignee: Scalars['String']
  externalId?: Maybe<Scalars['String']>
  state: Scalars['String']
  attachments?: Maybe<Scalars['JSON']>
  typeId: ApplicationTypeIdEnum
  answers: Scalars['JSON']
  externalData: Scalars['JSON']
}

export enum ApplicationTypeIdEnum {
  ExampleForm = 'ExampleForm',
  DrivingLessons = 'DrivingLessons',
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

export type DocumentDetails = {
  __typename?: 'DocumentDetails'
  fileType: Scalars['String']
  content: Scalars['String']
  html: Scalars['String']
  url: Scalars['String']
}

export type DocumentCategory = {
  __typename?: 'DocumentCategory'
  id: Scalars['ID']
  name: Scalars['String']
}

export type Query = {
  __typename?: 'Query'
  helloWorld: HelloWorld
  getNewsList: PaginatedNews
  getAdgerdirNewsList: PaginatedAdgerdirNews
  getNamespace?: Maybe<Namespace>
  getAboutPage: AboutPage
  getAboutSubPage?: Maybe<AboutSubPage>
  getLandingPage?: Maybe<LandingPage>
  getAlertBanner?: Maybe<AlertBanner>
  getGenericPage?: Maybe<GenericPage>
  getAdgerdirPage?: Maybe<AdgerdirPage>
  getOrganization?: Maybe<Organization>
  getAdgerdirNews?: Maybe<AdgerdirNews>
  getAdgerdirPages: AdgerdirPages
  getOrganizations: Organizations
  getAdgerdirTags?: Maybe<AdgerdirTags>
  getOrganizationTags?: Maybe<OrganizationTags>
  getFrontpageSliderList?: Maybe<FrontpageSliderList>
  getAdgerdirFrontpage?: Maybe<AdgerdirFrontpage>
  getMenu?: Maybe<Menu>
  getLifeEventPage?: Maybe<LifeEventPage>
  getLifeEvents: Array<LifeEventPage>
  getLifeEventsInCategory: Array<LifeEventPage>
  getArticleCategories: Array<ArticleCategory>
  getSingleArticle?: Maybe<Article>
  getArticles: Array<Article>
  getSingleNews?: Maybe<News>
  getUrl?: Maybe<Url>
  searchResults: SearchResult
  singleItem?: Maybe<ContentItem>
  webSearchAutocomplete: WebSearchAutocomplete
  getApplication?: Maybe<Application>
  getApplicationsByType?: Maybe<Array<Application>>
  getDocument?: Maybe<DocumentDetails>
  listDocuments?: Maybe<Array<Document>>
  getDocumentCategories?: Maybe<Array<DocumentCategory>>
  getTranslations?: Maybe<Scalars['JSON']>
}

export type QueryHelloWorldArgs = {
  input: HelloWorldInput
}

export type QueryGetNewsListArgs = {
  input: GetNewsListInput
}

export type QueryGetAdgerdirNewsListArgs = {
  input: GetAdgerdirNewsListInput
}

export type QueryGetNamespaceArgs = {
  input: GetNamespaceInput
}

export type QueryGetAboutPageArgs = {
  input: GetAboutPageInput
}

export type QueryGetAboutSubPageArgs = {
  input: GetAboutSubPageInput
}

export type QueryGetLandingPageArgs = {
  input: GetLandingPageInput
}

export type QueryGetAlertBannerArgs = {
  input: GetAlertBannerInput
}

export type QueryGetGenericPageArgs = {
  input: GetGenericPageInput
}

export type QueryGetAdgerdirPageArgs = {
  input: GetAdgerdirPageInput
}

export type QueryGetOrganizationArgs = {
  input: GetOrganizationInput
}

export type QueryGetAdgerdirNewsArgs = {
  input: GetAdgerdirNewsInput
}

export type QueryGetAdgerdirPagesArgs = {
  input: GetAdgerdirPagesInput
}

export type QueryGetOrganizationsArgs = {
  input: GetOrganizationsInput
}

export type QueryGetAdgerdirTagsArgs = {
  input: GetAdgerdirTagsInput
}

export type QueryGetOrganizationTagsArgs = {
  input: GetOrganizationTagsInput
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

export type QueryGetLifeEventsArgs = {
  input: GetLifeEventsInput
}

export type QueryGetLifeEventsInCategoryArgs = {
  input: GetLifeEventsInCategoryInput
}

export type QueryGetArticleCategoriesArgs = {
  input: GetArticleCategoriesInput
}

export type QueryGetSingleArticleArgs = {
  input: GetSingleArticleInput
}

export type QueryGetArticlesArgs = {
  input: GetArticlesInput
}

export type QueryGetSingleNewsArgs = {
  input: GetSingleNewsInput
}

export type QueryGetUrlArgs = {
  input: GetUrlInput
}

export type QuerySearchResultsArgs = {
  query: SearcherInput
}

export type QuerySingleItemArgs = {
  input: ItemInput
}

export type QueryWebSearchAutocompleteArgs = {
  input: WebSearchAutocompleteInput
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

export type QueryListDocumentsArgs = {
  input: ListDocumentsInput
}

export type QueryGetTranslationsArgs = {
  input: GetTranslationsInput
}

export type HelloWorldInput = {
  name?: Maybe<Scalars['String']>
}

export type GetNewsListInput = {
  lang?: Maybe<Scalars['String']>
  year?: Maybe<Scalars['Int']>
  month?: Maybe<Scalars['Int']>
  ascending?: Maybe<Scalars['Boolean']>
  page?: Maybe<Scalars['Int']>
  perPage?: Maybe<Scalars['Int']>
}

export type GetAdgerdirNewsListInput = {
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

export type GetAboutSubPageInput = {
  slug: Scalars['String']
  lang: Scalars['String']
}

export type GetLandingPageInput = {
  slug: Scalars['String']
  lang: Scalars['String']
}

export type GetAlertBannerInput = {
  id: Scalars['String']
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

export type GetOrganizationInput = {
  slug?: Maybe<Scalars['String']>
  lang: Scalars['String']
}

export type GetAdgerdirNewsInput = {
  slug?: Maybe<Scalars['String']>
  lang: Scalars['String']
}

export type GetAdgerdirPagesInput = {
  lang?: Maybe<Scalars['String']>
  perPage?: Maybe<Scalars['Int']>
}

export type GetOrganizationsInput = {
  lang?: Maybe<Scalars['String']>
  perPage?: Maybe<Scalars['Int']>
}

export type GetAdgerdirTagsInput = {
  lang?: Maybe<Scalars['String']>
}

export type GetOrganizationTagsInput = {
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

export type GetLifeEventsInput = {
  lang: Scalars['String']
}

export type GetLifeEventsInCategoryInput = {
  slug: Scalars['String']
  lang: Scalars['String']
}

export type GetArticleCategoriesInput = {
  lang: Scalars['String']
  size?: Maybe<Scalars['Int']>
}

export type GetSingleArticleInput = {
  slug: Scalars['String']
  lang: Scalars['String']
}

export type GetArticlesInput = {
  lang: Scalars['String']
  category: Scalars['String']
  size?: Maybe<Scalars['Int']>
}

export type GetSingleNewsInput = {
  slug: Scalars['String']
  lang?: Maybe<Scalars['String']>
}

export type GetUrlInput = {
  slug: Scalars['String']
  lang: Scalars['String']
}

export type SearcherInput = {
  queryString: Scalars['String']
  types?: Maybe<Array<SearchableContentTypes>>
  language?: Maybe<ContentLanguage>
  size?: Maybe<Scalars['Int']>
  page?: Maybe<Scalars['Int']>
}

export enum SearchableContentTypes {
  webAboutPage = 'webAboutPage',
  webArticle = 'webArticle',
  webLifeEventPage = 'webLifeEventPage',
  webNews = 'webNews',
}

export enum ContentLanguage {
  is = 'is',
  en = 'en',
}

export type ItemInput = {
  id?: Maybe<Scalars['ID']>
  slug?: Maybe<Scalars['String']>
  type?: Maybe<ItemType>
  language?: Maybe<ContentLanguage>
}

export enum ItemType {
  article = 'article',
  category = 'category',
}

export type WebSearchAutocompleteInput = {
  singleTerm: Scalars['String']
  language?: Maybe<ContentLanguage>
  size?: Maybe<Scalars['Int']>
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

export type ListDocumentsInput = {
  natReg: Scalars['String']
  dateFrom: Scalars['DateTime']
  dateTo: Scalars['DateTime']
  category: Scalars['String']
  page: Scalars['Float']
  pageSize: Scalars['Float']
}

export type GetTranslationsInput = {
  namespaces?: Maybe<Array<Scalars['String']>>
  lang: Scalars['String']
}

export type Mutation = {
  __typename?: 'Mutation'
  createApplication?: Maybe<Application>
  updateApplication?: Maybe<Application>
  updateApplicationExternalData?: Maybe<Application>
  addAttachment?: Maybe<Application>
  deleteAttachment?: Maybe<Application>
  submitApplication?: Maybe<Application>
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

export type MutationSubmitApplicationArgs = {
  input: SubmitApplicationInput
}

export type MutationCreateUploadUrlArgs = {
  filename: Scalars['String']
}

export type CreateApplicationInput = {
  applicant: Scalars['String']
  assignee: Scalars['String']
  externalId?: Maybe<Scalars['String']>
  state: Scalars['String']
  attachments?: Maybe<Scalars['JSON']>
  typeId: CreateApplicationDtoTypeIdEnum
  answers: Scalars['JSON']
}

export enum CreateApplicationDtoTypeIdEnum {
  ExampleForm = 'ExampleForm',
  DrivingLessons = 'DrivingLessons',
  ParentalLeave = 'ParentalLeave',
}

export type UpdateApplicationInput = {
  id: Scalars['String']
  applicant?: Maybe<Scalars['String']>
  assignee?: Maybe<Scalars['String']>
  externalId?: Maybe<Scalars['String']>
  attachments?: Maybe<Scalars['JSON']>
  answers?: Maybe<Scalars['JSON']>
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

export type SubmitApplicationInput = {
  id: Scalars['String']
  event: Scalars['String']
  answers?: Maybe<Scalars['JSON']>
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
  Image: ResolverTypeWrapper<Image>
  ID: ResolverTypeWrapper<Scalars['ID']>
  Int: ResolverTypeWrapper<Scalars['Int']>
  Html: ResolverTypeWrapper<Html>
  JSON: ResolverTypeWrapper<Scalars['JSON']>
  TimelineEvent: ResolverTypeWrapper<TimelineEvent>
  TimelineSlice: ResolverTypeWrapper<TimelineSlice>
  Story: ResolverTypeWrapper<Story>
  LinkCard: ResolverTypeWrapper<LinkCard>
  News: ResolverTypeWrapper<News>
  NumberBullet: ResolverTypeWrapper<NumberBullet>
  Statistic: ResolverTypeWrapper<Statistic>
  QuestionAndAnswer: ResolverTypeWrapper<QuestionAndAnswer>
  TabContent: ResolverTypeWrapper<TabContent>
  ArticleCategory: ResolverTypeWrapper<ArticleCategory>
  ArticleGroup: ResolverTypeWrapper<ArticleGroup>
  ArticleSubgroup: ResolverTypeWrapper<ArticleSubgroup>
  Float: ResolverTypeWrapper<Scalars['Float']>
  OrganizationTag: ResolverTypeWrapper<OrganizationTag>
  Organization: ResolverTypeWrapper<Organization>
  SubArticle: ResolverTypeWrapper<
    Omit<SubArticle, 'body'> & { body: Array<ResolversTypes['Slice']> }
  >
  Slice:
    | ResolversTypes['TimelineSlice']
    | ResolversTypes['MailingListSignupSlice']
    | ResolversTypes['HeadingSlice']
    | ResolversTypes['LinkCardSlice']
    | ResolversTypes['StorySlice']
    | ResolversTypes['LogoListSlice']
    | ResolversTypes['LatestNewsSlice']
    | ResolversTypes['BulletListSlice']
    | ResolversTypes['Statistics']
    | ResolversTypes['ProcessEntry']
    | ResolversTypes['FaqList']
    | ResolversTypes['EmbeddedVideo']
    | ResolversTypes['SectionWithImage']
    | ResolversTypes['TabSection']
    | ResolversTypes['Html']
    | ResolversTypes['Image']
  MailingListSignupSlice: ResolverTypeWrapper<MailingListSignupSlice>
  HeadingSlice: ResolverTypeWrapper<HeadingSlice>
  LinkCardSlice: ResolverTypeWrapper<LinkCardSlice>
  StorySlice: ResolverTypeWrapper<StorySlice>
  LogoListSlice: ResolverTypeWrapper<LogoListSlice>
  LatestNewsSlice: ResolverTypeWrapper<LatestNewsSlice>
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
  Statistics: ResolverTypeWrapper<Statistics>
  ProcessEntry: ResolverTypeWrapper<ProcessEntry>
  FaqList: ResolverTypeWrapper<FaqList>
  EmbeddedVideo: ResolverTypeWrapper<EmbeddedVideo>
  SectionWithImage: ResolverTypeWrapper<SectionWithImage>
  TabSection: ResolverTypeWrapper<TabSection>
  Article: ResolverTypeWrapper<
    Omit<Article, 'body'> & { body: Array<ResolversTypes['Slice']> }
  >
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>
  AdgerdirTag: ResolverTypeWrapper<AdgerdirTag>
  AdgerdirPage: ResolverTypeWrapper<AdgerdirPage>
  Organizations: ResolverTypeWrapper<Organizations>
  AdgerdirNews: ResolverTypeWrapper<AdgerdirNews>
  AdgerdirPages: ResolverTypeWrapper<AdgerdirPages>
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
  FrontpageSlider: ResolverTypeWrapper<FrontpageSlider>
  FrontpageSliderList: ResolverTypeWrapper<FrontpageSliderList>
  Pagination: ResolverTypeWrapper<Pagination>
  PaginatedNews: ResolverTypeWrapper<PaginatedNews>
  Namespace: ResolverTypeWrapper<Namespace>
  Link: ResolverTypeWrapper<Link>
  PageHeader: ResolverTypeWrapper<PageHeader>
  AboutPage: ResolverTypeWrapper<
    Omit<AboutPage, 'slices'> & { slices: Array<ResolversTypes['Slice']> }
  >
  LinkList: ResolverTypeWrapper<LinkList>
  LandingPage: ResolverTypeWrapper<
    Omit<LandingPage, 'content'> & { content: Array<ResolversTypes['Slice']> }
  >
  AlertBanner: ResolverTypeWrapper<AlertBanner>
  GenericPage: ResolverTypeWrapper<GenericPage>
  Menu: ResolverTypeWrapper<Menu>
  AdgerdirTags: ResolverTypeWrapper<AdgerdirTags>
  LifeEventPage: ResolverTypeWrapper<
    Omit<LifeEventPage, 'content'> & { content: Array<ResolversTypes['Slice']> }
  >
  PaginatedAdgerdirNews: ResolverTypeWrapper<PaginatedAdgerdirNews>
  OrganizationTags: ResolverTypeWrapper<OrganizationTags>
  Url: ResolverTypeWrapper<
    Omit<Url, 'page'> & { page: ResolversTypes['UrlPage'] }
  >
  UrlPage:
    | ResolversTypes['Article']
    | ResolversTypes['ArticleCategory']
    | ResolversTypes['News']
    | ResolversTypes['LifeEventPage']
  AboutSubPage: ResolverTypeWrapper<
    Omit<AboutSubPage, 'slices'> & { slices: Array<ResolversTypes['Slice']> }
  >
  SearchResult: ResolverTypeWrapper<
    Omit<SearchResult, 'items'> & { items: Array<ResolversTypes['Items']> }
  >
  Items:
    | ResolversTypes['Article']
    | ResolversTypes['LifeEventPage']
    | ResolversTypes['News']
    | ResolversTypes['AboutPage']
  ContentItem: ResolverTypeWrapper<ContentItem>
  WebSearchAutocomplete: ResolverTypeWrapper<WebSearchAutocomplete>
  Application: ResolverTypeWrapper<Application>
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>
  ApplicationTypeIdEnum: ApplicationTypeIdEnum
  PresignedPost: ResolverTypeWrapper<PresignedPost>
  Document: ResolverTypeWrapper<Document>
  DocumentDetails: ResolverTypeWrapper<DocumentDetails>
  DocumentCategory: ResolverTypeWrapper<DocumentCategory>
  Query: ResolverTypeWrapper<{}>
  HelloWorldInput: HelloWorldInput
  GetNewsListInput: GetNewsListInput
  GetAdgerdirNewsListInput: GetAdgerdirNewsListInput
  GetNamespaceInput: GetNamespaceInput
  GetAboutPageInput: GetAboutPageInput
  GetAboutSubPageInput: GetAboutSubPageInput
  GetLandingPageInput: GetLandingPageInput
  GetAlertBannerInput: GetAlertBannerInput
  GetGenericPageInput: GetGenericPageInput
  GetAdgerdirPageInput: GetAdgerdirPageInput
  GetOrganizationInput: GetOrganizationInput
  GetAdgerdirNewsInput: GetAdgerdirNewsInput
  GetAdgerdirPagesInput: GetAdgerdirPagesInput
  GetOrganizationsInput: GetOrganizationsInput
  GetAdgerdirTagsInput: GetAdgerdirTagsInput
  GetOrganizationTagsInput: GetOrganizationTagsInput
  GetFrontpageSliderListInput: GetFrontpageSliderListInput
  GetAdgerdirFrontpageInput: GetAdgerdirFrontpageInput
  GetMenuInput: GetMenuInput
  GetLifeEventPageInput: GetLifeEventPageInput
  GetLifeEventsInput: GetLifeEventsInput
  GetLifeEventsInCategoryInput: GetLifeEventsInCategoryInput
  GetArticleCategoriesInput: GetArticleCategoriesInput
  GetSingleArticleInput: GetSingleArticleInput
  GetArticlesInput: GetArticlesInput
  GetSingleNewsInput: GetSingleNewsInput
  GetUrlInput: GetUrlInput
  SearcherInput: SearcherInput
  SearchableContentTypes: SearchableContentTypes
  ContentLanguage: ContentLanguage
  ItemInput: ItemInput
  ItemType: ItemType
  WebSearchAutocompleteInput: WebSearchAutocompleteInput
  GetApplicationInput: GetApplicationInput
  GetApplicationsByTypeInput: GetApplicationsByTypeInput
  GetDocumentInput: GetDocumentInput
  ListDocumentsInput: ListDocumentsInput
  GetTranslationsInput: GetTranslationsInput
  Mutation: ResolverTypeWrapper<{}>
  CreateApplicationInput: CreateApplicationInput
  CreateApplicationDtoTypeIdEnum: CreateApplicationDtoTypeIdEnum
  UpdateApplicationInput: UpdateApplicationInput
  UpdateApplicationExternalDataInput: UpdateApplicationExternalDataInput
  DataProvider: DataProvider
  DataProviderDtoTypeEnum: DataProviderDtoTypeEnum
  AddAttachmentInput: AddAttachmentInput
  DeleteAttachmentInput: DeleteAttachmentInput
  SubmitApplicationInput: SubmitApplicationInput
}

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  HelloWorld: HelloWorld
  String: Scalars['String']
  Image: Image
  ID: Scalars['ID']
  Int: Scalars['Int']
  Html: Html
  JSON: Scalars['JSON']
  TimelineEvent: TimelineEvent
  TimelineSlice: TimelineSlice
  Story: Story
  LinkCard: LinkCard
  News: News
  NumberBullet: NumberBullet
  Statistic: Statistic
  QuestionAndAnswer: QuestionAndAnswer
  TabContent: TabContent
  ArticleCategory: ArticleCategory
  ArticleGroup: ArticleGroup
  ArticleSubgroup: ArticleSubgroup
  Float: Scalars['Float']
  OrganizationTag: OrganizationTag
  Organization: Organization
  SubArticle: Omit<SubArticle, 'body'> & {
    body: Array<ResolversParentTypes['Slice']>
  }
  Slice:
    | ResolversParentTypes['TimelineSlice']
    | ResolversParentTypes['MailingListSignupSlice']
    | ResolversParentTypes['HeadingSlice']
    | ResolversParentTypes['LinkCardSlice']
    | ResolversParentTypes['StorySlice']
    | ResolversParentTypes['LogoListSlice']
    | ResolversParentTypes['LatestNewsSlice']
    | ResolversParentTypes['BulletListSlice']
    | ResolversParentTypes['Statistics']
    | ResolversParentTypes['ProcessEntry']
    | ResolversParentTypes['FaqList']
    | ResolversParentTypes['EmbeddedVideo']
    | ResolversParentTypes['SectionWithImage']
    | ResolversParentTypes['TabSection']
    | ResolversParentTypes['Html']
    | ResolversParentTypes['Image']
  MailingListSignupSlice: MailingListSignupSlice
  HeadingSlice: HeadingSlice
  LinkCardSlice: LinkCardSlice
  StorySlice: StorySlice
  LogoListSlice: LogoListSlice
  LatestNewsSlice: LatestNewsSlice
  BulletListSlice: Omit<BulletListSlice, 'bullets'> & {
    bullets: Array<ResolversParentTypes['BulletEntry']>
  }
  BulletEntry:
    | ResolversParentTypes['IconBullet']
    | ResolversParentTypes['NumberBulletGroup']
  IconBullet: IconBullet
  NumberBulletGroup: NumberBulletGroup
  Statistics: Statistics
  ProcessEntry: ProcessEntry
  FaqList: FaqList
  EmbeddedVideo: EmbeddedVideo
  SectionWithImage: SectionWithImage
  TabSection: TabSection
  Article: Omit<Article, 'body'> & {
    body: Array<ResolversParentTypes['Slice']>
  }
  Boolean: Scalars['Boolean']
  AdgerdirTag: AdgerdirTag
  AdgerdirPage: AdgerdirPage
  Organizations: Organizations
  AdgerdirNews: AdgerdirNews
  AdgerdirPages: AdgerdirPages
  AdgerdirFrontpage: Omit<AdgerdirFrontpage, 'slices'> & {
    slices: Array<ResolversParentTypes['AdgerdirSlice']>
  }
  AdgerdirSlice:
    | ResolversParentTypes['AdgerdirGroupSlice']
    | ResolversParentTypes['AdgerdirFeaturedNewsSlice']
  AdgerdirGroupSlice: AdgerdirGroupSlice
  AdgerdirFeaturedNewsSlice: AdgerdirFeaturedNewsSlice
  FrontpageSlider: FrontpageSlider
  FrontpageSliderList: FrontpageSliderList
  Pagination: Pagination
  PaginatedNews: PaginatedNews
  Namespace: Namespace
  Link: Link
  PageHeader: PageHeader
  AboutPage: Omit<AboutPage, 'slices'> & {
    slices: Array<ResolversParentTypes['Slice']>
  }
  LinkList: LinkList
  LandingPage: Omit<LandingPage, 'content'> & {
    content: Array<ResolversParentTypes['Slice']>
  }
  AlertBanner: AlertBanner
  GenericPage: GenericPage
  Menu: Menu
  AdgerdirTags: AdgerdirTags
  LifeEventPage: Omit<LifeEventPage, 'content'> & {
    content: Array<ResolversParentTypes['Slice']>
  }
  PaginatedAdgerdirNews: PaginatedAdgerdirNews
  OrganizationTags: OrganizationTags
  Url: Omit<Url, 'page'> & { page: ResolversParentTypes['UrlPage'] }
  UrlPage:
    | ResolversParentTypes['Article']
    | ResolversParentTypes['ArticleCategory']
    | ResolversParentTypes['News']
    | ResolversParentTypes['LifeEventPage']
  AboutSubPage: Omit<AboutSubPage, 'slices'> & {
    slices: Array<ResolversParentTypes['Slice']>
  }
  SearchResult: Omit<SearchResult, 'items'> & {
    items: Array<ResolversParentTypes['Items']>
  }
  Items:
    | ResolversParentTypes['Article']
    | ResolversParentTypes['LifeEventPage']
    | ResolversParentTypes['News']
    | ResolversParentTypes['AboutPage']
  ContentItem: ContentItem
  WebSearchAutocomplete: WebSearchAutocomplete
  Application: Application
  DateTime: Scalars['DateTime']
  PresignedPost: PresignedPost
  Document: Document
  DocumentDetails: DocumentDetails
  DocumentCategory: DocumentCategory
  Query: {}
  HelloWorldInput: HelloWorldInput
  GetNewsListInput: GetNewsListInput
  GetAdgerdirNewsListInput: GetAdgerdirNewsListInput
  GetNamespaceInput: GetNamespaceInput
  GetAboutPageInput: GetAboutPageInput
  GetAboutSubPageInput: GetAboutSubPageInput
  GetLandingPageInput: GetLandingPageInput
  GetAlertBannerInput: GetAlertBannerInput
  GetGenericPageInput: GetGenericPageInput
  GetAdgerdirPageInput: GetAdgerdirPageInput
  GetOrganizationInput: GetOrganizationInput
  GetAdgerdirNewsInput: GetAdgerdirNewsInput
  GetAdgerdirPagesInput: GetAdgerdirPagesInput
  GetOrganizationsInput: GetOrganizationsInput
  GetAdgerdirTagsInput: GetAdgerdirTagsInput
  GetOrganizationTagsInput: GetOrganizationTagsInput
  GetFrontpageSliderListInput: GetFrontpageSliderListInput
  GetAdgerdirFrontpageInput: GetAdgerdirFrontpageInput
  GetMenuInput: GetMenuInput
  GetLifeEventPageInput: GetLifeEventPageInput
  GetLifeEventsInput: GetLifeEventsInput
  GetLifeEventsInCategoryInput: GetLifeEventsInCategoryInput
  GetArticleCategoriesInput: GetArticleCategoriesInput
  GetSingleArticleInput: GetSingleArticleInput
  GetArticlesInput: GetArticlesInput
  GetSingleNewsInput: GetSingleNewsInput
  GetUrlInput: GetUrlInput
  SearcherInput: SearcherInput
  ItemInput: ItemInput
  WebSearchAutocompleteInput: WebSearchAutocompleteInput
  GetApplicationInput: GetApplicationInput
  GetApplicationsByTypeInput: GetApplicationsByTypeInput
  GetDocumentInput: GetDocumentInput
  ListDocumentsInput: ListDocumentsInput
  GetTranslationsInput: GetTranslationsInput
  Mutation: {}
  CreateApplicationInput: CreateApplicationInput
  UpdateApplicationInput: UpdateApplicationInput
  UpdateApplicationExternalDataInput: UpdateApplicationExternalDataInput
  DataProvider: DataProvider
  AddAttachmentInput: AddAttachmentInput
  DeleteAttachmentInput: DeleteAttachmentInput
  SubmitApplicationInput: SubmitApplicationInput
}

export type HelloWorldResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['HelloWorld'] = ResolversParentTypes['HelloWorld']
> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type ImageResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Image'] = ResolversParentTypes['Image']
> = {
  typename?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  contentType?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  width?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  height?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type HtmlResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Html'] = ResolversParentTypes['Html']
> = {
  typename?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  document?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export interface JsonScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON'
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
  body?: Resolver<Maybe<ResolversTypes['Html']>, ParentType, ContextType>
  tags?: Resolver<
    Maybe<Array<ResolversTypes['String']>>,
    ParentType,
    ContextType
  >
  link?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type TimelineSliceResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['TimelineSlice'] = ResolversParentTypes['TimelineSlice']
> = {
  typename?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  events?: Resolver<
    Array<ResolversTypes['TimelineEvent']>,
    ParentType,
    ContextType
  >
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

export type NewsResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['News'] = ResolversParentTypes['News']
> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  subtitle?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  intro?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  image?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType>
  date?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  content?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
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

export type StatisticResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Statistic'] = ResolversParentTypes['Statistic']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type QuestionAndAnswerResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['QuestionAndAnswer'] = ResolversParentTypes['QuestionAndAnswer']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  question?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  answer?: Resolver<Maybe<ResolversTypes['Html']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type TabContentResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['TabContent'] = ResolversParentTypes['TabContent']
> = {
  tabTitle?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  contentTitle?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  image?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType>
  body?: Resolver<Maybe<ResolversTypes['Html']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type ArticleCategoryResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['ArticleCategory'] = ResolversParentTypes['ArticleCategory']
> = {
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  description?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type ArticleGroupResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['ArticleGroup'] = ResolversParentTypes['ArticleGroup']
> = {
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  description?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type ArticleSubgroupResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['ArticleSubgroup'] = ResolversParentTypes['ArticleSubgroup']
> = {
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  importance?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type OrganizationTagResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['OrganizationTag'] = ResolversParentTypes['OrganizationTag']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type OrganizationResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Organization'] = ResolversParentTypes['Organization']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  description?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  tag?: Resolver<
    Maybe<Array<ResolversTypes['OrganizationTag']>>,
    ParentType,
    ContextType
  >
  link?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type SubArticleResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['SubArticle'] = ResolversParentTypes['SubArticle']
> = {
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  body?: Resolver<Array<ResolversTypes['Slice']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type SliceResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Slice'] = ResolversParentTypes['Slice']
> = {
  __resolveType: TypeResolveFn<
    | 'TimelineSlice'
    | 'MailingListSignupSlice'
    | 'HeadingSlice'
    | 'LinkCardSlice'
    | 'StorySlice'
    | 'LogoListSlice'
    | 'LatestNewsSlice'
    | 'BulletListSlice'
    | 'Statistics'
    | 'ProcessEntry'
    | 'FaqList'
    | 'EmbeddedVideo'
    | 'SectionWithImage'
    | 'TabSection'
    | 'Html'
    | 'Image',
    ParentType,
    ContextType
  >
}

export type MailingListSignupSliceResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['MailingListSignupSlice'] = ResolversParentTypes['MailingListSignupSlice']
> = {
  typename?: Resolver<ResolversTypes['String'], ParentType, ContextType>
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

export type HeadingSliceResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['HeadingSlice'] = ResolversParentTypes['HeadingSlice']
> = {
  typename?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  body?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type LinkCardSliceResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['LinkCardSlice'] = ResolversParentTypes['LinkCardSlice']
> = {
  typename?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  cards?: Resolver<Array<ResolversTypes['LinkCard']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type StorySliceResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['StorySlice'] = ResolversParentTypes['StorySlice']
> = {
  typename?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  readMoreText?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  stories?: Resolver<Array<ResolversTypes['Story']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type LogoListSliceResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['LogoListSlice'] = ResolversParentTypes['LogoListSlice']
> = {
  typename?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  body?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  images?: Resolver<Array<ResolversTypes['Image']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type LatestNewsSliceResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['LatestNewsSlice'] = ResolversParentTypes['LatestNewsSlice']
> = {
  typename?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  news?: Resolver<Array<ResolversTypes['News']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type BulletListSliceResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['BulletListSlice'] = ResolversParentTypes['BulletListSlice']
> = {
  typename?: Resolver<ResolversTypes['String'], ParentType, ContextType>
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

export type StatisticsResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Statistics'] = ResolversParentTypes['Statistics']
> = {
  typename?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  statistics?: Resolver<
    Array<ResolversTypes['Statistic']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type ProcessEntryResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['ProcessEntry'] = ResolversParentTypes['ProcessEntry']
> = {
  typename?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  processTitle?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  processLink?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  buttonText?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type FaqListResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['FaqList'] = ResolversParentTypes['FaqList']
> = {
  typename?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  questions?: Resolver<
    Array<ResolversTypes['QuestionAndAnswer']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type EmbeddedVideoResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['EmbeddedVideo'] = ResolversParentTypes['EmbeddedVideo']
> = {
  typename?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type SectionWithImageResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['SectionWithImage'] = ResolversParentTypes['SectionWithImage']
> = {
  typename?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  image?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType>
  html?: Resolver<ResolversTypes['Html'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type TabSectionResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['TabSection'] = ResolversParentTypes['TabSection']
> = {
  typename?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  tabs?: Resolver<Array<ResolversTypes['TabContent']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type ArticleResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Article'] = ResolversParentTypes['Article']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  shortTitle?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  intro?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  containsApplicationForm?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >
  importance?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>
  body?: Resolver<Array<ResolversTypes['Slice']>, ParentType, ContextType>
  category?: Resolver<
    Maybe<ResolversTypes['ArticleCategory']>,
    ParentType,
    ContextType
  >
  group?: Resolver<
    Maybe<ResolversTypes['ArticleGroup']>,
    ParentType,
    ContextType
  >
  subgroup?: Resolver<
    Maybe<ResolversTypes['ArticleSubgroup']>,
    ParentType,
    ContextType
  >
  organization?: Resolver<
    Maybe<Array<ResolversTypes['Organization']>>,
    ParentType,
    ContextType
  >
  subArticles?: Resolver<
    Array<ResolversTypes['SubArticle']>,
    ParentType,
    ContextType
  >
  relatedArticles?: Resolver<
    Maybe<Array<ResolversTypes['Article']>>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type AdgerdirTagResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['AdgerdirTag'] = ResolversParentTypes['AdgerdirTag']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type AdgerdirPageResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['AdgerdirPage'] = ResolversParentTypes['AdgerdirPage']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
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

export type OrganizationsResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Organizations'] = ResolversParentTypes['Organizations']
> = {
  items?: Resolver<
    Array<ResolversTypes['Organization']>,
    ParentType,
    ContextType
  >
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
  pages?: Resolver<
    Maybe<Array<ResolversTypes['AdgerdirPage']>>,
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

export type AdgerdirFrontpageResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['AdgerdirFrontpage'] = ResolversParentTypes['AdgerdirFrontpage']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  description?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
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

export type FrontpageSliderResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['FrontpageSlider'] = ResolversParentTypes['FrontpageSlider']
> = {
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  subtitle?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  link?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  animationJson?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type FrontpageSliderListResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['FrontpageSliderList'] = ResolversParentTypes['FrontpageSliderList']
> = {
  items?: Resolver<
    Array<ResolversTypes['FrontpageSlider']>,
    ParentType,
    ContextType
  >
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
  namespace?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  fields?: Resolver<ResolversTypes['String'], ParentType, ContextType>
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

export type PageHeaderResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['PageHeader'] = ResolversParentTypes['PageHeader']
> = {
  typename?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  introduction?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  navigationText?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  links?: Resolver<Array<ResolversTypes['Link']>, ParentType, ContextType>
  slices?: Resolver<
    Array<ResolversTypes['TimelineSlice']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type AboutPageResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['AboutPage'] = ResolversParentTypes['AboutPage']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  seoDescription?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  theme?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  pageHeader?: Resolver<ResolversTypes['PageHeader'], ParentType, ContextType>
  slices?: Resolver<Array<ResolversTypes['Slice']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type LinkListResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['LinkList'] = ResolversParentTypes['LinkList']
> = {
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
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
  content?: Resolver<Array<ResolversTypes['Slice']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type AlertBannerResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['AlertBanner'] = ResolversParentTypes['AlertBanner']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  showAlertBanner?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  bannerVariant?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  description?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  link?: Resolver<Maybe<ResolversTypes['Link']>, ParentType, ContextType>
  isDismissable?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  dismissedForDays?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
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
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  intro?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  image?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType>
  thumbnail?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType>
  content?: Resolver<Array<ResolversTypes['Slice']>, ParentType, ContextType>
  category?: Resolver<
    Maybe<ResolversTypes['ArticleCategory']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type PaginatedAdgerdirNewsResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['PaginatedAdgerdirNews'] = ResolversParentTypes['PaginatedAdgerdirNews']
> = {
  page?: Resolver<ResolversTypes['Pagination'], ParentType, ContextType>
  news?: Resolver<
    Array<ResolversTypes['AdgerdirNews']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type OrganizationTagsResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['OrganizationTags'] = ResolversParentTypes['OrganizationTags']
> = {
  items?: Resolver<
    Array<ResolversTypes['OrganizationTag']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type UrlResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Url'] = ResolversParentTypes['Url']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  page?: Resolver<ResolversTypes['UrlPage'], ParentType, ContextType>
  urlsList?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type UrlPageResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['UrlPage'] = ResolversParentTypes['UrlPage']
> = {
  __resolveType: TypeResolveFn<
    'Article' | 'ArticleCategory' | 'News' | 'LifeEventPage',
    ParentType,
    ContextType
  >
}

export type AboutSubPageResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['AboutSubPage'] = ResolversParentTypes['AboutSubPage']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  subDescription?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  slices?: Resolver<Array<ResolversTypes['Slice']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type SearchResultResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['SearchResult'] = ResolversParentTypes['SearchResult']
> = {
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  items?: Resolver<Array<ResolversTypes['Items']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type ItemsResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Items'] = ResolversParentTypes['Items']
> = {
  __resolveType: TypeResolveFn<
    'Article' | 'LifeEventPage' | 'News' | 'AboutPage',
    ParentType,
    ContextType
  >
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
  containsApplicationForm?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >
  importance?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>
  group?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  subgroup?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
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

export type WebSearchAutocompleteResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['WebSearchAutocomplete'] = ResolversParentTypes['WebSearchAutocomplete']
> = {
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  completions?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
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
  state?: Resolver<ResolversTypes['String'], ParentType, ContextType>
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

export type DocumentDetailsResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['DocumentDetails'] = ResolversParentTypes['DocumentDetails']
> = {
  fileType?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  html?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type DocumentCategoryResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['DocumentCategory'] = ResolversParentTypes['DocumentCategory']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
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
  getNewsList?: Resolver<
    ResolversTypes['PaginatedNews'],
    ParentType,
    ContextType,
    RequireFields<QueryGetNewsListArgs, 'input'>
  >
  getAdgerdirNewsList?: Resolver<
    ResolversTypes['PaginatedAdgerdirNews'],
    ParentType,
    ContextType,
    RequireFields<QueryGetAdgerdirNewsListArgs, 'input'>
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
  getAboutSubPage?: Resolver<
    Maybe<ResolversTypes['AboutSubPage']>,
    ParentType,
    ContextType,
    RequireFields<QueryGetAboutSubPageArgs, 'input'>
  >
  getLandingPage?: Resolver<
    Maybe<ResolversTypes['LandingPage']>,
    ParentType,
    ContextType,
    RequireFields<QueryGetLandingPageArgs, 'input'>
  >
  getAlertBanner?: Resolver<
    Maybe<ResolversTypes['AlertBanner']>,
    ParentType,
    ContextType,
    RequireFields<QueryGetAlertBannerArgs, 'input'>
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
  getOrganization?: Resolver<
    Maybe<ResolversTypes['Organization']>,
    ParentType,
    ContextType,
    RequireFields<QueryGetOrganizationArgs, 'input'>
  >
  getAdgerdirNews?: Resolver<
    Maybe<ResolversTypes['AdgerdirNews']>,
    ParentType,
    ContextType,
    RequireFields<QueryGetAdgerdirNewsArgs, 'input'>
  >
  getAdgerdirPages?: Resolver<
    ResolversTypes['AdgerdirPages'],
    ParentType,
    ContextType,
    RequireFields<QueryGetAdgerdirPagesArgs, 'input'>
  >
  getOrganizations?: Resolver<
    ResolversTypes['Organizations'],
    ParentType,
    ContextType,
    RequireFields<QueryGetOrganizationsArgs, 'input'>
  >
  getAdgerdirTags?: Resolver<
    Maybe<ResolversTypes['AdgerdirTags']>,
    ParentType,
    ContextType,
    RequireFields<QueryGetAdgerdirTagsArgs, 'input'>
  >
  getOrganizationTags?: Resolver<
    Maybe<ResolversTypes['OrganizationTags']>,
    ParentType,
    ContextType,
    RequireFields<QueryGetOrganizationTagsArgs, 'input'>
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
  getLifeEvents?: Resolver<
    Array<ResolversTypes['LifeEventPage']>,
    ParentType,
    ContextType,
    RequireFields<QueryGetLifeEventsArgs, 'input'>
  >
  getLifeEventsInCategory?: Resolver<
    Array<ResolversTypes['LifeEventPage']>,
    ParentType,
    ContextType,
    RequireFields<QueryGetLifeEventsInCategoryArgs, 'input'>
  >
  getArticleCategories?: Resolver<
    Array<ResolversTypes['ArticleCategory']>,
    ParentType,
    ContextType,
    RequireFields<QueryGetArticleCategoriesArgs, 'input'>
  >
  getSingleArticle?: Resolver<
    Maybe<ResolversTypes['Article']>,
    ParentType,
    ContextType,
    RequireFields<QueryGetSingleArticleArgs, 'input'>
  >
  getArticles?: Resolver<
    Array<ResolversTypes['Article']>,
    ParentType,
    ContextType,
    RequireFields<QueryGetArticlesArgs, 'input'>
  >
  getSingleNews?: Resolver<
    Maybe<ResolversTypes['News']>,
    ParentType,
    ContextType,
    RequireFields<QueryGetSingleNewsArgs, 'input'>
  >
  getUrl?: Resolver<
    Maybe<ResolversTypes['Url']>,
    ParentType,
    ContextType,
    RequireFields<QueryGetUrlArgs, 'input'>
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
  webSearchAutocomplete?: Resolver<
    ResolversTypes['WebSearchAutocomplete'],
    ParentType,
    ContextType,
    RequireFields<QueryWebSearchAutocompleteArgs, 'input'>
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
    Maybe<ResolversTypes['DocumentDetails']>,
    ParentType,
    ContextType,
    RequireFields<QueryGetDocumentArgs, 'input'>
  >
  listDocuments?: Resolver<
    Maybe<Array<ResolversTypes['Document']>>,
    ParentType,
    ContextType,
    RequireFields<QueryListDocumentsArgs, 'input'>
  >
  getDocumentCategories?: Resolver<
    Maybe<Array<ResolversTypes['DocumentCategory']>>,
    ParentType,
    ContextType
  >
  getTranslations?: Resolver<
    Maybe<ResolversTypes['JSON']>,
    ParentType,
    ContextType,
    RequireFields<QueryGetTranslationsArgs, 'input'>
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
  submitApplication?: Resolver<
    Maybe<ResolversTypes['Application']>,
    ParentType,
    ContextType,
    RequireFields<MutationSubmitApplicationArgs, 'input'>
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
  Image?: ImageResolvers<ContextType>
  Html?: HtmlResolvers<ContextType>
  JSON?: GraphQLScalarType
  TimelineEvent?: TimelineEventResolvers<ContextType>
  TimelineSlice?: TimelineSliceResolvers<ContextType>
  Story?: StoryResolvers<ContextType>
  LinkCard?: LinkCardResolvers<ContextType>
  News?: NewsResolvers<ContextType>
  NumberBullet?: NumberBulletResolvers<ContextType>
  Statistic?: StatisticResolvers<ContextType>
  QuestionAndAnswer?: QuestionAndAnswerResolvers<ContextType>
  TabContent?: TabContentResolvers<ContextType>
  ArticleCategory?: ArticleCategoryResolvers<ContextType>
  ArticleGroup?: ArticleGroupResolvers<ContextType>
  ArticleSubgroup?: ArticleSubgroupResolvers<ContextType>
  OrganizationTag?: OrganizationTagResolvers<ContextType>
  Organization?: OrganizationResolvers<ContextType>
  SubArticle?: SubArticleResolvers<ContextType>
  Slice?: SliceResolvers<ContextType>
  MailingListSignupSlice?: MailingListSignupSliceResolvers<ContextType>
  HeadingSlice?: HeadingSliceResolvers<ContextType>
  LinkCardSlice?: LinkCardSliceResolvers<ContextType>
  StorySlice?: StorySliceResolvers<ContextType>
  LogoListSlice?: LogoListSliceResolvers<ContextType>
  LatestNewsSlice?: LatestNewsSliceResolvers<ContextType>
  BulletListSlice?: BulletListSliceResolvers<ContextType>
  BulletEntry?: BulletEntryResolvers<ContextType>
  IconBullet?: IconBulletResolvers<ContextType>
  NumberBulletGroup?: NumberBulletGroupResolvers<ContextType>
  Statistics?: StatisticsResolvers<ContextType>
  ProcessEntry?: ProcessEntryResolvers<ContextType>
  FaqList?: FaqListResolvers<ContextType>
  EmbeddedVideo?: EmbeddedVideoResolvers<ContextType>
  SectionWithImage?: SectionWithImageResolvers<ContextType>
  TabSection?: TabSectionResolvers<ContextType>
  Article?: ArticleResolvers<ContextType>
  AdgerdirTag?: AdgerdirTagResolvers<ContextType>
  AdgerdirPage?: AdgerdirPageResolvers<ContextType>
  Organizations?: OrganizationsResolvers<ContextType>
  AdgerdirNews?: AdgerdirNewsResolvers<ContextType>
  AdgerdirPages?: AdgerdirPagesResolvers<ContextType>
  AdgerdirFrontpage?: AdgerdirFrontpageResolvers<ContextType>
  AdgerdirSlice?: AdgerdirSliceResolvers<ContextType>
  AdgerdirGroupSlice?: AdgerdirGroupSliceResolvers<ContextType>
  AdgerdirFeaturedNewsSlice?: AdgerdirFeaturedNewsSliceResolvers<ContextType>
  FrontpageSlider?: FrontpageSliderResolvers<ContextType>
  FrontpageSliderList?: FrontpageSliderListResolvers<ContextType>
  Pagination?: PaginationResolvers<ContextType>
  PaginatedNews?: PaginatedNewsResolvers<ContextType>
  Namespace?: NamespaceResolvers<ContextType>
  Link?: LinkResolvers<ContextType>
  PageHeader?: PageHeaderResolvers<ContextType>
  AboutPage?: AboutPageResolvers<ContextType>
  LinkList?: LinkListResolvers<ContextType>
  LandingPage?: LandingPageResolvers<ContextType>
  AlertBanner?: AlertBannerResolvers<ContextType>
  GenericPage?: GenericPageResolvers<ContextType>
  Menu?: MenuResolvers<ContextType>
  AdgerdirTags?: AdgerdirTagsResolvers<ContextType>
  LifeEventPage?: LifeEventPageResolvers<ContextType>
  PaginatedAdgerdirNews?: PaginatedAdgerdirNewsResolvers<ContextType>
  OrganizationTags?: OrganizationTagsResolvers<ContextType>
  Url?: UrlResolvers<ContextType>
  UrlPage?: UrlPageResolvers<ContextType>
  AboutSubPage?: AboutSubPageResolvers<ContextType>
  SearchResult?: SearchResultResolvers<ContextType>
  Items?: ItemsResolvers<ContextType>
  ContentItem?: ContentItemResolvers<ContextType>
  WebSearchAutocomplete?: WebSearchAutocompleteResolvers<ContextType>
  Application?: ApplicationResolvers<ContextType>
  DateTime?: GraphQLScalarType
  PresignedPost?: PresignedPostResolvers<ContextType>
  Document?: DocumentResolvers<ContextType>
  DocumentDetails?: DocumentDetailsResolvers<ContextType>
  DocumentCategory?: DocumentCategoryResolvers<ContextType>
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
        name: 'Slice',
        possibleTypes: [
          {
            name: 'TimelineSlice',
          },
          {
            name: 'MailingListSignupSlice',
          },
          {
            name: 'HeadingSlice',
          },
          {
            name: 'LinkCardSlice',
          },
          {
            name: 'StorySlice',
          },
          {
            name: 'LogoListSlice',
          },
          {
            name: 'LatestNewsSlice',
          },
          {
            name: 'BulletListSlice',
          },
          {
            name: 'Statistics',
          },
          {
            name: 'ProcessEntry',
          },
          {
            name: 'FaqList',
          },
          {
            name: 'EmbeddedVideo',
          },
          {
            name: 'SectionWithImage',
          },
          {
            name: 'TabSection',
          },
          {
            name: 'Html',
          },
          {
            name: 'Image',
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
        name: 'UrlPage',
        possibleTypes: [
          {
            name: 'Article',
          },
          {
            name: 'ArticleCategory',
          },
          {
            name: 'News',
          },
          {
            name: 'LifeEventPage',
          },
        ],
      },
      {
        kind: 'UNION',
        name: 'Items',
        possibleTypes: [
          {
            name: 'Article',
          },
          {
            name: 'LifeEventPage',
          },
          {
            name: 'News',
          },
          {
            name: 'AboutPage',
          },
        ],
      },
    ],
  },
}
export default result
