import React, { FC, useState } from 'react'

import { Box, Button, ModalBase } from '@island.is/island-ui/core'

import * as styles from './EditModal.treat'
import EditForm from '../EditForm/EditForm'

interface EditModalProps {
  isVisible: boolean
  setIsVisible: (visibility: boolean) => void
}

const EditModal: FC<EditModalProps> = ({ isVisible, setIsVisible }) => {
  return (
    <ModalBase
      baseId="myDialog"
      className={styles.modal}
      isVisible={isVisible}
      hideOnClickOutside={false}
      onVisibilityChange={(visibility) => setIsVisible(visibility)}
    >
      {({ closeModal }: { closeModal: () => void }) => (
        <Box position="relative" borderRadius="large" background="white">
          <EditForm closeModal={closeModal} />
        </Box>
      )}
    </ModalBase>
  )
}

export default EditModal
