import React from 'react'
import Link from 'next/link'

import { Box, Button, Typography } from '@island.is/island-ui/core'

import { useI18n } from '@island.is/gjafakort-web/i18n'

function NoConnection() {
  const {
    t: {
      application: { noConnection: t },
      routes,
    },
  } = useI18n()

  return (
    <>
      <Box marginBottom={5}>
        <Typography variant="intro">{t.content}</Typography>
      </Box>
      <Link href={routes.companies.home}>
        <span>
          <Button variant="text">{t.content}</Button>
        </span>
      </Link>
    </>
  )
}

export default NoConnection
