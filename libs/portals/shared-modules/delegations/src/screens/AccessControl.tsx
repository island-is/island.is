import { Box, Button, GridColumn, Tabs } from '@island.is/island-ui/core'
import { FaqList, FaqListProps } from '@island.is/island-ui/contentful'

import { useLocale, useNamespaces } from '@island.is/localization'
import { IntroHeader, usePortalMeta } from '@island.is/portals/core'
import { useUserInfo } from '@island.is/react-spa/bff'
import { isDefined } from '@island.is/shared/utils'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { useLocation } from 'react-use'
import { DelegationsIncoming } from '../components/delegations/incoming/DelegationsIncoming'
import { DelegationsOutgoing } from '../components/delegations/outgoing/DelegationsOutgoing'
import { m } from '../lib/messages'
import { DelegationPaths } from '../lib/paths'
import type { AccessControlLoaderResponse } from './AccessControl.loader'

const TAB_DELEGATION_OUTGOING_ID = 'outgoing'
const TAB_DELEGATION_INCOMING_ID = 'incoming'

const AccessControl = () => {
  useNamespaces(['sp.access-control-delegations'])

  const contentfulData = useLoaderData() as AccessControlLoaderResponse

  const { formatMessage } = useLocale()
  const userInfo = useUserInfo()
  const navigate = useNavigate()

  const location = useLocation()
  const { basePath } = usePortalMeta()
  const DELEGATIONS_INCOMING_PATH = `${basePath}${DelegationPaths.DelegationsIncoming}`
  const isDelegationIncoming = location.pathname === DELEGATIONS_INCOMING_PATH

  const tabChangeHandler = (id: string) => {
    const url =
      id === TAB_DELEGATION_INCOMING_ID
        ? DelegationPaths.DelegationsIncoming
        : DelegationPaths.Delegations

    // Make sure not to add to history stack the same route twice in a row
    if (url !== location.pathname) {
      navigate(url)
    }
  }

  // Don't show incoming delegations when user is logged in on behalf of someone else, i.e. some delegation.
  const onlyOutgoingDelegations = isDefined(userInfo?.profile?.actor)

  return (
    <>
      <IntroHeader
        title={formatMessage(m.digitalDelegations)}
        intro={
          onlyOutgoingDelegations
            ? formatMessage({
                id: 'sp.access-control-delegations:header-intro-company',
                defaultMessage:
                  'Hérna kemur listi yfir þau umboð sem þú hefur gefið öðrum. Þú getur eytt umboðum eða bætt við nýjum.',
              })
            : formatMessage({
                id: 'sp.access-control-delegations:header-intro-individual',
                defaultMessage:
                  'Hérna getur þú veitt öðrum umboð og skoðað umboð sem aðrir hafa veitt þér. Þú getur eytt umboðum eða bætt við nýjum.',
              })
        }
        marginBottom={0}
      >
        <GridColumn span={['8/8', '3/8']}>
          <Box
            display={'flex'}
            justifyContent={['flexStart', 'flexEnd']}
            paddingTop={[3, 6]}
          >
            <Button
              onClick={() =>
                navigate(
                  `${DelegationPaths.DelegationsGrant}${location.search}`,
                )
              }
              size="small"
            >
              {formatMessage(m.newAccess)}
            </Button>
          </Box>
        </GridColumn>
      </IntroHeader>

      <Box marginTop={[4, 4, 6]}>
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
      {contentfulData?.faqList && (
        <Box paddingTop={8}>
          <FaqList {...(contentfulData.faqList as unknown as FaqListProps)} />
        </Box>
      )}
    </>
  )
}

export default AccessControl
