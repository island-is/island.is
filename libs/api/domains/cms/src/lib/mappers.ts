/* eslint-disable @typescript-eslint/no-use-before-define */
import { ApolloError } from 'apollo-server-express'
import { Asset } from 'contentful'
import { Document, BLOCKS, TopLevelBlock } from '@contentful/rich-text-types'
import * as types from './generated/contentfulTypes'
import { Article } from './models/article.model'
import { AboutPage } from './models/aboutPage.model'
import { AdgerdirPage } from './models/adgerdirPage.model'
import { AdgerdirFrontpage } from './models/adgerdirFrontpage.model'
import { LandingPage } from './models/landingPage.model'
import { FrontpageSlide } from './models/frontpageSlide.model'
import { FrontpageSliderList } from './models/frontpageSliderList.model'
import { News } from './models/news.model'
import { Link } from './models/link.model'
import { LinkList } from './models/linkList.model'
import { PageHeaderSlice } from './models/slices/pageHeaderSlice.model'
import { TimelineEvent } from './models/timelineEvent.model'
import { TimelineSlice } from './models/slices/timelineSlice.model'
import { Story } from './models/story.model'
import { StorySlice } from './models/slices/storySlice.model'
import { MailingListSignupSlice } from './models/slices/mailingListSignupSlice.model'
import { HeadingSlice } from './models/slices/headingSlice.model'
import { LinkCard } from './models/linkCard.model'
import { LinkCardSlice } from './models/slices/linkCardSlice.model'
import { LatestNewsSlice } from './models/slices/latestNewsSlice.model'
import { LogoListSlice } from './models/slices/logoListSlice.model'
import { IconBullet } from './models/bullets/iconBullet.model'
import { NumberBullet } from './models/bullets/numberBullet.model'
import { NumberBulletGroup } from './models/bullets/numberBulletGroup.model'
import { BulletEntry } from './models/bullets/bulletEntry.model'
import { BulletListSlice } from './models/slices/bulletListSlice.model'
import { Slice } from './models/slices/slice.model'
import { Namespace } from './models/namespace.model'
import { Image } from './models/image.model'
import { Menu } from './models/menu.model'
import { GenericPage } from './models/genericPage.model'
import { AdgerdirTag } from './models/adgerdirTag.model'
import { Statistic } from './models/statistic.model'
import { Statistics } from './models/slices/statistics.model'
import { ProcessEntry } from './models/slices/processEntry.model'
import { Html } from './models/slices/html.model'
import { FaqList } from './models/slices/faqList.model'
import { QuestionAndAnswer } from './models/questionAndAnswer.model'
import { EmbeddedVideo } from './models/slices/embeddedVideo.model'

const isHtml = (x: typeof Slice): x is Html => x instanceof Html

export const mapAdgerdirPage = ({
  sys,
  fields,
}: types.IVidspyrnaPage): AdgerdirPage => ({
  id: sys.id,
  slug: fields.slug,
  title: fields.title,
  description: fields.description,
  tags: fields.tags.map(mapAdgerdirTag),
  status: fields.status,
  content: JSON.stringify(fields.content),
})

export const mapAdgerdirTag = ({
  sys,
  fields,
}: types.IVidspyrnaTag): AdgerdirTag => ({
  id: sys.id,
  title: fields.title,
})

export const mapAdgerdirFrontpage = ({
  sys,
  fields,
}: types.IVidspyrnaFrontpage): AdgerdirFrontpage => ({
  id: sys.id,
  slug: fields.slug,
  title: fields.title,
  description: fields.description,
  content: JSON.stringify(fields.content),
})

export const mapArticle = ({ sys, fields }: types.IArticle): Article => ({
  id: sys.id,
  slug: fields.slug,
  title: fields.title,
  group: fields.group?.fields,
  category: fields.category?.fields,
  content: JSON.stringify(fields.content),
})

export const mapImage = ({ fields, sys }: Asset): Image =>
  new Image({
    id: sys.id,
    url: fields.file.url,
    title: fields.title,
    contentType: fields.file.contentType,
    width: fields.file.details.image.width,
    height: fields.file.details.image.height,
  })

export const mapNewsItem = ({ fields, sys }: types.INews): News => ({
  id: sys.id,
  slug: fields.slug,
  title: fields.title,
  intro: fields.intro,
  image: mapImage(fields.image),
  date: fields.date,
  content: JSON.stringify(fields.content),
})

export const mapLink = ({ fields }: types.ILink): Link => ({
  text: fields.text,
  url: fields.url,
})

export const mapLinks = ({ fields }: types.ILinkList): LinkList => ({
  title: fields.title,
  links: (fields.links ?? []).map(mapLink),
})

