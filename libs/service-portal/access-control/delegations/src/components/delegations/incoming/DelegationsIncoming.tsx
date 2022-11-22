import { useMemo, useState } from 'react'
import {
  SkeletonLoader,
  Stack,
  AlertBanner,
  Box,
} from '@island.is/island-ui/core'
import sortBy from 'lodash/sortBy'
import { AuthCustomDelegation } from '@island.is/api/schema'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
import {
  AuthDelegationDirection,
  AuthDelegationType,
  useAuthDelegationsQuery,
} from '@island.is/service-portal/graphql'
import { AccessDeleteModal } from '../../access/AccessDeleteModal'
import { AccessCard } from '../../access/AccessCard'
import { DelegationsEmptyState } from '../DelegationsEmptyState'
import { DelegationIncomingModal } from './DelegationIncomingModal'

export const DelegationsIncoming = () => {
  const { formatMessage, lang = 'is' } = useLocale()
  const [
    delegationView,
    setDelegationView,
  ] = useState<AuthCustomDelegation | null>(null)
  const [
    delegationDelete,
    setDelegationDelete,
  ] = useState<AuthCustomDelegation | null>(null)
  const { data, loading, refetch, error } = useAuthDelegationsQuery({
    variables: {
      input: {
        direction: AuthDelegationDirection.Incoming,
      },
      lang,
    },
    // Make sure that loading state is shown when refetching
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  })

  const delegations = useMemo(
    () =>
      sortBy(
        data?.authDelegations as AuthCustomDelegation[],
        (d) => d.from?.name,
      ) ?? [],
    [data?.authDelegations],
  )

  return (
    <Box display="flex" flexDirection="column" rowGap={4} marginTop={[1, 1, 8]}>
      {loading ? (
        <SkeletonLoader width="100%" height={191} />
      ) : error ? (
        <AlertBanner
          description={formatMessage(m.errorFetch)}
          variant="error"
        />
      ) : delegations.length === 0 ? (
        <DelegationsEmptyState />
      ) : (
        <Stack space={3}>
          {delegations.map(
            (delegation) =>
              delegation.from && (
                <AccessCard
                  key={
                    delegation.type === AuthDelegationType.Custom
                      ? delegation.id
                      : `${delegation.type}-${delegation.from.nationalId}`
                  }
                  delegation={delegation}
                  onDelete={(delegation) => {
                    setDelegationDelete(delegation)
                  }}
                  onView={(delegation) => {
                    setDelegationView(delegation)
                  }}
                  variant="incoming"
                />
              ),
          )}
        </Stack>
      )}
      <AccessDeleteModal
        onClose={() => {
          setDelegationDelete(null)
        }}
        onDelete={() => {
          setDelegationDelete(null)
          refetch({
            input: {
              direction: AuthDelegationDirection.Incoming,
            },
          })
        }}
        isVisible={!!delegationDelete}
        delegation={delegationDelete as AuthCustomDelegation}
      />
      <DelegationIncomingModal
        onClose={() => setDelegationView(null)}
        isVisible={!!delegationView}
        delegation={delegationView as AuthCustomDelegation}
      />
    </Box>
  )
}
