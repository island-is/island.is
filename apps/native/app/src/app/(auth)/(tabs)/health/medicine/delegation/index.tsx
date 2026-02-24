import React, { useCallback, useState } from 'react'
import { useIntl } from 'react-intl'
import { RefreshControl, ScrollView, View } from 'react-native'
import { Stack } from 'expo-router'
import styled from 'styled-components/native'

import { useGetMedicineDelegationsLazyQuery } from '@/graphql/types/schema'
import { GeneralCardSkeleton } from '@/ui'
import { MedicineDelegationContent } from '../../../../../../components/medicine-delegation-content'

const Host = styled.View`
  flex: 1;
  padding-horizontal: ${({ theme }) => theme.spacing[2]}px;
`

export default function MedicineDelegationScreen() {
  const intl = useIntl()
  const [refetching, setRefetching] = useState(false)
  const [showInactivePermits, setShowInactivePermits] = useState(false)

  const [loadDelegations, delegationsRes] = useGetMedicineDelegationsLazyQuery({
    variables: {
      locale: intl.locale,
      input: {
        status: [
          'active',
          'expired',
          'inactive',
          'unknown',
          'awaitingApproval',
        ],
      },
    },
  })

  // Load on mount
  React.useEffect(() => {
    if (!delegationsRes.called) {
      loadDelegations()
    }
  }, [delegationsRes.called, loadDelegations])

  const onRefresh = useCallback(async () => {
    setRefetching(true)
    try {
      if (delegationsRes.called && delegationsRes.refetch) {
        await delegationsRes.refetch()
      }
    } catch (e) {
      // noop
    } finally {
      setRefetching(false)
    }
  }, [delegationsRes])

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: intl.formatMessage({
            id: 'health.medicineDelegation.screenTitle',
          }),
        }}
      />
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refetching} onRefresh={onRefresh} />
        }
      >
        <Host>
          {delegationsRes.loading && !delegationsRes.data ? (
            Array.from({ length: 3 }).map((_, index) => (
              <GeneralCardSkeleton height={90} key={index} />
            ))
          ) : (
            <MedicineDelegationContent
              componentId="delegation"
              delegations={
                delegationsRes.data?.healthDirectorateMedicineDelegations
                  ?.items ?? []
              }
              loading={delegationsRes.loading}
              error={delegationsRes.error}
              showInactivePermits={showInactivePermits}
            />
          )}
        </Host>
      </ScrollView>
    </View>
  )
}
