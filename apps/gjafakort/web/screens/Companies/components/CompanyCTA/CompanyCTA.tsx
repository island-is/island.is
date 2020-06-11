import React from 'react'
import Link from 'next/link'

import { Box, Typography, Button } from '@island.is/island-ui/core'

import { useI18n } from '@island.is/gjafakort-web/i18n'
import packageSvg from '@island.is/gjafakort-web/assets/ferdagjof-pakki.svg'

function CompanyCTA() {
  const { t } = useI18n()

  return (
    <Box>
      <Box background="purple100" padding={4} marginBottom={3}>
        <Box marginBottom={2}>
          <Typography variant="h4">{t.companies.cta.label}</Typography>
        </Box>
        <Link href="/fyrirtaeki/umsokn">
          <span>
            <Button width="fluid">{t.companies.cta.content}</Button>
          </span>
        </Link>
      </Box>
      <Box textAlign="center" padding={3}>
        <img src={packageSvg} alt="" />
      </Box>
    </Box>
  )
}

export default CompanyCTA
