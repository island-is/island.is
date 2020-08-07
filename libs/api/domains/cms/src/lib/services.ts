/* eslint-disable @typescript-eslint/no-use-before-define */
import { getLocalizedEntries } from './contentful'
import { logger } from '@island.is/logging'
import {
  Image,
  Article,
  VidspyrnaItem,
  VidspyrnaItems,
  GetVidspyrnaItemsInput,
  GetVidspyrnaItemInput,
  News,
  Namespace,
  Pagination,
  TimelineSlice,
  TimelineEvent,
  PageHeaderSlice,
  Link,
  Story,
  StorySlice,
  Slice,
  Page,
  MailingListSignupSlice,
  HeadingSlice,
  LinkCard,
  LinkCardSlice,
  LatestNewsSlice,
  LogoListSlice,
  GetNewsListInput,
  GetPageInput,
  PaginatedNews,
  IconBullet,
  NumberBullet,
  NumberBulletGroup,
  BulletEntry,
  BulletListSlice,
} from '@island.is/api/schema'
import { ApolloError } from 'apollo-server-express'
import { Entry } from 'contentful'

type CmsPage = Omit<Page, 'slices'> & {
  slices: Entry<Slice>[]
}

const formatArticle = ({ sys, fields }): Article => ({
  __typename: 'Article',
  id: sys.id,
  slug: fields.slug,
  title: fields.title,
  group: fields.group?.fields,
  category: fields.category?.fields,
  content: JSON.stringify(fields.content),
})

const formatVidspyrnaItem = ({ sys, fields }): VidspyrnaItem => ({
  __typename: 'VidspyrnaItem',
  id: sys.id,
  slug: fields.slug,
  title: fields.title,
  description: fields.description,
  content: JSON.stringify(fields.content),
})

const formatImage = ({ fields }): Image => ({
  __typename: 'Image',
  url: fields.file.url,
  title: fields.title,
  contentType: fields.file.contentType,
  width: fields.file.details.image.width,
  height: fields.file.details.image.height,
})

const formatNewsItem = ({ fields, sys }): News => ({
  __typename: 'News',
  id: sys.id,
  slug: fields.slug,
  title: fields.title,
  intro: fields.intro,
  image: formatImage(fields.image),
  date: fields.date,
  content: JSON.stringify(fields.content),
})

const formatLink = ({ fields }): Link => ({
  text: fields.text,
  url: fields.url,
})

const formatPageHeaderSlice = ({ fields, sys }): PageHeaderSlice => ({
  __typename: 'PageHeaderSlice',
  id: sys.id,
  title: fields.title,
  introduction: fields.introduction,
  navigationText: fields.navigationText,
  links: fields.links.map(formatLink),
  slices: fields.slices.map(formatSlice),
})

const formatTimelineEvent = ({ fields, sys }): TimelineEvent => ({
  __typename: 'TimelineEvent',
  id: sys.id,
  title: fields.title,
  date: fields.date,
  numerator: fields.numerator,
  denominator: fields.denominator,
  label: fields.label ?? '',
  body: fields.body && JSON.stringify(fields.body),
  tags: fields.tags ?? [],
  link: fields.link ?? '',
})

const formatTimelineSlice = ({ fields, sys }): TimelineSlice => ({
  __typename: 'TimelineSlice',
  id: sys.id,
  title: fields.title,
  events: fields.events.map(formatTimelineEvent),
})

const formatStory = ({ fields, sys }): Story => ({
  __typename: 'Story',
  title: fields.title ?? '',
  label: fields.label ?? '',
  date: sys.createdAt,
  readMoreText: fields.readMoreText,
  logo: formatImage(fields.logo),
  intro: fields.intro,
  body: fields.body && JSON.stringify(fields.body),
})

const formatStorySlice = ({ fields, sys }): StorySlice => ({
  __typename: 'StorySlice',
  id: sys.id,
  readMoreText: fields.readMoreText ?? '',
  stories: fields.stories.map(formatStory),
})

const formatMailingListSignup = ({ fields, sys }): MailingListSignupSlice => ({
  __typename: 'MailingListSignupSlice',
  id: sys.id,
  title: fields.title ?? '',
  description: fields.description ?? '',
  inputLabel: fields.inputLabel ?? '',
  buttonText: fields.buttonText ?? '',
})

