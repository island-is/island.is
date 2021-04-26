import React from 'react'
import { defineMessage } from 'react-intl'
import { Box } from '@island.is/island-ui/core'
import { useNamespaces } from '@island.is/localization'
import { IntroHeader } from '@island.is/service-portal/core'

function Endorsements(): JSX.Element {
  useNamespaces('sp.endorsements')

  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={defineMessage({
          id: 'service.portal:endorsements-title',
          defaultMessage: 'Meðmæli',
        })}
        intro={defineMessage({
          id: 'service.portal:endorsements-intro',
          defaultMessage: 'Hér birtist listi af undirskriftunum þínum',
        })}
      />
    </Box>
  )
}

export default Endorsements
