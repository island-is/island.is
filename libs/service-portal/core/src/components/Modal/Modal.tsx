import React, { FC } from 'react'
import * as styles from './Modal.treat'
import { Box, FocusableBox, Icon, ModalBase } from '@island.is/island-ui/core'

interface Props {
  id: string
  onCloseModal?: () => void
}

export const Modal: FC<Props> = ({ id, children, onCloseModal }) => {
  return (
    <>
      <ModalBase baseId={id} initialVisibility={true} className={styles.modal}>
        {({ closeModal }: { closeModal: () => void }) => {
          const handleClose = () => {
            if (onCloseModal) onCloseModal()
            closeModal()
          }

          return (
            <Box background="white" padding={[3, 6, 12]}>
              <FocusableBox
                component="button"
                className={styles.closeButton}
                onClick={handleClose}
                padding={1}
              >
                <Icon
                  type="outline"
                  icon="close"
                  color="blue400"
                  size="medium"
                />
              </FocusableBox>
              {children}
            </Box>
          )
        }}
      </ModalBase>
    </>
  )
}

export default Modal
