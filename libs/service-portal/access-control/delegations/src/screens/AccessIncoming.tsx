import { Box, SkeletonLoader } from '@island.is/island-ui/core'
import { NotFound } from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { IdentityCard } from '../components/IdentityCard/IdentityCard'
import { useDelegation } from '../hooks/useDelegation'
import { AccessHeader } from '../components/access/AccessHeader/AccessHeader'
import { AccessList } from '../components/access/AccessList/AccessList'
import { Features, useFeatureFlag } from '@island.is/react/feature-flags'

const AccessIncoming = () => {
  useNamespaces(['sp.settings-access-control', 'sp.access-control-delegations'])
  // TODO: Remove feature flag when incoming delegations are ready
  const incomingFeatureFlag = useFeatureFlag(
    Features.incomingDelegationsV2,
    false,
  )

  const { formatMessage } = useLocale()
  const { delegation, delegationLoading, scopeTree } = useDelegation()

  if ((!delegationLoading && !delegation) || !incomingFeatureFlag.value) {
    return <NotFound />
  }

  return (
    <Box
      marginTop={[3, 3, 3, 4]}
      display="flex"
      rowGap={[4, 4, 4, 5]}
      flexDirection="column"
    >
      <AccessHeader delegation={delegation} showValidityPeriodMobile>
        {delegation && (
          <IdentityCard
            label={formatMessage({
              id: 'sp.access-control-delegations:domain',
              defaultMessage: 'Kerfi',
            })}
            title={delegation.domain.displayName}
            imgSrc={delegation.domain.organisationLogoUrl}
            size="small"
          />
        )}
      </AccessHeader>
      {delegation && scopeTree ? (
        <AccessList
          validityPeriod={delegation.validTo}
          scopes={delegation.scopes}
          scopeTree={scopeTree}
        />
      ) : (
        <SkeletonLoader width="100%" height={250} />
      )}
    </Box>
  )
}

export default AccessIncoming
