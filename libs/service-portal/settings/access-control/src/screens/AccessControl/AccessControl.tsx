import React from 'react'
import { defineMessage } from 'react-intl'

import { Box } from '@island.is/island-ui/core'
import {
  AccessDenied,
  IntroHeader,
  m,
  ServicePortalModuleComponent,
} from '@island.is/service-portal/core'

import { Accesses } from '../../components'
import { useNamespaces } from '@island.is/localization'

const AccessControl: ServicePortalModuleComponent = ({ userInfo, client }) => {
  useNamespaces('sp.settings-access-control')

  const actor = userInfo.profile.actor
  const isDelegation = Boolean(actor)

  const isCompany = userInfo.profile.subjectType === 'legalEntity'

  if (isCompany || isDelegation) {
    return <AccessDenied userInfo={userInfo} client={client} />
  }
  return (
    <Box>
      <IntroHeader
        title={m.accessControl}
        intro={defineMessage({
          id: 'sp.settings-access-control:home-intro',
          defaultMessage:
            'Hérna kemur listi yfir þau umboð sem þú hefur gefið öðrum. Þú getur eytt umboðum eða bætt við nýjum.',
        })}
        img="./assets/images/educationDegree.svg"
      />
      <Accesses />
    </Box>
  )
}

export default AccessControl
