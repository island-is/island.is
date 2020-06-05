import React from 'react'

import { Box, Typography, Stack, Button, Icon } from '@island.is/island-ui/core'
import packageSvg from '@island.is/gjafakort-web/assets/ferdagjof-pakki.svg'
import Layout from '@island.is/gjafakort-web/components/Layout/Layout'

function Congratulations() {
  return (
    <Layout
      left={
        <Box>
          <Box marginBottom={6}>
            <Stack space={3}>
              <Typography variant="h1" as="h1">
                Til hamingju!
              </Typography>
              <Typography variant="intro">
                Á næstu mínútum færð þú sendan tölvupóst þar sem fram koma
                aðgangsupplýsingar að vefsvæði og leiðbeiningar um notkun á
                Ferðagjöfinni.
              </Typography>
            </Stack>
          </Box>
          <Box marginBottom={15}>
            <Button variant="text" size="large">
              Áfram á vefsvæði fyrirtækja{' '}
              <Box marginLeft={1} alignItems="center" display="flex">
                <Icon type="arrowRight" width={16} />
              </Box>
            </Button>
          </Box>
        </Box>
      }
      right={
        <Box textAlign="center" padding={3}>
          <img src={packageSvg} alt="" />
        </Box>
      }
    />
  )
}

export default Congratulations
