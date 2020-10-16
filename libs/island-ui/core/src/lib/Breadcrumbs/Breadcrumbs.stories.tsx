import React from 'react'
import { withDesign } from 'storybook-addon-designs'

import { withFigma } from '../../utils/withFigma'
import { Breadcrumbs } from './Breadcrumbs'

export default {
  title: 'Navigation/Breadcrumbs',
  component: Breadcrumbs,
  decorators: [withDesign],
  parameters: withFigma({
    desktop:
      'https://www.figma.com/file/pDczqgdlWxgn3YugWZfe1v/UI-Library-%E2%80%93-%F0%9F%96%A5%EF%B8%8F-Desktop?node-id=93%3A685',
    mobile:
      'https://www.figma.com/file/rU3mPM1cLfHa3u7TWuutPQ/UI-Library-%E2%80%93-%F0%9F%93%B1Mobile?node-id=30%3A7',
  }),
}

export const Default = () => (
  <Breadcrumbs>
    <span>Ísland.is</span>
    <a href="/">Dómstólar og réttarfar</a>
    <a href="/">Lögregluembætti</a>
  </Breadcrumbs>
)
