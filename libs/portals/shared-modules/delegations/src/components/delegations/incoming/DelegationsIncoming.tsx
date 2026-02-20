import { Problem } from '@island.is/react-spa/shared'
import { useMemo, useState } from 'react'
import { SkeletonLoader, Stack, Box } from '@island.is/island-ui/core'
import sortBy from 'lodash/sortBy'
import {
  AuthCustomDelegation,
  AuthDelegationDirection,
  AuthDelegationType,
} from '@island.is/api/schema'
import { useLocale } from '@island.is/localization'
import { m } from '../../../lib/messages'
import { AccessDeleteModal } from '../../access/AccessDeleteModal/AccessDeleteModal'
import { AccessCard } from '../../access/AccessCard'
import { DelegationsEmptyState } from '../DelegationsEmptyState'
import { AuthCustomDelegationIncoming } from '../../../types/customDelegation'
import { DelegationViewModal } from '../DelegationViewModal'
import { useAuthDelegationsIncomingQuery } from './DelegationIncoming.generated'

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
  // console.log('data', JSON.stringify(data?.authDelegations))

  const delegations = useMemo(
    () =>
      sortBy(
        data?.authDelegations as AuthCustomDelegationIncoming[],
        (d) => d.from?.name,
      ) ?? [],
    [data?.authDelegations],
  )

  // const delegationGroups = useMemo(() => {
  //   return groupBy(delegations, 'type')
  // }, [delegations])

  // console.log('delegationGroups', delegationGroups)
  // console.log(
  //   'nationalIds',
  //   groupBy(delegationGroups.ProcurationHolder, 'from.nationalId'),
  // )

  return (
    <Box display="flex" flexDirection="column" rowGap={4} marginTop={[1, 1, 8]}>
      {loading ? (
        <SkeletonLoader width="100%" height={191} />
      ) : error ? (
        <Problem error={error} />
      ) : delegations.length === 0 ? (
        <DelegationsEmptyState
          message={formatMessage(m.noIncomingDelegations)}
          imageAlt={formatMessage(m.noDelegationsImageAlt)}
        />
      ) : (
        <Stack space={3}>
          {delegations.map((delegation) => {
            if (delegation.type === AuthDelegationType.LegalGuardianMinor)
              return null

            const isCustom = delegation.type === AuthDelegationType.Custom
            const isGeneralMandate =
              delegation.type === AuthDelegationType.GeneralMandate

            return (
              delegation.from && (
                <AccessCard
                  key={
                    delegation.type === AuthDelegationType.Custom
                      ? delegation.id
                      : `${delegation.type}-${delegation.from.nationalId}`
                  }
                  delegation={delegation as AuthCustomDelegation}
                  onDelete={
                    isCustom
                      ? (delegation) => {
                          setDelegationDelete(
                            delegation as AuthCustomDelegationIncoming,
                          )
                        }
                      : undefined
                  }
                  onView={
                    isCustom || isGeneralMandate
                      ? (delegation) => {
                          setDelegationView(
                            delegation as AuthCustomDelegationIncoming,
                          )
                        }
                      : undefined
                  }
                  variant="incoming"
                />
              )
            )
          })}
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
      <DelegationViewModal
        onClose={() => setDelegationView(null)}
        isVisible={!!delegationView}
        delegation={delegationView ?? undefined}
        direction={'incoming'}
      />
    </Box>
  )
}
