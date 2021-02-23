import React, { useState } from 'react'
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
export const CustomModalUsingState = () => {
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
        {({ closeModal }) => (
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
