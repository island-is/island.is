import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { RefreshControl, SafeAreaView, ScrollView, View } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import { useNavigation } from 'react-native-navigation-hooks/dist'
import styled from 'styled-components/native'

import {
  HealthDirectorateMedicineHistoryItem,
  HealthDirectoratePrescription,
  RightsPortalDrugCertificate,
  useGetDrugCertificatesLazyQuery,
  useGetDrugPrescriptionsLazyQuery,
  useGetMedicineHistoryLazyQuery,
} from '../../graphql/types/schema'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { useConnectivityIndicator } from '../../hooks/use-connectivity-indicator'
import { useLocale } from '../../hooks/use-locale'
import { GeneralCardSkeleton, Problem, TabButtons, Typography } from '../../ui'
import { CertificateCard } from './components/certificate-card'
import { MedicineHistoryCard } from './components/medicine-history-card'
import { PrescriptionCard } from './components/prescription-card'
import { useFeatureFlag } from '@/components/providers/feature-flag-provider'

type ActiveTabData = HealthDirectorateMedicineHistoryItem[] &
  HealthDirectoratePrescription[] &
  RightsPortalDrugCertificate[]

const Host = styled(SafeAreaView)`
  padding-horizontal: ${({ theme }) => theme.spacing[2]}px;
  margin-bottom: ${({ theme }) => theme.spacing[4]}px;
`

const Wrapper = styled.View`
  margin-top: ${({ theme }) => theme.spacing[3]}px;
`

const DescriptionWrapper = styled.View`
  margin-top: ${({ theme }) => theme.spacing[2]}px;
`

const { getNavigationOptions, useNavigationOptions } =
  createNavigationOptionHooks((_) => ({
    topBar: {
      title: {
        text: '',
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

  const { mergeOptions } = useNavigation(componentId)
  const locale = useLocale()

  const isPrescriptionsEnabled = useFeatureFlag(
    'isPrescriptionsEnabled',
    false,
    null,
  )

  useEffect(() => {
    if (isPrescriptionsEnabled === null) {
      return
    }

    mergeOptions({
      topBar: {
        title: {
          text: intl.formatMessage({
            id: isPrescriptionsEnabled
              ? 'health.prescriptionsAndCertificates.screenTitle'
              : 'health.drugCertificates.title',
          }),
        },
      },
    })
  }, [intl, isPrescriptionsEnabled, mergeOptions])
  const [loadPrescriptions, prescriptionsRes] =
    useGetDrugPrescriptionsLazyQuery({
      variables: { locale },
    })

  const [loadMedicineHistory, medicineHistoryRes] =
    useGetMedicineHistoryLazyQuery({
      variables: { locale },
    })

  const [loadCertificates, certificatesRes] = useGetDrugCertificatesLazyQuery(
    {},
  )

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
        enabled: isPrescriptionsEnabled,
        queryResult: prescriptionsRes,
        getData: () =>
          prescriptionsRes.data?.healthDirectoratePrescriptions?.prescriptions,
        ensureLoaded: () => {
          if (!prescriptionsRes.called && isPrescriptionsEnabled) {
            loadPrescriptions()
          }
        },
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
        descriptionId: 'health.prescriptionsAndCertificates.description',
        enabled: true,
        queryResult: certificatesRes,
        getData: () => certificatesRes.data?.rightsPortalDrugCertificates,
        ensureLoaded: () => {
          if (!certificatesRes.called) {
            loadCertificates()
          }
        },
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
        enabled: isPrescriptionsEnabled,
        queryResult: medicineHistoryRes,
        getData: () =>
          medicineHistoryRes.data?.healthDirectorateMedicineHistory
            ?.medicineHistory,
        ensureLoaded: () => {
          if (!medicineHistoryRes.called && isPrescriptionsEnabled) {
            loadMedicineHistory()
          }
        },
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
    isPrescriptionsEnabled,
    prescriptionsRes,
    certificatesRes,
    medicineHistoryRes,
    renderSkeletons,
    loadPrescriptions,
    loadCertificates,
    loadMedicineHistory,
  ])

  const activeTab = tabs[selectedTab]
  const activeTabData = activeTab?.getData() as ActiveTabData

  useEffect(() => {
    tabs[selectedTab]?.ensureLoaded()
  }, [tabs, selectedTab])

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
      const promises = [
        certificatesRes.called && certificatesRes.refetch
          ? certificatesRes.refetch()
          : null,
        isPrescriptionsEnabled &&
        prescriptionsRes.called &&
        prescriptionsRes.refetch
          ? prescriptionsRes.refetch()
          : null,
        isPrescriptionsEnabled &&
        medicineHistoryRes.called &&
        medicineHistoryRes.refetch
          ? medicineHistoryRes.refetch()
          : null,
      ].filter(Boolean)

      await Promise.all(promises)
    } catch (e) {
      // noop
    } finally {
      setRefetching(false)
    }
  }, [
    prescriptionsRes,
    certificatesRes,
    medicineHistoryRes,
    isPrescriptionsEnabled,
  ])

  if (isPrescriptionsEnabled === null) {
    return null
  }

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
            {isPrescriptionsEnabled ? (
              <TabButtons
                buttons={tabs.map((tab) => ({
                  title: intl.formatMessage({
                    id: tab.titleId,
                  }),
                }))}
                selectedTab={selectedTab}
                setSelectedTab={handleTabChange}
              />
            ) : (
              <Typography variant="body">
                {intl.formatMessage({
                  id: 'health.prescriptionsAndCertificates.description',
                })}
              </Typography>
            )}
          </Wrapper>
          {activeTab?.descriptionId && (
            <DescriptionWrapper>
              <Typography variant="body">
                {intl.formatMessage({
                  id: activeTab?.descriptionId ?? '',
                })}
              </Typography>
            </DescriptionWrapper>
          )}
          {activeTab &&
            (activeTabData?.length || activeTab.queryResult.loading) &&
            activeTab.renderContent(activeTabData)}
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
