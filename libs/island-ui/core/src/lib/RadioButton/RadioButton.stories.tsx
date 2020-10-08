import React from 'react'
import { RadioButton } from './RadioButton'
import { Box } from '../Box/Box'

export default {
  title: 'Form/RadioButton',
  component: RadioButton,
  parameters: {
    docs: {
      description: {
        component:
          '[View in Figma](https://www.figma.com/file/pDczqgdlWxgn3YugWZfe1v/UI-Library-%E2%80%93-%F0%9F%96%A5%EF%B8%8F-Desktop?node-id=49%3A135)',
      },
    },
  },
}

const Template = (args) => <RadioButton {...args} />

export const Primary = Template.bind({})
Primary.args = { label: 'My label', large: false }

export const Large = Template.bind({})
Large.args = { label: 'Large version', large: true }

export const WithTooltip = Template.bind({})
WithTooltip.args = { label: 'With a tooltip', tooltip: 'This is the tooltip' }

export const Filled = () => (
  <>
    <Box background={'blue100'} padding={3}>
      <RadioButton label="Filled white background" filled large />
    </Box>
  </>
)
