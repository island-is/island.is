import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { Box } from '@island.is/island-ui/core'

export const NotFilledOut = () => {
  const { formatMessage } = useLocale()
  return (
    <Box marginY={3}>
      <p style={{ fontStyle: 'italic' }}>{formatMessage(m.notFilledOut)}</p>
    </Box>
  )
}

export default NotFilledOut