export const mapTimelineEvent = ({
  fields,
  sys,
}: types.ITimelineEvent): TimelineEvent => ({
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

export const mapTimelineSlice = ({
  fields,
  sys,
}: types.ITimeline): TimelineSlice =>
  new TimelineSlice({
    id: sys.id,
    title: fields.title,
    events: fields.events.map(mapTimelineEvent),
  })

export const mapStory = ({ fields, sys }: types.IStory): Story => ({
  title: fields.title ?? '',
  label: fields.label ?? '',
  date: sys.createdAt,
  readMoreText: fields.readMoreText,
  logo: mapImage(fields.logo),
  intro: fields.intro,
  body: fields.body && JSON.stringify(fields.body),
})

export const mapStorySlice = ({
  fields,
  sys,
}: types.IStorySection): StorySlice =>
  new StorySlice({
    id: sys.id,
    readMoreText: fields.readMoreText ?? '',
    stories: fields.stories.map(mapStory),
  })

export const mapMailingListSignup = ({
  fields,
  sys,
}: types.IMailingListSignup): MailingListSignupSlice =>
  new MailingListSignupSlice({
    id: sys.id,
    title: fields.title,
    description: fields.description,
    inputLabel: fields.inputLabel,
    buttonText: fields.buttonText,
  })

export const mapSectionHeading = ({
  fields,
  sys,
}: types.ISectionHeading): HeadingSlice =>
  new HeadingSlice({
    id: sys.id,
    title: fields.title ?? '',
    body: fields.body ?? '',
  })

export const mapLinkCard = ({ fields }: types.ICard): LinkCard => ({
  title: fields.title ?? '',
  body: fields.body ?? '',
  link: fields.link ?? '',
  linkText: fields.linkText ?? '',
})

export const mapLinkCardSlice = ({
  fields,
  sys,
}: types.ICardSection): LinkCardSlice =>
  new LinkCardSlice({
    id: sys.id,
    title: fields.title ?? '',
    cards: fields.cards.map(mapLinkCard),
  })

export const mapLatestNews = ({
  fields,
  sys,
}: types.ILatestNewsSlice): LatestNewsSlice =>
  new LatestNewsSlice({
    id: sys.id,
    title: fields.title ?? '',
    news: [],
  })

export const mapLogoListSlice = ({
  fields,
  sys,
}: types.ILogoListSlice): LogoListSlice =>
  new LogoListSlice({
    id: sys.id,
    title: fields.title,
    body: fields.body,
    images: fields.images.map(mapImage),
  })

export const mapIconBullet = ({ fields, sys }: types.IIconBullet): IconBullet =>
  new IconBullet({
    id: sys.id,
    title: fields.title,
    body: fields.body,
    icon: mapImage(fields.icon),
    url: fields.url,
    linkText: fields.linkText,
  })

export const mapNumberBullet = ({
  fields,
  sys,
}: types.INumberBullet): NumberBullet => ({
  id: sys.id,
  title: fields.title,
  body: fields.body,
})

export const mapNumberBulletGroup = ({
  fields,
  sys,
}: types.INumberBulletSection): NumberBulletGroup =>
  new NumberBulletGroup({
    id: sys.id,
    defaultVisible: fields.defaultVisible,
    bullets: fields.bullets.map(mapNumberBullet),
  })

export const mapBulletEntry = (
  e: types.IIconBullet | types.INumberBulletSection,
): typeof BulletEntry => {
  switch (e.sys.contentType.sys.id) {
    case 'iconBullet':
      return mapIconBullet(e as types.IIconBullet)
    case 'numberBulletSection':
      return mapNumberBulletGroup(e as types.INumberBulletSection)
  }
}

export const mapBulletListSlice = ({ fields, sys }): BulletListSlice =>
  new BulletListSlice({
    id: sys.id,
    bullets: fields.bullets.map(mapBulletEntry),
  })

type SliceTypes =
  | types.IPageHeader
  | types.ITimeline
  | types.IMailingListSignup
  | types.ISectionHeading
  | types.ICardSection
  | types.IStorySection
  | types.ILogoListSlice
  | types.ILatestNewsSlice
  | types.IBigBulletList
  | types.IStatistics
  | types.IProcessEntry
  | types.IFaqList
  | types.IEmbeddedVideo

export const mapSlice = (slice: SliceTypes): typeof Slice => {
  switch (slice.sys.contentType.sys.id) {
    case 'pageHeader':
      return mapPageHeaderSlice(slice as types.IPageHeader)
    case 'timeline':
      return mapTimelineSlice(slice as types.ITimeline)
    case 'mailingListSignup':
      return mapMailingListSignup(slice as types.IMailingListSignup)
    case 'sectionHeading':
      return mapSectionHeading(slice as types.ISectionHeading)
    case 'cardSection':
      return mapLinkCardSlice(slice as types.ICardSection)
    case 'storySection':
      return mapStorySlice(slice as types.IStorySection)
    case 'logoListSlice':
      return mapLogoListSlice(slice as types.ILogoListSlice)
    case 'latestNewsSlice':
      return mapLatestNews(slice as types.ILatestNewsSlice)
    case 'bigBulletList':
      return mapBulletListSlice(slice as types.IBigBulletList)
    case 'statistics':
      return mapStatistics(slice as types.IStatistics)
    case 'processEntry':
      return mapProcessEntry(slice as types.IProcessEntry)
    case 'faqList':
      return mapFaqList(slice as types.IFaqList)
    case 'EmbeddedVideo':
      return mapEmbeddedVideo(slice as types.IEmbeddedVideo)
    default:
      throw new ApolloError(
        `Can not convert to slice: ${(slice as any).sys.contentType.sys.id}`,
      )
  }
}

export const mapLandingPage = ({
  fields,
}: types.ILandingPage): LandingPage => ({
  ...fields,
  image: fields.image && mapImage(fields.image),
  actionButton: fields.actionButton && mapLink(fields.actionButton),
  links: fields.links && mapLinks(fields.links),
  content: fields.content && mapRichText(fields.content),
})

export const mapFrontpageSlide = ({
  fields,
}: types.IFrontpageSlider): FrontpageSlide => ({
  ...fields,
  image: fields.image && mapImage(fields.image),
  link: fields.link && JSON.stringify(fields.link),
})

export const mapFrontpageSliderList = ({
  fields,
}: types.IFrontpageSliderList): FrontpageSliderList => ({
  items: fields.items.map(mapFrontpageSlide),
})

export const mapPageHeaderSlice = ({
  fields,
  sys,
}: types.IPageHeader): PageHeaderSlice =>
  new PageHeaderSlice({
    id: sys.id,
    title: fields.title,
    introduction: fields.introduction,
    navigationText: fields.navigationText,
    links: fields.links.map(mapLink),
    slices: fields.slices.map(mapSlice),
  })

export const mapNamespace = ({
  fields,
}: types.IUiConfiguration): Namespace => ({
  namespace: fields.namespace,
  fields: JSON.stringify(fields.fields),
})

export const mapMenu = ({ fields }: types.IMenu): Menu => ({
  title: fields.title,
  links: fields.links.map(mapLink),
})

export const mapGenericPage = ({
  fields,
}: types.IGenericPage): GenericPage => ({
  ...fields,
  intro: JSON.stringify(fields?.intro),
  mainContent: fields.mainContent && JSON.stringify(fields.mainContent),
  sidebar: fields.sidebar && JSON.stringify(fields.sidebar),
  misc: fields.misc && JSON.stringify(fields.misc),
})

export const mapStatistic = ({ fields, sys }: types.IStatistic): Statistic => ({
  ...fields,
  id: sys.id,
})

export const mapStatistics = ({ fields, sys }: types.IStatistics): Statistics =>
  new Statistics({
    id: sys.id,
    title: fields.title,
    statistics: fields.statistics.map(mapStatistic),
  })

export const mapProcessEntry = ({
  fields,
  sys,
}: types.IProcessEntry): ProcessEntry =>
  new ProcessEntry({
    ...fields,
    id: sys.id,
    processInfo: fields.processInfo && mapRichText(fields.processInfo).filter(isHtml),
    details: fields.details && mapRichText(fields.details).filter(isHtml),
    buttonText: fields.buttonText ?? '',
  })

export const mapQuestionAndAnswer = ({
  fields,
  sys,
}: types.IQuestionAndAnswer): QuestionAndAnswer => ({
  id: sys.id,
  question: fields.question,
  answer: fields.answer && mapRichText(fields.answer).filter(isHtml),
})

export const mapFaqList = ({ fields, sys }: types.IFaqList): FaqList =>
  new FaqList({
    id: sys.id,
    title: fields.title,
    questions: fields.questions.map(mapQuestionAndAnswer),
  })

export const mapEmbeddedVideo = ({
  fields,
  sys,
}: types.IEmbeddedVideo): EmbeddedVideo => ({
  id: sys.id,
  ...fields,
})

const mapTopLevelBlock = (
  block: TopLevelBlock,
  index: number,
): typeof Slice => {
  switch (block.nodeType) {
    case BLOCKS.EMBEDDED_ENTRY:
      return mapSlice(block.data.target)
    case BLOCKS.EMBEDDED_ASSET:
      // Only asset we can handle at the moment is an image
      return mapImage(block.data.target)
    default:
      return new Html({
        id: index.toString(),
        json: JSON.stringify({ nodeType: BLOCKS.DOCUMENT, content: [block] }),
      })
  }
}

export const mapRichText = (document: Document): Array<typeof Slice> => {
  return document.content.map(mapTopLevelBlock)
}
