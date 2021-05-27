import React from 'react'
import { defineMessage } from 'react-intl'

import { Box } from '@island.is/island-ui/core'
import { IntroHeader } from '@island.is/service-portal/core'

const access = {
  id: '1234567890',
  name: 'Starfsmaður (CFO)',
  nationalId: '1234567890',
}

function Access() {
  return (
    <Box>
      <IntroHeader
        title={access.name}
        intro={defineMessage({
          id: 'service.portal:access-control-access-intro',
          defaultMessage:
            'Reyndu að lámarka þau réttindi sem þú vilt veita viðkomandi eins mikið og mögulegt er.',
        })}
      />
    </Box>
  )
}

export default Access
