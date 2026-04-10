import {
  Box,
  Button,
  GridColumn,
  Icon,
  Input,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { IntroHeader } from '@island.is/portals/core'
import { useAuth, useUserInfo } from '@island.is/react-spa/bff'
import { isDefined } from '@island.is/shared/utils'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { useLocation, useWindowSize } from 'react-use'
import { useMemo, useState } from 'react'
import groupBy from 'lodash/groupBy'
import {
  AuthDelegationsGroupedByIdentity,
  AuthDelegationType,
} from '@island.is/api/schema'
import {
  AuthDelegationsGroupedByIdentityOutgoingQuery,
  useAuthDelegationsGroupedByIdentityOutgoingQuery,
} from '../../components/delegations/outgoing/DelegationsGroupedByIdentityOutgoing.generated'
import { useAuthDelegationsGroupedByIdentityIncomingQuery } from '../../components/delegations/incoming/DelegationsGroupedByIdentityIncoming.generated'
import { m } from '../../lib/messages'
import { DelegationPaths } from '../../lib/paths'
import { DelegationsTable } from '../../components/tables/DelegationsTable'
import {
  getGeneralMandateTableData,
  getLegalGuardianTableData,
  getProcuringHolderTableData,
} from '../../components/tables/getTableData'
import CustomDelegationsTable from '../../components/tables/CustomDelegationsTable'
import { FaqList, FaqListProps } from '@island.is/island-ui/contentful'
import { AccessControlLoaderResponse } from '../AccessControl.loader'
import * as styles from './AccessControlNew.css'
import { theme } from '@island.is/island-ui/theme'
import { Problem } from '@island.is/react-spa/shared'
import { renderHtml } from '@island.is/island-ui/contentful'

const filterDelegations = (
  searchValue: string,
  delegations?: AuthDelegationsGroupedByIdentityOutgoingQuery['authDelegationsGroupedByIdentityOutgoing'],
) => {
  if (!searchValue) {
    return delegations
  }
  return delegations?.filter((person) => {
    const searchValueLower = searchValue.toLowerCase()
    const name = person?.name?.toLowerCase()
    const nationalId = person?.nationalId?.toLowerCase()
    const normalizedSearch = searchValueLower.replace(/-/g, '')
    const normalizedNationalId = nationalId?.replace(/-/g, '')

    return (
      name?.includes(searchValueLower) ||
      normalizedNationalId?.includes(normalizedSearch)
    )
  })
}

const AccessControlNew = () => {
  useNamespaces(['sp.access-control-delegations'])

  const { formatMessage, lang = 'is' } = useLocale()
  const userInfo = useUserInfo()

  const navigate = useNavigate()
  const location = useLocation()
  const { switchUser } = useAuth()
  const [searchValue, setSearchValue] = useState('')

  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md

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

  const filteredOutgoingDelegations = useMemo(
    () => filterDelegations(searchValue, outgoingDelegations),
    [outgoingDelegations, searchValue],
  )

  const outgoingDelegationGroups = useMemo(() => {
    return groupBy(filteredOutgoingDelegations, 'type') as Record<
      AuthDelegationType,
      AuthDelegationsGroupedByIdentity[]
    >
  }, [filteredOutgoingDelegations])

  const outgoingCustomDelegations = outgoingDelegationGroups.Custom
  const outgoingGeneralMandateDelegations =
    outgoingDelegationGroups.GeneralMandate

  // Incoming
  const {
    data: incomingData,
    loading: incomingLoading,
    error: incomingError,
  } = useAuthDelegationsGroupedByIdentityIncomingQuery({
    variables: { lang },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  })
  const incomingDelegations =
    incomingData?.authDelegationsGroupedByIdentityIncoming

  const filteredIncomingDelegations = useMemo(
    () => filterDelegations(searchValue, incomingDelegations),
    [incomingDelegations, searchValue],
  )

  const incomingDelegationGroups = useMemo(() => {
    return groupBy(filteredIncomingDelegations, 'type') as Record<
      AuthDelegationType,
      AuthDelegationsGroupedByIdentity[]
    >
  }, [filteredIncomingDelegations])

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

  const loading = outgoingLoading || incomingLoading

  return (
    <>
      <IntroHeader
        title={formatMessage(m.digitalDelegations)}
        intro={
          onlyOutgoingDelegations
            ? formatMessage(m.accessControlIntroOnlyOutgoing)
            : formatMessage(m.accessControlIntro)
        }
        marginBottom={[2, 2, 4]}
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
        <div className={styles.inputWrapper}>
          <Input
            name="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={formatMessage(m.searchAllPlaceholder)}
            size="xs"
            type="text"
            backgroundColor="blue"
            icon={{ name: 'search' }}
          />
        </div>
      </IntroHeader>

      {/* Empty state */}
      {!incomingDelegations?.length &&
        !outgoingDelegations?.length &&
        !loading && (
          <div className={styles.problemContainer}>
            <Problem
              type="no_data"
              title={formatMessage(m.noDelegationsFound)}
              titleSize="h4"
              size="large"
              imgSrc="./assets/images/jobsGrid.svg"
              imgClassName={styles.problemImg}
              message={
                contentfulData?.emptyStateMessage?.document &&
                renderHtml(contentfulData.emptyStateMessage.document)
              }
            />
          </div>
        )}

      {!outgoingLoading &&
        outgoingDelegations &&
        outgoingDelegations.length > 0 && (
          <Box
            display="flex"
            columnGap={1}
            alignItems="center"
            marginBottom={3}
            paddingTop={2}
            borderBottomWidth="standard"
            borderColor="blue200"
            paddingBottom={2}
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
            <Text variant={isMobile ? 'h3' : 'h4'}>
              {formatMessage(m.outgoingDelegationsHeader)}
            </Text>
          </Box>
        )}

      {/* Outgoing delegations */}
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
            title={formatMessage(m.delegationTypeGeneralMandateOutgoing)}
            data={getGeneralMandateTableData(
              outgoingGeneralMandateDelegations,
              formatMessage,
            )}
            loading={outgoingLoading || false}
            error={outgoingError}
          />
        )}

      {!onlyOutgoingDelegations &&
        !incomingLoading &&
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
            <Text variant={isMobile ? 'h3' : 'h4'}>
              {formatMessage(m.incomingDelegationsHeader)}
            </Text>
          </Box>
        )}

      {/* Legal guardian delegations table */}
      {!onlyOutgoingDelegations &&
        legalGuardianDelegations &&
        legalGuardianDelegations.length > 0 && (
          <DelegationsTable
            title={formatMessage(m.legalGuardianTableTitle)}
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
      {!onlyOutgoingDelegations &&
        procuringHolderDelegations &&
        procuringHolderDelegations.length > 0 && (
          <DelegationsTable
            title={formatMessage(m.procurationHolderTableTitle)}
            data={getProcuringHolderTableData(
              procuringHolderDelegations,
              onSwitchUser,
              formatMessage,
            )}
            loading={incomingLoading || false}
            error={incomingError}
          />
        )}

      {/* Incoming general mandate delegations table */}
      {!onlyOutgoingDelegations &&
        incomingGeneralMandateDelegations &&
        incomingGeneralMandateDelegations.length > 0 && (
          <DelegationsTable
            title={formatMessage(m.delegationTypeGeneralMandateIncoming)}
            data={getGeneralMandateTableData(
              incomingGeneralMandateDelegations,
              formatMessage,
              onSwitchUser,
            )}
            loading={incomingLoading || false}
            error={incomingError}
          />
        )}

      {/* Incoming custom delegations */}
      {!onlyOutgoingDelegations &&
        incomingCustomDelegations &&
        incomingCustomDelegations.length > 0 && (
          <CustomDelegationsTable
            title={formatMessage(m.incomingCustomDelegationsTitle)}
            data={incomingCustomDelegations}
            loading={incomingLoading || false}
            error={incomingError}
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
