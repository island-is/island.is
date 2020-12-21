import React from 'react'
import { withDesign } from 'storybook-addon-designs'

import { withFigma } from '../../utils/withFigma'
import { NewBreadcrumbs } from './NewBreadcrumbs'

export default {
  title: 'Navigation/Breadcrumbs',
  component: NewBreadcrumbs,
  decorators: [withDesign],
  parameters: withFigma({
    desktop:
      'https://www.figma.com/file/pDczqgdlWxgn3YugWZfe1v/UI-Library-%E2%80%93-%F0%9F%96%A5%EF%B8%8F-Desktop?node-id=93%3A685',
    mobile:
      'https://www.figma.com/file/rU3mPM1cLfHa3u7TWuutPQ/UI-Library-%E2%80%93-%F0%9F%93%B1Mobile?node-id=30%3A7',
  }),
}

export const Default = () => (
  <NewBreadcrumbs
    items={[
      { title: 'href', href: '/' },
      { title: 'text' },
      { isTag: true, title: 'href tag', href: '/' },
      { isTag: true, title: 'text tag' },
    ]}
  />
)
