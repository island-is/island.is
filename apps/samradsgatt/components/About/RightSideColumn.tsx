import React from 'react'
import { Box, TableOfContents } from '@island.is/island-ui/core'

interface RightSideColumnProps {
  aboutHeadings: Array<unknown>
}

const RightSideColumn: React.FC<RightSideColumnProps> = ({ aboutHeadings }) => {
  // TODO: remove after data has been obtained
  aboutHeadings = [
    {
      headingId: 'Heading 1',
      headingTitle: 'Heading 1',
    },
    {
      headingId: 'Heading 2',
      headingTitle: 'Heading 2',
    },
    {
      headingId: 'Heading 3',
      headingTitle: 'Heading 3',
    },
    {
      headingId: 'Heading 4',
      headingTitle: 'Heading 4',
    },
  ]

  return (
    <Box paddingTop={12} paddingLeft={10}>
      <TableOfContents
        tableOfContentsTitle={'Efnisyfirlit'}
        headings={aboutHeadings.map(({ headingId, headingTitle }) => ({
          headingTitle: headingTitle,
          headingId: headingId,
        }))}
        onClick={
          (selectedHeadingId) => console.log('Navigate to: ', selectedHeadingId)
          //   onClick={(id) => scrollTo(id, { smooth: true })}
        }
      />
    </Box>
  )
}

export default RightSideColumn
