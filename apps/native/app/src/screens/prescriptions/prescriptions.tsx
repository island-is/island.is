import React, { useCallback, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { RefreshControl, SafeAreaView, ScrollView, View } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import styled from 'styled-components/native'

import {
  useGetDrugCertificatesQuery,
  useGetDrugPrescriptionsQuery,
  useGetMedicineHistoryQuery,
} from '../../graphql/types/schema'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { useConnectivityIndicator } from '../../hooks/use-connectivity-indicator'
import { useLocale } from '../../hooks/use-locale'
import { GeneralCardSkeleton, Problem, TabButtons, Typography } from '../../ui'
import { CertificateCard } from './components/certificate-card'
import { MedicineHistoryCard } from './components/medicin-history-card'
import { PrescriptionCard } from './components/prescription-card'

const Host = styled(SafeAreaView)`
  padding-horizontal: ${({ theme }) => theme.spacing[2]}px;
  margin-bottom: ${({ theme }) => theme.spacing[4]}px;
`

const Wrapper = styled.View`
  margin-top: ${({ theme }) => theme.spacing[3]}px;
`

const Top = styled(Typography)`
  margin-top: ${({ theme }) => theme.spacing[2]}px;
`

const { getNavigationOptions, useNavigationOptions } =
  createNavigationOptionHooks((_, intl) => ({
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
  const showDrugCertificates = selectedTab === 1
  const showMedicineHistory = selectedTab === 2

  const prescriptionsRes = useGetDrugPrescriptionsQuery({
    variables: { locale: useLocale() },
  })

  const medicineHistoryRes = useGetMedicineHistoryQuery({
    variables: { locale: useLocale() },
  })

  const certificatesRes = useGetDrugCertificatesQuery()

  const drugCertificates = certificatesRes.data?.rightsPortalDrugCertificates
  const prescriptions =
    prescriptionsRes.data?.healthDirectoratePrescriptions?.prescriptions
  const medicineHistory =
    medicineHistoryRes.data?.healthDirectorateMedicineHistory?.medicineHistory

  const showPrescriptionError =
    showPrescriptions && prescriptionsRes.error && !prescriptionsRes.data
  const showDrugCertificateError =
    showDrugCertificates && certificatesRes.error && !certificatesRes.data
  const showMedicineHistoryError =
    showMedicineHistory && medicineHistoryRes.error && !medicineHistoryRes.data

  const showNoDataError =
    (showDrugCertificates &&
      !certificatesRes.error &&
      !drugCertificates?.length &&
      !certificatesRes.loading) ||
    (showPrescriptions &&
      !prescriptionsRes.error &&
      !prescriptions?.length &&
      !prescriptionsRes.loading) ||
    (showMedicineHistory &&
      !medicineHistoryRes.error &&
      !medicineHistory?.length &&
      !medicineHistoryRes.loading)

  useConnectivityIndicator({
    componentId,
    refetching,
    queryResult: [prescriptionsRes, certificatesRes, medicineHistoryRes],
  })

  const onRefresh = useCallback(async () => {
    setRefetching(true)

    try {
      await Promise.all([
        prescriptionsRes.refetch(),
        certificatesRes.refetch(),
        medicineHistoryRes.refetch(),
      ])
    } catch (e) {
      // noop
    } finally {
      setRefetching(false)
    }
  }, [prescriptionsRes, certificatesRes, medicineHistoryRes])

  const renderSkeletons = useCallback(
    () =>
      Array.from({ length: 5 }).map((_, index) => (
        <GeneralCardSkeleton height={90} key={index} />
      )),
    [],
  )

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

          <Wrapper>
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
                {
                  title: intl.formatMessage({
                    id: 'health.medicineHistory.title',
                  }),
                },
              ]}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
          </Wrapper>
          {showDrugCertificates &&
          (drugCertificates?.length || certificatesRes.loading) ? (
            <Wrapper>
              {certificatesRes.loading && !certificatesRes.data
                ? renderSkeletons()
                : drugCertificates?.map((certificate, index) => (
                    <CertificateCard
                      key={`${certificate?.id}-${index}`}
                      certificate={certificate}
                    />
                  ))}
            </Wrapper>
          ) : null}
          {showPrescriptions &&
          (prescriptions?.length || prescriptionsRes.loading) ? (
            <Wrapper>
              {prescriptionsRes.loading && !prescriptionsRes.data
                ? renderSkeletons()
                : prescriptions?.map((prescription, index) => (
                    <PrescriptionCard
                      key={`${prescription?.id}-${index}`}
                      prescription={prescription}
                    />
                  ))}
            </Wrapper>
          ) : null}
          {showMedicineHistory &&
          (medicineHistory?.length || medicineHistoryRes.loading) ? (
            <Wrapper>
              {medicineHistoryRes.loading && !medicineHistoryRes.data
                ? renderSkeletons()
                : medicineHistory?.map((medicine, index) => {
                    return (
                      <MedicineHistoryCard
                        key={`${medicine?.id}-${index}`}
                        medicine={medicine}
                      />
                    )
                  })}
            </Wrapper>
          ) : null}
          {showPrescriptionError ||
            showDrugCertificateError ||
            (showMedicineHistoryError && (
              <Wrapper>
                <Problem
                  error={
                    showPrescriptionError ||
                    showDrugCertificateError ||
                    showMedicineHistoryError
                      ? prescriptionsRes.error
                      : certificatesRes.error || medicineHistoryRes.error
                  }
                />
              </Wrapper>
            ))}
          {showNoDataError && (
            <Wrapper>
              <Problem type="no_data" />
            </Wrapper>
          )}
        </Host>
      </ScrollView>
    </View>
  )
}

PrescriptionsScreen.options = getNavigationOptions
