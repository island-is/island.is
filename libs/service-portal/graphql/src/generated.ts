import gql from 'graphql-tag'
import * as ApolloReactCommon from '@apollo/client'
import * as ApolloReactHooks from '@apollo/client'
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
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: Date
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { [key: string]: any }
}

export type AuthDelegation = {
  toNationalId: Scalars['String']
  fromNationalId: Scalars['String']
  fromName: Scalars['String']
  type: AuthDelegationType
  provider: AuthDelegationProvider
}

export enum AuthDelegationType {
  LegalGuardian = 'LegalGuardian',
  ProcurationHolder = 'ProcurationHolder',
  Custom = 'Custom',
}

export enum AuthDelegationProvider {
  Thjodskra = 'Thjodskra',
  Fyrirtaekjaskra = 'Fyrirtaekjaskra',
  Delegationdb = 'Delegationdb',
}

export type AuthLegalGuardianDelegation = AuthDelegation & {
  __typename?: 'AuthLegalGuardianDelegation'
  toNationalId: Scalars['String']
  fromNationalId: Scalars['String']
  fromName: Scalars['String']
  type: AuthDelegationType
  provider: AuthDelegationProvider
}

export type AuthProcuringHolderDelegation = AuthDelegation & {
  __typename?: 'AuthProcuringHolderDelegation'
  toNationalId: Scalars['String']
  fromNationalId: Scalars['String']
  fromName: Scalars['String']
  type: AuthDelegationType
  provider: AuthDelegationProvider
}

