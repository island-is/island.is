import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import {
  Box,
  ButtonDeprecated as Button,
  ContentBlock,
  Typography,
} from '@island.is/island-ui/core'
import { SSN_IS_NOT_A_PERSON } from '@island.is/air-discount-scheme/consts'
import { useI18n, useTranslations } from '../../i18n'

function ErrorPage() {
  const {
    t: { error: t },
  } = useTranslations()
  const { toRoute } = useI18n()

  const router = useRouter()
  const { errorType } = router.query

  if (!t.title) {
    return null
  }

  let intro = t.intro
  if (errorType === SSN_IS_NOT_A_PERSON) {
    intro = t.introKennitalaIsNotAPerson
  }

  return (
    <Box paddingX="gutter">
      <ContentBlock width="large">
        <Box marginBottom={3}>
          <Typography variant="h1" as="h1">
            {t.title}
          </Typography>
        </Box>
        <Box marginBottom={9}>
          <Typography variant="intro">{intro}</Typography>
        </Box>
        <Link href={toRoute('home')} legacyBehavior>
          <span>
            <Button>{t.button}</Button>
          </span>
        </Link>
      </ContentBlock>
    </Box>
  )
}

ErrorPage.getInitialProps = () => ({})

export default ErrorPage
