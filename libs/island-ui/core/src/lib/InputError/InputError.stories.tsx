import React from 'react'
import { InputError } from './InputError'
import { Box } from '../Box'
import { ContentBlock } from '../ContentBlock'

export default {
  title: 'Core/InputError',
  component: InputError,
}

export const Default = () => {
  return (
    <ContentBlock>
      <Box padding={[1, 2, 3]}>
        <InputError id="id" errorMessage="error message" />
      </Box>
    </ContentBlock>
  )
}
