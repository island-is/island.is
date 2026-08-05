import { StackScreen } from '@/components/stack-screen'
import React, { useMemo } from 'react'
import { FlatList, RefreshControl, View } from 'react-native'

import { CertificateCard } from '@/components/certificate-card'
import { useGetDrugCertificatesQuery } from '@/graphql/types/schema'
import { NetworkStatus } from '@apollo/client'
import { EmptyComponent } from './shared'
import { Typography } from '../../ui'
import { useIntl } from 'react-intl'

export function DrugCertificatesTab({ initial }: { initial?: boolean }) {
  const intl = useIntl()
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
      contentInsetAdjustmentBehavior="automatic"
      ListHeaderComponent={
        <View style={{ marginBottom: 16 }}>
          <Typography variant="body">
            {intl.formatMessage({
              id: 'health.prescriptionsAndCertificates.description',
            })}
          </Typography>
        </View>
      }
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
