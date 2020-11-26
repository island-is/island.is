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
      tableOfContentsTitle={'Table of contents'}
      headings={[
        { headingTitle: 'First heading', headingId: 'firstId' },
        { headingTitle: 'Second heading', headingId: 'secondId' },
        { headingTitle: 'Third heading', headingId: 'thirdId' },
        { headingTitle: 'Fourth heading', headingId: 'fourthId' },
      ]}
      onClick={(selectedHeadingId) =>
        console.log('Navigate to: ', selectedHeadingId)
      }
    />
  </Box>
)
