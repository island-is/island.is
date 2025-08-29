import {
  AlertBanner,
  Article,
  ArticleCategory,
  ArticleGroup,
  ArticleSubgroup,
  Featured,
  Frontpage,
  FrontpageSlider,
  GenericPage,
  GroupedMenu,
  Html,
  Image,
  Link,
  Menu,
  MenuLinkWithChildren,
  News,
  ReferenceLink,
  AnchorPage,
  LifeEventPage,
  SectionWithImage,
  Slice,
  SubArticle,
  Organization,
} from '../../types'
import { wysiwyg } from './richtext'
import {
  factory,
  slugify,
  simpleFactory,
  faker,
  title,
} from '@island.is/shared/mocking'
import { SystemMetadata } from '@island.is/shared/types'

export const referenceLink = factory<ReferenceLink>({
  slug: () => faker.lorem.slug(),
  type: () => 'article',
})

export const image = factory<SystemMetadata<Image>>({
  typename: 'Image',
  width: 500,
  height: 500,
  id: () => faker.datatype.uuid(),
  url: () => faker.image.abstract(500, 500),
  contentType: 'img/jpeg',
  title: () => title(),
})

export const html = factory<Html>({
  typename: 'Html',
  id: () => faker.datatype.uuid(),
  document: () => wysiwyg(),
})

export const sectionWithImage = factory<SystemMetadata<SectionWithImage>>({
  typename: 'SectionWithImage',
  id: () => faker.datatype.uuid(),
  title: () => title(),
  content: () => slice.list(3),
  image: () => image(),
})

export const slice = simpleFactory((): Slice => {
  const factory = faker.random.arrayElement([html, sectionWithImage])
  return factory()
})

export const subArticle = factory<SubArticle>({
  id: () => faker.datatype.uuid(),
  title: () => title(),
  slug: slugify('title'),
  body: () => [slice()],
})

export const articleCategory = factory<ArticleCategory>({
  title: () => title(),
  slug: slugify('title'),
  id: () => faker.datatype.uuid(),
  description: () => faker.lorem.sentence(),
})

export const article = factory<SystemMetadata<Article>>({
  typename: 'Article',
  id: () => faker.datatype.uuid(),
  title: () => title(),
  body: () => slice.list(3),
  slug: slugify('title'),
  intro: () => faker.lorem.paragraph(),
  category: null,
  subArticles: () =>
    faker.datatype.number(4) === 0
      ? subArticle.list(faker.datatype.number({ min: 1, max: 4 }))
      : [],
  relatedArticles: () => [],
  group: null,
  subgroup: null,
})

export const anchorPage = factory<AnchorPage>({
  id: () => faker.datatype.uuid(),
  shortTitle: () => '',
  tinyThumbnail: image(),
  title: () => title(),
  slug: slugify('title'),
  intro: () => faker.lorem.paragraph(),
  content: () => slice.list(6),
  image: () => image(),
  thumbnail: () => image(),
})

export const link = factory<Link>({
  text: () => faker.lorem.words(),
  date: () => faker.date.past().toISOString(),
  url: () => faker.internet.url(),
  id: () => faker.datatype.uuid(),
})

export const menuLink = factory<MenuLinkWithChildren>({
  title: () => title(),
  link: () => referenceLink(),
  childLinks: () => [],
})

export const menu = factory<Menu>({
  id: faker.datatype.uuid(),
  title: () => title(),
  links: () => link.list(4),
  menuLinks: () => menuLink.list(4),
})

export const groupedMenu = factory<GroupedMenu>({
  id: faker.datatype.uuid(),
  title: () => title(),
  menus: () => menu.list(5),
})

export const alertBannerVariant = () =>
  faker.random.arrayElement(['error', 'info', 'success', 'warning', 'default'])

export const alertBanner = factory<AlertBanner>({
  id: () => faker.datatype.uuid(),
  title: () => title(),
  description: () => faker.lorem.sentence(),
  isDismissable: () => faker.datatype.boolean(),
  dismissedForDays: 7,
  link: () => referenceLink(),
  bannerVariant: () => alertBannerVariant(),
  showAlertBanner: () => faker.datatype.boolean(),
})

export const articleSubgroup = factory<ArticleSubgroup>({
  title: () => title(),
  slug: slugify('title'),
  importance: () => faker.datatype.number(),
})

export const articleGroup = factory<ArticleGroup>({
  title: () => title(),
  slug: slugify('title'),
  description: () => faker.lorem.sentence(),
})

export const news = factory<News>({
  id: () => faker.datatype.uuid(),
  title: () => title(),
  slug: slugify('title'),
  date: () => faker.date.past().toISOString(),
  intro: () => faker.lorem.paragraph(),
  subtitle: () => faker.lorem.sentence(),
  imageText: () => faker.lorem.sentence(),
  image: () => image(),
  content: () => slice.list(3),
  genericTags: () => [],
})

export const frontPageSlider = factory<FrontpageSlider>({
  title: () => title(),
  subtitle: () => faker.lorem.sentence(),
  link: null,
  content: () => faker.lorem.paragraph(),
})

export const featured = factory<Featured>({
  thing: () => referenceLink(),
  title: (_) => title(),
  attention: () => faker.datatype.boolean(),
})

export const lifeEventPage = factory<LifeEventPage>({
  id: () => faker.datatype.uuid(),
  shortTitle: () => '',
  tinyThumbnail: image(),
  title: () => title(),
  slug: slugify('title'),
  intro: () => faker.lorem.paragraph(),
  content: () => slice.list(6),
  image: () => image(),
  thumbnail: () => image(),
  featured: featured.list(3),
  organizations: [],
  relatedLifeEvents: [],
})

export const genericPage = factory<GenericPage>({
  slug: slugify('title'),
  title: () => title(),
})

export const frontpage = factory<Frontpage>({
  id: () => faker.datatype.uuid(),
  title: () => title(),
  featured: () => featured.list(3),
  slides: () => frontPageSlider.list(2),
  lifeEvents: () => lifeEventPage.list(6),
})

export const organization = factory<Organization>({
  id: () => faker.datatype.uuid(),
  title: () => title(),
  shortTitle: () => faker.lorem.word(),
  description: () => faker.lorem.sentence(),
  slug: slugify('title'),
  tag: () => [
    {
      id: faker.datatype.uuid(),
      title: title(),
    },
  ],
  email: () => faker.internet.email(),
  phone: () => faker.phone.phoneNumber(),
  footerItems: () => [{ id: faker.datatype.uuid(), title: title() }],
  publishedMaterialSearchFilterGenericTags: () => [],
  link: () => faker.internet.url(),
})
