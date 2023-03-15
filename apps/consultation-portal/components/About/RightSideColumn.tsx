import React from 'react'
import { Box, TableOfContents } from '@island.is/island-ui/core'

const RightSideColumn = () => {
  // TODO: remove after data has been obtained
  const aboutHeadings = ['Heading 1', 'Heading 2', 'Heading 3', 'Heading 4']

  return (
    <Box paddingBottom={[3, 3, 0, 0, 0]}>
      <TableOfContents
        tableOfContentsTitle={'Efnisyfirlit'}
        headings={aboutHeadings.map((item, index) => ({
          headingTitle: item,
          headingId: index.toString(),
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
