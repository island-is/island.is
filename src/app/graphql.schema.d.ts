/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

export enum ApplicationTypeIdEnum {
  ExampleForm = 'ExampleForm',
  ExampleForm2 = 'ExampleForm2',
  ExampleForm3 = 'ExampleForm3',
  FamilyAndPets = 'FamilyAndPets',
  ParentalLeave = 'ParentalLeave',
}

export enum ContentLanguage {
  is = 'is',
  en = 'en',
}

export enum ItemType {
  article = 'article',
  category = 'category',
}

export enum CreateApplicationDtoTypeIdEnum {
  ExampleForm = 'ExampleForm',
  ExampleForm2 = 'ExampleForm2',
  ExampleForm3 = 'ExampleForm3',
  FamilyAndPets = 'FamilyAndPets',
  ParentalLeave = 'ParentalLeave',
}

export enum UpdateApplicationDtoTypeIdEnum {
  ExampleForm = 'ExampleForm',
  ExampleForm2 = 'ExampleForm2',
  ExampleForm3 = 'ExampleForm3',
  FamilyAndPets = 'FamilyAndPets',
  ParentalLeave = 'ParentalLeave',
}

export class GetArticleInput {
  slug?: string
  lang: string
}

export class GetNewsInput {
  slug: string
  lang?: string
}

export class GetNewsListInput {
  lang?: string
  year?: number
  month?: number
  ascending?: boolean
  page?: number
  perPage?: number
}

export class GetNamespaceInput {
  namespace?: string
  lang: string
}

export class GetAboutPageInput {
  lang: string
}

export class GetLandingPageInput {
  slug: string
  lang: string
}

export class GetGenericPageInput {
  slug: string
  lang: string
}

export class GetAdgerdirPageInput {
  slug?: string
  lang: string
}

export class GetAdgerdirPagesInput {
  lang?: string
  perPage?: number
}

export class GetAdgerdirTagsInput {
  lang?: string
}

export class GetFrontpageSliderListInput {
  lang?: string
}

export class GetAdgerdirFrontpageInput {
  lang: string
}

export class GetMenuInput {
  name: string
  lang: string
}

export class HelloWorldInput {
  name?: string
}

export class SearcherInput {
  queryString?: string
  language?: ContentLanguage
  size?: number
  page?: number
}

export class ItemInput {
  id?: string
  slug?: string
  type?: ItemType
  language?: ContentLanguage
}

export class CategoriesInput {
  language?: ContentLanguage
}

export class ArticlesInCategoryInput {
  slug?: string
  language?: ContentLanguage
}

export class GetApplicationInput {
  id: string
}

export class GetApplicationsByTypeInput {
  typeId: ApplicationTypeIdEnum
}

export class GetDocumentInput {
  id: string
}

export class CreateApplicationInput {
  applicant: string
  assignee: string
  externalId?: string
  state: string
  attachments?: string[]
  typeId: CreateApplicationDtoTypeIdEnum
  answers: JSON
}

export class UpdateApplicationInput {
  id: string
  typeId: UpdateApplicationDtoTypeIdEnum
  applicant?: string
  assignee?: string
  externalId?: string
  state?: string
  attachments?: string[]
  answers?: JSON
}

export class CategoryInput {
  id?: string
  slug?: string
}

export class Taxonomy {
  title?: string
  slug?: string
  description: string
}

export class Article {
  id: string
  slug: string
  title: string
  content?: string
  group?: Taxonomy
  category: Taxonomy
}

export class AdgerdirTag {
  id?: string
  title?: string
}

export class AdgerdirPage {
  id: string
  slug: string
  title: string
  description?: string
  content?: string
  tags: AdgerdirTag[]
  link?: string
  status: string
}

export class AdgerdirPages {
  items: AdgerdirPage[]
}

export class AdgerdirFrontpage {
  id: string
  slug: string
  title: string
  description: string
  content?: string
}

