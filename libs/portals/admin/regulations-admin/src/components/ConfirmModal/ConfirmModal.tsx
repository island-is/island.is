import { FC } from 'react'
import { Box, Button, ModalBase, Stack, Text } from '@island.is/island-ui/core'
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
  confirmMessage = 'Eyða',
  onConfirm,
  onVisibilityChange,
  confirmGhost,
}) => {
  return (
    <ModalBase
      baseId="deleteImpactModal"
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
            <Text variant="h3">{title}</Text>
            <Text>{message}</Text>
            <Box display="flex" justifyContent="spaceBetween">
              <Button onClick={closeModal} size="small" variant="ghost">
                Hætta við
              </Button>
              <Button
                onClick={onConfirm}
                size="small"
                colorScheme="destructive"
                variant={confirmGhost ? 'ghost' : undefined}
              >
                {confirmMessage}
              </Button>
            </Box>
          </Stack>
        </Box>
      )}
    </ModalBase>
  )
}

export default ConfirmModal
