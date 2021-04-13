import React, { FC, useState } from 'react'

import { Box, Button, ModalBase } from '@island.is/island-ui/core'

import * as styles from './EditModal.treat'
import EditForm from '../EditForm/EditForm'

interface EditModalProps {}

const EditModal: FC<EditModalProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        icon="add"
        size="small"
        onClick={() => {
          setIsVisible(true)
        }}
      >
        Bæta við nafni
      </Button>
      <ModalBase
        baseId="myDialog"
        className={styles.modal}
        isVisible={isVisible}
        hideOnClickOutside={false}
        onVisibilityChange={(visibility) => {
          if (visibility !== isVisible) {
            setIsVisible(visibility)
          }
        }}
      >
        {({ closeModal }: { closeModal: () => void }) => (
          <Box position="relative" borderRadius="large" background="white">
            <EditForm closeModal={closeModal} />
          </Box>
        )}
      </ModalBase>
    </>
  )
}

export default EditModal