const formatSectionHeading = ({ fields, sys }): HeadingSlice => ({
  __typename: 'HeadingSlice',
  id: sys.id,
  title: fields.title ?? '',
  body: fields.description ?? '',
})

const formatLinkCard = ({ fields }): LinkCard => ({
  __typename: 'LinkCard',
  title: fields.title ?? '',
  body: fields.body ?? '',
  link: fields.link ?? '',
  linkText: fields.linkText ?? '',
})

const formatLinkCardSlice = ({ fields, sys }): LinkCardSlice => ({
  __typename: 'LinkCardSlice',
  id: sys.id,
  title: fields.title ?? '',
  cards: fields.cards.map(formatLinkCard),
})

const formatLatestNews = ({ fields, sys }): LatestNewsSlice => ({
  __typename: 'LatestNewsSlice',
  id: sys.id,
  title: fields.title ?? '',
  news: [],
})

const formatLogoListSlice = ({ fields, sys }): LogoListSlice => ({
  __typename: 'LogoListSlice',
  id: sys.id,
  title: fields.title,
  body: fields.body,
  images: fields.images.map(formatImage),
})

const formatIconBullet = ({ fields, sys }): IconBullet => ({
  __typename: 'IconBullet',
  id: sys.id,
  title: fields.title,
  body: fields.body,
  icon: formatImage(fields.icon),
  url: fields.url,
  linkText: fields.linkText,
})

const formatNumberBullet = ({ fields, sys }): NumberBullet => ({
  __typename: 'NumberBullet',
  id: sys.id,
  title: fields.title,
  body: fields.body,
})

const formatNumberBulletGroup = ({ fields, sys }): NumberBulletGroup => ({
  __typename: 'NumberBulletGroup',
  id: sys.id,
  defaultVisible: fields.defaultVisible,
  bullets: fields.bullets.map(formatNumberBullet),
})

const formatBulletEntry = ({ fields, sys }): BulletEntry => {
  switch (sys.contentType.sys.id) {
    case 'iconBullet':
      return formatIconBullet({ fields, sys })
    case 'numberBulletSection':
      return formatNumberBulletGroup({ fields, sys })
  }
}

const formatBulletListSlice = ({ fields, sys }): BulletListSlice => ({
  __typename: 'BulletListSlice',
  id: sys.id,
  bullets: fields.bullets.map(formatBulletEntry),
})

const formatSlice = (slice: Entry<Slice>): Slice => {
  const sliceName = slice.sys.contentType.sys.id
  switch (sliceName) {
    case 'pageHeader':
      return formatPageHeaderSlice(slice)
    case 'timeline':
      return formatTimelineSlice(slice)
    case 'mailingListSignup':
      return formatMailingListSignup(slice)
    case 'sectionHeading':
      return formatSectionHeading(slice)
    case 'cardSection':
      return formatLinkCardSlice(slice)
    case 'storySection':
      return formatStorySlice(slice)
    case 'logoListSlice':
      return formatLogoListSlice(slice)
    case 'latestNewsSlice':
      return formatLatestNews(slice)
    case 'bigBulletList':
      return formatBulletListSlice(slice)
    default:
      throw new ApolloError(`Can not convert to slice: ${sliceName}`)
  }
}

const formatPage = ({ fields }: Entry<CmsPage>): Page => ({
  __typename: 'Page',
  slices: fields.slices.map(formatSlice),
  title: fields.title,
  slug: fields.slug,
  theme: fields.theme.toLowerCase(),
  seoDescription: fields.seoDescription ?? '',
})

const makePage = (
  page: number,
  perPage: number,
  totalResults: number,
): Pagination => ({
  page,
  perPage,
  totalResults,
  totalPages: Math.ceil(totalResults / perPage),
})

const loadSlice = async (slice: Slice, lang: string): Promise<Slice> => {
  switch (slice.__typename) {
    case 'PageHeaderSlice':
      return {
        ...slice,
        slices: await Promise.all(
          slice.slices.map((slice) => loadSlice(slice, lang)),
        ),
      }
    case 'LatestNewsSlice': {
      const { news } = await getNewsList({ lang, perPage: 3 })
      return { ...slice, news }
    }
    default:
      return slice
  }
}

