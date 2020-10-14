import React from 'react'
import { withDesign } from 'storybook-addon-designs'
import { AsyncSelect } from './AsyncSelect'
import { Box } from '../Box/Box'
import { ContentBlock } from '../ContentBlock/ContentBlock'

const figmaLink =
  'https://www.figma.com/file/pDczqgdlWxgn3YugWZfe1v/UI-Library-%E2%80%93-%F0%9F%96%A5%EF%B8%8F-Desktop?node-id=50%3A101'

export default {
  title: 'Form/AsyncSelect',
  component: AsyncSelect,
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
      <AsyncSelect
        name="async_select_1"
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
          {
            label: 'Valmöguleiki 4',
            value: '3',
          },
        ]}
        noOptionsMessage="Enginn valmöguleiki"
        loadOptions={() => undefined}
      />
    </Box>
  </ContentBlock>
)
