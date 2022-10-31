import { Box } from '@island.is/island-ui/core'
import { IntroHeader, m } from '@island.is/service-portal/core'

import { DelegationsFromMe } from '../../components/delegations/DelegationsFromMe'
import { useLocale, useNamespaces } from '@island.is/localization'

const AccessControl = () => {
  useNamespaces(['sp.settings-access-control', 'sp.access-control-delegations'])
  const { formatMessage } = useLocale()

  return (
    <>
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
    </>
  )
}

export default AccessControl
