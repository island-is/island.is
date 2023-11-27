import React, { FC, ReactElement } from 'react'
import * as styles from './Modal.css'
import { Box, ModalBase, Button } from '@island.is/island-ui/core'

interface Props {
  id: string
  onCloseModal?: () => void
  toggleClose?: boolean
  isVisible?: boolean
  initialVisibility?: boolean
  disclosure?: ReactElement
  label?: string
}

export const Modal: FC<React.PropsWithChildren<Props>> = ({
  id,
  children,
  toggleClose,
  onCloseModal,
  disclosure,
  isVisible,
  label,
  initialVisibility = true,
}) => {
  const handleOnVisibilityChange = (isVisible: boolean) => {
    !isVisible && onCloseModal && onCloseModal()
  }
  return (
    <ModalBase
      baseId={id}
      initialVisibility={initialVisibility}
      className={styles.modal}
      toggleClose={toggleClose}
      onVisibilityChange={handleOnVisibilityChange}
      disclosure={disclosure}
      modalLabel={label}
      isVisible={isVisible}
    >
      {({ closeModal }: { closeModal: () => void }) => (
        <Box background="white" paddingY={[3, 6, 12]} paddingX={[3, 6, 12, 15]}>
          <Box className={styles.closeButton}>
            <Button
              circle
              colorScheme="negative"
              icon="close"
              onClick={() => {
                closeModal()
              }}
              size="large"
            />
          </Box>
          {children}
        </Box>
      )}
    </ModalBase>
  )
}

export default Modal
