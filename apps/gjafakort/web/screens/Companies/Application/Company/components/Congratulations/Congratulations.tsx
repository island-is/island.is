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
                Núna getur þú skráð til inn á vefsvæði fyrirtækja
              </Typography>
              <Typography variant="p">
                Á vefsvæðinu er hægt að fylgjast með notkun á Ferðagjöfinni, slá
                inn strikamerki og stofnað fleiri aðganga.
              </Typography>
              <Button
                variant="text"
                size="large"
                href="https://manager.yay.is/Account/Login?ReturnUrl=%2F"
              >
                Áfram á vefsvæði fyrirtækja{' '}
                <Box marginLeft={1} alignItems="center" display="flex">
                  <Icon type="arrowRight" width={16} />
                </Box>
              </Button>
              <Typography variant="p">
                Þú færð tölvupóst frá YaY ehf með aðgangsupplýsingum um
                vefsvæðið. YaY er tæknibirgi Ferðagjafarinnar og sér um Appið
                fyrir notendur og vefsvæði fyrirtækja.
              </Typography>
              <Typography variant="p">
                Ferðamálastofa sér um eftirlit með skráningu fyrirtækja, ef
                fyrirtæki eru ekki með tilsett leyfi verður aðgangur þeirra að
                Ferðagjöfinni lokaður.
              </Typography>
            </Stack>
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
