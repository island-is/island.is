import { Box, Button, Divider } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../lib/messages'

type Props = {
  onBackButtonClick: () => void
  onSendButtonClick: () => void
  loading?: boolean
  sendText?: string
}

const BottomBar = ({
  onBackButtonClick,
  onSendButtonClick,
  loading = false,
  sendText,
}: Props) => {
  const { formatMessage } = useLocale()

  return (
    <>
      <Box paddingY={3}>
        <Divider />
      </Box>
      <Box display="flex" justifyContent="spaceBetween" paddingY={5}>
        <Button variant="ghost" onClick={onBackButtonClick} disabled={loading}>
          {formatMessage(m.goBack)}
        </Button>
        <Button icon="checkmark" onClick={onSendButtonClick} loading={loading}>
          {sendText ? sendText : formatMessage(m.send)}
        </Button>
      </Box>
    </>
  )
}

export default BottomBar
