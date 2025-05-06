import { useLocale } from '@island.is/localization'
import { Box, Text } from '@island.is/island-ui/core'
import { m } from '../lib/messages'

export const Logo = () => {
  const { formatMessage } = useLocale()

  return (
    <Box>
      <Text variant="eyebrow" as="p" color="purple600">
        {formatMessage(m.serviceProvider)}
      </Text>
      <Text variant="h3" as="p" color="purple600">
        {formatMessage(m.inao).toUpperCase()}
      </Text>
    </Box>
  )
}
