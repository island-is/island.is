import { FC } from 'react'
import { Box, Button, ModalBase, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m as coreMessages } from '@island.is/portals/core'
import * as styles from './ConfirmModal.css'

interface ConfirmModalProps {
  isVisible: boolean
  onConfirm: () => void
  onVisibilityChange: (visibility: boolean) => void
  message: string
  title?: string
  confirmMessage?: string
  confirmGhost?: boolean
}

const ConfirmModal: FC<React.PropsWithChildren<ConfirmModalProps>> = ({
  isVisible,
  message,
  title,
  confirmMessage,
  onConfirm,
  onVisibilityChange,
  confirmGhost,
}) => {
  const { formatMessage } = useLocale()
  const defaultConfirmMessage = formatMessage(coreMessages.buttonDestroy)

  return (
    <ModalBase
      baseId="deleteEmailModal"
      className={styles.modal}
      isVisible={isVisible}
      hideOnClickOutside={false}
      onVisibilityChange={onVisibilityChange}
    >
      {({ closeModal }: { closeModal: () => void }) => (
        <Box
          position="relative"
          borderRadius="large"
          background="white"
          padding={6}
        >
          <Stack space={3}>
            {title && <Text variant="h3">{title}</Text>}
            <Text>{message}</Text>
            <Box display="flex" justifyContent="spaceBetween">
              <Button onClick={closeModal} size="small" variant="ghost">
                {formatMessage(coreMessages.buttonCancel)}
              </Button>
              <Button
                onClick={onConfirm}
                size="small"
                colorScheme="destructive"
                variant={confirmGhost ? 'ghost' : undefined}
              >
                {confirmMessage || defaultConfirmMessage}
              </Button>
            </Box>
          </Stack>
        </Box>
      )}
    </ModalBase>
  )
}

export default ConfirmModal
