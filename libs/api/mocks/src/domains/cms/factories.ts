import {
  AlertBanner,
  Article,
  ArticleCategory,
  ArticleGroup,
  ArticleSubgroup,
  Author,
  Featured,
  FrontpageSlider,
  Homepage,
  Html,
  Image,
  LifeEventPage,
  Link,
  Menu,
  News,
  SectionWithImage,
  Slice,
  SubArticle,
} from '../../types'
import faker from 'faker'
import { wysiwyg } from './richtext'
import { factory, slugify, simpleFactory } from '@island.is/shared/mocking'

export const image = factory<Image>({
  typename: 'Image',
  width: 500,
  height: 500,
  id: () => faker.random.uuid(),
  url: () => faker.image.abstract(500, 500),
  contentType: 'img/jpeg',
  title: () => faker.lorem.words(),
})

export const html = factory<Html>({
  typename: 'Html',
  id: () => faker.random.uuid(),
  document: () => wysiwyg(),
})

export const sectionWithImage = factory<SectionWithImage>({
  typename: 'SectionWithImage',
  id: () => faker.random.uuid(),
  title: () => faker.lorem.words(),
  html: () => html(),
  image: () => image(),
})

export const slice = simpleFactory(
  (): Slice => {
    const factory = faker.random.arrayElement([html, sectionWithImage])
    return factory()
  },
)

export const subArticle = factory<SubArticle>({
  title: () => faker.lorem.words(),
  slug: slugify('title'),
  body: () => [slice()],
})

export const articleCategory = factory<ArticleCategory>({
  title: () => faker.lorem.words(),
  slug: slugify('title'),
  id: () => faker.random.uuid(),
  description: () => faker.lorem.sentence(),
})

export const article = factory<Article>({
  typename: 'Article',
  id: () => faker.random.uuid(),
  title: () => faker.lorem.words(),
  body: () => slice.list(3),
  slug: slugify('title'),
  intro: () => faker.lorem.paragraph(),
  category: null,
  containsApplicationForm: () => faker.random.boolean(),
  subArticles: () =>
    faker.random.number(4) === 0
      ? subArticle.list(faker.random.number({ min: 1, max: 4 }))
      : [],
  relatedArticles: () => [],
  group: null,
  subgroup: null,
})

export const lifeEvent = factory<LifeEventPage>({
  typename: 'LifeEventPage',
  id: () => faker.random.uuid(),
  title: () => faker.lorem.words(),
  slug: slugify('title'),
  intro: () => faker.lorem.paragraph(),
  content: () => slice.list(6),
  image: () => image(),
  thumbnail: () => image(),
})

export const link = factory<Link>({
  text: () => faker.lorem.words(),
  url: () => faker.internet.url(),
})

export const menu = factory<Menu>({
  title: () => faker.lorem.words(),
  links: () => link.list(4),
})

export const alertBannerVariant = () =>
  faker.random.arrayElement(['error', 'info', 'success', 'warning', 'default'])

export const alertBanner = factory<AlertBanner>({
  id: () => faker.random.uuid(),
  title: () => faker.lorem.words(),
  description: () => faker.lorem.sentence(),
  isDismissable: () => faker.random.boolean(),
  dismissedForDays: 7,
  link: () => link(),
  bannerVariant: () => alertBannerVariant(),
  showAlertBanner: () => faker.random.boolean(),
})

export const author = factory<Author>({
  id: () => faker.random.uuid(),
  name: () => faker.name.findName(),
})

export const articleSubgroup = factory<ArticleSubgroup>({
  title: () => faker.lorem.words(),
  slug: slugify('title'),
  importance: () => faker.random.number(),
})

export const articleGroup = factory<ArticleGroup>({
  title: () => faker.lorem.words(),
  slug: slugify('title'),
  description: () => faker.lorem.sentence(),
})

export const news = factory<News>({
  typename: 'News',
  id: () => faker.random.uuid(),
  title: () => faker.lorem.words(),
  slug: slugify('title'),
  date: () => faker.date.past().toISOString(),
  intro: () => faker.lorem.paragraph(),
  subtitle: () => faker.lorem.sentence(),
  image: () => image(),
  content: () => slice.list(3),
  author: () => author(),
})

export const frontPageSlider = factory<FrontpageSlider>({
  title: () => faker.lorem.words(),
  subtitle: () => faker.lorem.sentence(),
  link: null,
  content: () => faker.lorem.paragraph(),
  animationJson: null,
})

export const featured = factory<Featured>({
  thing: () => article(),
  title: ({ thing }) => thing.title,
  attention: () => faker.random.boolean(),
})

export const homepage = factory<Homepage>({
  id: () => faker.random.uuid(),
  featuredThings: () => featured.list(3),
})
