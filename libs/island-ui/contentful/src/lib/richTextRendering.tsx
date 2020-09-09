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
} from '@island.is/island-ui/core'
import ProcessEntry from './ProcessEntry/ProcessEntry'
import EmbeddedVideo from './EmbeddedVideo/EmbeddedVideo'
import StaticHtml from './StaticHtml/StaticHtml'

export interface RenderNode {
  [k: string]: (node: Block | Inline, children: ReactNode) => ReactNode
}

interface RenderConfig {
  renderComponent?: (slice: Slice, renderNode: RenderNode) => ReactNode
  renderWrapper?: (slice: Slice, children: ReactNode) => ReactNode
  renderPadding?: (top: Slice, bottom: Slice) => ReactNode
  renderNode?: RenderNode
  htmlClassName?: string
}

export const defaultRenderComponent = (
  slice: Slice,
  renderNode: RenderNode,
  htmlClassName?: string,
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

    default:
      return null
  }
}

export const defaultRenderWrapper = (
  _slice: Slice,
  children: ReactNode,
): ReactNode => {
  // TODO: when the grid supports it, we'll create a wrapper here to indent
  // left and/or right side when needed
  return children
}

const typography = (
  variant: TypographyProps['variant'] & TypographyProps['as'],
) => (_: Block, children: ReactNode) => (
  <Typography variant={variant} as={variant}>
    {['h2', 'h3'].includes(variant) ? (
      // TODO: stop this data-sidebar-link madness
      <span data-sidebar-link={String(children)}>{children}</span>
    ) : (
      children
    )}
  </Typography>
)

export const defaultRenderNode: Readonly<RenderNode> = {
  [BLOCKS.HEADING_1]: typography('h1'),
  [BLOCKS.HEADING_2]: typography('h2'),
  [BLOCKS.HEADING_3]: typography('h3'),
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

export const defaultRenderPadding = (top: Slice, bottom: Slice): ReactNode => {
  const [a, b] = [top, bottom].map((slice) => slice.__typename)

  if (a === b) {
    return <Box paddingTop={3} />
  }

  if ([a, b].some((s) => s === 'Statistics')) {
    return <Box paddingTop={6} />
  }

  return <Box paddingTop={15} />
}

export const renderSlices = (
  slices?: Slice | Slice[],
  {
    renderComponent = defaultRenderComponent,
    renderWrapper = defaultRenderWrapper,
    renderPadding = defaultRenderPadding,
    renderNode = defaultRenderNode,
  }: RenderConfig = {},
): ReactNode => {
  if (!slices) {
    return null
  }

  if (!Array.isArray(slices)) {
    slices = [slices]
  }

  const components = slices.map((slice, index) => {
    const comp = renderComponent(slice, renderNode)
    if (!comp) {
      return null
    }

    return (
      <Fragment key={slice.__typename + ':' + index}>
        {index > 0 && renderPadding(slices[index - 1], slice)}
        {renderWrapper(slice, comp)}
      </Fragment>
    )
  })

  return <>{components.filter(Boolean)}</>
}

export const RichTextV2: FC<{
  slices: Slice | Slice[]
  config?: RenderConfig
}> = ({ slices, config }) => <>{renderSlices(slices, config)}</>
