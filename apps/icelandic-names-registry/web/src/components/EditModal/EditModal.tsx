import React, { FC, useState } from 'react'

import { Box, Button, Text, ModalBase } from '@island.is/island-ui/core'

import * as styles from './EditModal.treat'

interface EditModalProps {}

const EditModal: FC<EditModalProps> = () => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        onClick={() => {
          setIsVisible(true)
        }}
      >
        Open modal using state
      </Button>
      <ModalBase
        baseId="myDialog"
        isVisible={isVisible}
        onVisibilityChange={(visibility) => {
          if (visibility !== isVisible) {
            setIsVisible(visibility)
          }
        }}
      >
        {({ closeModal }: { closeModal: () => void }) => (
          <Box padding={4}>
            <Text>We use onVisibilityChange to keep isVisible in sync</Text>
            <Button onClick={closeModal} variant="text">
              Close modal
            </Button>
          </Box>
        )}
      </ModalBase>
    </>
  )
}

export default EditModal
