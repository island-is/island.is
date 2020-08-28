import React from 'react'
import Link from 'next/link'

import {
  Box,
  Button,
  ContentBlock,
  Typography,
} from '@island.is/island-ui/core'

function ErrorPage() {
  return (
    <Box paddingX="gutter">
      <ContentBlock width="large">
        <Box marginBottom={3}>
          <Typography variant="h1" as="h1">
            Villa kom upp
          </Typography>
        </Box>
        <Box marginBottom={9}>
          <Typography variant="intro">
            Eitthvað hefur farið úrskeiðis, vinsamlega reyndu aftur
          </Typography>
        </Box>
        <Link href="/">
          <span>
            <Button>Aftur heim</Button>
          </span>
        </Link>
      </ContentBlock>
    </Box>
  )
}

export default ErrorPage
