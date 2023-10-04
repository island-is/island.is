import { useLocale, useNamespaces } from '@island.is/localization'
import { Box, Tabs, Text } from '@island.is/island-ui/core'
import { IntroHeader } from '@island.is/portals/core'
import { messages } from '../../lib/messages'
import { useState } from 'react'
import { MedicinePurchase } from './TabPanes/MedicinePurchase'
import { MedicineTabs, CONTENT_GAP } from './constants'
import { MedicineCalulator } from './TabPanes/MedicineCalculator'
import { MedicineLicence } from './TabPanes/MedicineLicence'

const Medicine = () => {
  useNamespaces('sp.health')

  const { formatMessage } = useLocale()
  const [selectedTab, setSelectedTab] = useState<MedicineTabs>(
    MedicineTabs.BILLS,
  )

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

  return (
    <Box>
      <IntroHeader
        title={formatMessage(messages.medicineTitle)}
        intro={formatMessage(messages.medicineTitleIntro)}
      />
      <Tabs
        label={formatMessage(messages.chooseTherapy)}
        tabs={tabs}
        contentBackground="transparent"
        selected={selectedTab}
        size="xs"
        onChange={(id) => setSelectedTab(id as MedicineTabs)}
      />
    </Box>
  )
}

export default Medicine
