import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { RefreshControl, SafeAreaView, ScrollView, View } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import styled from 'styled-components/native'

import { useFeatureFlag } from '../../contexts/feature-flag-provider'
import {
  HealthDirectorateMedicineHistoryItem,
  HealthDirectoratePrescription,
  RightsPortalDrugCertificate,
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
import { Text } from 'react-native-reanimated/lib/typescript/Animated'

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

  const disableDrugCertificates = useFeatureFlag(
    'isDrugCertificateEnabled',
    false,
  )

  const prescriptionsRes = useGetDrugPrescriptionsQuery({
    variables: { locale: useLocale() },
    fetchPolicy: 'cache-first',
  })

  const medicineHistoryRes = useGetMedicineHistoryQuery({
    variables: { locale: useLocale() },
    fetchPolicy: 'cache-first',
  })

  const certificatesRes = useGetDrugCertificatesQuery({
    fetchPolicy: 'cache-first',
  })

  const renderSkeletons = useCallback(
    () =>
      Array.from({ length: 5 }).map((_, index) => (
        <GeneralCardSkeleton height={90} key={index} />
      )),
    [],
  )

  const tabs = useMemo(() => {
    const allTabs = [
      {
        id: 'prescriptions',
        titleId: 'health.prescriptions.title',
        enabled: true,
        queryResult: prescriptionsRes,
        getData: () =>
          prescriptionsRes.data?.healthDirectoratePrescriptions?.prescriptions,
        renderContent: (data: HealthDirectoratePrescription[]) => (
          <Wrapper>
            {prescriptionsRes.loading && !prescriptionsRes.data
              ? renderSkeletons()
              : data?.map((prescription, index) => (
                  <PrescriptionCard
                    key={`${prescription?.id}-${index}`}
                    prescription={prescription}
                  />
                ))}
          </Wrapper>
        ),
      },
      {
        id: 'drugCertificates',
        titleId: 'health.drugCertificates.title',
        enabled: disableDrugCertificates,
        queryResult: certificatesRes,
        getData: () => certificatesRes.data?.rightsPortalDrugCertificates,
        renderContent: (data: RightsPortalDrugCertificate[]) => (
          <Wrapper>
            {certificatesRes.loading && !certificatesRes.data
              ? renderSkeletons()
              : data?.map((certificate, index) => (
                  <CertificateCard
                    key={`${certificate?.id}-${index}`}
                    certificate={certificate}
                  />
                ))}
          </Wrapper>
        ),
      },
      {
        id: 'medicineHistory',
        titleId: 'health.medicineHistory.title',
        enabled: true,
        queryResult: medicineHistoryRes,
        getData: () =>
          medicineHistoryRes.data?.healthDirectorateMedicineHistory
            ?.medicineHistory,
        renderContent: (data: HealthDirectorateMedicineHistoryItem[]) => (
          <Wrapper>
            {medicineHistoryRes.loading && !medicineHistoryRes.data
              ? renderSkeletons()
              : data?.map((medicine, index) => (
                  <MedicineHistoryCard
                    key={`${medicine?.id}-${index}`}
                    medicine={medicine}
                  />
                ))}
          </Wrapper>
        ),
      },
    ]

    return allTabs.filter((tab) => tab.enabled)
  }, [
    disableDrugCertificates,
    prescriptionsRes,
    certificatesRes,
    medicineHistoryRes,
    renderSkeletons,
  ])

  const activeTab = tabs[selectedTab]
  const activeTabData = activeTab?.getData()

  const handleTabChange = (tabIndex: number) => {
    setSelectedTab(tabIndex)
  }

  const showError =
    activeTab && activeTab.queryResult.error && !activeTab.queryResult.data

  const showNoDataError =
    activeTab &&
    !activeTab.queryResult.error &&
    !activeTabData?.length &&
    !activeTab.queryResult.loading

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

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refetching} onRefresh={onRefresh} />
        }
        style={{ flex: 1 }}
      >
        <Host>
          <Wrapper>
            <TabButtons
              buttons={tabs.map((tab) => ({
                title: intl.formatMessage({
                  id: tab.titleId,
                }),
              }))}
              selectedTab={selectedTab}
              setSelectedTab={handleTabChange}
            />
          </Wrapper>
          {activeTab &&
            (activeTabData?.length || activeTab.queryResult.loading) &&
            activeTab.renderContent(activeTabData as any)}
          {showError && (
            <Wrapper>
              <Problem error={activeTab?.queryResult.error} />
            </Wrapper>
          )}
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
