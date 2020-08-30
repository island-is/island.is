import React, { FC, ReactNode, Fragment } from 'react'
import {
  Document,
  Block,
  Inline,
  BLOCKS,
  INLINES,
} from '@contentful/rich-text-types'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import slugify from '@sindresorhus/slugify'
import Image from './Image/Image'
import FaqList from './FaqList/FaqList'
import { Slice } from '@island.is/api/schema'
import { Statistics } from './Statistics/Statistics'
import Hyperlink from './Hyperlink/Hyperlink'
import {
  Typography,
  Blockquote,
  Box,
} from '@island.is/island-ui/core'
import ProcessEntry from './ProcessEntry/ProcessEntry'
import EmbeddedVideo from './EmbeddedVideo/EmbeddedVideo'

export interface RenderNode {
  [k: string]: (node: Block | Inline, children: ReactNode) => ReactNode
}

interface RenderConfig {
  renderComponent?: (slice: Slice, renderNode: RenderNode) => ReactNode
  renderWrapper?: (slice: Slice, children: ReactNode) => ReactNode
  renderPadding?: (top: Slice, bottom: Slice) => ReactNode
  renderNode?: RenderNode
}

export const defaultRenderComponent = (
  slice: Slice,
  renderNode: RenderNode,
): ReactNode => {
  switch (slice.__typename) {
    case 'Html':
      return renderHtml(slice.json, renderNode)

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

export const defaultRenderNode: RenderNode = {
  [INLINES.HYPERLINK]: (node: Inline, children: ReactNode): ReactNode => (
    <Hyperlink href={node.data.uri}>{children}</Hyperlink>
  ),
  [BLOCKS.HEADING_2]: (_node: Block, children: ReactNode): ReactNode => (
    <Typography variant="h2" as="h2">
      <span data-sidebar-link={slugify(children.toString())}>{children}</span>
    </Typography>
  ),
  [BLOCKS.HEADING_3]: (_node: Block, children: ReactNode): ReactNode => (
    <Typography variant="h3" as="h3">
      <span data-sidebar-link={slugify(children.toString())}>{children}</span>
    </Typography>
  ),
  [BLOCKS.PARAGRAPH]: (_node: Block, children: ReactNode): ReactNode => (
    <Typography variant="p" as="p">
      {children}
    </Typography>
  ),
  [BLOCKS.QUOTE]: (_node: Block, children: ReactNode): ReactNode => (
    <Blockquote>{children}</Blockquote>
  ),
}

export const renderHtml = (
  doc: Document,
  renderNode: RenderNode = defaultRenderNode,
): ReactNode => {
  return documentToReactComponents(doc, { renderNode })
}

export const defaultRenderPadding = (top: Slice, bottom: Slice): ReactNode => {
  if (top.__typename === bottom.__typename) {
    return <Box paddingTop={3} />
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

export const RichTextV2: FC<{ slices: Slice[]; config?: RenderConfig }> = ({
  slices,
  config,
}) => <>{renderSlices(slices, config)}</>
