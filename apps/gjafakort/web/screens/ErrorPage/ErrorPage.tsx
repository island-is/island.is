import React from 'react'
import Link from 'next/link'

import {
  Box,
  Button,
  ContentBlock,
  Typography,
} from '@island.is/island-ui/core'

import { useI18n } from '../../i18n'

function ErrorPage() {
  const { t } = useI18n()

  return (
    <Box marginTop={12}>
      <ContentBlock width="large">
        <Box marginBottom={3}>
          <Typography variant="h1" as="h1">
            {t.error.title}
          </Typography>
        </Box>
        <Box marginBottom={9}>
          <Typography variant="intro">{t.error.content}</Typography>
        </Box>
        <Link href="/">
          <span>
            <Button>{t.error.button}</Button>
          </span>
        </Link>
      </ContentBlock>
    </Box>
  )
}

export default ErrorPage
