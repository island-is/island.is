import { StackScreen } from '@/components/stack-screen'
import React, { useMemo } from 'react'
import { FlatList, RefreshControl } from 'react-native'

import { useGetMedicineHistoryQuery } from '@/graphql/types/schema'
import { NetworkStatus } from '@apollo/client'
import { MedicineHistoryCard } from '../medicine-history-card'
import { EmptyComponent } from './shared'

export function MedicineHistoryTab({ initial }: { initial?: boolean }) {
  const medicineHistoryRes = useGetMedicineHistoryQuery({
    initialFetchPolicy: initial ? 'network-only' : undefined,
  })

  const data = useMemo(
    () =>
      medicineHistoryRes.data?.healthDirectorateMedicineHistory
        .medicineHistory ?? [],
    [medicineHistoryRes.data],
  )

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <MedicineHistoryCard medicine={item} />}
      contentContainerStyle={{ flexGrow: 1, paddingTop: 16 }}
      refreshControl={
        <RefreshControl
          refreshing={
            medicineHistoryRes.networkStatus === NetworkStatus.refetch
          }
          onRefresh={() => medicineHistoryRes.refetch()}
        />
      }
      ListFooterComponent={() => (
        <StackScreen networkStatus={[medicineHistoryRes.networkStatus]} />
      )}
      ListEmptyComponent={() => <EmptyComponent res={medicineHistoryRes} />}
      style={{ flex: 1, paddingHorizontal: 16 }}
    />
  )
}
