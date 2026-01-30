import { Box, Button, GridColumn, Tabs } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { IntroHeader, usePortalMeta } from '@island.is/portals/core'
import { useAuth, useUserInfo } from '@island.is/react-spa/bff'
import { isDefined } from '@island.is/shared/utils'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-use'
import { DelegationsIncoming } from '../components/delegations/incoming/DelegationsIncoming'
import {
  DelegationsOutgoing,
  prepareDomainName,
} from '../components/delegations/outgoing/DelegationsOutgoing'
import { m } from '../lib/messages'
import { DelegationPaths } from '../lib/paths'
import {
  AuthCustomDelegation,
  AuthDelegationDirection,
  AuthGeneralMandate,
  AuthLegalGuardianDelegation,
  AuthLegalGuardianMinorDelegation,
  AuthProcuringHolderDelegation,
} from '@island.is/api/schema'
import { useAuthDelegationsOutgoingQuery } from '../components/delegations/outgoing/DelegationsOutgoing.generated'
import { useDomains } from '../hooks/useDomains/useDomains'
import CustomDelegationsTable from '../components/delegations/table/CustomDelegationsTable'
import { useAuthDelegationsIncomingQuery } from '../components/delegations/incoming/DelegationIncoming.generated'
import groupBy from 'lodash/groupBy'
import { useMemo } from 'react'
import { DelegationsTable } from '../components/delegations/table/DelegationsTable'
import {
  getGeneralMandateTableData,
  getLegalGuardianTableData,
  getProcuringHolderTableData,
} from '../components/delegations/table/getTableData'

const TAB_DELEGATION_OUTGOING_ID = 'outgoing'
const TAB_DELEGATION_INCOMING_ID = 'incoming'

const AccessControl = () => {
  useNamespaces(['sp.access-control-delegations'])

  const { formatMessage, lang = 'is' } = useLocale()
  const userInfo = useUserInfo()
  const navigate = useNavigate()

  const location = useLocation()
  const { basePath } = usePortalMeta()
  const DELEGATIONS_INCOMING_PATH = `${basePath}${DelegationPaths.DelegationsIncoming}`
  const isDelegationIncoming = location.pathname === DELEGATIONS_INCOMING_PATH
  const { name: domainName } = useDomains()
  const { switchUser } = useAuth()

  const {
    data: outgoingData,
    loading: outgoingLoading,
    refetch: outgoingRefetch,
    error: outgoingError,
  } = useAuthDelegationsOutgoingQuery({
    variables: {
      lang,
      input: {
        domain: prepareDomainName(domainName),
        direction: AuthDelegationDirection.outgoing,
      },
    },
    skip: !domainName || !lang,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  })

  const {
    data: incomingData,
    loading: incomingLoading,
    refetch: incomingRefetch,
    error: incomingError,
  } = useAuthDelegationsIncomingQuery({
    variables: {
      lang,
      input: {
        domain: prepareDomainName(domainName),
        direction: AuthDelegationDirection.incoming,
      },
    },
    skip: !domainName || !lang,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  })

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

  const outgoingDelegations =
    outgoingData?.authDelegations as AuthCustomDelegation[]

  const incomingDelegationGroups = useMemo(() => {
    return groupBy(incomingData?.authDelegations, 'type')
  }, [incomingData?.authDelegations])
  const customIncomingDelegations =
    incomingDelegationGroups.Custom as AuthCustomDelegation[]

  const legalGuardianDelegations = [
    ...(incomingDelegationGroups.LegalGuardian || []),
    ...(incomingDelegationGroups.LegalGuardianMinor || []),
  ] as AuthLegalGuardianDelegation[] | AuthLegalGuardianMinorDelegation[]
  const procuringHolderDelegations =
    incomingDelegationGroups.ProcurationHolder as AuthProcuringHolderDelegation[]
  const generalMandateDelegations =
    incomingDelegationGroups.GeneralMandate as AuthGeneralMandate[]

  // Don't show incoming delegations when user is logged in on behalf of someone else, i.e. some delegation.
  const onlyOutgoingDelegations = isDefined(userInfo?.profile?.actor)

  const onSwitchUser = (nationalId: string) => {
    switchUser(nationalId, `${location.origin}/minarsidur`)
    navigate('/')
  }

  return (
    <>
      <IntroHeader
        title={formatMessage(m.accessControl)}
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

      {/* Outgoing delegations table */}
      {outgoingDelegations && outgoingDelegations.length > 0 && (
        <CustomDelegationsTable
          title={formatMessage(m.outgoingDelegationsTitle)}
          data={outgoingDelegations}
          loading={outgoingLoading || false}
          refetch={outgoingRefetch}
          error={outgoingError}
          direction={AuthDelegationDirection.outgoing}
        />
      )}

      {/* Legal guardian delegations table */}
      {legalGuardianDelegations && legalGuardianDelegations.length > 0 && (
        <DelegationsTable
          // title={formatMessage(m.incomingDelegationsTitle)}
          title="Börn í þinni forsjá"
          data={getLegalGuardianTableData(
            legalGuardianDelegations,
            onSwitchUser,
            formatMessage,
          )}
          loading={incomingLoading || false}
          error={incomingError}
        />
      )}

      {/* Procuring holder delegations table */}
      {procuringHolderDelegations && procuringHolderDelegations.length > 0 && (
        <DelegationsTable
          title="Prókúruhafar í þinni forsjá"
          data={getProcuringHolderTableData(
            procuringHolderDelegations,
            onSwitchUser,
            formatMessage,
          )}
          loading={incomingLoading || false}
          error={incomingError}
        />
      )}

      {/* General mandate delegations table */}
      {generalMandateDelegations && generalMandateDelegations.length > 0 && (
        <DelegationsTable
          title="Allsherjarumboð"
          data={getGeneralMandateTableData(
            generalMandateDelegations,
            onSwitchUser,
            formatMessage,
          )}
          loading={incomingLoading || false}
          error={incomingError}
        />
      )}

      {/* Custom incoming delegations table */}
      {customIncomingDelegations && customIncomingDelegations.length > 0 && (
        <CustomDelegationsTable
          title={formatMessage(m.incomingCustomDelegationsTitle)}
          data={customIncomingDelegations}
          loading={incomingLoading || false}
          refetch={incomingRefetch}
          error={incomingError}
          direction={AuthDelegationDirection.incoming}
        />
      )}

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
    </>
  )
}

export default AccessControl
