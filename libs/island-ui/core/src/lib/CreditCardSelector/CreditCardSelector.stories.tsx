import React from 'react'

import { CreditCardSelector } from './CreditCardSelector'

export default {
  title: 'Form/CreditCardSelector',
  component: CreditCardSelector,
}

const Template = (args) => <CreditCardSelector {...args} />

export const Default = Template.bind({})
// Default.args = {
//   title: 'Innskráning',
//   icon: 'person',
//   items: [
//     {
//       title: 'Einstaklingur',
//       href: '#',
//     },
//     {
//       title: 'Fyrirtæki',
//       onClick: (menu) => {
//         menu.hide()
//         console.log('click')
//       },
//     },
//   ],
// }
