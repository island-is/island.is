import React, { useCallback, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { RefreshControl, SafeAreaView, ScrollView, View } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import styled from 'styled-components/native'

import {
  GeneralCardSkeleton,
  Heading,
  Problem,
  TabButtons,
  Typography,
} from '../../ui'
import { useGetDrugPrescriptionsQuery } from '../../graphql/types/schema'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { useConnectivityIndicator } from '../../hooks/use-connectivity-indicator'
import { useLocale } from '../../hooks/use-locale'

const Host = styled(SafeAreaView)`
  padding-horizontal: ${({ theme }) => theme.spacing[2]}px;
  margin-bottom: ${({ theme }) => theme.spacing[4]}px;
`

const Prescriptions = styled.View`
  margin-top: ${({ theme }) => theme.spacing[3]}px;
`

const Tabs = styled.View`
  margin-top: ${({ theme }) => theme.spacing[3]}px;
`

const ErrorWrapper = styled.View`
  margin-top: ${({ theme }) => theme.spacing[3]}px;
`

const { getNavigationOptions, useNavigationOptions } =
  createNavigationOptionHooks((theme, intl) => ({
    topBar: {
      title: {
        text: intl.formatMessage({ id: 'health.prescriptions.screenTitle' }),
      },
    },
    bottomTabs: {
      visible: false,
      drawBehind: true,
    },
  }))

export const PrescriptionsScreen: NavigationFunctionComponent = ({
  componentId,
}) => {
  useNavigationOptions(componentId)
  const intl = useIntl()
  const [refetching, setRefetching] = useState(false)
  const [selectedTab, setSelectedTab] = useState(0)

  const prescriptionsRes = useGetDrugPrescriptionsQuery({
    variables: { locale: useLocale() },
  })

  console.log(prescriptionsRes.data)

  useConnectivityIndicator({
    componentId,
    refetching,
    queryResult: prescriptionsRes,
  })

  const onRefresh = useCallback(async () => {
    setRefetching(true)

    try {
      await prescriptionsRes.refetch()
    } catch (e) {
      // noop
    } finally {
      setRefetching(false)
    }
  }, [prescriptionsRes])

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
              id="health.prescriptions.title"
              defaultMessage="Lyfjaávísanir"
            />
          </Heading>
          <Typography>
            <FormattedMessage
              id="health.prescriptions.description"
              defaultMessage="Hér má finna yfirlit yfir þínar lyfjaávísanir og lyfjaskírteini."
            />
          </Typography>
          {!prescriptionsRes.error && (
            <Tabs>
              <TabButtons
                buttons={[
                  {
                    title: intl.formatMessage({
                      id: 'health.prescriptions.title',
                    }),
                  },
                  {
                    title: intl.formatMessage({
                      id: 'health.prescriptions.drugCertificates',
                    }),
                  },
                ]}
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
              />
            </Tabs>
          )}
          {!prescriptionsRes.error && (
            <Prescriptions>
              {/* {prescriptionsRes.loading && !prescriptionsRes.data
                ? Array.from({ length: 5 }).map((_, index) => (
                    <GeneralCardSkeleton height={90} key={index} />
                  ))
                : vaccinations.map((vaccination, index) => (
                    <VaccinationsCard
                      key={`${vaccination?.id}-${index}`}
                      vaccination={vaccination}
                      loading={prescriptionsRes.loading && !prescriptionsRes.data}
                      componentId={componentId}
                    />
                  ))} */}
            </Prescriptions>
          )}
          {prescriptionsRes.error && !prescriptionsRes.data && (
            <ErrorWrapper>
              <Problem />
            </ErrorWrapper>
          )}
        </Host>
      </ScrollView>
    </View>
  )
}

PrescriptionsScreen.options = getNavigationOptions
