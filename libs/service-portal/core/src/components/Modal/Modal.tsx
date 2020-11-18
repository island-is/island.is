import React, { FC } from 'react'
import * as styles from './Modal.treat'
import { Box, Button, Icon, ModalBase } from '@island.is/island-ui/core'

interface Props {
  id: string
  onCloseModal: () => void
}

export const Modal: FC<Props> = ({ id, children, onCloseModal }) => {
  return (
    <>
      <ModalBase baseId={id} initialVisibility={true} className={styles.modal}>
        {({ closeModal }: { closeModal: () => void }) => (
          <Box background="white" padding={[3, 6, 12]}>
            <button
              className={styles.closeButton}
              onClick={() => {
                onCloseModal()
                closeModal()
              }}
            >
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
