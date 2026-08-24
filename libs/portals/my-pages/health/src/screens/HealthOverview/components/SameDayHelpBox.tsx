import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { messages } from '../../../lib/messages'

const SameDayHelpBox = () => {
  const { formatMessage } = useLocale()

  return (
    <Box
      borderWidth="standard"
      borderColor="blue200"
      borderRadius="large"
      background="white"
      padding={3}
    >
      <Text variant="h5" as="h3" lineHeight="lg">
        {formatMessage(messages.contactNow)}
      </Text>
      <Text variant="medium" fontWeight="light" lineHeight="lg" color="dark400">
        {formatMessage(messages.contactNowDesc)}
      </Text>
      <Text variant="medium" fontWeight="light" lineHeight="lg" color="red600">
        {formatMessage(messages.contactNowEmergencyDesc)}
      </Text>
    </Box>
  )
}

export default SameDayHelpBox
