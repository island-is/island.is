import { Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Modal } from '@island.is/react/components'
import { m } from '../../lib/messages'

interface TranslationPublishConfirmModalProps {
  isVisible: boolean
  publishing: boolean
  onConfirm: () => void
  onClose: () => void
}

export const TranslationPublishConfirmModal = ({
  isVisible,
  publishing,
  onConfirm,
  onClose,
}: TranslationPublishConfirmModalProps) => {
  const { formatMessage } = useLocale()
  const title = formatMessage(m.translationPublish)

  return (
    <Modal
      id="translation-publish-confirm"
      isVisible={isVisible}
      label={title}
      title={title}
      onClose={onClose}
      closeButtonLabel={formatMessage(m.translationPublishCancel)}
    >
      <Text>{formatMessage(m.translationPublishConfirm)}</Text>
      <Box
        marginTop={4}
        display="flex"
        flexDirection="row"
        justifyContent="spaceBetween"
      >
        <Button variant="ghost" size="small" onClick={onClose}>
          {formatMessage(m.translationPublishCancel)}
        </Button>
        <Button size="small" onClick={onConfirm} loading={publishing}>
          {title}
        </Button>
      </Box>
    </Modal>
  )
}
