import React, { Fragment, ReactNode } from 'react'
import { Document } from '@contentful/rich-text-types'
import {
  documentToReactComponents,
  Options,
} from '@contentful/rich-text-react-renderer'
import { Locale } from '@island.is/shared/types'

import { ImageProps } from '../Image/Image'
import { FaqListProps } from '../FaqList/FaqList'
import { StatisticsProps } from '../Statistics/Statistics'
import { AssetLinkProps } from '../AssetLink/AssetLink'
import { LinkCardProps } from '../LinkCard/LinkCard'
import { ProcessEntryProps } from '../ProcessEntry/ProcessEntry'
import { EmbeddedVideoProps } from '../EmbeddedVideo/EmbeddedVideo'
import { SectionWithImageProps } from '../SectionWithImage/SectionWithImage'
import { SectionWithVideoProps } from '../SectionWithVideo/SectionWithVideo'
import { TeamListProps } from '../TeamList/TeamList'
import { ContactUsProps } from '../ContactUs/ContactUs'
import { LocationProps } from '../Location/Location'
import { TellUsAStoryFormProps } from '../TellUsAStoryForm/TellUsAStoryForm'
import { defaultRenderNodeObject } from './defaultRenderNode'
import { defaultRenderMarkObject } from './defaultRenderMark'
import { defaultRenderComponentObject } from './defaultRenderComponents'
import { Box } from '@island.is/island-ui/core'

type HtmlSlice = { __typename: 'Html'; id: string; document: Document }
type FaqListSlice = { __typename: 'FaqList'; id: string } & FaqListProps
type ConnectedComponentSlice = {
  __typename: 'ConnectedComponent'
  id: string
  title: string
  json: string
  componentType: string
}
type StatisticsSlice = {
  __typename: 'Statistics'
  id: string
} & StatisticsProps
type ImageSlice = { __typename: 'Image'; id: string } & Omit<
  ImageProps,
  'thumbnail'
>
type AssetSlice = { __typename: 'Asset'; id: string } & AssetLinkProps
type LinkCardSlice = { __typename: 'LinkCard'; id: string } & LinkCardProps
type ProcessEntrySlice = {
  __typename: 'ProcessEntry'
  id: string
} & ProcessEntryProps
type EmbeddedVideoSlice = {
  __typename: 'EmbeddedVideo'
  id: string
} & EmbeddedVideoProps
type TeamListSlice = { __typename: 'TeamList'; id: string } & TeamListProps
type LocationSlice = { __typename: 'Location'; id: string } & LocationProps
type ContactUsSlice = { __typename: 'ContactUs'; id: string } & Omit<
  ContactUsProps,
  'state' | 'onSubmit'
>
type TellUsAStorySlice = { __typename: 'TellUsAStory'; id: string } & Omit<
  TellUsAStoryFormProps,
  'state' | 'onSubmit'
>
type SectionWithImageSlice = {
  __typename: 'SectionWithImage'
  id: string
} & SectionWithImageProps
type SectionWithVideoSlice = {
  __typename: 'SectionWithVideo'
  id: string
} & SectionWithVideoProps

export type SliceType =
  | HtmlSlice
  | FaqListSlice
  | ConnectedComponentSlice
  | StatisticsSlice
  | ImageSlice
  | AssetSlice
  | LinkCardSlice
  | ProcessEntrySlice
  | EmbeddedVideoSlice
  | TeamListSlice
  | ContactUsSlice
  | LocationSlice
  | TellUsAStorySlice
  | SectionWithImageSlice
  | SectionWithVideoSlice
  | {
      // TODO: these are used on the about page - we need to move their rendering
      // to here to make them re-usable by other page types
      __typename:
        | 'TimelineSlice'
        | 'HeadingSlice'
        | 'LinkCardSection'
        | 'EmailSignup'
        | 'StorySlice'
        | 'LatestNewsSlice'
        | 'LogoListSlice'
        | 'BulletListSlice'
        | 'TabSection'
      id: string
    }

type RichText = (
  richTextDocument: SliceType[],
  options?:
    | {
        renderNode: Options['renderNode']
        renderMark: Options['renderMark']
        renderComponent: {
          [slice in keyof typeof defaultRenderComponentObject]: (
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore make web strict
            SliceType,
          ) => ReactNode
        }
      }
    | { renderNode?: {}; renderMark?: {}; renderComponent?: {} },
  locale?: Locale,
) => React.ReactNode

export const richText: RichText = (
  documents,
  opt = { renderNode: {}, renderMark: {}, renderComponent: {} },
  locale = 'is',
) => {
  const options = {
    renderText: (text: string) => {
      return (
        text
          .split('\n')
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore make web strict
          .reduce((children: string[], textSegment: string, index: number) => {
            return [...children, index > 0 && <br key={index} />, textSegment]
          }, [])
      )
    },
    renderNode: { ...defaultRenderNodeObject, ...opt.renderNode },
    renderMark: { ...defaultRenderMarkObject, ...opt.renderMark },
  }
  const renderComponent = {
    ...defaultRenderComponentObject,
    ...opt.renderComponent,
    locale,
  }
  return documents.map((slice) => {
    if (slice.__typename === 'Html') {
      return (
        <Fragment key={slice.id}>
          {documentToReactComponents(slice.document, options)}
        </Fragment>
      )
    }
    return (
      <Box
        key={slice.id}
        id={slice.id}
        marginBottom={[5, 5, 5, 6]}
        marginTop={[5, 5, 5, 6]}
      >
        {/**
         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
         // @ts-ignore make web strict */}
        {renderComponent[slice.__typename]?.(slice, locale)}
      </Box>
    )
  })
}
