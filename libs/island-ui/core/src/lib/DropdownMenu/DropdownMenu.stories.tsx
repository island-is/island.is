import React from 'react'

import { DropdownMenu } from './DropdownMenu'

export default {
  title: 'Navigation/DropdownMenu',
  component: DropdownMenu,
}

const Template = (args) => <DropdownMenu {...args} />

export const Default = Template.bind({})
Default.args = {
  title: 'Innskráning',
  icon: 'person',
  openOnHover: true,
  items: [
    {
      title: 'Einstaklingur',
      href: '#',
    },
    {
      title: 'Fyrirtæki',
      onClick: (menu) => {
        menu.hide()
        console.log('click')
      },
    },
  ],
}
