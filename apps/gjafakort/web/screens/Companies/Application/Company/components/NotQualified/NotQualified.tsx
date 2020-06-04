import React from 'react'
import Link from 'next/link'

import { Box, Button, Typography } from '@island.is/island-ui/core'
import { FormLayout } from '@island.is/gjafakort-web/components'

function NoConnection() {
  return (
    <FormLayout>
      <Box marginBottom={2}>
        <Typography variant="h1" as="h1">
          Ófullnægjandi kröfur
        </Typography>
      </Box>
      <Box marginBottom={6}>
        <Typography variant="intro">
          Því miður stenst fyrirtækið ekki þær kröfur til að geta tekið þátt í
          Ferðagjöfnni. Fyrir nánari upplýsinga hafðu samband við ?
        </Typography>
      </Box>
      <Link href="/fyrirtaeki/umsokn">
        <span>
          <Button variant="text">Tilbaka</Button>
        </span>
      </Link>
    </FormLayout>
  )
}

export default NoConnection
