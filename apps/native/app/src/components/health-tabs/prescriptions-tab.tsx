import { StackScreen } from '@/components/stack-screen'
import React, { useMemo } from 'react'
import { FlatList, RefreshControl } from 'react-native'
import { router } from 'expo-router'

import { useGetDrugPrescriptionsQuery } from '@/graphql/types/schema'
import { NetworkStatus } from '@apollo/client'
import { useLocale } from '../../hooks/use-locale'
import { PrescriptionCard } from '../prescription-card'
import { EmptyComponent } from './shared'

export function PrescriptionsTab({ initial }: { initial?: boolean }) {
  const locale = useLocale()
  const prescriptionsRes = useGetDrugPrescriptionsQuery({
    variables: { locale },
    initialFetchPolicy: initial ? 'network-only' : undefined,
  })
  const data = useMemo(
    () =>
      prescriptionsRes.data?.healthDirectoratePrescriptions?.prescriptions ??
      [],
    [prescriptionsRes.data],
  )

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => (
        <PrescriptionCard
          prescription={item}
          onRenewPress={() =>
            router.push({
              pathname: '/renew-prescription',
              params: {
                id: item.id,
                name: item.name ?? undefined,
                type: item.type ?? undefined,
                indication: item.indication ?? undefined,
                dosageInstructions: item.dosageInstructions ?? undefined,
                totalPrescribedAmount: item.totalPrescribedAmount ?? undefined,
              },
            })
          }
        />
      )}
      contentContainerStyle={{ flexGrow: 1, paddingTop: 16 }}
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={
        <RefreshControl
          refreshing={prescriptionsRes.networkStatus === NetworkStatus.refetch}
          onRefresh={() => prescriptionsRes.refetch({ locale })}
        />
      }
      ListFooterComponent={() => (
        <StackScreen networkStatus={[prescriptionsRes.networkStatus]} />
      )}
      ListEmptyComponent={() => <EmptyComponent res={prescriptionsRes} />}
      style={{ flex: 1, paddingHorizontal: 16 }}
    />
  )
}
