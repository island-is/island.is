import React, { FC } from 'react'
import * as styles from './Modal.treat'
import { Box, Button, Icon, ModalBase } from '@island.is/island-ui/core'

interface Props {
  isOpen: boolean
  onCloseModal: () => void
}

export const Modal: FC<Props> = ({ isOpen, children, onCloseModal }) => {
  if (!isOpen) return null
  return (
    <>
      <ModalBase
        baseId="myDialog"
        initialVisibility={true}
        className={styles.modal}
      >
        {({ closeModal }: { closeModal: () => void }) => (
          <Box background="white" padding={[3, 6, 12]}>
            <button className={styles.closeButton} onClick={closeModal}>
              <Icon type="outline" icon="close" color="blue400" size="medium" />
            </button>
            {children}
          </Box>
        )}
      </ModalBase>
    </>
  )
}

export default Modal
