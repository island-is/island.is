import React from 'react'
import { Box, TableOfContents } from '@island.is/island-ui/core'
import { scrollTo } from '../../utils/helpers/useScrollSpy'

const RightSideColumn = () => {
  const aboutHeadings = [
    'Ábyrgð og umsjón',
    'Markmið',
    'Efni',
    'Ritun umsagna',
    'Birting umsagna',
    'Reglur',
    'Eftirfylgni',
    'Forsaga',
  ]

  return (
    <Box paddingBottom={[3, 3, 0, 0, 0]}>
      <TableOfContents
        tableOfContentsTitle={'Efnisyfirlit'}
        headings={aboutHeadings.map((item, index) => ({
          headingTitle: item,
          headingId: index.toString(),
        }))}
        onClick={(id) => scrollTo(id, { smooth: true })}
      />
    </Box>
  )
}

export default RightSideColumn
