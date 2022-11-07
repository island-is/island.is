import { Box, SkeletonLoader } from '@island.is/island-ui/core'
import { NotFound } from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { IdentityCard } from '../components/IdentityCard/IdentityCard'
import { useDelegation } from '../hooks/useDelegation'
import { AccessHeader } from '../components/access/AccessHeader/AccessHeader'
import { AccessList } from '../components/access/AccessList/AccessList'

const AccessIncoming = () => {
  useNamespaces(['sp.settings-access-control', 'sp.access-control-delegations'])
  const { formatMessage } = useLocale()
  const { delegation, delegationLoading, scopeTree } = useDelegation()

  if (!delegationLoading && !delegation) {
    return <NotFound />
  }

  return (
    <Box
      marginTop={[3, 3, 3, 4]}
      display="flex"
      rowGap={5}
      flexDirection="column"
    >
      <AccessHeader delegation={delegation}>
        {delegation && (
          <IdentityCard
            label={formatMessage({
              id: 'sp.access-control-delegations:domain',
              defaultMessage: 'Kerfi',
            })}
            title={delegation.domain.displayName}
            imgSrc={delegation.domain.organisationLogoUrl}
          />
        )}
      </AccessHeader>
      {delegation && scopeTree ? (
        <AccessList delegation={delegation} scopeTree={scopeTree} />
      ) : (
        <SkeletonLoader width="100%" height={250} />
      )}
    </Box>
  )
}

export default AccessIncoming
