import React from 'react'
import { withDesign } from 'storybook-addon-designs'
import { Input } from './Input'
import { Box } from '../Box/Box'
import { ContentBlock } from '../ContentBlock/ContentBlock'

const figmaLink =
  'https://www.figma.com/file/pDczqgdlWxgn3YugWZfe1v/UI-Library-%E2%80%93-%F0%9F%96%A5%EF%B8%8F-Desktop?node-id=42%3A1688'

export default {
  title: 'Form/Input',
  component: Input,
  decorators: [withDesign],
  parameters: {
    docs: {
      description: {
        component: `[View in Figma](${figmaLink})`,
      },
    },
    design: {
      type: 'figma',
      url: figmaLink,
    },
  },
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
