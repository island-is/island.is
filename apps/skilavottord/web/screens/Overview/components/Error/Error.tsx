import { Box, Button, Stack, Typography } from '@island.is/island-ui/core'
import { InlineError } from '@island.is/skilavottord-web/components'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import { useRouter } from 'next/router'
import React from 'react'

export const Error = () => {
  const {
    t: { myCars: t },
  } = useI18n()
  const router = useRouter()

  return (
    <Box paddingBottom={10}>
      <Stack space={4}>
        <Stack space={[3, 3, 2, 2]}>
          <Typography variant="h3">{t.subTitles.active}</Typography>
          <InlineError message={t.error.message} />
        </Stack>
        <Button
          variant="ghost"
          onClick={() => {
            router.reload()
          }}
        >
          {t.error.primaryButton}
        </Button>
      </Stack>
    </Box>
  )
}
