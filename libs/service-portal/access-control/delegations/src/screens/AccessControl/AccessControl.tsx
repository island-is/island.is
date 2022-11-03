import { useHistory } from 'react-router-dom'
import { useLocation } from 'react-use'
import { Box, Tabs } from '@island.is/island-ui/core'
import {
  IntroHeader,
  m,
  ServicePortalPath,
} from '@island.is/service-portal/core'

import { DelegationsToMe } from '../../components/delegations/DelegationsToMe'
import { DelegationsFromMe } from '../../components/delegations/DelegationsFromMe'
import { useLocale, useNamespaces } from '@island.is/localization'

const TAB_DELEGATION_TO_FROM_ID = '0'
const TAB_DELEGATION_TO_ME_ID = '1'
const DELEGATIONS_TO_ME_PATH = `${ServicePortalPath.MinarSidurPath}${ServicePortalPath.AccessControlDelegationsToMe}`

const AccessControl = () => {
  useNamespaces(['sp.settings-access-control', 'sp.access-control-delegations'])
  const { formatMessage } = useLocale()
  const history = useHistory()
  const location = useLocation()
  const isDelegationToMe = location.pathname === DELEGATIONS_TO_ME_PATH

  const tabChangeHandler = (id: string) => {
    const url =
      id === TAB_DELEGATION_TO_ME_ID
        ? ServicePortalPath.AccessControlDelegationsToMe
        : ServicePortalPath.AccessControlDelegations

    // Make sure not to add to history stack the same route twice in a row
    if (url !== location.pathname) {
      history.push(url)
    }
  }

  return (
    <>
      <IntroHeader
        title={formatMessage(m.accessControlDelegations)}
        intro={formatMessage({
          id: 'sp.access-control-delegations:header-intro',
          defaultMessage:
            'Hérna kemur listi yfir þau umboð sem þú hefur gefið öðrum. Þú getur eytt umboðum eða bætt við nýjum.',
        })}
      />
      <Box marginTop={8}>
        <Tabs
          selected={
            isDelegationToMe
              ? TAB_DELEGATION_TO_ME_ID
              : TAB_DELEGATION_TO_FROM_ID
          }
          onChange={tabChangeHandler}
          label={formatMessage(m.chooseDelegation)}
          tabs={[
            {
              label: formatMessage(m.accessControlDelegationsFromMe),
              content: <DelegationsFromMe />,
            },
            {
              label: formatMessage(m.accessControlDelegationsToMe),
              content: <DelegationsToMe />,
            },
          ]}
          contentBackground="white"
        />
      </Box>
    </>
  )
}

export default AccessControl
