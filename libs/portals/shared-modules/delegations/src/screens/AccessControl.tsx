import { useHistory } from 'react-router-dom'
import { useLocation } from 'react-use'
import { Box, Tabs } from '@island.is/island-ui/core'
import { IntroHeader, m as coreMessages } from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { useAuth } from '@island.is/auth/react'
import { isDefined } from '@island.is/shared/utils'
import { DelegationsIncoming } from '../components/delegations/incoming/DelegationsIncoming'
import { DelegationsOutgoing } from '../components/delegations/outgoing/DelegationsOutgoing'
import { Features, useFeatureFlag } from '@island.is/react/feature-flags'
import { m } from '../lib/messages'
import { DelegationPaths } from '../lib/paths'

const TAB_DELEGATION_OUTGOING_ID = 'outgoing'
const TAB_DELEGATION_INCOMING_ID = 'incoming'

const AccessControl = () => {
  useNamespaces(['sp.settings-access-control', 'sp.access-control-delegations'])
  // TODO: Remove feature flag when incoming delegations are ready
  const incomingFeatureFlag = useFeatureFlag(
    Features.incomingDelegationsV2,
    false,
  )
  const { formatMessage } = useLocale()
  const { userInfo } = useAuth()
  const history = useHistory()
  const location = useLocation()
  const firstPath = location?.pathname?.split('/')[1]
  const DELEGATIONS_INCOMING_PATH = `/${firstPath ?? ''}${
    DelegationPaths.DelegationsIncoming
  }`
  const isDelegationIncoming = location.pathname === DELEGATIONS_INCOMING_PATH

  const tabChangeHandler = (id: string) => {
    const url =
      id === TAB_DELEGATION_INCOMING_ID
        ? DelegationPaths.DelegationsIncoming
        : DelegationPaths.Delegations

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
        title={formatMessage(coreMessages.accessControl)}
        intro={formatMessage(
          onlyOutgoingDelegations
            ? {
                id: 'sp.access-control-delegations:header-intro-company',
                defaultMessage:
                  'Hérna kemur listi yfir þau umboð sem þú hefur gefið öðrum. Þú getur eytt umboðum eða bætt við nýjum.',
              }
            : {
                id: 'sp.access-control-delegations:header-intro-individual',
                defaultMessage:
                  'Hérna getur þú veitt öðrum umboð og skoðað umboð sem aðrir hafa veitt þér. Þú getur eytt umboðum eða bætt við nýjum.',
              },
        )}
        marginBottom={0}
      />
      <Box marginTop={[0, 0, 5]}>
        {onlyOutgoingDelegations || !incomingFeatureFlag.value ? (
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
                label: formatMessage(
                  coreMessages.accessControlDelegationsOutgoing,
                ),
                content: <DelegationsOutgoing />,
              },
              {
                id: TAB_DELEGATION_INCOMING_ID,
                label: formatMessage(
                  coreMessages.accessControlDelegationsIncoming,
                ),
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
