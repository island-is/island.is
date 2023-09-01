import { useLocale, useNamespaces } from '@island.is/localization'
import { Box, Tabs, Text } from '@island.is/island-ui/core'
import { IntroHeader } from '@island.is/portals/core'
import { messages } from '../../lib/messages'

const Medicine = () => {
  useNamespaces('sp.health')

  const { formatMessage } = useLocale()

  const tabs = [
    {
      label: formatMessage(messages.medicinePurchaseTitle),
      content: (
        <Box paddingY={4}>
          <Text marginBottom={2} variant="h5">
            {formatMessage(messages.medicinePurchaseIntroTitle)}
          </Text>
          <Text>{formatMessage(messages.medicinePurchaseIntroText)}</Text>
        </Box>
      ),
    },
    {
      label: formatMessage(messages.medicineCalculatorTitle),
      content: (
        <Box paddingY={4}>
          <Text marginBottom={2} variant="h5">
            {formatMessage(messages.medicineCalculatorIntroTitle)}
          </Text>
          <Text>{formatMessage(messages.medicineCalculatorIntroText)}</Text>
        </Box>
      ),
    },
    {
      label: formatMessage(messages.medicineLicenseTitle),
      content: (
        <Box paddingY={4}>
          <Text marginBottom={2} variant="h5">
            {formatMessage(messages.medicineLicenseIntroTitle)}
          </Text>
          <Text>{formatMessage(messages.medicineLicenseIntroText)}</Text>
        </Box>
      ),
    },
  ]

  const tabsElement =
    tabs.length === 1 ? (
      <>
        <Text variant="h5">{tabs[0].label}</Text>
        <Box>{tabs[0].content}</Box>
      </>
    ) : (
      <Tabs
        label={formatMessage(messages.chooseTherapy)}
        tabs={tabs}
        contentBackground="transparent"
        selected="0"
        size="xs"
      />
    )

  return (
    <Box>
      <IntroHeader
        title={formatMessage(messages.medicineTitle)}
        intro={
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore aliqua.'
        }
      />
      {tabsElement}
    </Box>
  )
}

export default Medicine
