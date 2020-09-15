import React, { FC, ReactNode, Fragment } from 'react'
import {
  Document,
  Block,
  Inline,
  BLOCKS,
  INLINES,
} from '@contentful/rich-text-types'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import Image from './Image/Image'
import FaqList from './FaqList/FaqList'
import { Slice } from '@island.is/api/schema'
import { Statistics } from './Statistics/Statistics'
import Hyperlink from './Hyperlink/Hyperlink'
import {
  Typography,
  Blockquote,
  Box,
  TypographyProps,
  ResponsiveSpace,
} from '@island.is/island-ui/core'
import ProcessEntry from './ProcessEntry/ProcessEntry'
import EmbeddedVideo from './EmbeddedVideo/EmbeddedVideo'
import StaticHtml from './StaticHtml/StaticHtml'
import slugify from '@sindresorhus/slugify'
import { SectionWithImage } from './SectionWithImage/SectionWithImage'

export interface RenderNode {
  [k: string]: (node: Block | Inline, children: ReactNode) => ReactNode
}

type SliceType = Slice['__typename']
type Ordered = 'ordered' | 'unordered'

export interface RenderConfig {
  renderComponent: (slice: Slice, config: RenderConfig) => ReactNode
  renderPadding: (top: Slice, bottom: Slice, config: RenderConfig) => ReactNode
  renderNode: RenderNode
  htmlClassName?: string
  defaultPadding: ResponsiveSpace
  padding: Readonly<Array<[SliceType, SliceType, ResponsiveSpace, Ordered?]>>
}

export const defaultRenderComponent = (
  slice: Slice,
  { renderNode, htmlClassName }: RenderConfig,
): ReactNode => {
  switch (slice.__typename) {
    case 'Html':
      return renderHtml(slice.document, {
        className: htmlClassName,
        renderNode,
      })

    case 'FaqList':
      return <FaqList {...slice} />

    case 'Statistics':
      return <Statistics {...slice} />

    case 'Image':
      return <Image type="apiImage" image={slice} />

    case 'ProcessEntry':
      return <ProcessEntry {...slice} />

    case 'EmbeddedVideo':
      return <EmbeddedVideo {...slice} />

    case 'SectionWithImage':
      return <SectionWithImage {...slice} />

    default:
      // TODO: this should be an exhaustive list of slice types, but some slice
      // types are only used on certain types of pages that are not using this
      // renderer at the moment (e.g. the AboutPage)
      return null
  }
}

const typography = (
  variant: TypographyProps['variant'] & TypographyProps['as'],
  withId = false,
) => (_: Block, children: ReactNode) => (
  <Typography
    id={withId ? slugify(String(children)) : null}
    variant={variant}
    as={variant}
  >
    {children}
  </Typography>
)

export const defaultRenderNode: Readonly<RenderNode> = {
  [BLOCKS.HEADING_1]: typography('h1', true),
  [BLOCKS.HEADING_2]: typography('h2', true),
  [BLOCKS.HEADING_3]: typography('h3', true),
  [BLOCKS.HEADING_4]: typography('h4'),
  [BLOCKS.HEADING_5]: typography('h5'),
  [BLOCKS.PARAGRAPH]: typography('p'),
  [BLOCKS.QUOTE]: (_node: Block, children: ReactNode): ReactNode => (
    <Blockquote>{children}</Blockquote>
  ),
  [INLINES.HYPERLINK]: (node: Inline, children: ReactNode): ReactNode => (
    <Hyperlink href={node.data.uri}>{children}</Hyperlink>
  ),
}

export const renderHtml = (
  document: Document,
  {
    renderNode = defaultRenderNode,
    className,
  }: {
    renderNode?: RenderNode
    className?: string
  } = {},
): ReactNode => {
  return (
    <StaticHtml className={className}>
      {documentToReactComponents(document, { renderNode })}
    </StaticHtml>
  )
}

const matches = (name: string, type: string) => name === '*' || name === type

export const defaultRenderPadding = (
  { __typename: above }: Slice,
  { __typename: below }: Slice,
  config: RenderConfig,
): ReactNode => {
  for (const [a, b, space, order = 'unordered'] of config.padding) {
    if (
      (matches(a, above) && matches(b, below)) ||
      (order === 'unordered' && matches(a, below) && matches(b, above))
    ) {
      return <Box paddingTop={space} />
    }
  }

  return <Box paddingTop={config.defaultPadding} />
}

export const DefaultRenderConfig: RenderConfig = {
  renderComponent: defaultRenderComponent,
  renderPadding: defaultRenderPadding,
  renderNode: defaultRenderNode,
  defaultPadding: 10,
  padding: [] as const,
} as const

export const renderSlices = (
  slices: Slice | Slice[],
  optionalConfig?: Partial<RenderConfig>,
): ReactNode => {
  const config: RenderConfig = {
    ...DefaultRenderConfig,
    ...optionalConfig,
  }

  if (!slices) {
    return null
  }

  if (!Array.isArray(slices)) {
    slices = [slices]
  }

  const components = slices.map((slice, index) => {
    const comp = config.renderComponent(slice, config)
    if (!comp) {
      return null
    }

    return (
      <Fragment key={slice.id}>
        {index > 0 && config.renderPadding(slices[index - 1], slice, config)}
        {comp}
      </Fragment>
    )
  })

  return <>{components.filter(Boolean)}</>
}
