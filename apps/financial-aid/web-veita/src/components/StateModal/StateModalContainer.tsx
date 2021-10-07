import React, { ReactNode } from 'react'
import { ModalBase, Box } from '@island.is/island-ui/core'

import * as styles from './StateModal.treat'

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
      isVisible={isVisible}
      onVisibilityChange={(visibility) => {
        if (visibility !== isVisible) {
          onVisibilityChange(visibility)
        }
      }}
      className={styles.modalBase}
    >
      <Box onClick={closeModal} className={styles.modalContainer}>
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
