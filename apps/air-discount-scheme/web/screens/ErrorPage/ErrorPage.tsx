import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import {
  Box,
  Button,
  ContentBlock,
  Typography,
} from '@island.is/island-ui/core'
import {
  SSN_IS_NOT_A_PERSON,
  USER_NOT_OLD_ENOUGH,
} from '@island.is/gjafakort/consts'

import { useI18n } from '../../i18n'

function ErrorPage() {
  const {
    t: { error: t, routes },
  } = useI18n()

  const router = useRouter()
  const { errorType } = router.query

  let intro = t.intro
  if (errorType === SSN_IS_NOT_A_PERSON) {
    intro = t.introKennitalaIsNotAPerson
  } else if (errorType === USER_NOT_OLD_ENOUGH) {
    intro = t.introUserNotOldEnough
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
        <Link href={routes.home}>
          <span>
            <Button>{t.button}</Button>
          </span>
        </Link>
      </ContentBlock>
    </Box>
  )
}

export default ErrorPage