export class Image {
  url: string
  title: string
  contentType: string
  width: number
  height: number
}

export class FrontpageSlide {
  subtitle?: string
  title?: string
  content?: string
  image?: Image
  link?: string
}

export class FrontpageSliderList {
  items: FrontpageSlide[]
}

export class News {
  id: string
  slug: string
  title: string
  intro: string
  image?: Image
  date: string
  content?: string
}

export class Pagination {
  page: number
  perPage: number
  totalResults: number
  totalPages: number
}

export class PaginatedNews {
  page: Pagination
  news: News[]
}

export class Namespace {
  namespace?: string
  fields?: string
}

export class Link {
  text: string
  url: string
}

export class TimelineEvent {
  id: string
  title: string
  date: string
  numerator?: number
  denominator?: number
  label: string
  body?: string
  tags: string[]
  link: string
}

export class Story {
  label: string
  title: string
  logo: Image
  readMoreText: string
  date: string
  intro: string
  body?: string
}

export class LinkCard {
  title: string
  body: string
  link: string
  linkText: string
}

export class NumberBullet {
  id: string
  title: string
  body: string
}

export class AboutPage {
  title: string
  seoDescription: string
  theme: string
  slices: Slice[]
}

export class PageHeaderSlice {
  id: string
  title: string
  introduction: string
  navigationText: string
  links: Link[]
  slices: Slice[]
}

export class TimelineSlice {
  id: string
  title: string
  events: TimelineEvent[]
}

export class HeadingSlice {
  id: string
  title: string
  body: string
}

export class StorySlice {
  id: string
  readMoreText: string
  stories: Story[]
}

export class LinkCardSlice {
  id: string
  title: string
  cards: LinkCard[]
}

export class LatestNewsSlice {
  id: string
  title: string
  news: News[]
}

export class MailingListSignupSlice {
  id: string
  title: string
  description: string
  inputLabel: string
  buttonText: string
}

export class LogoListSlice {
  id: string
  title: string
  body: string
  images: Image[]
}

export class BulletListSlice {
  id: string
  bullets: BulletEntry[]
}

export class IconBullet {
  id: string
  title: string
  body: string
  icon: Image
  url?: string
  linkText?: string
}

export class NumberBulletGroup {
  id: string
  defaultVisible: number
  bullets: NumberBullet[]
}

export class LinkList {
  title?: string
  links: Link[]
}

export class LandingPage {
  title: string
  slug: string
  introduction: string
  image?: Image
  actionButton?: Link
  links?: LinkList
  content?: string
}

export class GenericPage {
  title: string
  slug: string
  intro?: string
  mainContent?: string
  sidebar?: string
  misc?: string
}

export class Menu {
  title: string
  links: Link[]
}

export class AdgerdirTags {
  items: AdgerdirTag[]
}

export class Fund {
  nationalId: string
  credit: number
  used: number
  total: number
}

export class User {
  nationalId: string
  name: string
  mobile?: string
  role: string
  fund?: Fund
  meetsADSRequirements: boolean
}

export class Discount {
  discountCode: string
  expires: string
  nationalId: string
  user: User
}

export class Flight {
  id: string
  airline: string
  bookingDate: string
  travel: string
  user: User
}

