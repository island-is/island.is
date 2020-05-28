import React from 'react'
import Link from 'next/link'

import {
  Box,
  ContentBlock,
  Column,
  Columns,
  Button,
  Typography,
} from '@island.is/island-ui/core'

function NoConnection() {
  return (
    <ContentBlock width="large">
      <Columns space="gutter" collapseBelow="lg">
        <Column width="2/3">
          <Box
            background="blue100"
            paddingX={[5, 12]}
            paddingY={[5, 9]}
            marginTop={12}
          >
            <Box marginBottom={2}>
              <Typography variant="h1" as="h1">
                Ófullnægjandi kröfur
              </Typography>
            </Box>
            <Box marginBottom={6}>
              <Typography variant="intro">
                Því miður stenst fyrirtækið ekki þær kröfur til að geta tekið
                þátt í Ferðagjöfnni. Fyrir nánari upplýsinga hafðu samband við ?
              </Typography>
            </Box>
            <Link href="/fyrirtaeki">
              <span>
                <Button variant="text">Tilbaka</Button>
              </span>
            </Link>
          </Box>
        </Column>
      </Columns>
    </ContentBlock>
  )
}

export default NoConnection
