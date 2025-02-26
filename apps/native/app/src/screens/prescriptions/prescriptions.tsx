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

  const showPrescriptions = selectedTab === 0

  const prescriptionsRes = useGetDrugPrescriptionsQuery({
    variables: { locale: useLocale() },
  })
  const certificatesRes = useGetDrugCertificatesQuery()

  const drugCertificates = certificatesRes.data?.rightsPortalDrugCertificates
  const prescriptions = prescriptionsRes.data?.healthDirectoratePrescriptions

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
          {!(prescriptionsRes.error && certificatesRes.error) && (
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
          {!certificatesRes.error && !showPrescriptions && (
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
          )}
          {!prescriptionsRes.error && showPrescriptions && (
            <Prescriptions>
              {prescriptionsRes.loading && !prescriptionsRes.data
                ? Array.from({ length: 5 }).map((_, index) => (
                    <GeneralCardSkeleton height={90} key={index} />
                  ))
                : drugCertificates?.map((prescription, index) => (
                    <CertificateCard
                      key={`${prescription?.id}-${index}`}
                      certificate={prescription}
                      loading={
                        prescriptionsRes.loading && !prescriptionsRes.data
                      }
                    />
                  ))}
            </Prescriptions>
          )}
          {showPrescriptions &&
            prescriptionsRes.error &&
            !prescriptionsRes.data && (
              <ErrorWrapper>
                <Problem />
              </ErrorWrapper>
            )}
          {!showPrescriptions &&
            certificatesRes.error &&
            !certificatesRes.data && (
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
