import { useLocale, useNamespaces } from '@island.is/localization'
import { Box, Tabs } from '@island.is/island-ui/core'
import { IntroHeader } from '@island.is/portals/core'
import { messages } from '../../lib/messages'
import { useEffect, useState } from 'react'
import { MedicinePurchase } from './TabPanes/MedicinePurchase'
import { MedicineTabs } from './constants'
import { MedicineCalulator } from './TabPanes/MedicineCalculator'
import { MedicineLicence } from './TabPanes/MedicineLicence'
import { useLocation } from 'react-router-dom'

const Medicine = () => {
  useNamespaces('sp.health')

  const { hash } = useLocation()
  const hashValue = hash.split('#')[1]

  const { formatMessage } = useLocale()
  const [selectedTab, setSelectedTab] = useState<MedicineTabs>(
    Object.values(MedicineTabs).includes(hashValue as MedicineTabs)
      ? (hashValue as MedicineTabs)
      : MedicineTabs.BILLS,
  )

  // this ugly code is neccesary to make reakit tab component update its internal state
  const [forceReRender, setForceReRender] = useState(false)

  useEffect(() => {
    setForceReRender(true)
  }, [selectedTab])

  useEffect(() => {
    if (forceReRender) setForceReRender(false)
  }, [forceReRender])

  const tabs = [
    {
      id: MedicineTabs.BILLS,
      label: formatMessage(messages.medicinePurchaseTitle),
      content: <MedicinePurchase onTabChange={setSelectedTab} />,
    },
    {
      id: MedicineTabs.CALCULATOR,
      label: formatMessage(messages.medicineCalculatorTitle),
      content: <MedicineCalulator />,
    },
    {
      id: MedicineTabs.LICENSE,
      label: formatMessage(messages.medicineLicenseTitle),
      content: <MedicineLicence />,
    },
  ]

  const renderTabs = (selectedTab: MedicineTabs) => {
    return (
      !forceReRender && (
        <Tabs
          label={formatMessage(messages.chooseTherapy)}
          tabs={tabs}
          contentBackground="transparent"
          selected={selectedTab}
          size="xs"
          onChange={(id) => {
            if (id !== selectedTab) id !== selectedTab && setForceReRender(true)
            setSelectedTab(id as MedicineTabs)
          }}
        />
      )
    )
  }

  return (
    <Box>
      <IntroHeader
        title={formatMessage(messages.medicineTitle)}
        intro={formatMessage(messages.medicineTitleIntro)}
      />
      {renderTabs(selectedTab)}
    </Box>
  )
}

export default Medicine
