import React from 'react'
import { withDesign } from 'storybook-addon-designs'
import { withFigma } from '../../utils/withFigma'

import { DropdownMenu } from './DropdownMenu'

export default {
  title: 'Navigation/DropdownMenu',
  component: DropdownMenu,
  decorators: [withDesign],
  parameters: withFigma({
    desktop:
      'https://www.figma.com/file/cl7qnkUWOFwgMQKt2FsiZn/H%C3%B6nnun?node-id=6170%3A685',
    mobile:
      'https://www.figma.com/file/cl7qnkUWOFwgMQKt2FsiZn/H%C3%B6nnun?node-id=6271%3A1298',
  }),
}

const Template = (args) => <DropdownMenu {...args} />

export const Default = Template.bind({})
Default.args = {
  title: 'Innskráning',
  icon: 'person',
  items: [
    {
      title: 'Einstaklingur',
      href: '#',
    },
    {
      title: 'Fyrirtæki',
      onClick: () => {
        console.log('click')
      },
    },
  ],
}
