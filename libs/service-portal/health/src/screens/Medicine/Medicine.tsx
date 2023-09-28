import { useLocale, useNamespaces } from '@island.is/localization'
import { Box, Tabs, Text } from '@island.is/island-ui/core'
import { IntroHeader } from '@island.is/portals/core'
import { messages } from '../../lib/messages'
import { useState } from 'react'
import { MedicinePurchase } from './TabPanes/MedicinePurchase'
import { MedicineTabs, CONTENT_GAP } from './constants'

const Medicine = () => {
  useNamespaces('sp.health')

  const { formatMessage } = useLocale()
  const [selectedTab, setSelectedTab] = useState<MedicineTabs>(
    MedicineTabs.PURCHASE,
  )

  const tabs = [
    {
      id: MedicineTabs.PURCHASE,
      label: formatMessage(messages.medicinePurchaseTitle),
      content: <MedicinePurchase onTabChange={setSelectedTab} />,
    },
    {
      id: MedicineTabs.CALCULATOR,
      label: formatMessage(messages.medicineCalculatorTitle),
      content: (
        <Box paddingY={4}>
          <Text marginBottom={CONTENT_GAP} variant="h5">
            {formatMessage(messages.medicineCalculatorIntroTitle)}
          </Text>
          <Text>{formatMessage(messages.medicineCalculatorIntroText)}</Text>
        </Box>
      ),
    },
    {
      id: MedicineTabs.LICENSE,
      label: formatMessage(messages.medicineLicenseTitle),
      content: (
        <Box paddingY={4}>
          <Text marginBottom={CONTENT_GAP} variant="h5">
            {formatMessage(messages.medicineLicenseIntroTitle)}
          </Text>
          <Text>{formatMessage(messages.medicineLicenseIntroText)}</Text>
        </Box>
      ),
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
