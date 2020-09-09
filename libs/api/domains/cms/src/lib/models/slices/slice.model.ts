import { createUnionType } from '@nestjs/graphql'
import { ApolloError } from 'apollo-server-express'
import {
  Document,
  BLOCKS,
  Block,
  TopLevelBlock,
} from '@contentful/rich-text-types'

import * as types from '../../generated/contentfulTypes'
import { Image, mapImage } from '../image.model'
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
  ],
})

export const mapSlice = (slice: SliceTypes): typeof Slice => {
  switch (slice.sys.contentType.sys.id) {
    case 'pageHeader':
      return mapPageHeaderSlice(slice as types.IPageHeader)
    case 'timeline':
      return mapTimelineSlice(slice as types.ITimeline)
    case 'mailingListSignup':
      return mapMailingListSignup(slice as types.IMailingListSignup)
    case 'sectionHeading':
      return mapHeadingSlice(slice as types.ISectionHeading)
    case 'cardSection':
      return mapLinkCardSlice(slice as types.ICardSection)
    case 'storySection':
      return mapStorySlice(slice as types.IStorySection)
    case 'logoListSlice':
      return mapLogoListSlice(slice as types.ILogoListSlice)
    case 'latestNewsSlice':
      return mapLatestNewsSlice(slice as types.ILatestNewsSlice)
    case 'bigBulletList':
      return mapBulletListSlice(slice as types.IBigBulletList)
    case 'statistics':
      return mapStatistics(slice as types.IStatistics)
    case 'processEntry':
      return mapProcessEntry(slice as types.IProcessEntry)
    case 'faqList':
      return mapFaqList(slice as types.IFaqList)
    case 'embeddedVideo':
      return mapEmbeddedVideo(slice as types.IEmbeddedVideo)
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

export const mapDocument = (document: Document): Array<typeof Slice> => {
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
          slices.push(mapHtml(block, index))
        }
      }
    }
  })

  return slices
}

// Not used yet?
const mapTopLevelBlock = (
  block: TopLevelBlock,
  index: number,
): typeof Slice | Html => {
  switch (block.nodeType) {
    case BLOCKS.EMBEDDED_ENTRY:
      return mapSlice(block.data.target)

    case BLOCKS.EMBEDDED_ASSET:
      // Only asset we can handle at the moment is an image
      return mapImage(block.data.target)

    // TODO
    default:
      return new Html({
        id: index.toString(),
        document: {
          nodeType: block.nodeType,
          content: block.content,
          data: block.data,
        },
      })
  }
}

export const mapRichText = (document: Document): Array<typeof Slice | Html> => {
  return document.content.map(mapTopLevelBlock)
}
