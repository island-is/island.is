import { Box } from '@island.is/island-ui/core'
import {
  IntroHeader,
  m,
  ServicePortalModuleComponent,
} from '@island.is/service-portal/core'

import { DelegationsFromMe, DelegationsAccessGuard } from '../../components'
import { useLocale, useNamespaces } from '@island.is/localization'

const AccessControl: ServicePortalModuleComponent = (props) => {
  useNamespaces(['sp.settings-access-control', 'sp.access-control-delegations'])
  const { formatMessage } = useLocale()

  return (
    <DelegationsAccessGuard {...props}>
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
    </DelegationsAccessGuard>
  )
}

export default AccessControl
