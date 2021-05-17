import React from 'react'
import { defineMessage } from 'react-intl'

import { Text, Box } from '@island.is/island-ui/core'
import { IntroHeader } from '@island.is/service-portal/core'

function AccessControl(): JSX.Element {
  return (
    <Box>
      <IntroHeader
        title={defineMessage({
          id: 'service.portal:access-control-title',
          defaultMessage: 'Aðgangsstýring',
        })}
        intro={defineMessage({
          id: 'service.portal:access-control-intro',
          defaultMessage:
            'Hérna kemur listi yfir þau umboð sem þú hefur gefið öðrum. Þú getur eytt umboðum eða bætt við nýjum.',
        })}
      />
    </Box>
  )
}

export default AccessControl
