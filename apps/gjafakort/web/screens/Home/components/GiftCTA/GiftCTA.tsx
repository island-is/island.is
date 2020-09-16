import React, { useContext } from 'react'
import Link from 'next/link'

import { Box, Typography, Button } from '@island.is/island-ui/core'

import packageSvg from '@island.is/gjafakort-web/assets/ferdagjof-pakki.svg'
import { UserContext } from '@island.is/gjafakort-web/context'
import { useI18n } from '@island.is/gjafakort-web/i18n'

function GiftCTA() {
  const {
    t: {
      home: { cta: t },
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
          <Typography variant="h4">{t.users.label}</Typography>
        </Box>
        {isAuthenticated ? (
          <Link href={routes.users.home}>
            <Button width="fluid">{t.users.content}</Button>
          </Link>
        ) : (
          <Button width="fluid" href={routes.users.home}>
            {t.users.content}
          </Button>
        )}
      </Box>
      <Box
        background="purple100"
        padding={4}
        marginBottom={3}
        borderRadius="standard"
      >
        <Box marginBottom={2}>
          <Typography variant="h4">{t.companies.label}</Typography>
        </Box>
        <Link href={routes.companies.home}>
          <span>
            <Button width="fluid" variant="blueGhost">
              {t.companies.content}
            </Button>
          </span>
        </Link>
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

export default GiftCTA
