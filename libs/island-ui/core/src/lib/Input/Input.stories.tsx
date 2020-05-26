import React from 'react'
import { Input } from './Input'
import { Box } from '../Box'
import { ContentBlock } from '../ContentBlock'

export default {
  title: 'Core/Input',
  component: Input,
}

export const Default = () => (
  <ContentBlock>
    <Box padding={['gutter', 2, 3, 4]}>
      <Input
        label="This is the label"
        placeholder="This is the placeholder"
        name="Test"
      />
    </Box>
  </ContentBlock>
)

export const Error = () => (
  <ContentBlock>
    <Box padding={['gutter', 2, 3, 4]}>
      <Input
        label="This is the label"
        placeholder="This is the placeholder"
        name="Test"
        hasError
        errorMessage="This is the error message"
      />
    </Box>
  </ContentBlock>
)