const errorHandler = (name: string) => {
  return (error: Error) => {
    logger.error(error)
    throw new ApolloError('Failed to resolve request in ' + name)
  }
}

export const getArticle = async (
  slug: string,
  lang: string,
): Promise<Article> => {
  const result = await getLocalizedEntries<Article>(lang, {
    ['content_type']: 'article',
    'fields.slug': slug,
    include: 10,
  }).catch(errorHandler('getArticle'))

  // if we have no results
  if (!result.total) {
    return null
  }

  return formatArticle(result.items[0])
}

export const getVidspyrnaFrontpage = async (
  lang: string,
): Promise<VidspyrnaItem> => {
  const result = await getLocalizedEntries<Article>(lang, {
    ['content_type']: 'vidspyrna-frontpage',
    include: 1,
  }).catch(errorHandler('getVidspyrnaFrontpage'))

  // if we have no results
  if (!result.total) {
    return null
  }

  return formatVidspyrnaItem(result.items[0])
}

export const getVidspyrnaItems = async (
  lang = 'is-IS',
): Promise<VidspyrnaItems> => {
  const params = {
    ['content_type']: 'vidspyrna-page',
    include: 10,
    limit: 100,
  }

  const r = await getLocalizedEntries<News>(lang, params).catch(
    errorHandler('getVidspyrnaItems'),
  )

  return {
    items: r.items.map(formatVidspyrnaItem),
  }
}

export const getVidspyrnaItem = async (slug: string, lang: string) => {
  const r = await getLocalizedEntries<VidspyrnaItem>(lang, {
    ['content_type']: 'vidspyrna-page',
    include: 10,
    'fields.slug': slug,
  }).catch(errorHandler('getVidspyrnaItem'))

  return r.items[0] && formatVidspyrnaItem(r.items[0])
}

export const getNews = async (lang: string, slug: string) => {
  const r = await getLocalizedEntries<News>(lang, {
    ['content_type']: 'news',
    include: 10,
    'fields.slug': slug,
  }).catch(errorHandler('getNews'))

  return r.items[0] && formatNewsItem(r.items[0])
}

export const getNewsList = async ({
  lang = 'is-IS',
  year,
  month,
  ascending = false,
  page = 1,
  perPage = 10,
}: GetNewsListInput): Promise<PaginatedNews> => {
  const params = {
    ['content_type']: 'news',
    include: 10,
    order: (ascending ? '' : '-') + 'fields.date',
    skip: (page - 1) * perPage,
    limit: perPage,
  }

  if (year) {
    params['fields.date[gte]'] = new Date(year, month ?? 0, 1)
    params['fields.date[lt]'] =
      month != undefined
        ? new Date(year, month + 1, 1)
        : new Date(year + 1, 0, 1)
  }

  const r = await getLocalizedEntries<News>(lang, params).catch(
    errorHandler('getNewsList'),
  )

  return {
    page: makePage(page, perPage, r.total),
    news: r.items.map(formatNewsItem),
  }
}

export const getPage = async ({ lang, slug }: GetPageInput): Promise<Page> => {
  const result = await getLocalizedEntries<CmsPage>(lang, {
    ['content_type']: 'page',
    'fields.slug': slug,
    include: 10,
  }).catch(errorHandler('getPage'))

  if (!result.total) {
    return null
  }

  const page = formatPage(result.items[0])
  return {
    ...page,
    slices: await Promise.all(
      page.slices.map((slice) => loadSlice(slice, lang)),
    ),
  }
}

export const getNamespace = async (
  namespace: string,
  lang: string,
): Promise<Namespace> => {
  const result = await getLocalizedEntries<Namespace>(lang, {
    ['content_type']: 'uiConfiguration',
    'fields.namespace': namespace,
  }).catch(errorHandler('getNamespace'))

  // if we have no results
  if (!result.total) {
    return null
  }

  const [
    {
      fields: { fields },
    },
  ] = result.items

  return {
    namespace,
    fields: JSON.stringify(fields),
  }
}
