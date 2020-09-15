import { createUnionType } from '@nestjs/graphql'
import { ApolloError } from 'apollo-server-express'
import { Document, BLOCKS, Block } from '@contentful/rich-text-types'

import {
  IPageHeader,
  ITimeline,
  IMailingListSignup,
  ISectionHeading,
  ICardSection,
  IStorySection,
  ILogoListSlice,
  ILatestNewsSlice,
  IBigBulletList,
  IStatistics,
  IProcessEntry,
  IFaqList,
  IEmbeddedVideo,
  ISectionWithImage,
} from '../generated/contentfulTypes'

import { Image, mapImage } from './image.model'
import {
  MailingListSignupSlice,
  mapMailingListSignup,
} from './mailingListSignupSlice.model'
import { PageHeaderSlice, mapPageHeaderSlice } from './pageHeaderSlice.model'
import { TimelineSlice, mapTimelineSlice } from './timelineSlice.model'
import { HeadingSlice, mapHeadingSlice } from './headingSlice.model'
import { StorySlice, mapStorySlice } from './storySlice.model'
import { LinkCardSlice, mapLinkCardSlice } from './linkCardSlice.model'
import { LatestNewsSlice, mapLatestNewsSlice } from './latestNewsSlice.model'
import { LogoListSlice, mapLogoListSlice } from './logoListSlice.model'
import { BulletListSlice, mapBulletListSlice } from './bulletListSlice.model'
import { Statistics, mapStatistics } from './statistics.model'
import { Html, mapHtml } from './html.model'
import { ProcessEntry, mapProcessEntry } from './processEntry.model'
import { FaqList, mapFaqList } from './faqList.model'
import { EmbeddedVideo, mapEmbeddedVideo } from './embeddedVideo.model'
import { SectionWithImage, mapSectionWithImage } from './sectionWithImage.model'

type SliceTypes =
  | IPageHeader
  | ITimeline
  | IMailingListSignup
  | ISectionHeading
  | ICardSection
  | IStorySection
  | ILogoListSlice
  | ILatestNewsSlice
  | IBigBulletList
  | IStatistics
  | IProcessEntry
  | IFaqList
  | IEmbeddedVideo
  | ISectionWithImage

export const Slice = createUnionType({
  name: 'Slice',
  types: () => [
    PageHeaderSlice,
    TimelineSlice,
    HeadingSlice,
    StorySlice,
    LinkCardSlice,
    LatestNewsSlice,
    MailingListSignupSlice,
    LogoListSlice,
    BulletListSlice,
    Html,
    Image,
    Statistics,
    ProcessEntry,
    FaqList,
    EmbeddedVideo,
    SectionWithImage,
  ],
})

export const mapSlice = (slice: SliceTypes): typeof Slice => {
  switch (slice.sys.contentType.sys.id) {
    case 'pageHeader':
      return mapPageHeaderSlice(slice as IPageHeader)
    case 'timeline':
      return mapTimelineSlice(slice as ITimeline)
    case 'mailingListSignup':
      return mapMailingListSignup(slice as IMailingListSignup)
    case 'sectionHeading':
      return mapHeadingSlice(slice as ISectionHeading)
    case 'cardSection':
      return mapLinkCardSlice(slice as ICardSection)
    case 'storySection':
      return mapStorySlice(slice as IStorySection)
    case 'logoListSlice':
      return mapLogoListSlice(slice as ILogoListSlice)
    case 'latestNewsSlice':
      return mapLatestNewsSlice(slice as ILatestNewsSlice)
    case 'bigBulletList':
      return mapBulletListSlice(slice as IBigBulletList)
    case 'statistics':
      return mapStatistics(slice as IStatistics)
    case 'processEntry':
      return mapProcessEntry(slice as IProcessEntry)
    case 'faqList':
      return mapFaqList(slice as IFaqList)
    case 'embeddedVideo':
      return mapEmbeddedVideo(slice as IEmbeddedVideo)
    case 'sectionWithImage':
      return mapSectionWithImage(slice as ISectionWithImage)
    default:
      throw new ApolloError(
        `Can not convert to slice: ${(slice as any).sys.contentType.sys.id}`,
      )
  }
}

const isEmptyNode = (node: Block): boolean => {
  return node.content.every((child) => {
    return child.nodeType === 'text' && child.value === ''
  })
}

export const mapDocument = (document: Document, idPrefix: string): Array<typeof Slice> => {
  const slices: Array<typeof Slice> = []

  document.content.forEach((block, index) => {
    switch (block.nodeType) {
      case BLOCKS.EMBEDDED_ENTRY:
        slices.push(mapSlice(block.data.target))
        break
      case BLOCKS.EMBEDDED_ASSET:
        slices.push(mapImage(block.data.target))
        break
      default: {
        // ignore last empty paragraph because of this annoying bug:
        // https://github.com/contentful/rich-text/issues/101
        if (index === document.content.length - 1 && isEmptyNode(block)) return

        // either merge into previous html slice or create a new one
        const prev = slices[slices.length - 1]
        if (prev instanceof Html) {
          prev.document.content.push(block)
        } else {
          slices.push(mapHtml(block, `${idPrefix}:${index}`))
        }
      }
    }
  })

  return slices
}
