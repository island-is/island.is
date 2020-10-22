import React from 'react'
import { Box } from '../Box/Box'
import { Button } from '../Button/Button'
import { Text } from '../Text/Text'

import { ModalBase } from './ModalBase'

export default {
  title: 'Components/ModalBase',
  component: ModalBase,
}

export const CustomModalExample = () => {
  return (
    <ModalBase
      baseId="myDialog"
      disclosure={<Button>Open my custom modal</Button>}
    >
      {({ closeModal }) => (
        <Box background="white" padding={4}>
          <Text>Here's my content</Text>
          <Button onClick={closeModal} variant="text">
            Close modal
          </Button>
        </Box>
      )}
    </ModalBase>
  )
}
