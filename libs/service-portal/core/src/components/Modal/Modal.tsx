import React, { FC } from 'react'
import * as styles from './Modal.treat'
import { Box, Icon, ModalBase, Button } from '@island.is/island-ui/core'

interface Props {
  id: string
  onCloseModal: () => void
  toggleClose?: boolean
}

export const Modal: FC<Props> = ({
  id,
  children,
  onCloseModal,
  toggleClose,
}) => {
  return (
    <>
      <ModalBase
        baseId={id}
        initialVisibility={true}
        className={styles.modal}
        toggleClose={toggleClose}
      >
        {({ closeModal }: { closeModal: () => void }) => (
          <Box background="white" padding={[3, 6, 12]}>
            <Box className={styles.closeButton}>
              <Button
                circle
                colorScheme="negative"
                icon="close"
                onClick={() => {
                  onCloseModal()
                  closeModal()
                }}
                size="large"
              />
            </Box>
            {children}
          </Box>
        )}
      </ModalBase>
    </>
  )
}

export default Modal
