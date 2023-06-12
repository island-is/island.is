import { FC } from 'react'
import { Box, Button, ModalBase, Stack, Text } from '@island.is/island-ui/core'
import * as styles from './ConfirmModal.css'

interface ConfirmModalProps {
  isVisible: boolean
  onConfirm: () => void
  onVisibilityChange: (visibility: boolean) => void
  message: string
}

const ConfirmModal: FC<React.PropsWithChildren<ConfirmModalProps>> = ({
  isVisible,
  message,
  onConfirm,
  onVisibilityChange,
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
            <Text>{message}</Text>
            <Box display="flex" justifyContent="spaceBetween">
              <Button onClick={closeModal} size="small" variant="ghost">
                Hætta við
              </Button>
              <Button
                onClick={onConfirm}
                size="small"
                colorScheme="destructive"
              >
                Eyða
              </Button>
            </Box>
          </Stack>
        </Box>
      )}
    </ModalBase>
  )
}

export default ConfirmModal
