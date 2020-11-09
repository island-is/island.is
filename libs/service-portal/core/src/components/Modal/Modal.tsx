import React, { FC } from 'react'
import * as styles from './Modal.treat'
import { Box, Icon } from '@island.is/island-ui/core'

interface Props {
  isOpen: boolean
  onCloseModal: () => void
}

export const Modal: FC<Props> = ({ isOpen, children, onCloseModal }) => {
  if (!isOpen) return null
  return (
    <>
      <Box
        position="fixed"
        top={0}
        right={0}
        bottom={0}
        left={0}
        className={styles.overlay}
        onClick={onCloseModal}
      />
      <Box
        className={styles.modal}
        position="relative"
        background="white"
        padding={[3, 6, 12]}
        borderRadius="large"
      >
        <button className={styles.closeButton} onClick={onCloseModal}>
          <Icon type="outline" icon="close" color="blue400" size="medium" />
        </button>
        {children}
      </Box>
    </>
  )
}

export default Modal
