import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { View, SafeAreaView  } from 'react-native'

import { DrugCertificatesTab } from '@/components/health-tabs/drug-certificates-tab'
import { MedicineDelegationTab } from '@/components/health-tabs/medicine-delegation-tab'
import { MedicineHistoryTab } from '@/components/health-tabs/medicine-history-tab'
import { PrescriptionsTab } from '@/components/health-tabs/prescriptions-tab'
import { useFeatureFlag } from '@/components/providers/feature-flag-provider'
import { TabButtons } from '@/ui'
import { useLocalSearchParams } from 'expo-router'

type Tab = {
  id: string
  title: string
  component: React.ComponentType<{ initial: boolean }>
}

export default function MedicineScreen() {
  const params = useLocalSearchParams();
  const tabs = useMedicineTabs()
  const [tabIndex, setTabIndex] = useState(0)
  const [history, setHistory] = useState<number[]>([])
  const initial = useMemo(
    () => !history.includes(tabIndex),
    [history, tabIndex],
  )
  const changeTab = useCallback((index: number) => {
    setHistory((prevHistory) => [...prevHistory, index])
    setTabIndex(index)
  }, [])


  useEffect(() => {
    const initialTabIndex = tabs.findIndex((tab) => tab.id === params.tab);
    if (initialTabIndex !== -1) {
      setTabIndex(initialTabIndex);
    }
  }, [tabs, params.tab]);

  // Memoizing the tab component
  const Tab = useMemo(() => tabs[tabIndex].component, [tabIndex, tabs])

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView  style={[{ marginHorizontal: 16 }]}>
        <TabButtons
          buttons={tabs.map((tab) => ({
            title: tab.title,
          }))}
          selectedTab={tabIndex}
          setSelectedTab={changeTab}
        />
      </SafeAreaView>
      <Tab initial={initial} />
    </View>
  )
}

export function useMedicineTabs() {
  const intl = useIntl()
  const isPrescriptionsEnabled = useFeatureFlag('isPrescriptionsEnabled', false)
  const isMedicineDelegationEnabled = useFeatureFlag(
    'isMedicineDelegationEnabled',
    false,
  )
  const tabs = [
    isPrescriptionsEnabled && {
      id: 'prescriptions',
      title: intl.formatMessage({ id: 'health.prescriptions.title' }),
      component: PrescriptionsTab,
    },
    isMedicineDelegationEnabled && {
      id: 'medicineDelegation',
      title: intl.formatMessage({
        id: 'health.medicineDelegation.screenTitle',
      }),
      component: MedicineDelegationTab,
    },
    {
      id: 'drugCertificates',
      title: intl.formatMessage({ id: 'health.drugCertificates.title' }),
      component: DrugCertificatesTab,
    },
    isPrescriptionsEnabled && {
      id: 'medicineHistory',
      title: intl.formatMessage({ id: 'health.medicineHistory.title' }),
      component: MedicineHistoryTab,
    },
  ]
  return tabs.filter(Boolean) as Tab[]
}
