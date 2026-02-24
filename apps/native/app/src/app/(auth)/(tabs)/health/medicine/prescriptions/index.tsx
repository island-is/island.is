import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { RefreshControl, SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native'
import { Stack } from 'expo-router'
import styled from 'styled-components/native'

import { useFeatureFlag } from '@/components/providers/feature-flag-provider'
import {
  HealthDirectorateMedicineHistoryItem,
  HealthDirectoratePrescription,
  RightsPortalDrugCertificate,
  useGetDrugCertificatesLazyQuery,
  useGetDrugPrescriptionsLazyQuery,
  useGetMedicineDelegationsLazyQuery,
  useGetMedicineHistoryLazyQuery,
} from '@/graphql/types/schema'
import { useLocale } from '@/hooks/use-locale'
import { GeneralCardSkeleton, Problem, Tag, Typography } from '@/ui'
import { MedicineDelegationContent } from '../_components/medicine-delegation-content'
import { CertificateCard } from './_components/certificate-card'
import { MedicineHistoryCard } from './_components/medicine-history-card'
import { PrescriptionCard } from './_components/prescription-card'

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

const TagsWrapper = styled.ScrollView.attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  contentContainerStyle: {
    gap: 8,
  },
})`
  margin-top: ${({ theme }) => theme.spacing[2]}px;
  flex-grow: 0;
  margin-horizontal: -${({ theme }) => theme.spacing[2]}px;
  padding-horizontal: ${({ theme }) => theme.spacing[2]}px;
`

const DescriptionWrapper = styled.View`
  margin-top: ${({ theme }) => theme.spacing[2]}px;
`

export default function PrescriptionsScreen() {
  const intl = useIntl()
  const [refetching, setRefetching] = useState(false)
  const [selectedTabId, setSelectedTabId] = useState<string | null>(null)
  const [showInactivePermits, setShowInactivePermits] = useState(false)
  const hasSetInitialTab = useRef(false)

  const locale = useLocale()

  const isPrescriptionsEnabled = useFeatureFlag(
    'isPrescriptionsEnabled',
    false,
    null,
  )

  const isMedicineDelegationEnabled = useFeatureFlag(
    'isMedicineDelegationEnabled',
    false,
    null,
  )

  const featureFlagsLoaded =
    isPrescriptionsEnabled !== null && isMedicineDelegationEnabled !== null

  const screenTitle = useMemo(() => {
    if (!featureFlagsLoaded) return ''
    return intl.formatMessage({
      id:
        !isPrescriptionsEnabled && !isMedicineDelegationEnabled
          ? 'health.drugCertificates.title'
          : 'health.prescriptionsAndCertificates.screenTitle',
    })
  }, [featureFlagsLoaded, intl, isPrescriptionsEnabled, isMedicineDelegationEnabled])

  const [loadPrescriptions, prescriptionsRes] =
    useGetDrugPrescriptionsLazyQuery({
      variables: { locale },
    })

  const [loadMedicineDelegations, medicineDelegationsRes] =
    useGetMedicineDelegationsLazyQuery({
      variables: {
        locale: intl.locale,
        input: {
          status: [
            'active',
            'expired',
            'inactive',
            'unknown',
            'awaitingApproval',
          ],
        },
      },
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
        id: 'medicineDelegation',
        titleId: 'health.medicineDelegation.screenTitle',
        enabled: isMedicineDelegationEnabled,
        queryResult: medicineDelegationsRes,
        getData: () =>
          medicineDelegationsRes.data?.healthDirectorateMedicineDelegations
            ?.items ?? [],
        ensureLoaded: () => {
          if (!medicineDelegationsRes.called && isMedicineDelegationEnabled) {
            loadMedicineDelegations()
          }
        },
        extraData: [showInactivePermits],
        renderContent: () => (
          <Wrapper>
            {medicineDelegationsRes.loading && !medicineDelegationsRes.data ? (
              renderSkeletons()
            ) : (
              <MedicineDelegationContent
                componentId="prescriptions"
                delegations={
                  medicineDelegationsRes.data
                    ?.healthDirectorateMedicineDelegations?.items ?? []
                }
                loading={medicineDelegationsRes.loading}
                error={medicineDelegationsRes.error}
                showInactivePermits={showInactivePermits}
              />
            )}
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
    isMedicineDelegationEnabled,
    prescriptionsRes,
    certificatesRes,
    medicineHistoryRes,
    medicineDelegationsRes,
    showInactivePermits,
    renderSkeletons,
    loadPrescriptions,
    loadCertificates,
    loadMedicineHistory,
    loadMedicineDelegations,
    intl,
  ])

  const selectedTab = selectedTabId
    ? tabs.findIndex((tab) => tab.id === selectedTabId)
    : 0

  const validSelectedTab =
    selectedTab >= 0 && selectedTab < tabs.length ? selectedTab : 0

  const activeTab = tabs[validSelectedTab]
  const activeTabData = activeTab?.getData() as ActiveTabData

  useEffect(() => {
    if (!featureFlagsLoaded) {
      return
    }

    if (tabs.length > 0 && !hasSetInitialTab.current) {
      setSelectedTabId(tabs[0].id)
      hasSetInitialTab.current = true
    }
  }, [tabs, featureFlagsLoaded])

  useEffect(() => {
    if (featureFlagsLoaded) {
      tabs[validSelectedTab]?.ensureLoaded()
    }
  }, [tabs, validSelectedTab, featureFlagsLoaded])

  const handleTabChange = (tabIndex: number) => {
    if (tabs[tabIndex]) {
      setSelectedTabId(tabs[tabIndex].id)
    }
  }

  const showError =
    activeTab && activeTab.queryResult.error && !activeTab.queryResult.data

  const showNoDataError =
    activeTab &&
    !activeTab.queryResult.error &&
    !activeTabData?.length &&
    !activeTab.queryResult.loading

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
        isMedicineDelegationEnabled &&
        medicineDelegationsRes.called &&
        medicineDelegationsRes.refetch
          ? medicineDelegationsRes.refetch()
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
    medicineDelegationsRes,
    isPrescriptionsEnabled,
    isMedicineDelegationEnabled,
  ])

  if (!featureFlagsLoaded) {
    return null
  }

  const isDelegationTab = activeTab?.id === 'medicineDelegation'

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: screenTitle,
          headerRight: isDelegationTab
            ? () => (
                <TouchableOpacity
                  onPress={() => setShowInactivePermits((prev) => !prev)}
                >
                  <Typography variant="eyebrow" color="#0061FF">
                    {intl.formatMessage({
                      id: showInactivePermits
                        ? 'health.medicineDelegation.hideExpiredPermits'
                        : 'health.medicineDelegation.showExpiredPermits',
                    })}
                  </Typography>
                </TouchableOpacity>
              )
            : undefined,
        }}
      />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refetching} onRefresh={onRefresh} />
        }
        style={{ flex: 1 }}
      >
        <Host>
          {tabs.length > 1 && (
            <TagsWrapper>
              {tabs.map((tab, index) => (
                <Tag
                  key={tab.id}
                  title={intl.formatMessage({
                    id: tab.titleId,
                  })}
                  active={validSelectedTab === index}
                  onPress={() => handleTabChange(index)}
                />
              ))}
            </TagsWrapper>
          )}
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