export abstract class IQuery {
  abstract getArticle(input: GetArticleInput): Article | Promise<Article>
  abstract getNews(input: GetNewsInput): News | Promise<News>
  abstract getNewsList(
    input: GetNewsListInput,
  ): PaginatedNews | Promise<PaginatedNews>
  abstract getNamespace(
    input: GetNamespaceInput,
  ): Namespace | Promise<Namespace>
  abstract getAboutPage(
    input: GetAboutPageInput,
  ): AboutPage | Promise<AboutPage>
  abstract getLandingPage(
    input: GetLandingPageInput,
  ): LandingPage | Promise<LandingPage>
  abstract getGenericPage(
    input: GetGenericPageInput,
  ): GenericPage | Promise<GenericPage>
  abstract getAdgerdirPage(
    input: GetAdgerdirPageInput,
  ): AdgerdirPage | Promise<AdgerdirPage>
  abstract getAdgerdirPages(
    input: GetAdgerdirPagesInput,
  ): AdgerdirPages | Promise<AdgerdirPages>
  abstract getAdgerdirTags(
    input: GetAdgerdirTagsInput,
  ): AdgerdirTags | Promise<AdgerdirTags>
  abstract getFrontpageSliderList(
    input: GetFrontpageSliderListInput,
  ): FrontpageSliderList | Promise<FrontpageSliderList>
  abstract getAdgerdirFrontpage(
    input: GetAdgerdirFrontpageInput,
  ): AdgerdirFrontpage | Promise<AdgerdirFrontpage>
  abstract getMenu(input: GetMenuInput): Menu | Promise<Menu>
  abstract user(): User | Promise<User>
  abstract flights(): Flight[] | Promise<Flight[]>
  abstract helloWorld(input: HelloWorldInput): HelloWorld | Promise<HelloWorld>
  abstract searchResults(
    query: SearcherInput,
  ): SearchResult | Promise<SearchResult>
  abstract singleItem(input: ItemInput): ContentItem | Promise<ContentItem>
  abstract categories(
    input: CategoriesInput,
  ): ContentCategory[] | Promise<ContentCategory[]>
  abstract articlesInCategory(
    category: ArticlesInCategoryInput,
  ): ContentItem[] | Promise<ContentItem[]>
  abstract getApplication(
    input: GetApplicationInput,
  ): Application | Promise<Application>
  abstract getApplicationsByType(
    input: GetApplicationsByTypeInput,
  ): Application[] | Promise<Application[]>
  abstract getDocument(input: GetDocumentInput): Document | Promise<Document>
  abstract items(): Item[] | Promise<Item[]>
  abstract getItem(id?: number): Item | Promise<Item>
  abstract getAllVehicles(personalId?: string): Vehicles[] | Promise<Vehicles[]>
  abstract root(): string | Promise<string>
}

export abstract class IMutation {
  abstract fetchDiscounts(): Discount[] | Promise<Discount[]>
  abstract createApplication(
    input: CreateApplicationInput,
  ): Application | Promise<Application>
  abstract updateApplication(
    input: UpdateApplicationInput,
  ): Application | Promise<Application>
  abstract createItem(msg: string): Item | Promise<Item>
  abstract root(): string | Promise<string>
}

export class HelloWorld {
  message: string
}

export class ContentItem {
  id: string
  title?: string
  content?: string
  tag?: string[]
  category?: string
  categorySlug?: string
  categoryDescription?: string
  group?: string
  groupSlug?: string
  groupDescription?: string
  contentBlob?: string
  contentId?: string
  contentType?: string
  date?: string
  image?: string
  imageText?: string
  lang?: string
  slug?: string
}

export class SearchResult {
  total: number
  items: ContentItem[]
}

export class ContentCategory {
  title?: string
  slug?: string
  description?: string
}

export class Application {
  id: string
  created: DateTime
  modified: DateTime
  applicant: string
  assignee: string
  externalId?: string
  state: string
  attachments?: string[]
  typeId: ApplicationTypeIdEnum
  answers: JSON
}

export class Document {
  id: string
  date: DateTime
  subject: string
  senderName: string
  senderNatReg: string
  opened: boolean
}

export class Item {
  id: number
  msg: string
}

export class Vehicles {
  owner?: string
  vehicleDesc?: string
  permNo?: string
  outOfUse?: string
}

export class ContentArticle {
  id?: string
  title?: string
  slug?: string
}

export type DateTime = any
export type JSON = any
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
export type BulletEntry = IconBullet | NumberBulletGroup
