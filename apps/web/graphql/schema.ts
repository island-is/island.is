export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { [key: string]: any }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: Date
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
  description?: Maybe<Scalars['String']>
}

export type Article = {
  __typename?: 'Article'
  id: Scalars['String']
  slug: Scalars['String']
  title: Scalars['String']
  content?: Maybe<Scalars['String']>
  group?: Maybe<Taxonomy>
  category?: Maybe<Taxonomy>
}

export type AdgerdirTag = {
  __typename?: 'AdgerdirTag'
  id: Scalars['ID']
  title: Scalars['String']
}

export type AdgerdirPage = {
  __typename?: 'AdgerdirPage'
  id: Scalars['ID']
  slug: Scalars['String']
  title: Scalars['String']
  description?: Maybe<Scalars['String']>
  content?: Maybe<Scalars['String']>
  tags: Array<AdgerdirTag>
  link?: Maybe<Scalars['String']>
  status: Scalars['String']
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
}

export type Image = {
  __typename?: 'Image'
  id: Scalars['ID']
  url: Scalars['String']
  title: Scalars['String']
  contentType: Scalars['String']
  width: Scalars['Int']
  height: Scalars['Int']
}

export type FrontpageSlide = {
  __typename?: 'FrontpageSlide'
  title: Scalars['String']
  subtitle: Scalars['String']
  content: Scalars['String']
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
  namespace: Scalars['String']
  fields: Scalars['String']
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

export type Statistic = {
  __typename?: 'Statistic'
  id: Scalars['ID']
  value: Scalars['String']
  label: Scalars['String']
}

export type Html = {
  __typename?: 'Html'
  id: Scalars['ID']
  document: Scalars['JSON']
}

export type QuestionAndAnswer = {
  __typename?: 'QuestionAndAnswer'
  id: Scalars['ID']
  question: Scalars['String']
  answer: Html
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
  | Html
  | Image
  | Statistics
  | ProcessEntry
  | FaqList
  | EmbeddedVideo

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

export type Statistics = {
  __typename?: 'Statistics'
  id: Scalars['ID']
  title: Scalars['String']
  statistics: Array<Statistic>
}

export type ProcessEntry = {
  __typename?: 'ProcessEntry'
  id: Scalars['ID']
  title: Scalars['String']
  subtitle?: Maybe<Scalars['String']>
  details?: Maybe<Html>
  type: Scalars['String']
  processTitle: Scalars['String']
  processDescription?: Maybe<Scalars['String']>
  processInfo?: Maybe<Html>
  processLink: Scalars['String']
  buttonText: Scalars['String']
}

export type FaqList = {
  __typename?: 'FaqList'
  id: Scalars['ID']
  title: Scalars['String']
  questions: Array<QuestionAndAnswer>
}

export type EmbeddedVideo = {
  __typename?: 'EmbeddedVideo'
  id: Scalars['ID']
  title: Scalars['String']
  url: Scalars['String']
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

export type Application = {
  __typename?: 'Application'
  id: Scalars['ID']
  created: Scalars['DateTime']
  modified: Scalars['DateTime']
  applicant: Scalars['String']
  assignee: Scalars['String']
  externalId?: Maybe<Scalars['String']>
  state: ApplicationStateEnum
  attachments?: Maybe<Array<Scalars['String']>>
  typeId: ApplicationTypeIdEnum
  answers: Scalars['JSON']
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
  PaternityLeave = 'PaternityLeave',
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
}

export type MutationCreateApplicationArgs = {
  input: CreateApplicationInput
}

export type MutationUpdateApplicationArgs = {
  input: UpdateApplicationInput
}

export type CreateApplicationInput = {
  applicant: Scalars['String']
  assignee: Scalars['String']
  externalId?: Maybe<Scalars['String']>
  state: CreateApplicationDtoStateEnum
  attachments?: Maybe<Array<Scalars['String']>>
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
  PaternityLeave = 'PaternityLeave',
}

export type UpdateApplicationInput = {
  id: Scalars['String']
  typeId: UpdateApplicationDtoTypeIdEnum
  applicant?: Maybe<Scalars['String']>
  assignee?: Maybe<Scalars['String']>
  externalId?: Maybe<Scalars['String']>
  state?: Maybe<UpdateApplicationDtoStateEnum>
  attachments?: Maybe<Array<Scalars['String']>>
  answers?: Maybe<Scalars['JSON']>
}

export enum UpdateApplicationDtoTypeIdEnum {
  ExampleForm = 'ExampleForm',
  ExampleForm2 = 'ExampleForm2',
  ExampleForm3 = 'ExampleForm3',
  FamilyAndPets = 'FamilyAndPets',
  PaternityLeave = 'PaternityLeave',
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

export type GetAboutPageQueryVariables = Exact<{
  input: GetAboutPageInput
}>

export type GetAboutPageQuery = { __typename?: 'Query' } & {
  getAboutPage: { __typename?: 'AboutPage' } & Pick<
    AboutPage,
    'title' | 'seoDescription' | 'theme'
  > & {
      slices: Array<
        | ({
            __typename?: 'PageHeaderSlice'
          } & AllSlicesPageHeaderSliceFragment)
        | ({ __typename?: 'TimelineSlice' } & AllSlicesTimelineSliceFragment)
        | ({ __typename?: 'HeadingSlice' } & AllSlicesHeadingSliceFragment)
        | ({ __typename?: 'StorySlice' } & AllSlicesStorySliceFragment)
        | ({ __typename?: 'LinkCardSlice' } & AllSlicesLinkCardSliceFragment)
        | ({
            __typename?: 'LatestNewsSlice'
          } & AllSlicesLatestNewsSliceFragment)
        | ({
            __typename?: 'MailingListSignupSlice'
          } & AllSlicesMailingListSignupSliceFragment)
        | ({ __typename?: 'LogoListSlice' } & AllSlicesLogoListSliceFragment)
        | ({
            __typename?: 'BulletListSlice'
          } & AllSlicesBulletListSliceFragment)
        | ({ __typename?: 'Html' } & AllSlicesHtmlFragment)
        | ({ __typename?: 'Image' } & AllSlicesImageFragment)
        | ({ __typename?: 'Statistics' } & AllSlicesStatisticsFragment)
        | ({ __typename?: 'ProcessEntry' } & AllSlicesProcessEntryFragment)
        | ({ __typename?: 'FaqList' } & AllSlicesFaqListFragment)
        | ({ __typename?: 'EmbeddedVideo' } & AllSlicesEmbeddedVideoFragment)
      >
    }
}

export type GetSingleItemQueryVariables = Exact<{
  input: ItemInput
}>

export type GetSingleItemQuery = { __typename?: 'Query' } & {
  singleItem?: Maybe<
    { __typename?: 'ContentItem' } & Pick<
      ContentItem,
      'id' | 'slug' | 'title' | 'group' | 'category' | 'categorySlug'
    > & { content: ContentItem['contentBlob'] }
  >
}

export type GetCategoriesQueryVariables = Exact<{
  input: CategoriesInput
}>

export type GetCategoriesQuery = { __typename?: 'Query' } & {
  categories: Array<
    { __typename?: 'ContentCategory' } & Pick<
      ContentCategory,
      'title' | 'slug' | 'description'
    >
  >
}

export type GetArticlesInCategoryQueryVariables = Exact<{
  category: ArticlesInCategoryInput
}>

export type GetArticlesInCategoryQuery = { __typename?: 'Query' } & {
  articlesInCategory: Array<
    { __typename?: 'ContentItem' } & Pick<
      ContentItem,
      | 'content'
      | 'category'
      | 'slug'
      | 'title'
      | 'group'
      | 'groupDescription'
      | 'groupSlug'
    >
  >
}

export type GetFrontpageSliderListQueryVariables = Exact<{
  input: GetFrontpageSliderListInput
}>

export type GetFrontpageSliderListQuery = { __typename?: 'Query' } & {
  getFrontpageSliderList?: Maybe<
    { __typename?: 'FrontpageSliderList' } & {
      items: Array<
        { __typename?: 'FrontpageSlide' } & Pick<
          FrontpageSlide,
          'subtitle' | 'title' | 'content' | 'link'
        > & {
            image?: Maybe<
              { __typename?: 'Image' } & Pick<
                Image,
                'url' | 'title' | 'contentType' | 'width' | 'height'
              >
            >
          }
      >
    }
  >
}

export type GetLandingPageQueryVariables = Exact<{
  input: GetLandingPageInput
}>

export type GetLandingPageQuery = { __typename?: 'Query' } & {
  getLandingPage?: Maybe<
    { __typename?: 'LandingPage' } & Pick<
      LandingPage,
      'title' | 'slug' | 'introduction'
    > & {
        image?: Maybe<{ __typename?: 'Image' } & ImageFieldsFragment>
        actionButton?: Maybe<
          { __typename?: 'Link' } & Pick<Link, 'text' | 'url'>
        >
        links?: Maybe<
          { __typename?: 'LinkList' } & Pick<LinkList, 'title'> & {
              links: Array<{ __typename?: 'Link' } & Pick<Link, 'text' | 'url'>>
            }
        >
        content: Array<
          | ({
              __typename?: 'PageHeaderSlice'
            } & AllSlicesPageHeaderSliceFragment)
          | ({ __typename?: 'TimelineSlice' } & AllSlicesTimelineSliceFragment)
          | ({ __typename?: 'HeadingSlice' } & AllSlicesHeadingSliceFragment)
          | ({ __typename?: 'StorySlice' } & AllSlicesStorySliceFragment)
          | ({ __typename?: 'LinkCardSlice' } & AllSlicesLinkCardSliceFragment)
          | ({
              __typename?: 'LatestNewsSlice'
            } & AllSlicesLatestNewsSliceFragment)
          | ({
              __typename?: 'MailingListSignupSlice'
            } & AllSlicesMailingListSignupSliceFragment)
          | ({ __typename?: 'LogoListSlice' } & AllSlicesLogoListSliceFragment)
          | ({
              __typename?: 'BulletListSlice'
            } & AllSlicesBulletListSliceFragment)
          | ({ __typename?: 'Html' } & AllSlicesHtmlFragment)
          | ({ __typename?: 'Image' } & AllSlicesImageFragment)
          | ({ __typename?: 'Statistics' } & AllSlicesStatisticsFragment)
          | ({ __typename?: 'ProcessEntry' } & AllSlicesProcessEntryFragment)
          | ({ __typename?: 'FaqList' } & AllSlicesFaqListFragment)
          | ({ __typename?: 'EmbeddedVideo' } & AllSlicesEmbeddedVideoFragment)
        >
      }
  >
}

export type GetMenuQueryVariables = Exact<{
  input: GetMenuInput
}>

export type GetMenuQuery = { __typename?: 'Query' } & {
  getMenu?: Maybe<
    { __typename?: 'Menu' } & Pick<Menu, 'title'> & {
        links: Array<{ __typename?: 'Link' } & Pick<Link, 'text' | 'url'>>
      }
  >
}

export type GetNamespaceQueryVariables = Exact<{
  input: GetNamespaceInput
}>

export type GetNamespaceQuery = { __typename?: 'Query' } & {
  getNamespace?: Maybe<{ __typename?: 'Namespace' } & Pick<Namespace, 'fields'>>
}

export type GetNewsListQueryVariables = Exact<{
  input: GetNewsListInput
}>

export type GetNewsListQuery = { __typename?: 'Query' } & {
  getNewsList: { __typename?: 'PaginatedNews' } & {
    page: { __typename?: 'Pagination' } & Pick<
      Pagination,
      'page' | 'perPage' | 'totalPages'
    >
    news: Array<
      { __typename?: 'News' } & Pick<
        News,
        'id' | 'title' | 'date' | 'slug' | 'intro'
      > & {
          image?: Maybe<
            { __typename?: 'Image' } & Pick<
              Image,
              'url' | 'title' | 'width' | 'height'
            >
          >
        }
    >
  }
}

export type GetNewsItemQueryVariables = Exact<{
  input: GetNewsInput
}>

export type GetNewsItemQuery = { __typename?: 'Query' } & {
  getNews?: Maybe<
    { __typename?: 'News' } & Pick<
      News,
      'id' | 'title' | 'date' | 'slug' | 'intro' | 'content'
    > & {
        image?: Maybe<
          { __typename?: 'Image' } & Pick<
            Image,
            'url' | 'title' | 'width' | 'height'
          >
        >
      }
  >
}

export type GetSearchResultsQueryVariables = Exact<{
  query: SearcherInput
}>

export type GetSearchResultsQuery = { __typename?: 'Query' } & {
  searchResults: { __typename?: 'SearchResult' } & Pick<
    SearchResult,
    'total'
  > & {
      items: Array<
        { __typename?: 'ContentItem' } & Pick<
          ContentItem,
          'id' | 'title' | 'content' | 'slug' | 'category' | 'group'
        >
      >
    }
}

export type GetSearchResultsDetailedQueryVariables = Exact<{
  query: SearcherInput
}>

export type GetSearchResultsDetailedQuery = { __typename?: 'Query' } & {
  searchResults: { __typename?: 'SearchResult' } & Pick<
    SearchResult,
    'total'
  > & {
      items: Array<
        { __typename?: 'ContentItem' } & Pick<
          ContentItem,
          | 'id'
          | 'title'
          | 'slug'
          | 'tag'
          | 'content'
          | 'categoryDescription'
          | 'categorySlug'
          | 'category'
          | 'group'
          | 'groupSlug'
          | 'contentType'
        >
      >
    }
}

export type ImageFieldsFragment = { __typename: 'Image' } & Pick<
  Image,
  'id' | 'title' | 'url' | 'contentType' | 'width' | 'height'
>

export type PageHeaderFieldsFragment = { __typename: 'PageHeaderSlice' } & Pick<
  PageHeaderSlice,
  'id' | 'title' | 'introduction' | 'navigationText'
> & {
    links: Array<{ __typename?: 'Link' } & Pick<Link, 'text' | 'url'>>
    slices: Array<
      | { __typename?: 'PageHeaderSlice' }
      | ({ __typename?: 'TimelineSlice' } & TimelineFieldsFragment)
      | { __typename?: 'HeadingSlice' }
      | { __typename?: 'StorySlice' }
      | { __typename?: 'LinkCardSlice' }
      | { __typename?: 'LatestNewsSlice' }
      | { __typename?: 'MailingListSignupSlice' }
      | { __typename?: 'LogoListSlice' }
      | { __typename?: 'BulletListSlice' }
      | { __typename?: 'Html' }
      | { __typename?: 'Image' }
      | { __typename?: 'Statistics' }
      | { __typename?: 'ProcessEntry' }
      | { __typename?: 'FaqList' }
      | { __typename?: 'EmbeddedVideo' }
    >
  }

export type TimelineFieldsFragment = { __typename: 'TimelineSlice' } & Pick<
  TimelineSlice,
  'id' | 'title'
> & {
    events: Array<
      { __typename?: 'TimelineEvent' } & Pick<
        TimelineEvent,
        | 'id'
        | 'title'
        | 'date'
        | 'numerator'
        | 'denominator'
        | 'label'
        | 'body'
        | 'tags'
        | 'link'
      >
    >
  }

export type MailingListSignupFieldsFragment = {
  __typename: 'MailingListSignupSlice'
} & Pick<
  MailingListSignupSlice,
  'id' | 'title' | 'description' | 'inputLabel' | 'buttonText'
>

export type StoryFieldsFragment = { __typename: 'StorySlice' } & Pick<
  StorySlice,
  'id' | 'readMoreText'
> & {
    stories: Array<
      { __typename?: 'Story' } & Pick<
        Story,
        'title' | 'intro' | 'label' | 'body'
      > & { logo: { __typename?: 'Image' } & ImageFieldsFragment }
    >
  }

export type LatestNewsFieldsFragment = { __typename: 'LatestNewsSlice' } & Pick<
  LatestNewsSlice,
  'id' | 'title'
> & {
    news: Array<
      { __typename?: 'News' } & Pick<
        News,
        'title' | 'slug' | 'date' | 'intro' | 'content'
      > & { image?: Maybe<{ __typename?: 'Image' } & ImageFieldsFragment> }
    >
  }

export type LinkCardFieldsFragment = { __typename: 'LinkCardSlice' } & Pick<
  LinkCardSlice,
  'id' | 'title'
> & {
    cards: Array<
      { __typename?: 'LinkCard' } & Pick<
        LinkCard,
        'title' | 'body' | 'link' | 'linkText'
      >
    >
  }

export type HeadingFieldsFragment = { __typename: 'HeadingSlice' } & Pick<
  HeadingSlice,
  'id' | 'title' | 'body'
>

export type LogoListFieldsFragment = { __typename: 'LogoListSlice' } & Pick<
  LogoListSlice,
  'id' | 'title' | 'body'
> & { images: Array<{ __typename?: 'Image' } & ImageFieldsFragment> }

export type BulletListFieldsFragment = { __typename: 'BulletListSlice' } & Pick<
  BulletListSlice,
  'id'
> & {
    bullets: Array<
      | ({ __typename: 'IconBullet' } & Pick<
          IconBullet,
          'id' | 'title' | 'body' | 'url' | 'linkText'
        > & { icon: { __typename?: 'Image' } & ImageFieldsFragment })
      | ({ __typename: 'NumberBulletGroup' } & Pick<
          NumberBulletGroup,
          'id' | 'defaultVisible'
        > & {
            bullets: Array<
              { __typename?: 'NumberBullet' } & Pick<
                NumberBullet,
                'title' | 'body'
              >
            >
          })
    >
  }

export type FaqListFieldsFragment = { __typename: 'FaqList' } & Pick<
  FaqList,
  'id' | 'title'
> & {
    questions: Array<
      { __typename?: 'QuestionAndAnswer' } & Pick<
        QuestionAndAnswer,
        'question'
      > & { answer: { __typename?: 'Html' } & HtmlFieldsFragment }
    >
  }

export type StatisticsFieldsFragment = { __typename: 'Statistics' } & Pick<
  Statistics,
  'id' | 'title'
> & {
    statistics: Array<
      { __typename?: 'Statistic' } & Pick<Statistic, 'id' | 'value' | 'label'>
    >
  }

export type ProcessEntryFieldsFragment = { __typename?: 'ProcessEntry' } & Pick<
  ProcessEntry,
  | 'id'
  | 'title'
  | 'subtitle'
  | 'type'
  | 'processTitle'
  | 'processDescription'
  | 'processLink'
  | 'buttonText'
> & {
    details?: Maybe<{ __typename?: 'Html' } & HtmlFieldsFragment>
    processInfo?: Maybe<{ __typename?: 'Html' } & HtmlFieldsFragment>
  }

export type HtmlFieldsFragment = { __typename: 'Html' } & Pick<
  Html,
  'id' | 'document'
>

export type AllSlicesPageHeaderSliceFragment = {
  __typename?: 'PageHeaderSlice'
} & PageHeaderFieldsFragment

export type AllSlicesTimelineSliceFragment = {
  __typename?: 'TimelineSlice'
} & TimelineFieldsFragment

export type AllSlicesHeadingSliceFragment = {
  __typename?: 'HeadingSlice'
} & HeadingFieldsFragment

export type AllSlicesStorySliceFragment = {
  __typename?: 'StorySlice'
} & StoryFieldsFragment

export type AllSlicesLinkCardSliceFragment = {
  __typename?: 'LinkCardSlice'
} & LinkCardFieldsFragment

export type AllSlicesLatestNewsSliceFragment = {
  __typename?: 'LatestNewsSlice'
} & LatestNewsFieldsFragment

export type AllSlicesMailingListSignupSliceFragment = {
  __typename?: 'MailingListSignupSlice'
} & MailingListSignupFieldsFragment

export type AllSlicesLogoListSliceFragment = {
  __typename?: 'LogoListSlice'
} & LogoListFieldsFragment

export type AllSlicesBulletListSliceFragment = {
  __typename?: 'BulletListSlice'
} & BulletListFieldsFragment

export type AllSlicesHtmlFragment = { __typename?: 'Html' } & HtmlFieldsFragment

export type AllSlicesImageFragment = { __typename?: 'Image' }

export type AllSlicesStatisticsFragment = {
  __typename?: 'Statistics'
} & StatisticsFieldsFragment

export type AllSlicesProcessEntryFragment = {
  __typename?: 'ProcessEntry'
} & ProcessEntryFieldsFragment

export type AllSlicesFaqListFragment = {
  __typename?: 'FaqList'
} & FaqListFieldsFragment

export type AllSlicesEmbeddedVideoFragment = { __typename?: 'EmbeddedVideo' }

export type AllSlicesFragment =
  | AllSlicesPageHeaderSliceFragment
  | AllSlicesTimelineSliceFragment
  | AllSlicesHeadingSliceFragment
  | AllSlicesStorySliceFragment
  | AllSlicesLinkCardSliceFragment
  | AllSlicesLatestNewsSliceFragment
  | AllSlicesMailingListSignupSliceFragment
  | AllSlicesLogoListSliceFragment
  | AllSlicesBulletListSliceFragment
  | AllSlicesHtmlFragment
  | AllSlicesImageFragment
  | AllSlicesStatisticsFragment
  | AllSlicesProcessEntryFragment
  | AllSlicesFaqListFragment
  | AllSlicesEmbeddedVideoFragment
