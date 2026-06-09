import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { m } from '../../lib/messages'

export const DeleteWarningStep = () => {
  const { formatMessage } = useLocale()

  return (
    <Box display="flex" flexDirection="column" alignItems="flexStart">
      <Text variant="h3" marginBottom={2}>
        {formatMessage(m.deleteWarningTitle)}
      </Text>

      <Box width="full">
        <Text>{formatMessage(m.deleteWarningBody)}</Text>
      </Box>
    </Box>
  )
}
