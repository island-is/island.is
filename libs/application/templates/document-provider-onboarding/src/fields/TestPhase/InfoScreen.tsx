import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text, Link } from '@island.is/island-ui/core'
import { m } from '../../forms/messages'
import { useLocale } from '@island.is/localization'

const InfoScreen: FC<FieldBaseProps> = ({ field, application }) => {
  return (
    <Box marginTop={[2, 3]}>
      <Box>
        <Text>{m.testPhaseInfoScreenMessage.defaultMessage}</Text>
      </Box>
      <Box marginTop={[2, 3]}>
        <Link
          href="http://assets.ctfassets.net/8k0h54kbe6bj/Cy8xoQ5fX1Cef99GVYH4L/d12d148dace0528d67e59da19e732304/Design-1.0.0-DocumentProviders.pdf"
          color="blue400"
          underline="small"
          underlineVisibility="always"
          shallow={true}
        >
          Tæknilýsing vegna samskipta skjalaveitu við Pósthólf (aðeins á ensku)
        </Link>
      </Box>
      <Box marginTop={[2, 3]}>
        <Link
          href="https://github.com/digitaliceland/postholf-demo"
          color="blue400"
          underline="small"
          underlineVisibility="always"
        >
          Sýnidæmi á Github fyrir samskipti við Pósthólf island.is
        </Link>
      </Box>
      <Box marginTop={[2, 3]}>
        <Link
          href="http://assets.ctfassets.net/8k0h54kbe6bj/1MkIyeKtuc7c6BlbmKIOYz/c987f9e6a5d9a5284887869671c178a8/oryggisgatlisti-postholf.pdf"
          color="blue400"
          underline="small"
          underlineVisibility="always"
        >
          Öryggiskröfur sem gerðar eru til skjalaveitna
        </Link>
      </Box>
      <Box marginTop={[2, 3]}>
        <Text>Skjöl þurfa að vera á PDF formi</Text>
      </Box>
    </Box>
  )
}

export default InfoScreen
