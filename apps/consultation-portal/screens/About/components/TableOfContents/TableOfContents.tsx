import React from 'react'
import { Box, TableOfContents as Contents } from '@island.is/island-ui/core'
import { scrollTo } from '../../../../hooks/useScrollSpy'
import { ABOUT_HEADINGS } from '../../../../utils/consts/consts'
import localization from '../../About.json'

const TableOfContents = () => {
  const loc = localization['tableOfContents']
  return (
    <Box paddingBottom={[3, 3, 0, 0, 0]}>
      <Contents
        tableOfContentsTitle={loc.title}
        headings={ABOUT_HEADINGS.map((item, index) => ({
          headingTitle: item,
          headingId: index.toString(),
        }))}
        onClick={(id) => scrollTo(id, { smooth: true })}
      />
    </Box>
  )
}

export default TableOfContents
