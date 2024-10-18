import { Box, Button, Divider } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { MessageDescriptor } from 'react-intl'

type Props = {
  onBackButtonClick: () => void
  onSendButtonClick: () => void
  loading?: boolean
  goBack: MessageDescriptor
  send: MessageDescriptor
}

export const BottomBar = ({
  onBackButtonClick,
  onSendButtonClick,
  loading = false,
  goBack,
  send,
}: Props) => {
  const { formatMessage } = useLocale()

  return (
    <>
      <Box paddingY={3}>
        <Divider />
      </Box>
      <Box display="flex" justifyContent="spaceBetween" paddingY={5}>
        <Button variant="ghost" onClick={onBackButtonClick} disabled={loading}>
          {formatMessage(goBack)}
        </Button>
        <Button icon="checkmark" onClick={onSendButtonClick} loading={loading}>
          {formatMessage(send)}
        </Button>
      </Box>
    </>
  )
}
