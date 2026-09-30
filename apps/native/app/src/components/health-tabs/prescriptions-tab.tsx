import { StackScreen } from '@/components/stack-screen'
import React, { useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import { FlatList, RefreshControl, View } from 'react-native'
import { router } from 'expo-router'
import { useTheme } from 'styled-components/native'

import {
  HealthDirectoratePrescriptionRenewalStatus,
  useGetDrugPrescriptionsQuery,
} from '@/graphql/types/schema'
import { Typography } from '@/ui'
import { NetworkStatus } from '@apollo/client'
import { useLocale } from '../../hooks/use-locale'
import { PrescriptionCard } from '../prescription-card'
import { EmptyComponent } from './shared'

export function PrescriptionsTab({ initial }: { initial?: boolean }) {
  const locale = useLocale()
  const theme = useTheme()
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
                // Only a dismissal explains itself in the sheet; any other
                // response belongs to a request that is still live.
                renewResponseMessage:
                  item.renewalStatus ===
                  HealthDirectoratePrescriptionRenewalStatus.Dismissed
                    ? item.renewResponseMessage ?? undefined
                    : undefined,
              },
            })
          }
        />
      )}
      ListHeaderComponent={
        <View style={{ marginBottom: theme.spacing[2] }}>
          <Typography>
            <FormattedMessage
              id="health.prescriptions.description"
              values={{
                link: (chunks: React.ReactNode[]) => (
                  <Typography
                    weight="600"
                    color={theme.color.blue400}
                    style={{ textDecorationLine: 'underline' }}
                    accessibilityRole="link"
                    onPress={() => router.navigate('/settings')}
                  >
                    {chunks}
                  </Typography>
                ),
              }}
            />
          </Typography>
        </View>
      }
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
