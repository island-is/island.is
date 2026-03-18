import { StackScreen } from '@/components/stack-screen'
import React, { useMemo } from 'react'
import { FlatList, RefreshControl, View } from 'react-native'

import { useGetDrugCertificatesQuery } from '@/graphql/types/schema'
import { Problem } from '@/ui'
import { NetworkStatus } from '@apollo/client'
import { CertificateCard } from '@/components/certificate-card'
import { EmptyComponent, Skeletons } from './shared'

export function DrugCertificatesTab({ initial }: { initial?: boolean }) {
  const certificatesRes = useGetDrugCertificatesQuery({
    initialFetchPolicy: initial ? 'network-only' : undefined,
  })

  const data = useMemo(
    () => certificatesRes.data?.rightsPortalDrugCertificates ?? [],
    [certificatesRes.data],
  )

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <CertificateCard certificate={item} />}
      contentContainerStyle={{ flexGrow: 1, paddingTop: 16 }}
      refreshControl={
        <RefreshControl
          refreshing={certificatesRes.networkStatus === NetworkStatus.refetch}
          onRefresh={() => certificatesRes.refetch()}
        />
      }
      ListFooterComponent={() => (
        <StackScreen networkStatus={[certificatesRes.networkStatus]} />
      )}
      ListEmptyComponent={() => <EmptyComponent res={certificatesRes} />}
      style={{ flex: 1, paddingHorizontal: 16 }}
    />
  )
}
