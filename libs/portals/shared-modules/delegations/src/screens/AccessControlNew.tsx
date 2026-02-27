import { Box, Button, GridColumn, Icon, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { IntroHeader } from '@island.is/portals/core'
import { useAuth, useUserInfo } from '@island.is/react-spa/bff'
import { isDefined } from '@island.is/shared/utils'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { useLocation } from 'react-use'
import { useMemo } from 'react'
import groupBy from 'lodash/groupBy'
import {
  AuthDelegationsGroupedByIdentity,
  AuthDelegationType,
} from '@island.is/api/schema'
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

  // Outgoing
  const {
    data: outgoingData,
    loading: outgoingLoading,
    error: outgoingError,
  } = useAuthDelegationsGroupedByIdentityOutgoingQuery({
    variables: { lang },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  })
  const outgoingDelegations =
    outgoingData?.authDelegationsGroupedByIdentityOutgoing

  const outgoingDelegationGroups = useMemo(() => {
    return groupBy(outgoingDelegations, 'type') as Record<
      AuthDelegationType,
      AuthDelegationsGroupedByIdentity[]
    >
  }, [outgoingDelegations])

  const outgoingCustomDelegations = outgoingDelegationGroups.Custom
  const outgoingGeneralMandateDelegations =
    outgoingDelegationGroups.GeneralMandate

  // Incoming
  const {
    data: incomingPersonData,
    loading: incomingPersonLoading,
    error: incomingPersonError,
  } = useAuthDelegationsGroupedByIdentityIncomingQuery({
    variables: { lang },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  })
  const incomingDelegations =
    incomingPersonData?.authDelegationsGroupedByIdentityIncoming

  const incomingDelegationGroups = useMemo(() => {
    return groupBy(incomingDelegations, 'type') as Record<
      AuthDelegationType,
      AuthDelegationsGroupedByIdentity[]
    >
  }, [incomingDelegations])

  const incomingCustomDelegations = incomingDelegationGroups.Custom

  const legalGuardianDelegations = [
    ...(incomingDelegationGroups.LegalGuardian || []),
    ...(incomingDelegationGroups.LegalGuardianMinor || []),
  ]

  const procuringHolderDelegations = incomingDelegationGroups.ProcurationHolder

  const incomingGeneralMandateDelegations =
    incomingDelegationGroups.GeneralMandate

  // Don't show incoming delegations when user is logged in on behalf of someone else
  const onlyOutgoingDelegations = isDefined(userInfo?.profile?.actor)

  const onSwitchUser = (nationalId: string) => {
    switchUser(nationalId, `${location.origin}/minarsidur`)
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
        marginBottom={4}
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

      {!outgoingLoading &&
        outgoingDelegations &&
        outgoingDelegations.length > 0 && (
          <Box
            display="flex"
            columnGap={1}
            alignItems="center"
            marginBottom={3}
            paddingTop={2}
          >
            <Box
              borderRadius="large"
              background="blue100"
              padding={1}
              display="flex"
              alignItems="center"
            >
              <Icon size="small" color="blue400" type="outline" icon="person" />
              <Icon size="small" color="blue400" icon="arrowForward" />
            </Box>
            <Text variant="h4">
              {formatMessage(m.outgoingDelegationsHeader)}
            </Text>
          </Box>
        )}

      {/* Outgoing delegations - NEW person-centric view */}
      {outgoingCustomDelegations && outgoingCustomDelegations.length > 0 && (
        <CustomDelegationsTable
          title={formatMessage(m.outgoingDelegationsTitle)}
          data={outgoingCustomDelegations}
          loading={outgoingLoading || false}
          error={outgoingError}
          direction="outgoing"
        />
      )}

      {/* Outgoing general mandate delegations table */}
      {outgoingGeneralMandateDelegations &&
        outgoingGeneralMandateDelegations.length > 0 && (
          <DelegationsTable
            title="Allsherjarumboð"
            data={getGeneralMandateTableData(
              outgoingGeneralMandateDelegations,
              onSwitchUser,
              formatMessage,
            )}
            loading={outgoingLoading || false}
            error={outgoingError}
          />
        )}

      {!incomingPersonLoading &&
        incomingDelegations &&
        incomingDelegations.length > 0 && (
          <Box
            display="flex"
            columnGap={1}
            alignItems="center"
            marginBottom={3}
            paddingTop={2}
          >
            <Box
              borderRadius="large"
              background="purple100"
              padding={1}
              display="flex"
              alignItems="center"
            >
              <Icon
                size="small"
                color="purple400"
                type="outline"
                icon="person"
              />
              <Icon size="small" color="purple400" icon="arrowForward" />
            </Box>
            <Text variant="h4">
              {formatMessage(m.incomingDelegationsHeader)}
            </Text>
          </Box>
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
          loading={incomingPersonLoading || false}
          error={incomingPersonError}
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
          loading={incomingPersonLoading || false}
          error={incomingPersonError}
        />
      )}

      {/* Incoming general mandate delegations table */}
      {incomingGeneralMandateDelegations &&
        incomingGeneralMandateDelegations.length > 0 && (
          <DelegationsTable
            title="Allsherjarumboð"
            data={getGeneralMandateTableData(
              incomingGeneralMandateDelegations,
              onSwitchUser,
              formatMessage,
            )}
            loading={incomingPersonLoading || false}
            error={incomingPersonError}
          />
        )}

      {/* Incoming custom delegations - NEW person-centric view */}
      {!onlyOutgoingDelegations &&
        incomingCustomDelegations &&
        incomingCustomDelegations.length > 0 && (
          <CustomDelegationsTable
            title={formatMessage(m.incomingCustomDelegationsTitle)}
            data={incomingCustomDelegations}
            loading={incomingPersonLoading || false}
            error={incomingPersonError}
            direction="incoming"
          />
        )}

      {contentfulData?.faqList && contentfulData.faqList.questions.length > 0 && (
        <Box paddingTop={8}>
          <FaqList {...(contentfulData.faqList as unknown as FaqListProps)} />
        </Box>
      )}
    </>
  )
}

export default AccessControlNew
