import React, { useCallback, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { RefreshControl, SafeAreaView, ScrollView, View } from 'react-native'
import { Stack } from 'expo-router'
import styled from 'styled-components/native'

import {
  GeneralCardSkeleton,
  Heading,
  Problem,
  TabButtons,
  Typography,
} from '@/ui'
import { useGetVaccinationsQuery } from '@/graphql/types/schema'
import { useLocale } from '@/hooks/use-locale'
import { VaccinationsCard } from '../../../../components/vaccination-card'

const Host = styled(SafeAreaView)`
  margin-horizontal: ${({ theme }) => theme.spacing[2]}px;
  margin-bottom: ${({ theme }) => theme.spacing[4]}px;
`

const Vaccinations = styled.View`
  margin-top: ${({ theme }) => theme.spacing[3]}px;
`

const Tabs = styled.View`
  margin-top: ${({ theme }) => theme.spacing[3]}px;
`

const ErrorWrapper = styled.View`
  margin-top: ${({ theme }) => theme.spacing[3]}px;
`

export default function VaccinationsScreen() {
  const intl = useIntl()
  const [refetching, setRefetching] = useState(false)
  const [selectedTab, setSelectedTab] = useState(0)
  const locale = useLocale()

  const vaccinationsRes = useGetVaccinationsQuery({ variables: { locale } })

  const vaccinations = vaccinationsRes.data?.healthDirectorateVaccinations
    .vaccinations
    ? selectedTab === 0
      ? vaccinationsRes.data?.healthDirectorateVaccinations.vaccinations.filter(
          (v) => v.isFeatured,
        )
      : vaccinationsRes.data?.healthDirectorateVaccinations.vaccinations.filter(
          (v) => !v.isFeatured,
        )
    : []

  const onRefresh = useCallback(async () => {
    setRefetching(true)

    try {
      await vaccinationsRes.refetch()
    } catch (e) {
      // noop
    } finally {
      setRefetching(false)
    }
  }, [vaccinationsRes])

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: intl.formatMessage({ id: 'health.vaccinations.screenTitle' }),
        }}
      />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refetching} onRefresh={onRefresh} />
        }
        style={{ flex: 1 }}
      >
        <Host>
          <SafeAreaView style={{ marginHorizontal: 16}}>
          <Heading>
            <FormattedMessage
              id="health.vaccinations.title"
              defaultMessage="Bólusetningar"
            />
          </Heading>
          <Typography>
            <FormattedMessage
              id="health.vaccinations.description"
              defaultMessage="Hér getur þú séð lista yfir bóluefni sem þú hefur fengið, stöðu bólusetningar og aðrar upplýsingar."
            />
          </Typography>
          {!vaccinationsRes.error && (
            <Tabs>
              <TabButtons
                buttons={[
                  {
                    title: intl.formatMessage({
                      id: 'health.vaccinations.generalVaccinations',
                    }),
                  },
                  {
                    title: intl.formatMessage({
                      id: 'health.vaccinations.otherVaccinations',
                    }),
                  },
                ]}
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
              />
            </Tabs>
          )}
          </SafeAreaView>
          {!vaccinationsRes.error && (
            <Vaccinations>
              {vaccinationsRes.loading && !vaccinationsRes.data
                ? Array.from({ length: 5 }).map((_, index) => (
                    <GeneralCardSkeleton height={90} key={index} />
                  ))
                : vaccinations.map((vaccination, index) => (
                    <VaccinationsCard
                      key={`${vaccination?.id}-${index}`}
                      vaccination={vaccination}
                      loading={vaccinationsRes.loading && !vaccinationsRes.data}
                      componentId="vaccinations"
                    />
                  ))}
            </Vaccinations>
          )}
          {vaccinationsRes.error && !vaccinationsRes.data && (
            <ErrorWrapper>
              <Problem />
            </ErrorWrapper>
          )}
        </Host>
      </ScrollView>
    </View>
  )
}
