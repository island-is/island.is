import React from 'react'
import { Box, Stack, Typography } from '@island.is/island-ui/core'

import packageSvg from '@island.is/gjafakort-web/assets/ferdagjof-pakki.svg'
import { ReactComponent as AppleSvg } from '@island.is/gjafakort-web/assets/appstore.svg'
import { ReactComponent as GooglePlaySvg } from '@island.is/gjafakort-web/assets/googlePlay.svg'
import { useI18n } from '@island.is/gjafakort-web/i18n'

function AppsSidebar() {
  const {
    t: { user: t },
  } = useI18n()
  return (
    <Stack space={3}>
      <Box background="purple100" padding={3} borderRadius="standard">
        <Stack space={2}>
          <Typography variant="h4" as="h2">
            {t.appStore.title}
          </Typography>
          <Typography variant="p">{t.appStore.content}</Typography>
          <a
            href="https://play.google.com/store/apps/details?id=is.ferdagjof.app"
            rel="noopener noreferrer"
            target="_blank"
          >
            <GooglePlaySvg title={t.appStore.google} />
          </a>
          <a
            href="https://apps.apple.com/is/app/fer%C3%B0agj%C3%B6f/id1514948705"
            rel="noopener noreferrer"
            target="_blank"
          >
            <AppleSvg title={t.appStore.apple} />
          </a>
        </Stack>
      </Box>
      <Box
        textAlign="center"
        padding={3}
        border="standard"
        borderRadius="standard"
      >
        <img src={packageSvg} alt="" />
      </Box>
    </Stack>
  )
}

export default AppsSidebar
