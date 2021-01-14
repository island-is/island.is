import React from 'react'
import { BLOCKS, INLINES } from '@contentful/rich-text-types'
import { Asset } from 'contentful'
import Hyperlink from '../Hyperlink/Hyperlink'
import {
  getTextStyles,
  Blockquote,
  ResponsiveSpace,
  Box,
} from '@island.is/island-ui/core'
import slugify from '@sindresorhus/slugify'
import { RenderNode } from '@contentful/rich-text-react-renderer'
import * as styles from './RichText.treat'

const defaultHeaderMargins: {
  marginBottom: ResponsiveSpace
  marginTop: ResponsiveSpace
} = { marginBottom: 2, marginTop: [5, 5, 5, 6] }

const componentMargins: {
  marginBottom: ResponsiveSpace
  marginTop: ResponsiveSpace
} = { marginBottom: [5, 5, 5, 6], marginTop: [5, 5, 5, 6] }

export const defaultRenderNode: RenderNode = {
  [BLOCKS.HEADING_1]: (_node, children) => (
    <Box
      id={slugify(String(children))}
      component="h1"
      className={getTextStyles({ variant: 'h1' }) + ' ' + styles.heading}
      {...defaultHeaderMargins}
    >
      {children}
    </Box>
  ),
  [BLOCKS.HEADING_2]: (_node, children) => (
    <Box
      id={slugify(String(children))}
      component="h2"
      className={getTextStyles({ variant: 'h2' }) + ' ' + styles.heading}
      {...defaultHeaderMargins}
    >
      {children}
    </Box>
  ),
  [BLOCKS.HEADING_3]: (_node, children) => (
    <Box
      id={slugify(String(children))}
      component="h3"
      className={getTextStyles({ variant: 'h3' }) + ' ' + styles.heading}
      {...defaultHeaderMargins}
    >
      {children}
    </Box>
  ),
  [BLOCKS.HEADING_4]: (_node, children) => (
    <Box
      id={slugify(String(children))}
      component="h4"
      className={getTextStyles({ variant: 'h4' }) + ' ' + styles.heading}
      {...defaultHeaderMargins}
    >
      {children}
    </Box>
  ),
  [BLOCKS.HEADING_5]: (_node, children) => (
    <Box
      component="h5"
      className={getTextStyles({ variant: 'h5' }) + ' ' + styles.heading}
      {...defaultHeaderMargins}
    >
      {children}
    </Box>
  ),
  [BLOCKS.PARAGRAPH]: (_node, children) => (
    <Box component="p" className={getTextStyles({}) + ' ' + styles.paragraph}>
      {children}
    </Box>
  ),
  [BLOCKS.OL_LIST]: (_node, children) => (
    <Box component="ol" className={styles.orderedList}>
      {children}
    </Box>
  ),
  [BLOCKS.UL_LIST]: (_node, children) => (
    <Box component="ul" className={styles.unorderedList}>
      {children}
    </Box>
  ),
  [BLOCKS.LIST_ITEM]: (_node, children) => (
    <Box component="li" className={styles.listItem}>
      {children}
    </Box>
  ),
  [BLOCKS.QUOTE]: (_node, children) => (
    <Box {...componentMargins}>
      <Blockquote>{children}</Blockquote>
    </Box>
  ),
  [BLOCKS.HR]: () => (
    <Box {...componentMargins}>
      <hr />
    </Box>
  ),
  [INLINES.HYPERLINK]: (node, children) => (
    <Hyperlink href={node.data.uri}>{children}</Hyperlink>
  ),
  [INLINES.ASSET_HYPERLINK]: (node, children) => {
    const asset = (node.data.target as unknown) as Asset
    return asset.fields.file?.url ? (
      <Hyperlink href={asset.fields.file.url}>{children}</Hyperlink>
    ) : null
  },
}
