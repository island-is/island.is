import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { messages } from '../../lib/messages'

const Files = () => {
  const { formatMessage } = useLocale()

  return (
    <Box>
      <Box>{formatMessage(messages.pregnancy)}</Box>
    </Box>
  )
}

export default Files
