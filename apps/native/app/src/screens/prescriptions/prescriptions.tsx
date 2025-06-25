import React, { useCallback, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { RefreshControl, SafeAreaView, ScrollView, View } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import styled from 'styled-components/native'

import { GeneralCardSkeleton, Problem, TabButtons, Typography } from '../../ui'
import {
  useGetDrugCertificatesQuery,
  useGetDrugPrescriptionsQuery,
} from '../../graphql/types/schema'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { useConnectivityIndicator } from '../../hooks/use-connectivity-indicator'
import { useLocale } from '../../hooks/use-locale'
import { CertificateCard } from './components/certificate-card'
import { PrescriptionCard } from './components/prescription-card'

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

const Top = styled(Typography)`
  margin-top: ${({ theme }) => theme.spacing[2]}px;
`

const { getNavigationOptions, useNavigationOptions } =
  createNavigationOptionHooks((theme, intl) => ({
    topBar: {
      title: {
        text: intl.formatMessage({
          id: 'health.prescriptionsAndCertificates.screenTitle',
        }),
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

  const showPrescriptions = selectedTab === 0

  const prescriptionsRes = useGetDrugPrescriptionsQuery({
    variables: { locale: useLocale() },
  })
  const certificatesRes = useGetDrugCertificatesQuery()

  const drugCertificates = certificatesRes.data?.rightsPortalDrugCertificates
  const prescriptions =
    prescriptionsRes.data?.healthDirectoratePrescriptions?.prescriptions

  const showPrescriptionError =
    showPrescriptions && prescriptionsRes.error && !prescriptionsRes.data
  const showDrugCertificateError =
    !showPrescriptions && certificatesRes.error && !certificatesRes.data

  const showNoDataError =
    (!showPrescriptions &&
      !certificatesRes.error &&
      !drugCertificates?.length &&
      !certificatesRes.loading) ||
    (showPrescriptions &&
      !prescriptionsRes.error &&
      !prescriptions?.length &&
      !prescriptionsRes.loading)

  useConnectivityIndicator({
    componentId,
    refetching,
    queryResult: [prescriptionsRes, certificatesRes],
  })

  const onRefresh = useCallback(async () => {
    setRefetching(true)

    try {
      await prescriptionsRes.refetch()
      await certificatesRes.refetch()
    } catch (e) {
      // noop
    } finally {
      setRefetching(false)
    }
  }, [prescriptionsRes, certificatesRes])

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refetching} onRefresh={onRefresh} />
        }
        style={{ flex: 1 }}
      >
        <Host>
          <Top>
            <FormattedMessage
              id={'health.prescriptions.description'}
              defaultMessage={
                'Hér má finna yfirlit yfir þínar lyfjaávísanir og lyfjaskírteini.'
              }
            />
          </Top>

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
                    id: 'health.drugCertificates.title',
                  }),
                },
              ]}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
          </Tabs>
          {!showPrescriptions &&
          (drugCertificates?.length || certificatesRes.loading) ? (
            <Prescriptions>
              {certificatesRes.loading && !certificatesRes.data
                ? Array.from({ length: 5 }).map((_, index) => (
                    <GeneralCardSkeleton height={90} key={index} />
                  ))
                : drugCertificates?.map((certificate, index) => (
                    <CertificateCard
                      key={`${certificate?.id}-${index}`}
                      certificate={certificate}
                    />
                  ))}
            </Prescriptions>
          ) : null}
          {showPrescriptions &&
          (prescriptions?.length || prescriptionsRes.loading) ? (
            <Prescriptions>
              {prescriptionsRes.loading && !prescriptionsRes.data
                ? Array.from({ length: 5 }).map((_, index) => (
                    <GeneralCardSkeleton height={90} key={index} />
                  ))
                : prescriptions?.map((prescription, index) => (
                    <PrescriptionCard
                      key={`${prescription?.id}-${index}`}
                      prescription={prescription}
                    />
                  ))}
            </Prescriptions>
          ) : null}
          {showPrescriptionError && (
            <ErrorWrapper>
              <Problem />
            </ErrorWrapper>
          )}
          {showDrugCertificateError && (
            <ErrorWrapper>
              <Problem />
            </ErrorWrapper>
          )}
          {showNoDataError && (
            <ErrorWrapper>
              <Problem type="no_data" />
            </ErrorWrapper>
          )}
        </Host>
      </ScrollView>
    </View>
  )
}

PrescriptionsScreen.options = getNavigationOptions
