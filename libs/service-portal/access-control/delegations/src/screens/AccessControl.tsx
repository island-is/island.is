import { useHistory } from 'react-router-dom'
import { useLocation } from 'react-use'
import { Box, Tabs } from '@island.is/island-ui/core'
import {
  IntroHeader,
  m,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { useAuth } from '@island.is/auth/react'
import { isDefined } from '@island.is/shared/utils'
import { DelegationsIncoming } from '../components/delegations/incoming/DelegationsIncoming'
import { DelegationsOutgoing } from '../components/delegations/outgoing/DelegationsOutgoing'

const TAB_DELEGATION_OUTGOING_ID = '0'
const TAB_DELEGATION_INCOMING_ID = '1'
const DELEGATIONS_INCOMING_PATH = `${ServicePortalPath.MinarSidurPath}${ServicePortalPath.AccessControlDelegationsIncoming}`

const AccessControl = () => {
  useNamespaces(['sp.settings-access-control', 'sp.access-control-delegations'])
  const { formatMessage } = useLocale()
  const { userInfo } = useAuth()
  const history = useHistory()
  const location = useLocation()
  const isDelegationIncoming = location.pathname === DELEGATIONS_INCOMING_PATH

  const tabChangeHandler = (id: string) => {
    const url =
      id === TAB_DELEGATION_INCOMING_ID
        ? ServicePortalPath.AccessControlDelegationsIncoming
        : ServicePortalPath.AccessControlDelegations

    // Make sure not to add to history stack the same route twice in a row
    if (url !== location.pathname) {
      history.push(url)
    }
  }

  // Only show outgoing delegation when user is logged in on behalf of someone else, i.e. some delegation.
  const onlyOutgoingDelegations = isDefined(userInfo?.profile?.actor)

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
      <Box marginTop={[0, 0, 8]}>
        {onlyOutgoingDelegations ? (
          <DelegationsOutgoing />
        ) : (
          <Tabs
            onlyRenderSelectedTab
            selected={
              isDelegationIncoming
                ? TAB_DELEGATION_INCOMING_ID
                : TAB_DELEGATION_OUTGOING_ID
            }
            onChange={tabChangeHandler}
            label={formatMessage(m.chooseDelegation)}
            tabs={[
              {
                id: TAB_DELEGATION_OUTGOING_ID,
                label: formatMessage(m.accessControlDelegationsOutgoing),
                content: <DelegationsOutgoing />,
              },
              {
                id: TAB_DELEGATION_INCOMING_ID,
                label: formatMessage(m.accessControlDelegationsIncoming),
                content: <DelegationsIncoming />,
              },
            ]}
            contentBackground="white"
          />
        )}
      </Box>
    </>
  )
}

export default AccessControl
