import React from 'react'
import { Box, TableOfContents as Contents } from '@island.is/island-ui/core'
import { scrollTo } from '../../../../hooks/useScrollSpy'

const TableOfContents = () => {
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
      <Contents
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

export default TableOfContents
