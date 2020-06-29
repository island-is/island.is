import React, { useContext } from 'react'
import Link from 'next/link'

import { Box, Typography, Button } from '@island.is/island-ui/core'

import { useI18n } from '@island.is/gjafakort-web/i18n'
import { UserContext } from '@island.is/gjafakort-web/context'
import packageSvg from '@island.is/gjafakort-web/assets/ferdagjof-pakki.svg'

function CompanyCTA() {
  const {
    t: {
      companies: { cta: t },
      routes,
    },
  } = useI18n()
  const { isAuthenticated } = useContext(UserContext)

  return (
    <Box>
      <Box
        background="purple100"
        padding={4}
        marginBottom={3}
        borderRadius="standard"
      >
        <Box marginBottom={2}>
          <Typography variant="h4">{t.label}</Typography>
        </Box>
        {isAuthenticated ? (
          <Link href={routes.companies.application}>
            <Button width="fluid">{t.content}</Button>
          </Link>
        ) : (
          <Button width="fluid" href={routes.companies.application}>
            {t.content}
          </Button>
        )}
      </Box>
      <Box
        textAlign="center"
        padding={3}
        border="standard"
        borderRadius="standard"
      >
        <img src={packageSvg} alt="" />
      </Box>
    </Box>
  )
}

export default CompanyCTA
