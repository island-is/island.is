import React from 'react'

import { Box, Typography } from '@island.is/island-ui/core'
import {
  Table,
  Row,
  Head,
  HeadData,
  Body,
  Data,
} from '@island.is/air-discount-scheme-web/components/Table/Table'

interface PropTypes {
  misc: string
}

function Usage({ misc }: PropTypes) {
  return (
    <Box marginBottom={6} paddingTop={6}>
      <Box marginBottom={3}>
        <Typography variant="h3">Notkun á núverandi tímabili</Typography>
      </Box>
      <Table>
        <Head>
          <Row>
            <HeadData>Notandi</HeadData>
            <HeadData>Leggur</HeadData>
            <HeadData>Dagsetning</HeadData>
          </Row>
        </Head>
        <Body>
          <Row>
            <Data>The table body</Data>
            <Data>with two columns</Data>
            <Data>with two columns</Data>
          </Row>
        </Body>
      </Table>
    </Box>
  )
}

export default Usage
