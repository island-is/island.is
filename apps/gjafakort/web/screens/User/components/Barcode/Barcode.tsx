import React from 'react'
import { Box, Stack, Tiles, Typography } from '@island.is/island-ui/core'
import { ReactComponent as BarcodeSvg } from '@island.is/gjafakort-web/assets/barcodeMock.svg'
import { Countdown } from '../Countdown'

const Barcode = () => {
  return (
    <Tiles space={5} columns={[1, 2]}>
      <Box textAlign="center">
        <Stack space={1}>
          <BarcodeSvg width="100%" height="auto" />
          <Typography variant="h3">Virði</Typography>
          <Typography variant="h1">5.000 kr.</Typography>
        </Stack>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="full"
      >
        <Typography variant="h5">Strikamerki rennur út eftir</Typography>
        <Typography variant="h1">
          <Countdown minutes={10} /> mín
        </Typography>
      </Box>
    </Tiles>
  )
}

export default Barcode
