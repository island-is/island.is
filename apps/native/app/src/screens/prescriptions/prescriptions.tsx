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
import {
  useGetDrugCertificatesQuery,
  useGetDrugPrescriptionsQuery,
} from '../../graphql/types/schema'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { useConnectivityIndicator } from '../../hooks/use-connectivity-indicator'
import { useLocale } from '../../hooks/use-locale'
import { CertificateCard } from './components/certificate-card'
import { PrescriptionCard } from './components/prescription-card'
import { useFeatureFlag } from '../../contexts/feature-flag-provider'

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
  const isPrescriptionsEnabled = useFeatureFlag('isPrescriptionsEnabled', false)

  const showPrescriptions = isPrescriptionsEnabled && selectedTab === 0

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
          <Heading>
            <FormattedMessage
              id={
                isPrescriptionsEnabled
                  ? 'health.prescriptions.title'
                  : 'health.drugCertificates.title'
              }
              defaultMessage={
                isPrescriptionsEnabled ? 'Lyfjaávísanir' : 'Lyfjaskírteini'
              }
            />
          </Heading>
          <Typography>
            <FormattedMessage
              id={
                isPrescriptionsEnabled
                  ? 'health.prescriptions.description'
                  : 'health.drugCertificates.description'
              }
              defaultMessage={
                isPrescriptionsEnabled
                  ? 'Hér má finna yfirlit yfir þínar lyfjaávísanir og lyfjaskírteini.'
                  : 'Læknir sækir um lyfjaskírteini fyrir einstakling sem gefin eru út af Sjúkratryggingum að uppfylltum ákveðnum skilyrðum samkvæmt vinnureglum.'
              }
            />
          </Typography>
          {!(prescriptionsRes.error && certificatesRes.error) &&
            isPrescriptionsEnabled && (
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
            )}
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
                      loading={certificatesRes.loading && !certificatesRes.data}
                    />
                  ))}
            </Prescriptions>
          ) : null}
          {(prescriptions?.length || prescriptionsRes.loading) &&
          showPrescriptions ? (
            <Prescriptions>
              {prescriptionsRes.loading && !prescriptionsRes.data
                ? Array.from({ length: 5 }).map((_, index) => (
                    <GeneralCardSkeleton height={90} key={index} />
                  ))
                : prescriptions?.map((prescription, index) => (
                    <PrescriptionCard
                      key={`${prescription?.id}-${index}`}
                      prescription={prescription}
                      loading={
                        prescriptionsRes.loading && !prescriptionsRes.data
                      }
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
