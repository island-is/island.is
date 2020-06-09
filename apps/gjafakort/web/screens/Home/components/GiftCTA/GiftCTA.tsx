import React from 'react'
import Link from 'next/link'

import { Box, Typography, Button } from '@island.is/island-ui/core'

import packageSvg from '@island.is/gjafakort-web/assets/ferdagjof-pakki.svg'
import { useI18n } from '../../../../i18n'

function GiftCTA() {
  const { t } = useI18n()

  return (
    <Box>
      <Box background="purple100" padding={4} marginBottom={3}>
        <Box marginBottom={2}>
          <Typography variant="h4">{t.intro.users.label}</Typography>
        </Box>
        <Link href="/notandi">
          <span>
            <Button width="fluid" disabled>
              {t.intro.users.content}
            </Button>
          </span>
        </Link>
      </Box>
      <Box background="purple100" padding={4} marginBottom={3}>
        <Box marginBottom={2}>
          <Typography variant="h4">{t.intro.companies.label}</Typography>
        </Box>
        <Link href="/fyrirtaeki">
          <span>
            <Button width="fluid" variant="ghost">
              {t.intro.companies.content}
            </Button>
          </span>
        </Link>
      </Box>
      <Box textAlign="center" padding={3}>
        <img src={packageSvg} alt="" />
      </Box>
    </Box>
  )
}

export default GiftCTA
