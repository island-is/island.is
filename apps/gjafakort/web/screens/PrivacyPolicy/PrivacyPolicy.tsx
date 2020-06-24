import React from 'react'
import HtmlParser from 'react-html-parser'

import { Stack, Typography, Box, Button } from '@island.is/island-ui/core'
import { useI18n } from '@island.is/gjafakort-web/i18n'
import { Layout, AppsSidebar } from '@island.is/gjafakort-web/components'
import Link from 'next/link'

function User() {
  const {
    t: { routes, ...t },
  } = useI18n()
  return (
    <Layout
      left={
        <Box marginBottom={5}>
          <Stack space={4}>
            <Typography variant="h1">{t.privacyPolicy.title}</Typography>
            {t.privacyPolicy.sections.map((section, index) => (
              <Typography variant="p" links key={index}>
                {HtmlParser(section)}
              </Typography>
            ))}
          </Stack>
        </Box>
      }
      right={
        <Stack space={3}>
          <Box background="purple100" padding={4} borderRadius="standard">
            <Box marginBottom={2}>
              <Typography variant="h4">{t.home.cta.users.label}</Typography>
            </Box>
            <Link href={routes.users.home}>
              <Button width="fluid">{t.home.cta.users.content}</Button>
            </Link>
          </Box>
          <AppsSidebar />
        </Stack>
      }
    />
  )
}

export default User