export type AuthCustomDelegation = AuthDelegation & {
  __typename?: 'AuthCustomDelegation'
  toNationalId: Scalars['String']
  fromNationalId: Scalars['String']
  fromName: Scalars['String']
  type: AuthDelegationType
  provider: AuthDelegationProvider
  id: Scalars['ID']
  validFrom: Scalars['DateTime']
  validTo?: Maybe<Scalars['DateTime']>
  scopes: Array<Scalars['String']>
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

export type Link = {
  __typename?: 'Link'
  text: Scalars['String']
  url: Scalars['String']
}

export type ArticleCategory = {
  __typename?: 'ArticleCategory'
  id: Scalars['ID']
  title: Scalars['String']
  slug: Scalars['String']
  description?: Maybe<Scalars['String']>
}

export type ArticleGroup = {
  __typename?: 'ArticleGroup'
  title: Scalars['String']
  slug: Scalars['String']
  description?: Maybe<Scalars['String']>
  importance?: Maybe<Scalars['Float']>
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

export type Asset = {
  __typename?: 'Asset'
  typename: Scalars['String']
  id: Scalars['ID']
  url: Scalars['String']
  title: Scalars['String']
  contentType: Scalars['String']
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
  link: Scalars['String']
  linkedPage?: Maybe<Scalars['String']>
  body?: Maybe<Scalars['String']>
}

export type LinkCard = {
  __typename?: 'LinkCard'
  title: Scalars['String']
  body: Scalars['String']
  link: Scalars['String']
  linkText: Scalars['String']
}

export type Author = {
  __typename?: 'Author'
  id: Scalars['ID']
  name: Scalars['String']
}

export type GenericTag = {
  __typename?: 'GenericTag'
  id: Scalars['ID']
  title: Scalars['String']
}

export type News = {
  __typename?: 'News'
  id: Scalars['ID']
  slug: Scalars['String']
  title: Scalars['String']
  subtitle: Scalars['String']
  author?: Maybe<Author>
  intro?: Maybe<Scalars['String']>
  image?: Maybe<Image>
  date: Scalars['String']
  content?: Maybe<Array<Slice>>
  genericTags: Array<GenericTag>
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
  | ConnectedComponent
  | EmbeddedVideo
  | SectionWithImage
  | TabSection
  | TeamList
  | ContactUs
  | Location
  | TellUsAStory
  | Html
  | Image
  | Asset
  | Districts
  | FeaturedArticles
  | OneColumnText
  | TwoColumnText
  | Offices
  | AccordionSlice

export type MailingListSignupSlice = {
  __typename?: 'MailingListSignupSlice'
  id: Scalars['ID']
  title: Scalars['String']
  description?: Maybe<Scalars['String']>
  inputLabel: Scalars['String']
  buttonText: Scalars['String']
}

export type HeadingSlice = {
  __typename?: 'HeadingSlice'
  id: Scalars['ID']
  title: Scalars['String']
  body: Scalars['String']
}

export type LinkCardSlice = {
  __typename?: 'LinkCardSlice'
  id: Scalars['ID']
  title: Scalars['String']
  cards: Array<LinkCard>
}

export type StorySlice = {
  __typename?: 'StorySlice'
  id: Scalars['ID']
  readMoreText: Scalars['String']
  stories: Array<Story>
}

export type LogoListSlice = {
  __typename?: 'LogoListSlice'
  id: Scalars['ID']
  title: Scalars['String']
  body: Scalars['String']
  images: Array<Image>
}

export type LatestNewsSlice = {
  __typename?: 'LatestNewsSlice'
  id: Scalars['ID']
  title: Scalars['String']
  readMoreText: Scalars['String']
  news: Array<News>
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

export type FaqList = {
  __typename?: 'FaqList'
  id: Scalars['ID']
  title: Scalars['String']
  questions: Array<QuestionAndAnswer>
}

export type ConnectedComponent = {
  __typename?: 'ConnectedComponent'
  id: Scalars['ID']
  title: Scalars['String']
  type?: Maybe<Scalars['String']>
  json?: Maybe<Scalars['JSON']>
}

export type EmbeddedVideo = {
  __typename?: 'EmbeddedVideo'
  id: Scalars['ID']
  title: Scalars['String']
  url: Scalars['String']
}

export type SectionWithImage = {
  __typename?: 'SectionWithImage'
  id: Scalars['ID']
  title: Scalars['String']
  image?: Maybe<Image>
  html: Html
}

export type TabSection = {
  __typename?: 'TabSection'
  id: Scalars['ID']
  title: Scalars['String']
  tabs: Array<TabContent>
}

export type TeamList = {
  __typename?: 'TeamList'
  id: Scalars['ID']
  teamMembers: Array<TeamMember>
}

export type ContactUs = {
  __typename?: 'ContactUs'
  id: Scalars['ID']
  title: Scalars['String']
  required: Scalars['String']
  invalidPhone: Scalars['String']
  invalidEmail: Scalars['String']
  labelName: Scalars['String']
  labelPhone: Scalars['String']
  labelEmail: Scalars['String']
  labelSubject: Scalars['String']
  labelMessage: Scalars['String']
  submitButtonText: Scalars['String']
  successMessage: Scalars['String']
  errorMessage: Scalars['String']
}

export type Location = {
  __typename?: 'Location'
  id: Scalars['ID']
  title: Scalars['String']
  subTitle: Scalars['String']
  address: Scalars['String']
  link?: Maybe<Link>
  background: Image
}

export type Districts = {
  __typename?: 'Districts'
  id: Scalars['ID']
  title: Scalars['String']
  description?: Maybe<Scalars['String']>
  image?: Maybe<Image>
  links: Array<Link>
}

export type FeaturedArticles = {
  __typename?: 'FeaturedArticles'
  id: Scalars['ID']
  title: Scalars['String']
  image?: Maybe<Image>
  articles: Array<Article>
  link?: Maybe<Link>
}

export type TwoColumnText = {
  __typename?: 'TwoColumnText'
  id: Scalars['ID']
  rightTitle?: Maybe<Scalars['String']>
  rightContent?: Maybe<Array<Slice>>
  rightLink?: Maybe<Link>
  leftTitle?: Maybe<Scalars['String']>
  leftContent?: Maybe<Array<Slice>>
  leftLink?: Maybe<Link>
}

export type Offices = {
  __typename?: 'Offices'
  id: Scalars['ID']
  title: Scalars['String']
  offices: Array<OrganizationOffice>
}

export type AccordionSlice = {
  __typename?: 'AccordionSlice'
  id: Scalars['ID']
  title: Scalars['String']
  accordionItems?: Maybe<Array<OneColumnText>>
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

export type ProcessEntry = {
  __typename?: 'ProcessEntry'
  id: Scalars['ID']
  type: Scalars['String']
  processTitle: Scalars['String']
  processLink: Scalars['String']
  openLinkInModal?: Maybe<Scalars['Boolean']>
  buttonText: Scalars['String']
}

export type QuestionAndAnswer = {
  __typename?: 'QuestionAndAnswer'
  id: Scalars['ID']
  question: Scalars['String']
  answer: Array<Slice>
}

export type TabContent = {
  __typename?: 'TabContent'
  tabTitle: Scalars['String']
  contentTitle?: Maybe<Scalars['String']>
  image?: Maybe<Image>
  body?: Maybe<Html>
}

export type TeamMember = {
  __typename?: 'TeamMember'
  name: Scalars['String']
  title: Scalars['String']
  image: Image
}

export type TellUsAStory = {
  __typename?: 'TellUsAStory'
  id: Scalars['ID']
  introTitle: Scalars['String']
  introDescription?: Maybe<Html>
  introImage?: Maybe<Image>
  firstSectionTitle: Scalars['String']
  organizationLabel: Scalars['String']
  organizationPlaceholder: Scalars['String']
  organizationInputErrorMessage: Scalars['String']
  dateOfStoryLabel: Scalars['String']
  dateOfStoryPlaceholder: Scalars['String']
  dateOfStoryInputErrorMessage: Scalars['String']
  secondSectionTitle: Scalars['String']
  subjectLabel: Scalars['String']
  subjectPlaceholder: Scalars['String']
  subjectInputErrorMessage?: Maybe<Scalars['String']>
  messageLabel: Scalars['String']
  messagePlaceholder: Scalars['String']
  messageInputErrorMessage: Scalars['String']
  thirdSectionTitle: Scalars['String']
  instructionsDescription?: Maybe<Html>
  instructionsImage: Image
  instructionsTitle: Scalars['String']
  nameLabel: Scalars['String']
  namePlaceholder: Scalars['String']
  nameInputErrorMessage: Scalars['String']
  emailLabel: Scalars['String']
  emailPlaceholder: Scalars['String']
  emailInputErrorMessage: Scalars['String']
  publicationAllowedLabel: Scalars['String']
  submitButtonTitle: Scalars['String']
  SuccessMessageTitle: Scalars['String']
  successMessage?: Maybe<Html>
  errorMessageTitle: Scalars['String']
  errorMessage?: Maybe<Html>
}

export type OrganizationOffice = {
  __typename?: 'OrganizationOffice'
  id: Scalars['ID']
  name?: Maybe<Scalars['String']>
  city?: Maybe<Scalars['String']>
  address?: Maybe<Scalars['String']>
  email?: Maybe<Scalars['String']>
  phoneNumber?: Maybe<Scalars['String']>
  openingHours?: Maybe<Scalars['String']>
  content?: Maybe<Array<Slice>>
}

export type OneColumnText = {
  __typename?: 'OneColumnText'
  id: Scalars['ID']
  title: Scalars['String']
  link?: Maybe<Link>
  content?: Maybe<Array<Slice>>
}

export type FooterItem = {
  __typename?: 'FooterItem'
  id: Scalars['ID']
  title: Scalars['String']
  link?: Maybe<Link>
  content?: Maybe<Array<Slice>>
}

export type Organization = {
  __typename?: 'Organization'
  id: Scalars['ID']
  title: Scalars['String']
  shortTitle: Scalars['String']
  description?: Maybe<Scalars['String']>
  slug: Scalars['String']
  tag: Array<OrganizationTag>
  logo?: Maybe<Image>
  link?: Maybe<Scalars['String']>
  footerItems: Array<FooterItem>
}

export type ArticleReference = {
  __typename?: 'ArticleReference'
  id: Scalars['ID']
  title: Scalars['String']
  slug: Scalars['String']
  intro: Scalars['String']
  group?: Maybe<ArticleGroup>
  organization?: Maybe<Array<Organization>>
}

export type SubArticle = {
  __typename?: 'SubArticle'
  id: Scalars['ID']
  title: Scalars['String']
  slug: Scalars['String']
  parent?: Maybe<ArticleReference>
  body: Array<Slice>
  showTableOfContents?: Maybe<Scalars['Boolean']>
}

export type Article = {
  __typename?: 'Article'
  id: Scalars['ID']
  title: Scalars['String']
  slug: Scalars['String']
  shortTitle?: Maybe<Scalars['String']>
  intro?: Maybe<Scalars['String']>
  importance?: Maybe<Scalars['Float']>
  body: Array<Slice>
  processEntry?: Maybe<ProcessEntry>
  category?: Maybe<ArticleCategory>
  otherCategories?: Maybe<Array<ArticleCategory>>
  group?: Maybe<ArticleGroup>
  otherGroups?: Maybe<Array<ArticleGroup>>
  subgroup?: Maybe<ArticleSubgroup>
  otherSubgroups?: Maybe<Array<ArticleSubgroup>>
  organization?: Maybe<Array<Organization>>
  relatedOrganization?: Maybe<Array<Organization>>
  responsibleParty?: Maybe<Array<Organization>>
  subArticles: Array<SubArticle>
  relatedArticles?: Maybe<Array<Article>>
  relatedContent?: Maybe<Array<Link>>
  featuredImage?: Maybe<Image>
  showTableOfContents?: Maybe<Scalars['Boolean']>
}

export type ContentSlug = {
  __typename?: 'ContentSlug'
  id: Scalars['ID']
  slug: Scalars['String']
  type: Scalars['String']
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
  content: Array<Slice>
  objective?: Maybe<Scalars['String']>
  slug: Scalars['String']
  tags: Array<AdgerdirTag>
  link?: Maybe<Scalars['String']>
  linkButtonText?: Maybe<Scalars['String']>
  status: Scalars['String']
  estimatedCostIsk?: Maybe<Scalars['Float']>
  finalCostIsk?: Maybe<Scalars['Float']>
  processEntry?: Maybe<ProcessEntry>
}

export type Organizations = {
  __typename?: 'Organizations'
  items: Array<Organization>
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
  content: Array<Slice>
  slices: Array<AdgerdirSlice>
  featuredImage?: Maybe<Image>
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
  featured: Array<News>
}

export type FrontpageSlider = {
  __typename?: 'FrontpageSlider'
  title: Scalars['String']
  subtitle: Scalars['String']
  intro?: Maybe<Html>
  content: Scalars['String']
  link?: Maybe<Scalars['String']>
  animationJsonAsset?: Maybe<Asset>
}

export type FrontpageSliderList = {
  __typename?: 'FrontpageSliderList'
  items: Array<FrontpageSlider>
}

export type Namespace = {
  __typename?: 'Namespace'
  namespace: Scalars['String']
  fields: Scalars['String']
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
  slug: Scalars['String']
  seoDescription: Scalars['String']
  theme: Scalars['String']
  pageHeader: PageHeader
  slices: Array<Slice>
}

export type ReferenceLink = {
  __typename?: 'ReferenceLink'
  slug: Scalars['String']
  type: Scalars['String']
}

export type AlertBanner = {
  __typename?: 'AlertBanner'
  id: Scalars['ID']
  showAlertBanner: Scalars['Boolean']
  bannerVariant: Scalars['String']
  title?: Maybe<Scalars['String']>
  description?: Maybe<Scalars['String']>
  linkTitle?: Maybe<Scalars['String']>
  link?: Maybe<ReferenceLink>
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

export type MenuLink = {
  __typename?: 'MenuLink'
  title: Scalars['String']
  link: ReferenceLink
}

export type MenuLinkWithChildren = {
  __typename?: 'MenuLinkWithChildren'
  title: Scalars['String']
  link?: Maybe<ReferenceLink>
  childLinks: Array<MenuLink>
}

export type Menu = {
  __typename?: 'Menu'
  id: Scalars['ID']
  title: Scalars['String']
  links: Array<Link>
  menuLinks: Array<MenuLinkWithChildren>
}

export type IntroLinkImage = {
  __typename?: 'IntroLinkImage'
  title: Scalars['String']
  intro: Html
  image?: Maybe<Image>
  leftImage: Scalars['Boolean']
  linkTitle: Scalars['String']
  link: ReferenceLink
}

export type GenericOverviewPage = {
  __typename?: 'GenericOverviewPage'
  id: Scalars['ID']
  title: Scalars['String']
  pageIdentifier: Scalars['String']
  intro?: Maybe<Html>
  navigation: Menu
  overviewLinks: Array<IntroLinkImage>
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
  intro?: Maybe<Scalars['String']>
  image?: Maybe<Image>
  thumbnail?: Maybe<Image>
  content: Array<Slice>
  category?: Maybe<ArticleCategory>
}

export type OrganizationTags = {
  __typename?: 'OrganizationTags'
  items: Array<OrganizationTag>
}

export type Url = {
  __typename?: 'Url'
  id: Scalars['ID']
  title?: Maybe<Scalars['String']>
  page?: Maybe<ReferenceLink>
  urlsList: Array<Scalars['String']>
}

export type AboutSubPage = {
  __typename?: 'AboutSubPage'
  id: Scalars['ID']
  title: Scalars['String']
  slug: Scalars['String']
  url: Scalars['String']
  description: Scalars['String']
  subDescription: Scalars['String']
  intro?: Maybe<Html>
  slices: Array<Slice>
  bottomSlices: Array<Slice>
  parent?: Maybe<AboutPage>
}

export type Featured = {
  __typename?: 'Featured'
  title: Scalars['String']
  attention: Scalars['Boolean']
  thing?: Maybe<ReferenceLink>
}

export type Homepage = {
  __typename?: 'Homepage'
  id: Scalars['ID']
  featuredThings: Array<Featured>
}

export type SubpageHeader = {
  __typename?: 'SubpageHeader'
  subpageId: Scalars['String']
  title: Scalars['String']
  summary: Scalars['String']
  featuredImage?: Maybe<Image>
  body?: Maybe<Array<Slice>>
}

export type LinkGroup = {
  __typename?: 'LinkGroup'
  id: Scalars['ID']
  name: Scalars['String']
  primaryLink: Link
  childrenLinks: Array<Link>
}

export type SidebarCard = {
  __typename?: 'SidebarCard'
  id: Scalars['ID']
  type: Scalars['String']
  title: Scalars['String']
  content: Scalars['String']
  link?: Maybe<Link>
}

export type OrganizationTheme = {
  __typename?: 'OrganizationTheme'
  gradientStartColor: Scalars['String']
  gradientEndColor: Scalars['String']
}

export type OrganizationPage = {
  __typename?: 'OrganizationPage'
  id: Scalars['ID']
  title: Scalars['String']
  slug: Scalars['String']
  description: Scalars['String']
  theme: Scalars['String']
  themeProperties: OrganizationTheme
  slices: Array<Slice>
  bottomSlices: Array<Slice>
  newsTag?: Maybe<GenericTag>
  menuLinks: Array<LinkGroup>
  secondaryMenu?: Maybe<LinkGroup>
  organization: Organization
  featuredImage?: Maybe<Image>
  footerItems: Array<FooterItem>
  sidebarCards: Array<SidebarCard>
}

export type OrganizationSubpage = {
  __typename?: 'OrganizationSubpage'
  id: Scalars['ID']
  title: Scalars['String']
  slug: Scalars['String']
  description?: Maybe<Array<Slice>>
  links?: Maybe<Array<Link>>
  slices?: Maybe<Array<Slice>>
  sliceCustomRenderer?: Maybe<Scalars['String']>
  sliceExtraText?: Maybe<Scalars['String']>
  parentSubpage?: Maybe<Scalars['String']>
  organizationPage: OrganizationPage
  featuredImage?: Maybe<Image>
}

export type ErrorPage = {
  __typename?: 'ErrorPage'
  id: Scalars['ID']
  errorCode: Scalars['String']
  title: Scalars['String']
  description?: Maybe<Html>
}

export type Auction = {
  __typename?: 'Auction'
  id: Scalars['ID']
  title: Scalars['String']
  updatedAt: Scalars['String']
  date: Scalars['String']
  type: Scalars['String']
  content?: Maybe<Array<Slice>>
  organization: Organization
}

export type Frontpage = {
  __typename?: 'Frontpage'
  id: Scalars['ID']
  title?: Maybe<Scalars['String']>
  featured: Array<Featured>
  slides: Array<FrontpageSlider>
  namespace?: Maybe<Namespace>
  lifeEvents: Array<LifeEventPage>
}

export type NewsList = {
  __typename?: 'NewsList'
  total: Scalars['Int']
  items: Array<News>
}

export type GroupedMenu = {
  __typename?: 'GroupedMenu'
  id: Scalars['ID']
  title: Scalars['String']
  menus: Array<Menu>
}

export type TagCount = {
  __typename?: 'TagCount'
  key: Scalars['String']
  value: Scalars['String']
  count: Scalars['Int']
}

export type TypeCount = {
  __typename?: 'TypeCount'
  key: Scalars['String']
  count: Scalars['Int']
}

export type SearchResult = {
  __typename?: 'SearchResult'
  total: Scalars['Int']
  items: Array<Items>
  tagCounts?: Maybe<Array<TagCount>>
  typesCount?: Maybe<Array<TypeCount>>
}

export type Items =
  | Article
  | LifeEventPage
  | News
  | AboutPage
  | AdgerdirPage
  | SubArticle

export type WebSearchAutocomplete = {
  __typename?: 'WebSearchAutocomplete'
  total: Scalars['Int']
  completions: Array<Scalars['String']>
}

export type Eligibility = {
  __typename?: 'Eligibility'
  id: Scalars['ID']
  issued: Scalars['String']
  expires: Scalars['String']
  comment: Scalars['String']
}

export type DrivingLicense = {
  __typename?: 'DrivingLicense'
  id: Scalars['ID']
  issued: Scalars['String']
  expires: Scalars['String']
  isProvisional: Scalars['Boolean']
  eligibilities: Array<Eligibility>
}

export type DrivingLicenseType = {
  __typename?: 'DrivingLicenseType'
  id: Scalars['ID']
  name: Scalars['String']
}

export type PenaltyPointStatus = {
  __typename?: 'PenaltyPointStatus'
  nationalId: Scalars['ID']
  isPenaltyPointsOk: Scalars['Boolean']
}

export type License = {
  __typename?: 'License'
  id: Scalars['ID']
  school: Scalars['String']
  programme: Scalars['String']
  date: Scalars['String']
}

export type SignedLicense = {
  __typename?: 'SignedLicense'
  url: Scalars['ID']
}

export type Grade = {
  __typename?: 'Grade'
  grade: Scalars['String']
  weight?: Maybe<Scalars['String']>
}

export type EducationIcelandicGrade = {
  __typename?: 'EducationIcelandicGrade'
  grade: Scalars['String']
  competence: Scalars['String']
  competenceStatus: Scalars['String']
  reading: Grade
  grammar: Grade
  progressText: Scalars['String']
}

export type EducationEnglishGrade = {
  __typename?: 'EducationEnglishGrade'
  grade: Scalars['String']
  competence: Scalars['String']
  competenceStatus: Scalars['String']
  reading: Grade
  grammar: Grade
  progressText: Scalars['String']
}

export type EducationMathGrade = {
  __typename?: 'EducationMathGrade'
  grade: Scalars['String']
  competence: Scalars['String']
  competenceStatus: Scalars['String']
  calculation: Grade
  geometry: Grade
  ratiosAndPercentages: Grade
  algebra: Grade
  numberComprehension: Grade
  wordAndNumbers: Scalars['String']
  progressText: Scalars['String']
}

export type EducationGradeResult = {
  __typename?: 'EducationGradeResult'
  studentYear: Scalars['String']
  icelandicGrade?: Maybe<EducationIcelandicGrade>
  mathGrade?: Maybe<EducationMathGrade>
  englishGrade?: Maybe<EducationEnglishGrade>
}

export type EducationExamResult = {
  __typename?: 'EducationExamResult'
  id: Scalars['ID']
  fullName: Scalars['String']
  grades: Array<EducationGradeResult>
}

export type EducationExamFamilyOverview = {
  __typename?: 'EducationExamFamilyOverview'
  nationalId: Scalars['ID']
  name: Scalars['String']
  isChild: Scalars['Boolean']
  organizationType: Scalars['String']
  organizationName: Scalars['String']
  yearInterval: Scalars['String']
}

export type Application = {
  __typename?: 'Application'
  id: Scalars['ID']
  created: Scalars['DateTime']
  modified: Scalars['DateTime']
  applicant: Scalars['String']
  assignees: Array<Scalars['String']>
  state: Scalars['String']
  stateTitle?: Maybe<Scalars['String']>
  stateDescription?: Maybe<Scalars['String']>
  attachments?: Maybe<Scalars['JSON']>
  typeId: ApplicationResponseDtoTypeIdEnum
  answers: Scalars['JSON']
  externalData: Scalars['JSON']
  name?: Maybe<Scalars['String']>
  institution?: Maybe<Scalars['String']>
  progress?: Maybe<Scalars['Float']>
  status: ApplicationResponseDtoStatusEnum
}

export enum ApplicationResponseDtoTypeIdEnum {
  ExampleForm = 'ExampleForm',
  Passport = 'Passport',
  DrivingLessons = 'DrivingLessons',
  DrivingLicense = 'DrivingLicense',
  ParentalLeave = 'ParentalLeave',
  MetaApplication = 'MetaApplication',
  DocumentProviderOnboarding = 'DocumentProviderOnboarding',
  HealthInsurance = 'HealthInsurance',
  ChildrenResidenceChange = 'ChildrenResidenceChange',
  DataProtectionAuthorityComplaint = 'DataProtectionAuthorityComplaint',
  PartyLetter = 'PartyLetter',
  LoginService = 'LoginService',
  PartyApplication = 'PartyApplication',
  InstitutionCollaboration = 'InstitutionCollaboration',
  FundingGovernmentProjects = 'FundingGovernmentProjects',
  PublicDebtPaymentPlan = 'PublicDebtPaymentPlan',
  JointCustodyAgreement = 'JointCustodyAgreement',
}

export enum ApplicationResponseDtoStatusEnum {
  Inprogress = 'inprogress',
  Completed = 'completed',
  Rejected = 'rejected',
}

export type RequestFileSignatureResponse = {
  __typename?: 'RequestFileSignatureResponse'
  controlCode: Scalars['String']
  documentToken: Scalars['String']
}

export type PresignedUrlResponse = {
  __typename?: 'PresignedUrlResponse'
  url: Scalars['String']
}

export type UploadSignedFileResponse = {
  __typename?: 'UploadSignedFileResponse'
  documentSigned: Scalars['Boolean']
}

export type Union = {
  __typename?: 'Union'
  id: Scalars['String']
  name: Scalars['String']
}

export type PensionFund = {
  __typename?: 'PensionFund'
  id: Scalars['String']
  name: Scalars['String']
}

export type ParentalLeaveEntitlement = {
  __typename?: 'ParentalLeaveEntitlement'
  independentMonths: Scalars['Float']
  transferableMonths: Scalars['Float']
}

export type ParentalLeavePeriod = {
  __typename?: 'ParentalLeavePeriod'
  from: Scalars['String']
  to: Scalars['String']
  ratio: Scalars['Float']
  approved: Scalars['Boolean']
  paid: Scalars['Boolean']
}

export type ParentalLeavePaymentPlan = {
  __typename?: 'ParentalLeavePaymentPlan'
  estimatedAmount: Scalars['Float']
  pensionAmount: Scalars['Float']
  privatePensionAmount: Scalars['Float']
  unionAmount: Scalars['Float']
  taxAmount: Scalars['Float']
  estimatePayment: Scalars['Float']
  period: ParentalLeavePeriod
}

export type PregnancyStatus = {
  __typename?: 'PregnancyStatus'
  hasActivePregnancy: Scalars['Boolean']
  expectedDateOfBirth: Scalars['String']
}

export type ParentalLeaveEmployer = {
  __typename?: 'ParentalLeaveEmployer'
  email?: Maybe<Scalars['String']>
  nationalRegistryId: Scalars['String']
}

export type ParentalLeavePensionFund = {
  __typename?: 'ParentalLeavePensionFund'
  id: Scalars['String']
  name: Scalars['String']
}

export type ParentalLeaveUnion = {
  __typename?: 'ParentalLeaveUnion'
  id: Scalars['String']
  name: Scalars['String']
}

export type ParentalLeavePaymentInfo = {
  __typename?: 'ParentalLeavePaymentInfo'
  bankAccount: Scalars['String']
  personalAllowance: Scalars['Float']
  personalAllowanceFromSpouse: Scalars['Float']
  union: ParentalLeaveUnion
  pensionFund: ParentalLeavePensionFund
  privatePensionFund: ParentalLeavePensionFund
  privatePensionFundRatio: Scalars['Float']
}

export type ParentalLeave = {
  __typename?: 'ParentalLeave'
  applicationId: Scalars['ID']
  applicant: Scalars['String']
  otherParentId: Scalars['String']
  expectedDateOfBirth: Scalars['String']
  dateOfBirth: Scalars['String']
  email: Scalars['String']
  phoneNumber: Scalars['String']
  paymentInfo: ParentalLeavePaymentInfo
  periods: Array<ParentalLeavePeriod>
  employers: Array<ParentalLeaveEmployer>
  status: Scalars['String']
  rightsCode?: Maybe<Scalars['String']>
}

export type PresignedPost = {
  __typename?: 'PresignedPost'
  url: Scalars['String']
  fields: Scalars['JSON']
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

export type Document = {
  __typename?: 'Document'
  id: Scalars['ID']
  date: Scalars['DateTime']
  subject: Scalars['String']
  senderName: Scalars['String']
  senderNatReg: Scalars['String']
  opened: Scalars['Boolean']
  fileType: Scalars['String']
  url: Scalars['String']
}

export type CommunicationResponse = {
  __typename?: 'CommunicationResponse'
  sent: Scalars['Boolean']
}

export type UserProfile = {
  __typename?: 'UserProfile'
  nationalId: Scalars['ID']
  mobilePhoneNumber?: Maybe<Scalars['String']>
  locale?: Maybe<Scalars['String']>
  email?: Maybe<Scalars['String']>
  emailVerified: Scalars['Boolean']
  mobilePhoneNumberVerified: Scalars['Boolean']
}

export type ConfirmResponse = {
  __typename?: 'ConfirmResponse'
  message: Scalars['String']
  confirmed: Scalars['Boolean']
}

export type Response = {
  __typename?: 'Response'
  created: Scalars['Boolean']
}

export type NationalRegistryFamilyMember = {
  __typename?: 'NationalRegistryFamilyMember'
  nationalId: Scalars['ID']
  fullName: Scalars['String']
  gender?: Maybe<Gender>
  familyRelation: Scalars['String']
}

export enum Gender {
  Male = 'MALE',
  Female = 'FEMALE',
  Transgender = 'TRANSGENDER',
  MaleMinor = 'MALE_MINOR',
  FemaleMinor = 'FEMALE_MINOR',
  TransgenderMinor = 'TRANSGENDER_MINOR',
  Unknown = 'UNKNOWN',
}

export type BanMarking = {
  __typename?: 'BanMarking'
  banMarked: Scalars['Boolean']
  startDate: Scalars['String']
}

export type Address = {
  __typename?: 'Address'
  code: Scalars['ID']
  lastUpdated?: Maybe<Scalars['String']>
  streetAddress?: Maybe<Scalars['String']>
  city: Scalars['String']
  postalCode?: Maybe<Scalars['String']>
}

export type Citizenship = {
  __typename?: 'Citizenship'
  code: Scalars['ID']
  name: Scalars['String']
}

export type NationalRegistryUser = {
  __typename?: 'NationalRegistryUser'
  nationalId: Scalars['ID']
  fullName: Scalars['String']
  gender?: Maybe<Gender>
  legalResidence: Scalars['String']
  birthPlace: Scalars['String']
  citizenship: Citizenship
  religion?: Maybe<Scalars['String']>
  maritalStatus?: Maybe<MaritalStatus>
  banMarking?: Maybe<BanMarking>
  age: Scalars['Float']
  birthday: Scalars['DateTime']
  address?: Maybe<Address>
}

export enum MaritalStatus {
  Unmarried = 'UNMARRIED',
  Married = 'MARRIED',
  Widowed = 'WIDOWED',
  Separated = 'SEPARATED',
  Divorced = 'DIVORCED',
  MarriedLivingSeparately = 'MARRIED_LIVING_SEPARATELY',
  MarriedToForeignLawPerson = 'MARRIED_TO_FOREIGN_LAW_PERSON',
  Unknown = 'UNKNOWN',
  ForeignResidenceMarriedToUnregisteredPerson = 'FOREIGN_RESIDENCE_MARRIED_TO_UNREGISTERED_PERSON',
  IcelandicResidenceMarriedToUnregisteredPerson = 'ICELANDIC_RESIDENCE_MARRIED_TO_UNREGISTERED_PERSON',
}

export type OpenApi = {
  __typename?: 'OpenApi'
  spec: Scalars['String']
}

export type PageInfo = {
  __typename?: 'PageInfo'
  nextCursor?: Maybe<Scalars['String']>
}

export type ExternalLinks = {
  __typename?: 'ExternalLinks'
  responsibleParty: Scalars['String']
  documentation: Scalars['String']
  bugReport: Scalars['String']
  featureRequest: Scalars['String']
}

export type XroadIdentifier = {
  __typename?: 'XroadIdentifier'
  instance: Scalars['String']
  memberClass: Scalars['String']
  memberCode: Scalars['String']
  subsystemCode: Scalars['String']
  serviceCode: Scalars['String']
}

export type ServiceDetail = {
  __typename?: 'ServiceDetail'
  version: Scalars['ID']
  title: Scalars['String']
  summary: Scalars['String']
  description: Scalars['String']
  type: TypeCategory
  pricing: Array<PricingCategory>
  data: Array<DataCategory>
  links: ExternalLinks
  xroadIdentifier: XroadIdentifier
}

export enum TypeCategory {
  Rest = 'REST',
  Soap = 'SOAP',
  Graphql = 'GRAPHQL',
}

export enum PricingCategory {
  Free = 'FREE',
  Paid = 'PAID',
}

export enum DataCategory {
  Open = 'OPEN',
  Public = 'PUBLIC',
  Official = 'OFFICIAL',
  Personal = 'PERSONAL',
  Health = 'HEALTH',
  Financial = 'FINANCIAL',
}

export type ServiceEnvironment = {
  __typename?: 'ServiceEnvironment'
  environment: Environment
  details: Array<ServiceDetail>
}

export enum Environment {
  Development = 'DEVELOPMENT',
  Staging = 'STAGING',
  Production = 'PRODUCTION',
}

export type Service = {
  __typename?: 'Service'
  id: Scalars['ID']
  owner: Scalars['String']
  title: Scalars['String']
  summary: Scalars['String']
  description: Scalars['String']
  pricing: Array<PricingCategory>
  data: Array<DataCategory>
  type: Array<TypeCategory>
  access: Array<AccessCategory>
  environments: Array<ServiceEnvironment>
}

export enum AccessCategory {
  Xroad = 'XROAD',
  Apigw = 'APIGW',
}

export type ApiCatalogue = {
  __typename?: 'ApiCatalogue'
  services: Array<Service>
  pageInfo?: Maybe<PageInfo>
}

export type AudienceAndScope = {
  __typename?: 'AudienceAndScope'
  audience: Scalars['String']
  scope: Scalars['String']
}

export type ClientCredentials = {
  __typename?: 'ClientCredentials'
  clientId: Scalars['String']
  clientSecret: Scalars['String']
  providerId: Scalars['String']
}

export type TestResult = {
  __typename?: 'TestResult'
  id: Scalars['String']
  isValid: Scalars['Boolean']
  message?: Maybe<Scalars['String']>
}

export type Contact = {
  __typename?: 'Contact'
  id: Scalars['String']
  name: Scalars['String']
  email: Scalars['String']
  phoneNumber: Scalars['String']
  created: Scalars['DateTime']
  modified: Scalars['DateTime']
}

export type Helpdesk = {
  __typename?: 'Helpdesk'
  id: Scalars['String']
  email: Scalars['String']
  phoneNumber: Scalars['String']
  created: Scalars['DateTime']
  modified: Scalars['DateTime']
}

export type Provider = {
  __typename?: 'Provider'
  id: Scalars['String']
  organisationId?: Maybe<Scalars['String']>
  endpoint?: Maybe<Scalars['String']>
  endpointType?: Maybe<Scalars['String']>
  apiScope?: Maybe<Scalars['String']>
  xroad?: Maybe<Scalars['Boolean']>
  created: Scalars['DateTime']
  modified: Scalars['DateTime']
}

export type Organisation = {
  __typename?: 'Organisation'
  id: Scalars['String']
  nationalId: Scalars['String']
  name: Scalars['String']
  address?: Maybe<Scalars['String']>
  email?: Maybe<Scalars['String']>
  phoneNumber?: Maybe<Scalars['String']>
  created: Scalars['DateTime']
  modified: Scalars['DateTime']
  administrativeContact?: Maybe<Contact>
  technicalContact?: Maybe<Contact>
  helpdesk?: Maybe<Helpdesk>
  providers?: Maybe<Array<Provider>>
}

export type ProviderStatistics = {
  __typename?: 'ProviderStatistics'
  published: Scalars['Float']
  notifications: Scalars['Float']
  opened: Scalars['Float']
}

export type Homestay = {
  __typename?: 'Homestay'
  registrationNumber?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  address?: Maybe<Scalars['String']>
  manager?: Maybe<Scalars['String']>
  year?: Maybe<Scalars['Float']>
  city?: Maybe<Scalars['String']>
  guests?: Maybe<Scalars['Float']>
  rooms?: Maybe<Scalars['Float']>
  propertyId?: Maybe<Scalars['String']>
  apartmentId?: Maybe<Scalars['String']>
}

export type CurrentUserCompanies = {
  __typename?: 'CurrentUserCompanies'
  nationalId: Scalars['String']
  name: Scalars['String']
  operationalForm: Scalars['String']
  companyStatus: Scalars['String']
  isPartOfBoardOfDirectors: Scalars['Boolean']
  hasProcuration: Scalars['Boolean']
}

export type IcelandicName = {
  __typename?: 'IcelandicName'
  id: Scalars['Float']
  icelandicName: Scalars['String']
  type?: Maybe<Scalars['String']>
  status?: Maybe<Scalars['String']>
  visible?: Maybe<Scalars['Boolean']>
  description?: Maybe<Scalars['String']>
  verdict?: Maybe<Scalars['String']>
  url?: Maybe<Scalars['String']>
  created: Scalars['DateTime']
  modified: Scalars['DateTime']
}

export type DeleteNameResponse = {
  __typename?: 'DeleteNameResponse'
  id: Scalars['Float']
}

export type EndorsementListOpen = {
  __typename?: 'EndorsementListOpen'
  id: Scalars['ID']
  title: Scalars['String']
  description?: Maybe<Scalars['String']>
}

export type EndorsementMetadata = {
  __typename?: 'EndorsementMetadata'
  fullName?: Maybe<Scalars['String']>
  address?: Maybe<Scalars['JSON']>
}

export type Endorsement = {
  __typename?: 'Endorsement'
  id: Scalars['ID']
  endorser: Scalars['String']
  endorsementListId: Scalars['String']
  endorsementList?: Maybe<EndorsementListOpen>
  meta: EndorsementMetadata
  created: Scalars['String']
  modified: Scalars['String']
}

export type ValidationRule = {
  __typename?: 'ValidationRule'
  type: ValidationRuleDtoTypeEnum
  value: Scalars['JSON']
}

export enum ValidationRuleDtoTypeEnum {
  MinAge = 'minAge',
  MinAgeAtDate = 'minAgeAtDate',
  UniqueWithinTags = 'uniqueWithinTags',
}

export type EndorsementList = {
  __typename?: 'EndorsementList'
  id: Scalars['ID']
  title: Scalars['String']
  description?: Maybe<Scalars['String']>
  closedDate?: Maybe<Scalars['String']>
  endorsementMeta: Array<EndorsementListEndorsementMetaEnum>
  tags: Array<EndorsementListTagsEnum>
  validationRules: Array<ValidationRule>
  owner: Scalars['String']
  endorsements: Array<Endorsement>
  created: Scalars['String']
  modified: Scalars['String']
}

export enum EndorsementListEndorsementMetaEnum {
  FullName = 'fullName',
  Address = 'address',
  SignedTags = 'signedTags',
}

export enum EndorsementListTagsEnum {
  PartyLetter2021 = 'partyLetter2021',
  PartyApplicationNordausturkjordaemi2021 = 'partyApplicationNordausturkjordaemi2021',
  PartyApplicationNordvesturkjordaemi2021 = 'partyApplicationNordvesturkjordaemi2021',
  PartyApplicationReykjavikurkjordaemiNordur2021 = 'partyApplicationReykjavikurkjordaemiNordur2021',
  PartyApplicationReykjavikurkjordaemiSudur2021 = 'partyApplicationReykjavikurkjordaemiSudur2021',
  PartyApplicationSudurkjordaemi2021 = 'partyApplicationSudurkjordaemi2021',
  PartyApplicationSudvesturkjordaemi2021 = 'partyApplicationSudvesturkjordaemi2021',
}

export type Query = {
  __typename?: 'Query'
  authActorDelegations: Array<AuthDelegation>
  getNamespace?: Maybe<Namespace>
  getAboutPage: AboutPage
  getAboutSubPage?: Maybe<AboutSubPage>
  getContentSlug?: Maybe<ContentSlug>
  getAlertBanner?: Maybe<AlertBanner>
  getGenericPage?: Maybe<GenericPage>
  getGenericOverviewPage?: Maybe<GenericOverviewPage>
  getAdgerdirPage?: Maybe<AdgerdirPage>
  getErrorPage?: Maybe<ErrorPage>
  getOrganization?: Maybe<Organization>
  getOrganizationPage?: Maybe<OrganizationPage>
  getOrganizationSubpage?: Maybe<OrganizationSubpage>
  getAuctions: Array<Auction>
  getAuction: Auction
  getAdgerdirPages: AdgerdirPages
  getOrganizations: Organizations
  getAdgerdirTags?: Maybe<AdgerdirTags>
  getOrganizationTags?: Maybe<OrganizationTags>
  getFrontpageSliderList?: Maybe<FrontpageSliderList>
  getAdgerdirFrontpage?: Maybe<AdgerdirFrontpage>
  getLifeEventPage?: Maybe<LifeEventPage>
  getLifeEvents: Array<LifeEventPage>
  getLifeEventsInCategory: Array<LifeEventPage>
  getUrl?: Maybe<Url>
  getTellUsAStory: TellUsAStory
  getHomepage: Homepage
  getFrontpage?: Maybe<Frontpage>
  getArticleCategories: Array<ArticleCategory>
  getSingleArticle?: Maybe<Article>
  getArticles: Array<Article>
  getSingleNews?: Maybe<News>
  getNewsDates: Array<Scalars['String']>
  getNews: NewsList
  getMenu?: Maybe<Menu>
  getGroupedMenu?: Maybe<GroupedMenu>
  getSubpageHeader?: Maybe<SubpageHeader>
  searchResults: SearchResult
  webSearchAutocomplete: WebSearchAutocomplete
  drivingLicense: DrivingLicense
  drivingLicenseDeprivationTypes: Array<DrivingLicenseType>
  drivingLicenseEntitlementTypes: Array<DrivingLicenseType>
  drivingLicenseRemarkTypes: Array<DrivingLicenseType>
  drivingLicensePenaltyPointStatus: PenaltyPointStatus
  educationLicense: Array<License>
  educationExamFamilyOverviews: Array<EducationExamFamilyOverview>
  educationExamResult: EducationExamResult
  applicationApplication?: Maybe<Application>
  applicationApplications?: Maybe<Array<Application>>
  getPresignedUrl?: Maybe<PresignedUrlResponse>
  getParentalLeavesEntitlements?: Maybe<ParentalLeaveEntitlement>
  getParentalLeaves?: Maybe<Array<ParentalLeave>>
  getParentalLeavesEstimatedPaymentPlan?: Maybe<Array<ParentalLeavePaymentPlan>>
  getParentalLeavesApplicationPaymentPlan?: Maybe<
    Array<ParentalLeavePaymentPlan>
  >
  getUnions?: Maybe<Array<Union>>
  getPensionFunds?: Maybe<Array<PensionFund>>
  getPrivatePensionFunds?: Maybe<Array<PensionFund>>
  getPregnancyStatus?: Maybe<PregnancyStatus>
  getDocument?: Maybe<DocumentDetails>
  listDocuments?: Maybe<Array<Document>>
  getDocumentCategories?: Maybe<Array<DocumentCategory>>
  getTranslations?: Maybe<Scalars['JSON']>
  getUserProfile?: Maybe<UserProfile>
  nationalRegistryFamily?: Maybe<Array<NationalRegistryFamilyMember>>
  nationalRegistryUser?: Maybe<NationalRegistryUser>
  healthInsuranceGetProfun: Scalars['String']
  healthInsuranceIsHealthInsured: Scalars['Boolean']
  healthInsuranceGetPendingApplication: Array<Scalars['Float']>
  getApiCatalogue: ApiCatalogue
  getApiServiceById?: Maybe<Service>
  getOpenApi: OpenApi
  getProviderOrganisations: Array<Organisation>
  getProviderOrganisation: Organisation
  organisationExists: Scalars['Boolean']
  getStatisticsTotal: ProviderStatistics
  getHomestays: Array<Homestay>
  rskCurrentUserCompanies: Array<CurrentUserCompanies>
  getAllIcelandicNames: Array<IcelandicName>
  getIcelandicNameById: IcelandicName
  getIcelandicNameByInitialLetter: Array<IcelandicName>
  getIcelandicNameBySearch: Array<IcelandicName>
  getRegulation: Scalars['JSON']
  getRegulations: Scalars['JSON']
  getRegulationsSearch: Scalars['JSON']
  getRegulationsYears: Scalars['JSON']
  getRegulationsMinistries: Scalars['JSON']
  getRegulationsLawChapters: Scalars['JSON']
  endorsementSystemGetSingleEndorsement?: Maybe<Endorsement>
  endorsementSystemGetEndorsements?: Maybe<Array<Endorsement>>
  endorsementSystemFindEndorsementLists: Array<EndorsementList>
  endorsementSystemGetSingleEndorsementList?: Maybe<EndorsementList>
  endorsementSystemUserEndorsements: Array<Endorsement>
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

export type QueryGetContentSlugArgs = {
  input: GetContentSlugInput
}

export type QueryGetAlertBannerArgs = {
  input: GetAlertBannerInput
}

export type QueryGetGenericPageArgs = {
  input: GetGenericPageInput
}

export type QueryGetGenericOverviewPageArgs = {
  input: GetGenericOverviewPageInput
}

export type QueryGetAdgerdirPageArgs = {
  input: GetAdgerdirPageInput
}

export type QueryGetErrorPageArgs = {
  input: GetErrorPageInput
}

export type QueryGetOrganizationArgs = {
  input: GetOrganizationInput
}

export type QueryGetOrganizationPageArgs = {
  input: GetOrganizationPageInput
}

export type QueryGetOrganizationSubpageArgs = {
  input: GetOrganizationSubpageInput
}

export type QueryGetAuctionsArgs = {
  input: GetAuctionsInput
}

export type QueryGetAuctionArgs = {
  input: GetAuctionInput
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

export type QueryGetLifeEventPageArgs = {
  input: GetLifeEventPageInput
}

export type QueryGetLifeEventsArgs = {
  input: GetLifeEventsInput
}

export type QueryGetLifeEventsInCategoryArgs = {
  input: GetLifeEventsInCategoryInput
}

export type QueryGetUrlArgs = {
  input: GetUrlInput
}

export type QueryGetTellUsAStoryArgs = {
  input: GetTellUsAStoryInput
}

export type QueryGetHomepageArgs = {
  input: GetHomepageInput
}

export type QueryGetFrontpageArgs = {
  input: GetFrontpageInput
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

export type QueryGetNewsDatesArgs = {
  input: GetNewsDatesInput
}

export type QueryGetNewsArgs = {
  input: GetNewsInput
}

export type QueryGetMenuArgs = {
  input: GetMenuInput
}

export type QueryGetGroupedMenuArgs = {
  input: GetSingleMenuInput
}

export type QueryGetSubpageHeaderArgs = {
  input: GetSubpageHeaderInput
}

export type QuerySearchResultsArgs = {
  query: SearcherInput
}

export type QueryWebSearchAutocompleteArgs = {
  input: WebSearchAutocompleteInput
}

export type QueryEducationExamResultArgs = {
  nationalId: Scalars['String']
}

export type QueryApplicationApplicationArgs = {
  input: ApplicationApplicationInput
  locale?: Maybe<Scalars['String']>
}

export type QueryApplicationApplicationsArgs = {
  input?: Maybe<ApplicationApplicationsInput>
  locale?: Maybe<Scalars['String']>
}

export type QueryGetPresignedUrlArgs = {
  input: GetPresignedUrlInput
}

export type QueryGetParentalLeavesEntitlementsArgs = {
  input: GetParentalLeavesEntitlementsInput
}

export type QueryGetParentalLeavesEstimatedPaymentPlanArgs = {
  input: GetParentalLeavesEstimatedPaymentPlanInput
}

export type QueryGetParentalLeavesApplicationPaymentPlanArgs = {
  input: GetParentalLeavesApplicationPaymentPlanInput
}

export type QueryGetDocumentArgs = {
  input: GetDocumentInput
}

export type QueryGetTranslationsArgs = {
  input: GetTranslationsInput
}

export type QueryGetApiCatalogueArgs = {
  input: GetApiCatalogueInput
}

export type QueryGetApiServiceByIdArgs = {
  input: GetApiServiceInput
}

export type QueryGetOpenApiArgs = {
  input: GetOpenApiInput
}

export type QueryGetProviderOrganisationArgs = {
  nationalId: Scalars['String']
}

export type QueryOrganisationExistsArgs = {
  nationalId: Scalars['String']
}

export type QueryGetStatisticsTotalArgs = {
  input?: Maybe<StatisticsInput>
}

export type QueryGetHomestaysArgs = {
  input: GetHomestaysInput
}

export type QueryGetIcelandicNameByIdArgs = {
  input: GetIcelandicNameByIdInput
}

export type QueryGetIcelandicNameByInitialLetterArgs = {
  input: GetIcelandicNameByInitialLetterInput
}

export type QueryGetIcelandicNameBySearchArgs = {
  input: GetIcelandicNameBySearchInput
}

export type QueryGetRegulationArgs = {
  input: GetRegulationInput
}

export type QueryGetRegulationsArgs = {
  input: GetRegulationsInput
}

export type QueryGetRegulationsSearchArgs = {
  input: GetRegulationsSearchInput
}

export type QueryGetRegulationsLawChaptersArgs = {
  input: GetRegulationsLawChaptersInput
}

export type QueryEndorsementSystemGetSingleEndorsementArgs = {
  input: FindEndorsementListInput
}

export type QueryEndorsementSystemGetEndorsementsArgs = {
  input: FindEndorsementListInput
}

export type QueryEndorsementSystemFindEndorsementListsArgs = {
  input: FindEndorsementListByTagDto
}

export type QueryEndorsementSystemGetSingleEndorsementListArgs = {
  input: FindEndorsementListInput
}

export type GetNamespaceInput = {
  namespace?: Maybe<Scalars['String']>
  lang?: Maybe<Scalars['String']>
}

export type GetAboutPageInput = {
  lang?: Maybe<Scalars['String']>
}

export type GetAboutSubPageInput = {
  url: Scalars['String']
  lang?: Maybe<Scalars['String']>
}

export type GetContentSlugInput = {
  id: Scalars['String']
  lang?: Maybe<Scalars['String']>
}

export type GetAlertBannerInput = {
  id: Scalars['String']
  lang?: Maybe<Scalars['String']>
}

export type GetGenericPageInput = {
  slug: Scalars['String']
  lang?: Maybe<Scalars['String']>
}

export type GetGenericOverviewPageInput = {
  pageIdentifier: Scalars['String']
  lang?: Maybe<Scalars['String']>
}

export type GetAdgerdirPageInput = {
  slug?: Maybe<Scalars['String']>
  lang?: Maybe<Scalars['String']>
}

export type GetErrorPageInput = {
  errorCode: Scalars['String']
  lang?: Maybe<Scalars['String']>
}

export type GetOrganizationInput = {
  slug?: Maybe<Scalars['String']>
  lang?: Maybe<Scalars['String']>
}

export type GetOrganizationPageInput = {
  slug: Scalars['String']
  lang?: Maybe<Scalars['String']>
}

export type GetOrganizationSubpageInput = {
  organizationSlug: Scalars['String']
  slug: Scalars['String']
  lang?: Maybe<Scalars['String']>
}

export type GetAuctionsInput = {
  lang?: Maybe<Scalars['String']>
  organization?: Maybe<Scalars['String']>
  year?: Maybe<Scalars['Float']>
  month?: Maybe<Scalars['Float']>
}

export type GetAuctionInput = {
  id: Scalars['String']
  lang?: Maybe<Scalars['String']>
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
  lang?: Maybe<Scalars['String']>
}

export type GetLifeEventPageInput = {
  slug: Scalars['String']
  lang?: Maybe<Scalars['String']>
}

export type GetLifeEventsInput = {
  lang?: Maybe<Scalars['String']>
}

export type GetLifeEventsInCategoryInput = {
  slug: Scalars['String']
  lang?: Maybe<Scalars['String']>
}

export type GetUrlInput = {
  slug: Scalars['String']
  lang?: Maybe<Scalars['String']>
}

export type GetTellUsAStoryInput = {
  lang?: Maybe<Scalars['String']>
}

export type GetHomepageInput = {
  lang?: Maybe<Scalars['String']>
}

export type GetFrontpageInput = {
  pageIdentifier: Scalars['String']
  lang?: Maybe<Scalars['String']>
}

export type GetArticleCategoriesInput = {
  lang?: Maybe<Scalars['String']>
  size?: Maybe<Scalars['Int']>
}

export type GetSingleArticleInput = {
  slug: Scalars['String']
  lang?: Maybe<Scalars['String']>
}

export type GetArticlesInput = {
  lang?: Maybe<Scalars['String']>
  category?: Maybe<Scalars['String']>
  organization?: Maybe<Scalars['String']>
  size?: Maybe<Scalars['Int']>
  sort?: Maybe<SortField>
}

export enum SortField {
  Title = 'TITLE',
  Popular = 'POPULAR',
}

export type GetSingleNewsInput = {
  slug: Scalars['String']
  lang?: Maybe<Scalars['String']>
}

export type GetNewsDatesInput = {
  lang?: Maybe<Scalars['String']>
  order?: Maybe<Scalars['String']>
  tag?: Maybe<Scalars['String']>
}

export type GetNewsInput = {
  lang?: Maybe<Scalars['String']>
  year?: Maybe<Scalars['Int']>
  month?: Maybe<Scalars['Int']>
  order?: Maybe<Scalars['String']>
  page?: Maybe<Scalars['Int']>
  size?: Maybe<Scalars['Int']>
  tag?: Maybe<Scalars['String']>
}

export type GetMenuInput = {
  name: Scalars['String']
  lang?: Maybe<Scalars['String']>
}

export type GetSingleMenuInput = {
  id: Scalars['String']
  lang?: Maybe<Scalars['String']>
}

export type GetSubpageHeaderInput = {
  id: Scalars['String']
  lang?: Maybe<Scalars['String']>
}

export type SearcherInput = {
  queryString: Scalars['String']
  types?: Maybe<Array<SearchableContentTypes>>
  language?: Maybe<ContentLanguage>
  size?: Maybe<Scalars['Int']>
  page?: Maybe<Scalars['Int']>
  tags?: Maybe<Array<Tag>>
  countTag?: Maybe<SearchableTags>
  countTypes?: Maybe<Scalars['Boolean']>
}

export enum SearchableContentTypes {
  WebAboutPage = 'webAboutPage',
  WebArticle = 'webArticle',
  WebSubArticle = 'webSubArticle',
  WebLifeEventPage = 'webLifeEventPage',
  WebNews = 'webNews',
  WebAdgerdirPage = 'webAdgerdirPage',
}

export enum ContentLanguage {
  Is = 'is',
  En = 'en',
}

export type Tag = {
  type: SearchableTags
  key: Scalars['String']
}

export enum SearchableTags {
  Category = 'category',
}

export type WebSearchAutocompleteInput = {
  singleTerm: Scalars['String']
  language?: Maybe<ContentLanguage>
  size?: Maybe<Scalars['Int']>
}

export type ApplicationApplicationInput = {
  id: Scalars['String']
}

export type ApplicationApplicationsInput = {
  typeId?: Maybe<Array<Scalars['String']>>
  status?: Maybe<Array<Scalars['String']>>
}

export type GetPresignedUrlInput = {
  id: Scalars['String']
  type: Scalars['String']
}

export type GetParentalLeavesEntitlementsInput = {
  dateOfBirth: Scalars['String']
}

export type GetParentalLeavesEstimatedPaymentPlanInput = {
  dateOfBirth: Scalars['String']
  period: Array<Period>
}

export type Period = {
  from: Scalars['String']
  to: Scalars['String']
  ratio: Scalars['Float']
  approved: Scalars['Boolean']
  paid: Scalars['Boolean']
}

export type GetParentalLeavesApplicationPaymentPlanInput = {
  dateOfBirth: Scalars['String']
  applicationId: Scalars['String']
}

export type GetDocumentInput = {
  id: Scalars['String']
}

export type GetTranslationsInput = {
  namespaces: Array<Scalars['String']>
  lang: Scalars['String']
}

export type GetApiCatalogueInput = {
  limit?: Maybe<Scalars['Int']>
  cursor?: Maybe<Scalars['String']>
  query?: Maybe<Scalars['String']>
  pricing?: Maybe<Array<Scalars['String']>>
  data?: Maybe<Array<Scalars['String']>>
  type?: Maybe<Array<Scalars['String']>>
  access?: Maybe<Array<Scalars['String']>>
}

export type GetApiServiceInput = {
  id: Scalars['ID']
}

export type GetOpenApiInput = {
  instance: Scalars['String']
  memberClass: Scalars['String']
  memberCode: Scalars['String']
  subsystemCode: Scalars['String']
  serviceCode: Scalars['String']
}

export type StatisticsInput = {
  organisationId?: Maybe<Scalars['String']>
  /** Date format: YYYY-MM-DD */
  fromDate?: Maybe<Scalars['String']>
  /** Date format: YYYY-MM-DD */
  toDate?: Maybe<Scalars['String']>
}

export type GetHomestaysInput = {
  year?: Maybe<Scalars['Float']>
}

export type GetIcelandicNameByIdInput = {
  id: Scalars['Float']
}

export type GetIcelandicNameByInitialLetterInput = {
  initialLetter: Scalars['String']
}

export type GetIcelandicNameBySearchInput = {
  q: Scalars['String']
}

export type GetRegulationInput = {
  viewType: RegulationViewTypes
  name: Scalars['String']
  date?: Maybe<Scalars['String']>
  isCustomDiff?: Maybe<Scalars['Boolean']>
  earlierDate?: Maybe<Scalars['String']>
}

export enum RegulationViewTypes {
  Current = 'current',
  Diff = 'diff',
  Original = 'original',
  D = 'd',
}

export type GetRegulationsInput = {
  type: Scalars['String']
  page?: Maybe<Scalars['Float']>
}

export type GetRegulationsSearchInput = {
  q?: Maybe<Scalars['String']>
  rn?: Maybe<Scalars['String']>
  ch?: Maybe<Scalars['String']>
  year?: Maybe<Scalars['Int']>
  yearTo?: Maybe<Scalars['Int']>
}

export type GetRegulationsLawChaptersInput = {
  tree?: Maybe<Scalars['Boolean']>
}

export type FindEndorsementListInput = {
  listId: Scalars['String']
}

export type FindEndorsementListByTagDto = {
  tag: EndorsementListControllerFindByTagTagEnum
}

export enum EndorsementListControllerFindByTagTagEnum {
  PartyLetter2021 = 'partyLetter2021',
  PartyApplicationNordausturkjordaemi2021 = 'partyApplicationNordausturkjordaemi2021',
  PartyApplicationNordvesturkjordaemi2021 = 'partyApplicationNordvesturkjordaemi2021',
  PartyApplicationReykjavikurkjordaemiNordur2021 = 'partyApplicationReykjavikurkjordaemiNordur2021',
  PartyApplicationReykjavikurkjordaemiSudur2021 = 'partyApplicationReykjavikurkjordaemiSudur2021',
  PartyApplicationSudurkjordaemi2021 = 'partyApplicationSudurkjordaemi2021',
  PartyApplicationSudvesturkjordaemi2021 = 'partyApplicationSudvesturkjordaemi2021',
}

export type Mutation = {
  __typename?: 'Mutation'
  fetchEducationSignedLicenseUrl?: Maybe<SignedLicense>
  createApplication?: Maybe<Application>
  updateApplication?: Maybe<Application>
  updateApplicationExternalData?: Maybe<Application>
  addAttachment?: Maybe<Application>
  deleteAttachment?: Maybe<Application>
  submitApplication?: Maybe<Application>
  assignApplication?: Maybe<Application>
  createPdfPresignedUrl?: Maybe<PresignedUrlResponse>
  requestFileSignature?: Maybe<RequestFileSignatureResponse>
  uploadSignedFile?: Maybe<UploadSignedFileResponse>
  createUploadUrl: PresignedPost
  contactUs: CommunicationResponse
  tellUsAStory: CommunicationResponse
  contactUsZendeskTicket: CommunicationResponse
  createProfile?: Maybe<UserProfile>
  updateProfile?: Maybe<UserProfile>
  createSmsVerification?: Maybe<Response>
  resendEmailVerification?: Maybe<Response>
  confirmSmsVerification?: Maybe<ConfirmResponse>
  confirmEmailVerification?: Maybe<ConfirmResponse>
  updateOrganisation: Organisation
  createAdministrativeContact?: Maybe<Contact>
  updateAdministrativeContact: Contact
  createTechnicalContact?: Maybe<Contact>
  updateTechnicalContact: Contact
  createHelpdesk?: Maybe<Helpdesk>
  updateHelpdesk: Helpdesk
  createTestProvider: ClientCredentials
  updateTestEndpoint: AudienceAndScope
  runEndpointTests: Array<TestResult>
  createProvider: ClientCredentials
  updateEndpoint: AudienceAndScope
  updateIcelandicNameById: IcelandicName
  createIcelandicName: IcelandicName
  deleteIcelandicNameById: DeleteNameResponse
  endorsementSystemEndorseList: Endorsement
  endorsementSystemBulkEndorseList: Array<Endorsement>
  endorsementSystemUnendorseList: Scalars['Boolean']
  endorsementSystemCloseEndorsementList: EndorsementList
  endorsementSystemCreateEndorsementList: EndorsementList
}

export type MutationFetchEducationSignedLicenseUrlArgs = {
  input: FetchEducationSignedLicenseUrlInput
}

export type MutationCreateApplicationArgs = {
  input: CreateApplicationInput
}

export type MutationUpdateApplicationArgs = {
  input: UpdateApplicationInput
  locale?: Maybe<Scalars['String']>
}

export type MutationUpdateApplicationExternalDataArgs = {
  input: UpdateApplicationExternalDataInput
  locale?: Maybe<Scalars['String']>
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

export type MutationAssignApplicationArgs = {
  input: AssignApplicationInput
}

export type MutationCreatePdfPresignedUrlArgs = {
  input: CreatePdfInput
}

export type MutationRequestFileSignatureArgs = {
  input: RequestFileSignatureInput
}

export type MutationUploadSignedFileArgs = {
  input: UploadSignedFileInput
}

export type MutationCreateUploadUrlArgs = {
  filename: Scalars['String']
}

export type MutationContactUsArgs = {
  input: ContactUsInput
}

export type MutationTellUsAStoryArgs = {
  input: TellUsAStoryInput
}

export type MutationContactUsZendeskTicketArgs = {
  input: ContactUsInput
}

export type MutationCreateProfileArgs = {
  input: CreateUserProfileInput
}

export type MutationUpdateProfileArgs = {
  input: UpdateUserProfileInput
}

export type MutationCreateSmsVerificationArgs = {
  input: CreateSmsVerificationInput
}

export type MutationConfirmSmsVerificationArgs = {
  input: ConfirmSmsVerificationInput
}

export type MutationConfirmEmailVerificationArgs = {
  input: ConfirmEmailVerificationInput
}

export type MutationUpdateOrganisationArgs = {
  input: UpdateOrganisationInput
  id: Scalars['String']
}

export type MutationCreateAdministrativeContactArgs = {
  input: CreateContactInput
  organisationId: Scalars['String']
}

export type MutationUpdateAdministrativeContactArgs = {
  contact: UpdateContactInput
  administrativeContactId: Scalars['String']
  organisationId: Scalars['String']
}

export type MutationCreateTechnicalContactArgs = {
  input: CreateContactInput
  organisationId: Scalars['String']
}

export type MutationUpdateTechnicalContactArgs = {
  contact: UpdateContactInput
  technicalContactId: Scalars['String']
  organisationId: Scalars['String']
}

export type MutationCreateHelpdeskArgs = {
  input: CreateHelpdeskInput
  organisationId: Scalars['String']
}

export type MutationUpdateHelpdeskArgs = {
  helpdesk: UpdateHelpdeskInput
  helpdeskId: Scalars['String']
  organisationId: Scalars['String']
}

export type MutationCreateTestProviderArgs = {
  input: CreateProviderInput
}

export type MutationUpdateTestEndpointArgs = {
  input: UpdateEndpointInput
}

export type MutationRunEndpointTestsArgs = {
  input: RunEndpointTestsInput
}

export type MutationCreateProviderArgs = {
  input: CreateProviderInput
}

export type MutationUpdateEndpointArgs = {
  input: UpdateEndpointInput
}

export type MutationUpdateIcelandicNameByIdArgs = {
  input: UpdateIcelandicNameInput
}

export type MutationCreateIcelandicNameArgs = {
  input: CreateIcelandicNameInput
}

export type MutationDeleteIcelandicNameByIdArgs = {
  input: DeleteIcelandicNameByIdInput
}

export type MutationEndorsementSystemEndorseListArgs = {
  input: FindEndorsementListInput
}

export type MutationEndorsementSystemBulkEndorseListArgs = {
  input: BulkEndorseListInput
}

export type MutationEndorsementSystemUnendorseListArgs = {
  input: FindEndorsementListInput
}

export type MutationEndorsementSystemCloseEndorsementListArgs = {
  input: FindEndorsementListInput
}

export type MutationEndorsementSystemCreateEndorsementListArgs = {
  input: CreateEndorsementListDto
}

export type FetchEducationSignedLicenseUrlInput = {
  licenseId: Scalars['String']
}

export type CreateApplicationInput = {
  typeId: CreateApplicationDtoTypeIdEnum
}

export enum CreateApplicationDtoTypeIdEnum {
  ExampleForm = 'ExampleForm',
  Passport = 'Passport',
  DrivingLessons = 'DrivingLessons',
  DrivingLicense = 'DrivingLicense',
  ParentalLeave = 'ParentalLeave',
  MetaApplication = 'MetaApplication',
  DocumentProviderOnboarding = 'DocumentProviderOnboarding',
  HealthInsurance = 'HealthInsurance',
  ChildrenResidenceChange = 'ChildrenResidenceChange',
  DataProtectionAuthorityComplaint = 'DataProtectionAuthorityComplaint',
  PartyLetter = 'PartyLetter',
  LoginService = 'LoginService',
  PartyApplication = 'PartyApplication',
  InstitutionCollaboration = 'InstitutionCollaboration',
  FundingGovernmentProjects = 'FundingGovernmentProjects',
  PublicDebtPaymentPlan = 'PublicDebtPaymentPlan',
  JointCustodyAgreement = 'JointCustodyAgreement',
}

export type UpdateApplicationInput = {
  id: Scalars['String']
  applicant?: Maybe<Scalars['String']>
  assignee?: Maybe<Scalars['String']>
  attachments?: Maybe<Scalars['JSON']>
  answers?: Maybe<Scalars['JSON']>
}

export type UpdateApplicationExternalDataInput = {
  id: Scalars['String']
  dataProviders: Array<DataProvider>
}

export type DataProvider = {
  id: Scalars['String']
  type: Scalars['String']
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

export type AssignApplicationInput = {
  token: Scalars['String']
}

export type CreatePdfInput = {
  id: Scalars['String']
  type: CreatePdfDtoTypeEnum
}

export enum CreatePdfDtoTypeEnum {
  ChildrenResidenceChange = 'ChildrenResidenceChange',
  JointCustodyAgreement = 'JointCustodyAgreement',
}

export type RequestFileSignatureInput = {
  id: Scalars['String']
  type: RequestFileSignatureDtoTypeEnum
}

export enum RequestFileSignatureDtoTypeEnum {
  ChildrenResidenceChange = 'ChildrenResidenceChange',
  JointCustodyAgreement = 'JointCustodyAgreement',
}

export type UploadSignedFileInput = {
  id: Scalars['String']
  documentToken: Scalars['String']
  type: UploadSignedFileDtoTypeEnum
}

export enum UploadSignedFileDtoTypeEnum {
  ChildrenResidenceChange = 'ChildrenResidenceChange',
  JointCustodyAgreement = 'JointCustodyAgreement',
}

export type ContactUsInput = {
  name: Scalars['String']
  phone?: Maybe<Scalars['String']>
  email: Scalars['String']
  subject?: Maybe<Scalars['String']>
  message: Scalars['String']
}

export type TellUsAStoryInput = {
  organization: Scalars['String']
  dateOfStory: Scalars['String']
  subject?: Maybe<Scalars['String']>
  message: Scalars['String']
  name: Scalars['String']
  email: Scalars['String']
  publicationAllowed?: Maybe<Scalars['Boolean']>
}

export type CreateUserProfileInput = {
  mobilePhoneNumber?: Maybe<Scalars['String']>
  locale?: Maybe<Scalars['String']>
  email?: Maybe<Scalars['String']>
}

export type UpdateUserProfileInput = {
  mobilePhoneNumber?: Maybe<Scalars['String']>
  locale?: Maybe<Scalars['String']>
  email?: Maybe<Scalars['String']>
}

export type CreateSmsVerificationInput = {
  mobilePhoneNumber: Scalars['String']
}

export type ConfirmSmsVerificationInput = {
  code: Scalars['String']
}

export type ConfirmEmailVerificationInput = {
  hash: Scalars['String']
}

export type UpdateOrganisationInput = {
  nationalId?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  address?: Maybe<Scalars['String']>
  email?: Maybe<Scalars['String']>
  phoneNumber?: Maybe<Scalars['String']>
}

export type CreateContactInput = {
  name: Scalars['String']
  email: Scalars['String']
  phoneNumber: Scalars['String']
}

export type UpdateContactInput = {
  name?: Maybe<Scalars['String']>
  address?: Maybe<Scalars['String']>
  email?: Maybe<Scalars['String']>
  phoneNumber?: Maybe<Scalars['String']>
}

export type CreateHelpdeskInput = {
  email: Scalars['String']
  phoneNumber: Scalars['String']
}

export type UpdateHelpdeskInput = {
  email?: Maybe<Scalars['String']>
  phoneNumber?: Maybe<Scalars['String']>
}

export type CreateProviderInput = {
  nationalId: Scalars['String']
  clientName: Scalars['String']
}

export type UpdateEndpointInput = {
  nationalId: Scalars['String']
  endpoint: Scalars['String']
  providerId: Scalars['String']
  xroad?: Maybe<Scalars['Boolean']>
}

export type RunEndpointTestsInput = {
  nationalId: Scalars['String']
  recipient: Scalars['String']
  documentId: Scalars['String']
  providerId: Scalars['String']
}

export type UpdateIcelandicNameInput = {
  id: Scalars['Float']
  body: CreateIcelandicNameInput
}

export type CreateIcelandicNameInput = {
  icelandicName: Scalars['String']
  type: Scalars['String']
  status: Scalars['String']
  verdict?: Maybe<Scalars['String']>
  description?: Maybe<Scalars['String']>
  visible: Scalars['Boolean']
  url?: Maybe<Scalars['String']>
}

export type DeleteIcelandicNameByIdInput = {
  id: Scalars['Float']
}

export type BulkEndorseListInput = {
  listId: Scalars['String']
  nationalIds: Array<Scalars['String']>
}

export type CreateEndorsementListDto = {
  title: Scalars['String']
  description: Scalars['String']
  endorsementMeta: Array<EndorsementListDtoEndorsementMetaEnum>
  tags: Array<EndorsementListDtoTagsEnum>
  validationRules: Array<ValidationRuleInput>
}

export enum EndorsementListDtoEndorsementMetaEnum {
  FullName = 'fullName',
  Address = 'address',
  SignedTags = 'signedTags',
}

export enum EndorsementListDtoTagsEnum {
  PartyLetter2021 = 'partyLetter2021',
  PartyApplicationNordausturkjordaemi2021 = 'partyApplicationNordausturkjordaemi2021',
  PartyApplicationNordvesturkjordaemi2021 = 'partyApplicationNordvesturkjordaemi2021',
  PartyApplicationReykjavikurkjordaemiNordur2021 = 'partyApplicationReykjavikurkjordaemiNordur2021',
  PartyApplicationReykjavikurkjordaemiSudur2021 = 'partyApplicationReykjavikurkjordaemiSudur2021',
  PartyApplicationSudurkjordaemi2021 = 'partyApplicationSudurkjordaemi2021',
  PartyApplicationSudvesturkjordaemi2021 = 'partyApplicationSudvesturkjordaemi2021',
}

export type ValidationRuleInput = {
  type: ValidationRuleDtoTypeEnum
  value: Scalars['JSON']
}

export type ApplicationFragment = { __typename?: 'Application' } & Pick<
  Application,
  | 'id'
  | 'created'
  | 'modified'
  | 'applicant'
  | 'assignees'
  | 'state'
  | 'stateDescription'
  | 'typeId'
  | 'name'
  | 'progress'
  | 'status'
>

export type ConfirmEmailVerificationMutationVariables = Exact<{
  input: ConfirmEmailVerificationInput
}>

export type ConfirmEmailVerificationMutation = { __typename?: 'Mutation' } & {
  confirmEmailVerification?: Maybe<
    { __typename?: 'ConfirmResponse' } & Pick<
      ConfirmResponse,
      'message' | 'confirmed'
    >
  >
}

export type ConfirmSmsVerificationMutationVariables = Exact<{
  input: ConfirmSmsVerificationInput
}>

export type ConfirmSmsVerificationMutation = { __typename?: 'Mutation' } & {
  confirmSmsVerification?: Maybe<
    { __typename?: 'ConfirmResponse' } & Pick<
      ConfirmResponse,
      'message' | 'confirmed'
    >
  >
}

export type CreateSmsVerificationMutationVariables = Exact<{
  input: CreateSmsVerificationInput
}>

export type CreateSmsVerificationMutation = { __typename?: 'Mutation' } & {
  createSmsVerification?: Maybe<
    { __typename?: 'Response' } & Pick<Response, 'created'>
  >
}

export type CreateProfileMutationVariables = Exact<{
  input: CreateUserProfileInput
}>

export type CreateProfileMutation = { __typename?: 'Mutation' } & {
  createProfile?: Maybe<
    { __typename?: 'UserProfile' } & Pick<
      UserProfile,
      'nationalId' | 'mobilePhoneNumber' | 'locale' | 'email'
    >
  >
}

export type ResendEmailVerificationMutationVariables = Exact<{
  [key: string]: never
}>

export type ResendEmailVerificationMutation = { __typename?: 'Mutation' } & {
  resendEmailVerification?: Maybe<
    { __typename?: 'Response' } & Pick<Response, 'created'>
  >
}

export type UpdateProfileMutationVariables = Exact<{
  input: UpdateUserProfileInput
}>

export type UpdateProfileMutation = { __typename?: 'Mutation' } & {
  updateProfile?: Maybe<
    { __typename?: 'UserProfile' } & Pick<
      UserProfile,
      'nationalId' | 'mobilePhoneNumber' | 'locale' | 'email'
    >
  >
}

export type ApplicationApplicationsQueryVariables = Exact<{
  input?: Maybe<ApplicationApplicationsInput>
  locale: Scalars['String']
}>

export type ApplicationApplicationsQuery = { __typename?: 'Query' } & {
  applicationApplications?: Maybe<
    Array<{ __typename?: 'Application' } & ApplicationFragment>
  >
}

export type ActorDelegationsQueryVariables = Exact<{ [key: string]: never }>

export type ActorDelegationsQuery = { __typename?: 'Query' } & {
  authActorDelegations: Array<
    | ({ __typename?: 'AuthLegalGuardianDelegation' } & Pick<
        AuthLegalGuardianDelegation,
        'fromNationalId' | 'fromName'
      >)
    | ({ __typename?: 'AuthProcuringHolderDelegation' } & Pick<
        AuthProcuringHolderDelegation,
        'fromNationalId' | 'fromName'
      >)
    | ({ __typename?: 'AuthCustomDelegation' } & Pick<
        AuthCustomDelegation,
        'fromNationalId' | 'fromName'
      >)
  >
}

export type GetDocumentQueryVariables = Exact<{
  input: GetDocumentInput
}>

export type GetDocumentQuery = { __typename?: 'Query' } & {
  getDocument?: Maybe<
    { __typename?: 'DocumentDetails' } & Pick<
      DocumentDetails,
      'content' | 'url' | 'fileType'
    >
  >
}

export type GetDocumentCategoriesQueryVariables = Exact<{
  [key: string]: never
}>

export type GetDocumentCategoriesQuery = { __typename?: 'Query' } & {
  getDocumentCategories?: Maybe<
    Array<
      { __typename?: 'DocumentCategory' } & Pick<
        DocumentCategory,
        'id' | 'name'
      >
    >
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

export type GetUserProfileQueryVariables = Exact<{ [key: string]: never }>

export type GetUserProfileQuery = { __typename?: 'Query' } & {
  getUserProfile?: Maybe<
    { __typename?: 'UserProfile' } & Pick<
      UserProfile,
      | 'nationalId'
      | 'mobilePhoneNumber'
      | 'locale'
      | 'email'
      | 'emailVerified'
      | 'mobilePhoneNumberVerified'
    >
  >
}

export type ListDocumentsQueryVariables = Exact<{ [key: string]: never }>

export type ListDocumentsQuery = { __typename?: 'Query' } & {
  listDocuments?: Maybe<
    Array<
      { __typename?: 'Document' } & Pick<
        Document,
        | 'id'
        | 'subject'
        | 'senderName'
        | 'senderNatReg'
        | 'date'
        | 'fileType'
        | 'url'
      >
    >
  >
}

export const ApplicationFragmentDoc = gql`
  fragment Application on Application {
    id
    created
    modified
    applicant
    assignees
    state
    stateDescription
    typeId
    name
    progress
    status
  }
`
export const ConfirmEmailVerificationDocument = gql`
  mutation confirmEmailVerification($input: ConfirmEmailVerificationInput!) {
    confirmEmailVerification(input: $input) {
      message
      confirmed
    }
  }
`
export type ConfirmEmailVerificationMutationFn = ApolloReactCommon.MutationFunction<
  ConfirmEmailVerificationMutation,
  ConfirmEmailVerificationMutationVariables
>

/**
 * __useConfirmEmailVerificationMutation__
 *
 * To run a mutation, you first call `useConfirmEmailVerificationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useConfirmEmailVerificationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [confirmEmailVerificationMutation, { data, loading, error }] = useConfirmEmailVerificationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useConfirmEmailVerificationMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    ConfirmEmailVerificationMutation,
    ConfirmEmailVerificationMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    ConfirmEmailVerificationMutation,
    ConfirmEmailVerificationMutationVariables
  >(ConfirmEmailVerificationDocument, baseOptions)
}
export type ConfirmEmailVerificationMutationHookResult = ReturnType<
  typeof useConfirmEmailVerificationMutation
>
export type ConfirmEmailVerificationMutationResult = ApolloReactCommon.MutationResult<ConfirmEmailVerificationMutation>
export type ConfirmEmailVerificationMutationOptions = ApolloReactCommon.BaseMutationOptions<
  ConfirmEmailVerificationMutation,
  ConfirmEmailVerificationMutationVariables
>
export const ConfirmSmsVerificationDocument = gql`
  mutation confirmSmsVerification($input: ConfirmSmsVerificationInput!) {
    confirmSmsVerification(input: $input) {
      message
      confirmed
    }
  }
`
export type ConfirmSmsVerificationMutationFn = ApolloReactCommon.MutationFunction<
  ConfirmSmsVerificationMutation,
  ConfirmSmsVerificationMutationVariables
>

/**
 * __useConfirmSmsVerificationMutation__
 *
 * To run a mutation, you first call `useConfirmSmsVerificationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useConfirmSmsVerificationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [confirmSmsVerificationMutation, { data, loading, error }] = useConfirmSmsVerificationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useConfirmSmsVerificationMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    ConfirmSmsVerificationMutation,
    ConfirmSmsVerificationMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    ConfirmSmsVerificationMutation,
    ConfirmSmsVerificationMutationVariables
  >(ConfirmSmsVerificationDocument, baseOptions)
}
export type ConfirmSmsVerificationMutationHookResult = ReturnType<
  typeof useConfirmSmsVerificationMutation
>
export type ConfirmSmsVerificationMutationResult = ApolloReactCommon.MutationResult<ConfirmSmsVerificationMutation>
export type ConfirmSmsVerificationMutationOptions = ApolloReactCommon.BaseMutationOptions<
  ConfirmSmsVerificationMutation,
  ConfirmSmsVerificationMutationVariables
>
export const CreateSmsVerificationDocument = gql`
  mutation createSmsVerification($input: CreateSmsVerificationInput!) {
    createSmsVerification(input: $input) {
      created
    }
  }
`
export type CreateSmsVerificationMutationFn = ApolloReactCommon.MutationFunction<
  CreateSmsVerificationMutation,
  CreateSmsVerificationMutationVariables
>

/**
 * __useCreateSmsVerificationMutation__
 *
 * To run a mutation, you first call `useCreateSmsVerificationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSmsVerificationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSmsVerificationMutation, { data, loading, error }] = useCreateSmsVerificationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSmsVerificationMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateSmsVerificationMutation,
    CreateSmsVerificationMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    CreateSmsVerificationMutation,
    CreateSmsVerificationMutationVariables
  >(CreateSmsVerificationDocument, baseOptions)
}
export type CreateSmsVerificationMutationHookResult = ReturnType<
  typeof useCreateSmsVerificationMutation
>
export type CreateSmsVerificationMutationResult = ApolloReactCommon.MutationResult<CreateSmsVerificationMutation>
export type CreateSmsVerificationMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CreateSmsVerificationMutation,
  CreateSmsVerificationMutationVariables
>
export const CreateProfileDocument = gql`
  mutation createProfile($input: CreateUserProfileInput!) {
    createProfile(input: $input) {
      nationalId
      mobilePhoneNumber
      locale
      email
    }
  }
`
export type CreateProfileMutationFn = ApolloReactCommon.MutationFunction<
  CreateProfileMutation,
  CreateProfileMutationVariables
>

/**
 * __useCreateProfileMutation__
 *
 * To run a mutation, you first call `useCreateProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProfileMutation, { data, loading, error }] = useCreateProfileMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateProfileMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateProfileMutation,
    CreateProfileMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    CreateProfileMutation,
    CreateProfileMutationVariables
  >(CreateProfileDocument, baseOptions)
}
export type CreateProfileMutationHookResult = ReturnType<
  typeof useCreateProfileMutation
>
export type CreateProfileMutationResult = ApolloReactCommon.MutationResult<CreateProfileMutation>
export type CreateProfileMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CreateProfileMutation,
  CreateProfileMutationVariables
>
export const ResendEmailVerificationDocument = gql`
  mutation resendEmailVerification {
    resendEmailVerification {
      created
    }
  }
`
export type ResendEmailVerificationMutationFn = ApolloReactCommon.MutationFunction<
  ResendEmailVerificationMutation,
  ResendEmailVerificationMutationVariables
>

/**
 * __useResendEmailVerificationMutation__
 *
 * To run a mutation, you first call `useResendEmailVerificationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResendEmailVerificationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resendEmailVerificationMutation, { data, loading, error }] = useResendEmailVerificationMutation({
 *   variables: {
 *   },
 * });
 */
export function useResendEmailVerificationMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    ResendEmailVerificationMutation,
    ResendEmailVerificationMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    ResendEmailVerificationMutation,
    ResendEmailVerificationMutationVariables
  >(ResendEmailVerificationDocument, baseOptions)
}
export type ResendEmailVerificationMutationHookResult = ReturnType<
  typeof useResendEmailVerificationMutation
>
export type ResendEmailVerificationMutationResult = ApolloReactCommon.MutationResult<ResendEmailVerificationMutation>
export type ResendEmailVerificationMutationOptions = ApolloReactCommon.BaseMutationOptions<
  ResendEmailVerificationMutation,
  ResendEmailVerificationMutationVariables
>
export const UpdateProfileDocument = gql`
  mutation updateProfile($input: UpdateUserProfileInput!) {
    updateProfile(input: $input) {
      nationalId
      mobilePhoneNumber
      locale
      email
    }
  }
`
export type UpdateProfileMutationFn = ApolloReactCommon.MutationFunction<
  UpdateProfileMutation,
  UpdateProfileMutationVariables
>

/**
 * __useUpdateProfileMutation__
 *
 * To run a mutation, you first call `useUpdateProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProfileMutation, { data, loading, error }] = useUpdateProfileMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateProfileMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UpdateProfileMutation,
    UpdateProfileMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    UpdateProfileMutation,
    UpdateProfileMutationVariables
  >(UpdateProfileDocument, baseOptions)
}
export type UpdateProfileMutationHookResult = ReturnType<
  typeof useUpdateProfileMutation
>
export type UpdateProfileMutationResult = ApolloReactCommon.MutationResult<UpdateProfileMutation>
export type UpdateProfileMutationOptions = ApolloReactCommon.BaseMutationOptions<
  UpdateProfileMutation,
  UpdateProfileMutationVariables
>
export const ApplicationApplicationsDocument = gql`
  query ApplicationApplications(
    $input: ApplicationApplicationsInput
    $locale: String!
  ) {
    applicationApplications(input: $input, locale: $locale) {
      ...Application
    }
  }
  ${ApplicationFragmentDoc}
`

/**
 * __useApplicationApplicationsQuery__
 *
 * To run a query within a React component, call `useApplicationApplicationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useApplicationApplicationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useApplicationApplicationsQuery({
 *   variables: {
 *      input: // value for 'input'
 *      locale: // value for 'locale'
 *   },
 * });
 */
export function useApplicationApplicationsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    ApplicationApplicationsQuery,
    ApplicationApplicationsQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    ApplicationApplicationsQuery,
    ApplicationApplicationsQueryVariables
  >(ApplicationApplicationsDocument, baseOptions)
}
export function useApplicationApplicationsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ApplicationApplicationsQuery,
    ApplicationApplicationsQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    ApplicationApplicationsQuery,
    ApplicationApplicationsQueryVariables
  >(ApplicationApplicationsDocument, baseOptions)
}
export type ApplicationApplicationsQueryHookResult = ReturnType<
  typeof useApplicationApplicationsQuery
>
export type ApplicationApplicationsLazyQueryHookResult = ReturnType<
  typeof useApplicationApplicationsLazyQuery
>
export type ApplicationApplicationsQueryResult = ApolloReactCommon.QueryResult<
  ApplicationApplicationsQuery,
  ApplicationApplicationsQueryVariables
>
export const ActorDelegationsDocument = gql`
  query ActorDelegations {
    authActorDelegations {
      fromNationalId
      fromName
    }
  }
`

/**
 * __useActorDelegationsQuery__
 *
 * To run a query within a React component, call `useActorDelegationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useActorDelegationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useActorDelegationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useActorDelegationsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    ActorDelegationsQuery,
    ActorDelegationsQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    ActorDelegationsQuery,
    ActorDelegationsQueryVariables
  >(ActorDelegationsDocument, baseOptions)
}
export function useActorDelegationsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ActorDelegationsQuery,
    ActorDelegationsQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    ActorDelegationsQuery,
    ActorDelegationsQueryVariables
  >(ActorDelegationsDocument, baseOptions)
}
export type ActorDelegationsQueryHookResult = ReturnType<
  typeof useActorDelegationsQuery
>
export type ActorDelegationsLazyQueryHookResult = ReturnType<
  typeof useActorDelegationsLazyQuery
>
export type ActorDelegationsQueryResult = ApolloReactCommon.QueryResult<
  ActorDelegationsQuery,
  ActorDelegationsQueryVariables
>
export const GetDocumentDocument = gql`
  query GetDocument($input: GetDocumentInput!) {
    getDocument(input: $input) {
      content
      url
      fileType
    }
  }
`

/**
 * __useGetDocumentQuery__
 *
 * To run a query within a React component, call `useGetDocumentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDocumentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDocumentQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetDocumentQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetDocumentQuery,
    GetDocumentQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<GetDocumentQuery, GetDocumentQueryVariables>(
    GetDocumentDocument,
    baseOptions,
  )
}
export function useGetDocumentLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetDocumentQuery,
    GetDocumentQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    GetDocumentQuery,
    GetDocumentQueryVariables
  >(GetDocumentDocument, baseOptions)
}
export type GetDocumentQueryHookResult = ReturnType<typeof useGetDocumentQuery>
export type GetDocumentLazyQueryHookResult = ReturnType<
  typeof useGetDocumentLazyQuery
>
export type GetDocumentQueryResult = ApolloReactCommon.QueryResult<
  GetDocumentQuery,
  GetDocumentQueryVariables
>
export const GetDocumentCategoriesDocument = gql`
  query getDocumentCategories {
    getDocumentCategories {
      id
      name
    }
  }
`

/**
 * __useGetDocumentCategoriesQuery__
 *
 * To run a query within a React component, call `useGetDocumentCategoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDocumentCategoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDocumentCategoriesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetDocumentCategoriesQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetDocumentCategoriesQuery,
    GetDocumentCategoriesQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    GetDocumentCategoriesQuery,
    GetDocumentCategoriesQueryVariables
  >(GetDocumentCategoriesDocument, baseOptions)
}
export function useGetDocumentCategoriesLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetDocumentCategoriesQuery,
    GetDocumentCategoriesQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    GetDocumentCategoriesQuery,
    GetDocumentCategoriesQueryVariables
  >(GetDocumentCategoriesDocument, baseOptions)
}
export type GetDocumentCategoriesQueryHookResult = ReturnType<
  typeof useGetDocumentCategoriesQuery
>
export type GetDocumentCategoriesLazyQueryHookResult = ReturnType<
  typeof useGetDocumentCategoriesLazyQuery
>
export type GetDocumentCategoriesQueryResult = ApolloReactCommon.QueryResult<
  GetDocumentCategoriesQuery,
  GetDocumentCategoriesQueryVariables
>
export const GetMenuDocument = gql`
  query GetMenu($input: GetMenuInput!) {
    getMenu(input: $input) {
      title
      links {
        text
        url
      }
    }
  }
`

/**
 * __useGetMenuQuery__
 *
 * To run a query within a React component, call `useGetMenuQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMenuQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMenuQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetMenuQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetMenuQuery,
    GetMenuQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<GetMenuQuery, GetMenuQueryVariables>(
    GetMenuDocument,
    baseOptions,
  )
}
export function useGetMenuLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetMenuQuery,
    GetMenuQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<GetMenuQuery, GetMenuQueryVariables>(
    GetMenuDocument,
    baseOptions,
  )
}
export type GetMenuQueryHookResult = ReturnType<typeof useGetMenuQuery>
export type GetMenuLazyQueryHookResult = ReturnType<typeof useGetMenuLazyQuery>
export type GetMenuQueryResult = ApolloReactCommon.QueryResult<
  GetMenuQuery,
  GetMenuQueryVariables
>
export const GetUserProfileDocument = gql`
  query GetUserProfile {
    getUserProfile {
      nationalId
      mobilePhoneNumber
      locale
      email
      emailVerified
      mobilePhoneNumberVerified
    }
  }
`

/**
 * __useGetUserProfileQuery__
 *
 * To run a query within a React component, call `useGetUserProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserProfileQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUserProfileQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetUserProfileQuery,
    GetUserProfileQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    GetUserProfileQuery,
    GetUserProfileQueryVariables
  >(GetUserProfileDocument, baseOptions)
}
export function useGetUserProfileLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetUserProfileQuery,
    GetUserProfileQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    GetUserProfileQuery,
    GetUserProfileQueryVariables
  >(GetUserProfileDocument, baseOptions)
}
export type GetUserProfileQueryHookResult = ReturnType<
  typeof useGetUserProfileQuery
>
export type GetUserProfileLazyQueryHookResult = ReturnType<
  typeof useGetUserProfileLazyQuery
>
export type GetUserProfileQueryResult = ApolloReactCommon.QueryResult<
  GetUserProfileQuery,
  GetUserProfileQueryVariables
>
export const ListDocumentsDocument = gql`
  query listDocuments {
    listDocuments {
      id
      subject
      senderName
      senderNatReg
      date
      fileType
      url
    }
  }
`

/**
 * __useListDocumentsQuery__
 *
 * To run a query within a React component, call `useListDocumentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListDocumentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListDocumentsQuery({
 *   variables: {
 *   },
 * });
 */
export function useListDocumentsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    ListDocumentsQuery,
    ListDocumentsQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    ListDocumentsQuery,
    ListDocumentsQueryVariables
  >(ListDocumentsDocument, baseOptions)
}
export function useListDocumentsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ListDocumentsQuery,
    ListDocumentsQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    ListDocumentsQuery,
    ListDocumentsQueryVariables
  >(ListDocumentsDocument, baseOptions)
}
export type ListDocumentsQueryHookResult = ReturnType<
  typeof useListDocumentsQuery
>
export type ListDocumentsLazyQueryHookResult = ReturnType<
  typeof useListDocumentsLazyQuery
>
export type ListDocumentsQueryResult = ApolloReactCommon.QueryResult<
  ListDocumentsQuery,
  ListDocumentsQueryVariables
>
