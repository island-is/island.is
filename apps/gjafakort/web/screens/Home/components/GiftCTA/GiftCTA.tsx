import React from 'react'
import Link from 'next/link'

import { Box, Typography, Button } from '@island.is/island-ui/core'

import packageSvg from '../../../../assets/ferdagjof-pakki.svg'

function GiftCTA() {
  return (
    <Box>
      <Box background="purple100" padding={4} marginBottom={3}>
        <Box marginBottom={2}>
          <Typography variant="h4">Einstaklingar</Typography>
        </Box>
        <Link href="/notendur">
          <span>
            <Button width="fluid">Sækja Ferðagjöf</Button>
          </span>
        </Link>
      </Box>
      <Box background="purple100" padding={4} marginBottom={3}>
        <Box marginBottom={2}>
          <Typography variant="h4">Ferðaþjónustufyrirtæki</Typography>
        </Box>
        <Link href="/fyrirtaeki">
          <span>
            <Button width="fluid" variant="ghost">
              Skrá fyrirtæki
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
