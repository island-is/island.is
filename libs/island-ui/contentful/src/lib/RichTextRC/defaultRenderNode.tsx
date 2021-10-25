import React from 'react'
import { BLOCKS, INLINES } from '@contentful/rich-text-types'
import { Asset } from 'contentful'
import { RenderNode } from '@contentful/rich-text-react-renderer'
import slugify from '@sindresorhus/slugify'
import {
  getTextStyles,
  Blockquote,
  ResponsiveSpace,
  Box,
} from '@island.is/island-ui/core'
import Hyperlink from '../Hyperlink/Hyperlink'

import * as styles from './RichText.css'

const defaultHeaderMargins: {
  marginBottom: ResponsiveSpace
  marginTop: ResponsiveSpace
} = { marginBottom: 2, marginTop: [5, 5, 5, 6] }

const componentMargins: {
  marginBottom: ResponsiveSpace
  marginTop: ResponsiveSpace
} = { marginBottom: [5, 5, 5, 6], marginTop: [5, 5, 5, 6] }

// Searches render node children recursively for the text
const getInnerText = (node: any): string => {
  if (typeof node === 'string') {
    return node
  }

  // we check all entries of this array for a valid string value
  if (Array.isArray(node)) {
    // check all array entries and return the first non empty string
    for (const entry of node) {
      // if the array entry is a non empty string return it
      if (typeof entry === 'string' && entry.length) {
        return entry
      } else {
        // the entry is an array or an object, try and find an embedded string
        const foundValue = getInnerText(entry)
        if (foundValue.length) {
          return foundValue
        }
      }
    }
  }

  if (typeof node === 'object' && node) {
    const inner = node?.props?.children ?? null
    return getInnerText(inner)
  }

  return ''
}
export const defaultRenderNode: RenderNode = {
  [BLOCKS.HEADING_1]: (_node, children) => (
    <Box
      id={slugify(getInnerText(children))}
      component="h1"
      className={getTextStyles({ variant: 'h1' }) + ' ' + styles.heading}
      {...defaultHeaderMargins}
    >
      {children}
    </Box>
  ),
  [BLOCKS.HEADING_2]: (_node, children) => (
    <Box
      id={slugify(getInnerText(children))}
      component="h2"
      className={getTextStyles({ variant: 'h2' }) + ' ' + styles.heading}
      {...defaultHeaderMargins}
    >
      {children}
    </Box>
  ),
  [BLOCKS.HEADING_3]: (_node, children) => (
    <Box
      id={slugify(getInnerText(children))}
      component="h3"
      className={getTextStyles({ variant: 'h3' }) + ' ' + styles.heading}
      {...defaultHeaderMargins}
    >
      {children}
    </Box>
  ),
  [BLOCKS.HEADING_4]: (_node, children) => (
    <Box
      id={slugify(getInnerText(children))}
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
  [BLOCKS.HEADING_6]: (_node, children) => (
    <Box
      component="p"
      className={getTextStyles({ variant: 'intro' }) + ' ' + styles.heading}
      marginTop={4}
      marginBottom={2}
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
