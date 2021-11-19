import React from 'react'
import { defineMessage } from 'react-intl'

import { Box } from '@island.is/island-ui/core'
import { IntroHeader, m } from '@island.is/service-portal/core'

import { Accesses } from './components'

function AccessControl(): JSX.Element {
  return (
    <Box>
      <IntroHeader
        title={m.accessControl}
        intro={defineMessage({
          id: 'service.portal.settings.accessControl:home-intro',
          defaultMessage:
            'Hérna kemur listi yfir þau umboð sem þú hefur gefið öðrum. Þú getur eytt umboðum eða bætt við nýjum.',
        })}
      />
      <Accesses />
    </Box>
  )
}

export default AccessControl
