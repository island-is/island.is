import { ModalBase, Icon, Box, Button, Text } from '@island.is/island-ui/core'
import { messages } from '../../lib/messages'
import * as styles from './RegisterModal.css'
import { useLocale } from '@island.is/localization'

type RegisterModalProps = {
  onClose: () => void
  onAccept: () => void
  id: string
  title: string
  description: string
  buttonLoading?: boolean
  isVisible?: boolean
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  id,
  onAccept,
  onClose,
  title,
  description,
  buttonLoading = false,
  isVisible = false,
}) => {
  const { formatMessage } = useLocale()

  return (
    <ModalBase
      isVisible={isVisible}
      baseId={id}
      className={styles.modalBaseStyle}
    >
      <Box paddingTop={10} paddingBottom={9} paddingX={3} background="white">
        <Box className={styles.closeModalButtonStyle}>
          <button
            aria-label={formatMessage(messages.closeModal)}
            onClick={onClose}
          >
            <Icon icon="close" size="large" />
          </button>
        </Box>
        <Box className={styles.modalGridStyle}>
          <Box className={styles.modalGridContentStyle}>
            <Text variant="h2">{title}</Text>
            <Text marginTop={2} marginBottom={3}>
              {description}
            </Text>
            <Box className={styles.modalGridButtonGroup}>
              <Button size="small" variant="primary" onClick={onClose}>
                {formatMessage(messages.healthRegisterModalDecline)}
              </Button>
              <Button
                size="small"
                variant="ghost"
                onClick={onAccept}
                loading={buttonLoading}
              >
                {formatMessage(messages.healthRegisterModalAccept)}
              </Button>
            </Box>
          </Box>
          <Box className={styles.modalGridImageStyle}>
            <img src="./assets/images/hourglass.svg" alt="" />
          </Box>
        </Box>
      </Box>
    </ModalBase>
  )
}
