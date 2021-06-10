import React from 'react'
import cn from 'classnames'
import DOMPurify from 'isomorphic-dompurify'
import HtmlParser, { Transform, Options, processNodes } from 'react-html-parser'
import { Hyperlink } from '@island.is/island-ui/contentful'
import { Box, getTextStyles, ResponsiveSpace } from '@island.is/island-ui/core'

import * as styles from './render-html.treat'

const paragraphTextClassNames = getTextStyles({}) + ' ' + styles.paragraph

const defaultHeaderMargins: {
  marginBottom: ResponsiveSpace
  marginTop: ResponsiveSpace
} = { marginBottom: 2, marginTop: [5, 5, 5, 6] }

const headingTags = ['h1', 'h2', 'h3', 'h4', 'h5']

const transform: Transform = (node, index) => {
  if (node.type === 'tag' && node.name === 'ul') {
    return (
      <Box key={index} component="ul" className={styles.unorderedList}>
        {processNodes(node.children, transform)}
      </Box>
    )
  }

  if (node.type === 'tag' && node.name === 'li') {
    return (
      <Box
        key={index}
        component="li"
        className={cn(styles.listItem, paragraphTextClassNames)}
      >
        {processNodes(node.children, transform)}
      </Box>
    )
  }

  if (node.type === 'tag' && node.name === 'p') {
    return (
      <Box key={index} component="p" className={paragraphTextClassNames}>
        {processNodes(node.children, transform)}
      </Box>
    )
  }

  if (node.type === 'tag' && node.name === 'a') {
    return (
      <Hyperlink key={index} href={node.attribs.href}>
        {processNodes(node.children, transform)}
      </Hyperlink>
    )
  }

  if (node.type === 'tag' && headingTags.includes(node.name)) {
    return (
      <Box
        component={node.name}
        className={getTextStyles({ variant: node.name }) + ' ' + styles.heading}
        {...defaultHeaderMargins}
      >
        {processNodes(node.children, transform)}
      </Box>
    )
  }

  // [BLOCKS.UL_LIST]: (_node, children) => (
  //   <Box component="ul" className={styles.unorderedList}>
  //     {children}
  //   </Box>
  // ),
  // [BLOCKS.LIST_ITEM]: (_node, children) => (
  //   <Box component="li" className={styles.listItem}>
  //     {children}
  //   </Box>
  // ),

  // if (node.type === 'tag' && node.name === 'li') {
  //   return <unorderedList key={index}>{processNodes(node.children, transform)}</Text>
  // }
}

const options: Options = {
  transform,
}

export const renderHtml = (html: string) => {
  if (!html) {
    return null
  }

  const cleanHtml = DOMPurify.sanitize(html)
  return HtmlParser(cleanHtml, options)
}

export default renderHtml
