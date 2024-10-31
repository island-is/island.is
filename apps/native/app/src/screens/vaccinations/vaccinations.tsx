import { GeneralCardSkeleton, Heading, TabButtons, Typography } from '@ui'
import React, { useCallback, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { RefreshControl, SafeAreaView, ScrollView, View } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import styled from 'styled-components/native'

import { useGetVaccinationsQuery } from '../../graphql/types/schema'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { useConnectivityIndicator } from '../../hooks/use-connectivity-indicator'
import { VaccinationsCard } from './components/vaccination-card'

const Host = styled(SafeAreaView)`
  padding-horizontal: ${({ theme }) => theme.spacing[2]}px;
  margin-bottom: ${({ theme }) => theme.spacing[4]}px;
`

const Vaccinations = styled.View`
  margin-top: ${({ theme }) => theme.spacing[3]}px;
`

const Tabs = styled.View`
  margin-top: ${({ theme }) => theme.spacing[3]}px;
`

const { getNavigationOptions, useNavigationOptions } =
  createNavigationOptionHooks((theme, intl) => ({
    topBar: {
      title: {
        text: intl.formatMessage({ id: 'health.vaccinations.screenTitle' }),
      },
    },
    bottomTabs: {
      visible: false,
      drawBehind: true,
    },
  }))

export const VaccinationsScreen: NavigationFunctionComponent = ({
  componentId,
}) => {
  useNavigationOptions(componentId)
  const intl = useIntl()
  const [refetching, setRefetching] = useState(false)
  const [selectedTab, setSelectedTab] = useState(0)

  const vaccinationsRes = useGetVaccinationsQuery()

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

  useConnectivityIndicator({
    componentId,
    refetching,
    queryResult: vaccinationsRes,
  })

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
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refetching} onRefresh={onRefresh} />
        }
        style={{ flex: 1 }}
      >
        <Host>
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
                    componentId={componentId}
                  />
                ))}
          </Vaccinations>
        </Host>
      </ScrollView>
    </View>
  )
}

VaccinationsScreen.options = getNavigationOptions
