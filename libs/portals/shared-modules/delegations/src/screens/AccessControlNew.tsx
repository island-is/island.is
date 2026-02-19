import { Box, Button, GridColumn } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { IntroHeader } from '@island.is/portals/core'
import { useAuth, useUserInfo } from '@island.is/react-spa/bff'
import { isDefined } from '@island.is/shared/utils'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { useLocation } from 'react-use'
import { useMemo } from 'react'
import groupBy from 'lodash/groupBy'
import {
  AuthDelegationDirection,
  AuthGeneralMandate,
  AuthLegalGuardianDelegation,
  AuthLegalGuardianMinorDelegation,
  AuthProcuringHolderDelegation,
} from '@island.is/api/schema'
import { useAuthDelegationsIncomingQuery } from '../components/delegations/incoming/DelegationIncoming.generated'
import { useAuthDelegationsGroupedByIdentityOutgoingQuery } from '../components/delegations/outgoing/DelegationsGroupedByIdentityOutgoing.generated'
import { useAuthDelegationsGroupedByIdentityIncomingQuery } from '../components/delegations/incoming/DelegationsGroupedByIdentityIncoming.generated'
import { m } from '../lib/messages'
import { DelegationPaths } from '../lib/paths'
import { DelegationsTable } from '../components/delegations/table/DelegationsTable'
import {
  getGeneralMandateTableData,
  getLegalGuardianTableData,
  getProcuringHolderTableData,
} from '../components/delegations/table/getTableData'
import CustomDelegationsTable from '../components/delegations/table/CustomDelegationsTable'
import { FaqList, FaqListProps } from '@island.is/island-ui/contentful'
import { AccessControlLoaderResponse } from './AccessControl.loader'

const AccessControlNew = () => {
  useNamespaces(['sp.access-control-delegations'])

  const { formatMessage, lang = 'is' } = useLocale()
  const userInfo = useUserInfo()
  const navigate = useNavigate()
  const location = useLocation()
  const { switchUser } = useAuth()

  const contentfulData = useLoaderData() as AccessControlLoaderResponse

  // Use new identity-grouped queries for custom delegations
  const {
    data: outgoingData,
    loading: outgoingLoading,
    error: outgoingError,
    refetch: refetchOutgoing,
  } = useAuthDelegationsGroupedByIdentityOutgoingQuery({
    variables: { lang },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  })

  // For incoming, we still need the old query to get non-custom delegations
  const {
    data: incomingData,
    loading: incomingLoading,
    error: incomingError,
  } = useAuthDelegationsIncomingQuery({
    variables: {
      lang,
      input: {
        direction: AuthDelegationDirection.incoming,
      },
    },
    skip: !lang,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  })

  // Use new identity-grouped query for incoming custom delegations
  const {
    data: incomingPersonData,
    loading: incomingPersonLoading,
    error: incomingPersonError,
    refetch: refetchIncoming,
  } = useAuthDelegationsGroupedByIdentityIncomingQuery({
    variables: { lang },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  })

  // Filter identity-grouped view:
  // Outgoing: Show Custom + GeneralMandate
  // Incoming: Show only Custom (other types shown in their own tables)
  const outgoingDelegationsByPerson =
    outgoingData?.authDelegationsGroupedByIdentityOutgoing?.filter(
      (delegation) =>
        delegation.type === 'Custom' || delegation.type === 'GeneralMandate',
    ) || []

  const incomingDelegationsByPerson =
    incomingPersonData?.authDelegationsGroupedByIdentityIncoming?.filter(
      (delegation) => delegation.type === 'Custom',
    ) || []

  // Group incoming delegations by type for non-custom delegations
  const incomingDelegationGroups = useMemo(() => {
    return groupBy(incomingData?.authDelegations, 'type')
  }, [incomingData?.authDelegations])

  const legalGuardianDelegations = [
    ...(incomingDelegationGroups.LegalGuardian || []),
    ...(incomingDelegationGroups.LegalGuardianMinor || []),
  ] as AuthLegalGuardianDelegation[] | AuthLegalGuardianMinorDelegation[]

  const procuringHolderDelegations =
    incomingDelegationGroups.ProcurationHolder as AuthProcuringHolderDelegation[]

  const generalMandateDelegations =
    incomingDelegationGroups.GeneralMandate as AuthGeneralMandate[]

  // Don't show incoming delegations when user is logged in on behalf of someone else
  const onlyOutgoingDelegations = isDefined(userInfo?.profile?.actor)

  const onSwitchUser = (nationalId: string) => {
    switchUser(nationalId, `${location.origin}/minarsidur`)
    navigate('/')
  }

  // TODO: These handlers will be implemented when we add delete/edit functionality
  // For now, they're here for future implementation
  // const handleDeleteOutgoing = (nationalId: string) => {
  //   // Should delete ALL delegations to this person across all domains
  //   console.log('Delete delegation for:', nationalId)
  // }
  // const handleEditOutgoing = (nationalId: string) => {
  //   // Should allow editing scopes across all domains
  //   console.log('Edit delegation for:', nationalId)
  // }

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
                  `${DelegationPaths.DelegationsGrantNew}${location.search}`,
                )
              }
              size="small"
            >
              {formatMessage(m.grantDelegation)}
            </Button>
          </Box>
        </GridColumn>
      </IntroHeader>

      {/* Outgoing delegations - NEW person-centric view */}
      {outgoingDelegationsByPerson &&
        outgoingDelegationsByPerson.length > 0 && (
          <CustomDelegationsTable
            title={formatMessage(m.outgoingDelegationsTitle)}
            data={outgoingDelegationsByPerson}
            loading={outgoingLoading || false}
            error={outgoingError}
            refetch={() => refetchOutgoing({ lang })}
          />
        )}

      {/* Legal guardian delegations table */}
      {legalGuardianDelegations && legalGuardianDelegations.length > 0 && (
        <DelegationsTable
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

      {/* Incoming custom delegations - NEW person-centric view */}
      {!onlyOutgoingDelegations &&
        incomingDelegationsByPerson &&
        incomingDelegationsByPerson.length > 0 && (
          <CustomDelegationsTable
            title={formatMessage(m.incomingCustomDelegationsTitle)}
            data={incomingDelegationsByPerson}
            loading={incomingPersonLoading || false}
            error={incomingPersonError}
            refetch={() => refetchIncoming({ lang })}
          />
        )}

      {contentfulData?.faqList && (
        <Box paddingTop={8}>
          <FaqList {...(contentfulData.faqList as unknown as FaqListProps)} />
        </Box>
      )}
    </>
  )
}

export default AccessControlNew
