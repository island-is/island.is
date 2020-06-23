import React from 'react'
import HtmlParser from 'react-html-parser'

import { Stack, Typography, Box } from '@island.is/island-ui/core'
import { useI18n } from '@island.is/gjafakort-web/i18n'
import { Layout, AppsSidebar } from '@island.is/gjafakort-web/components'

function User() {
  const {
    t: { privacyPolicy: t },
  } = useI18n()
  return (
    <Layout
      left={
        <Box marginBottom={5}>
          <Stack space={4}>
            <Typography variant="h1">{t.title}</Typography>
            {t.sections.map((section, index) => (
              <Typography variant="p" links key={index}>
                {HtmlParser(section)}
              </Typography>
            ))}
          </Stack>
        </Box>
      }
      right={<AppsSidebar />}
    />
  )
}

export default User
