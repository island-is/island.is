import { Box } from '@island.is/island-ui/core'
import {
  IntroHeader,
  m,
  ServicePortalModuleComponent,
} from '@island.is/service-portal/core'

import { DelegationsFromMe, DelegationsAccess } from '../../components'
import { useLocale, useNamespaces } from '@island.is/localization'

const AccessControl: ServicePortalModuleComponent = ({ userInfo, client }) => {
  useNamespaces('sp.access-control-delegations')
  const { formatMessage } = useLocale()

  return (
    <DelegationsAccess userInfo={userInfo} client={client}>
      <IntroHeader
        title={formatMessage(m.accessControl)}
        intro={formatMessage({
          id: 'sp.access-control-delegations:header-intro',
          defaultMessage:
            'Hérna kemur listi yfir þau umboð sem þú hefur gefið öðrum. Þú getur eytt umboðum eða bætt við nýjum.',
        })}
      />
      <Box marginTop={8}>
        <DelegationsFromMe />
      </Box>
    </DelegationsAccess>
  )
}

export default AccessControl
