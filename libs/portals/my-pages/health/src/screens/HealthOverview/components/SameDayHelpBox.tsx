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
      paddingY={2}
    >
      <Text variant="h5" as="h3" lineHeight="lg">
        {formatMessage(messages.contactNow)}
      </Text>
      <Text variant="medium" fontWeight="light" lineHeight="md" color="dark400">
        {formatMessage(messages.contactNowDesc)}{' '}
        <Text
          as="span"
          variant="medium"
          fontWeight="light"
          lineHeight="md"
          color="red600"
        >
          {formatMessage(messages.contactNowEmergencyDesc)}
        </Text>
      </Text>
    </Box>
  )
}

export default SameDayHelpBox
