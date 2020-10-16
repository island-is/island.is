import React from 'react'
import { withDesign } from 'storybook-addon-designs'

import { Checkbox } from './Checkbox'

const figmaLink =
  'https://www.figma.com/file/pDczqgdlWxgn3YugWZfe1v/UI-Library-%E2%80%93-%F0%9F%96%A5%EF%B8%8F-Desktop?node-id=49%3A186'

export default {
  title: 'Form/Checkbox',
  component: Checkbox,
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

const Template = (args) => <Checkbox {...args} />

export const Primary = Template.bind({})
Primary.args = { label: 'My label', large: false }

export const Large = Template.bind({})
Large.args = { label: 'Large version', large: true }

export const WithTooltip = Template.bind({})
WithTooltip.args = { label: 'With a tooltip', tooltip: 'This is the tooltip' }
