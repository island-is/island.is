import React from 'react'
import { Breadcrumbs } from './Breadcrumbs'
import { Box } from '../Box'

export default {
  title: 'Navigation/Breadcrumbs',
  component: Breadcrumbs,
  parameters: {
    docs: {
      description: {
        component:
          '[View in Figma](https://www.figma.com/file/pDczqgdlWxgn3YugWZfe1v/UI-Library-%E2%80%93-%F0%9F%96%A5%EF%B8%8F-Desktop?node-id=93%3A685)',
      },
    },
  },
}

export const Default = () => (
  <Breadcrumbs>
    <span>Ísland.is</span>
    <a href="/">Dómstólar og réttarfar</a>
    <a href="/">Lögregluembætti</a>
  </Breadcrumbs>
)
