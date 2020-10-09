import React from 'react'
import { Footer } from './Footer'

export default {
  title: 'Navigation/Footer',
  component: Footer,
  parameters: {
    docs: {
      description: {
        component:
          '[View in Figma](https://www.figma.com/file/pDczqgdlWxgn3YugWZfe1v/UI-Library-%E2%80%93-%F0%9F%96%A5%EF%B8%8F-Desktop?node-id=345%3A0)',
      },
    },
  },
}

export const Default = () => <Footer showMiddleLinks showTagLinks />
