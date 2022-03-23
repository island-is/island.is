import React from 'react'
import { defineMessage } from 'react-intl'

import { Box } from '@island.is/island-ui/core'
import { IntroHeader, m } from '@island.is/service-portal/core'

import { Accesses } from '../../components'
import { useNamespaces } from '@island.is/localization'

function AccessControl(): JSX.Element {
  useNamespaces('sp.settings-access-control')

  return (
    <Box>
      <IntroHeader
        title={m.accessControl}
        intro={defineMessage({
          id: 'sp.settings-access-control:home-intro',
          defaultMessage:
            'Hér birtist listi yfir þau umboð sem þú hefur gefið öðrum á Mínum síðum Ísland.is. Þú getur veitt umboð fyrir þín gögn til að mynda Pósthólf og Fjármál. Þú getur líka eytt umboðum, bætt við nýjum og stýrt tímalengd þeirra.',
        })}
        img="./assets/images/educationDegree.svg"
      />
      <Accesses />
    </Box>
  )
}

export default AccessControl
