import React from 'react'
import Link from 'next/link'

import { Box, Button, Typography } from '@island.is/island-ui/core'

function NoConnection() {
  return (
    <>
      <Box marginBottom={5}>
        <Typography variant="intro">
          Þú ert ekki skráður prókúruhafi, vinsamlegast hafðu samband við RSK
        </Typography>
      </Box>
      <Link href="/fyrirtaeki">
        <span>
          <Button variant="text">Tilbaka</Button>
        </span>
      </Link>
    </>
  )
}

export default NoConnection
