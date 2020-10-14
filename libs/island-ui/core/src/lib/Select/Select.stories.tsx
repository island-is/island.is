import React from 'react'
import { withDesign } from 'storybook-addon-designs'
import { Select } from './Select'
import { Box } from '../Box/Box'
import { ContentBlock } from '../ContentBlock/ContentBlock'

const figmaLink =
  'https://www.figma.com/file/pDczqgdlWxgn3YugWZfe1v/UI-Library-%E2%80%93-%F0%9F%96%A5%EF%B8%8F-Desktop?node-id=50%3A101'

export default {
  title: 'Form/Select',
  component: Select,
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
      <div style={{ minHeight: 300 }}>
        <Select
          name="select1"
          label="Tegund fyrirtækis"
          placeholder="Veldu tegund"
          options={[
            {
              label: 'Valmöguleiki 1',
              value: '0',
            },
            {
              label: 'Valmöguleiki 2',
              value: '1',
            },
            {
              label: 'Valmöguleiki 3',
              value: '2',
            },
          ]}
          noOptionsMessage="Enginn valmöguleiki"
        />
      </div>
    </Box>
  </ContentBlock>
)
