import { Problem } from '@island.is/react-spa/shared'
import { useMemo, useState } from 'react'
import { SkeletonLoader, Stack, Box } from '@island.is/island-ui/core'
import sortBy from 'lodash/sortBy'
import {
  AuthDelegationDirection,
  AuthDelegationType,
} from '@island.is/api/schema'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/portals/core'
import { AccessDeleteModal } from '../../access/AccessDeleteModal/AccessDeleteModal'
import { AccessCard } from '../../access/AccessCard'
import { DelegationsEmptyState } from '../DelegationsEmptyState'
import { DelegationIncomingModal } from './DelegationIncomingModal/DelegationIncomingModal'
import { useAuthDelegationsIncomingQuery } from './DelegationIncomingModal/DelegationIncomingModal.generated'
import { AuthCustomDelegationIncoming } from '../../../types/customDelegation'

export const DelegationsIncoming = () => {
  const { formatMessage, lang = 'is' } = useLocale()
  const [delegationView, setDelegationView] =
    useState<AuthCustomDelegationIncoming | null>(null)
  const [delegationDelete, setDelegationDelete] =
    useState<AuthCustomDelegationIncoming | null>(null)
  const { data, loading, refetch, error } = useAuthDelegationsIncomingQuery({
    variables: {
      input: {
        direction: AuthDelegationDirection.incoming,
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
        data?.authDelegations as AuthCustomDelegationIncoming[],
        (d) => d.from?.name,
      ) ?? [],
    [data?.authDelegations],
  )

  return (
    <Box display="flex" flexDirection="column" rowGap={4} marginTop={[1, 1, 8]}>
      {loading ? (
        <SkeletonLoader width="100%" height={191} />
      ) : error ? (
        <Problem error={error} />
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
                    setDelegationDelete(
                      delegation as AuthCustomDelegationIncoming,
                    )
                  }}
                  onView={(delegation) => {
                    setDelegationView(
                      delegation as AuthCustomDelegationIncoming,
                    )
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
              direction: AuthDelegationDirection.incoming,
            },
          })
        }}
        isVisible={!!delegationDelete}
        delegation={delegationDelete as AuthCustomDelegationIncoming}
      />
      <DelegationIncomingModal
        onClose={() => setDelegationView(null)}
        isVisible={!!delegationView}
        delegation={delegationView as AuthCustomDelegationIncoming}
      />
    </Box>
  )
}
