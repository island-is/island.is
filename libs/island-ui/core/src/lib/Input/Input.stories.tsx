import React from 'react'
import { Input } from './Input'
import { Box } from '../Box'
import { ContentBlock } from '../ContentBlock'

export default {
  title: 'Components/Input',
  component: Input,
}

export const Default = () => (
  <ContentBlock>
    <Box padding={['gutter', 2, 3, 4]}>
      <Input
        label="This is the label"
        placeholder="This is the placeholder"
        name="Test1"
      />
    </Box>
  </ContentBlock>
)

export const Tooltip = () => (
  <ContentBlock>
    <Box padding={['gutter', 2, 3, 4]}>
      <Input
        label="This is the label"
        placeholder="This is the placeholder"
        name="Test2"
        tooltip="Bacon ipsum dolor amet ball tip leberkas pork belly pork chop, meatloaf swine jerky doner andouille tenderloin"
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
        name="Test3"
        hasError
        errorMessage="This is the error message"
      />
    </Box>
  </ContentBlock>
)

export const Required = () => (
  <ContentBlock>
    <Box padding={['gutter', 2, 3, 4]}>
      <Input
        label="This is the label"
        placeholder="This is the placeholder"
        name="Test4"
        required
      />
    </Box>
  </ContentBlock>
)

export const Textarea = () => (
  <ContentBlock>
    <Box padding={['gutter', 2, 3, 4]}>
      <Input
        label="Textarea label"
        placeholder="This is the placeholder"
        name="Test5"
        textarea
        rows={4}
      />
    </Box>
  </ContentBlock>
)

export const Textarea10Rows = () => (
  <ContentBlock>
    <Box padding={['gutter', 2, 3, 4]}>
      <Input
        label="Textarea label"
        placeholder="This is the placeholder"
        name="Test6"
        textarea
        rows={10}
      />
    </Box>
  </ContentBlock>
)

export const TextareaError = () => (
  <ContentBlock>
    <Box padding={['gutter', 2, 3, 4]}>
      <Input
        label="Textarea label"
        placeholder="This is the placeholder"
        name="Test7"
        hasError
        errorMessage="This is the error message"
        textarea
        rows={4}
      />
    </Box>
  </ContentBlock>
)

export const TextareaRequired = () => (
  <ContentBlock>
    <Box padding={['gutter', 2, 3, 4]}>
      <Input
        label="Textarea label"
        placeholder="This is the placeholder"
        name="Test8"
        required
        textarea
        rows={4}
      />
    </Box>
  </ContentBlock>
)
