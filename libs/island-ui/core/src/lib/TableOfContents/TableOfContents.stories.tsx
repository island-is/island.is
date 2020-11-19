import React from 'react'
import { Box } from '../Box/Box'
import { TableOfContents } from './TableOfContents'

export default {
  title: 'Navigation/TableOfContents',
  component: TableOfContents,
}

export const TableOfContentsExample = () => (
  <Box paddingTop={3}>
    <TableOfContents
      title={'Table of contents'}
      headings={['First heading', 'Second heading', 'Third heading', 'Fourth heading']}
      onClick={(text) => console.log(text)}
    />
  </Box>
)
