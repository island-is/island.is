import React, { ReactNode } from 'react'
import { ModalBase, Box } from '@island.is/island-ui/core'

import * as styles from './StateModal.css'

interface Props {
  isVisible: boolean
  onVisibilityChange: React.Dispatch<React.SetStateAction<boolean>>
  closeModal: () => void
  children: ReactNode
}

const StateModalContainer = ({
  isVisible,
  onVisibilityChange,
  closeModal,
  children,
}: Props) => {
  return (
    <ModalBase
      baseId="changeStatus"
      modalLabel="Change status modal"
      isVisible={isVisible}
      onVisibilityChange={(visibility) => {
        onVisibilityChange(visibility)
      }}
      className={styles.modalBase}
    >
      <Box className={styles.closeModalBackground} onClick={closeModal}></Box>
      <Box className={styles.modalContainer}>
        <Box
          position="relative"
          borderRadius="large"
          overflow="hidden"
          background="white"
          className={styles.modal}
        >
          {children}
        </Box>
      </Box>
    </ModalBase>
  )
}

export default StateModalContainer
