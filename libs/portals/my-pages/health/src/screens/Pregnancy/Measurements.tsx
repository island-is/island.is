import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { messages } from '../../lib/messages'

const Measurements = () => {
  const { formatMessage } = useLocale()

  return (
    <Box>
      <Box>{formatMessage(messages.pregnancy)}</Box>
    </Box>
  )
}

export default Measurements
