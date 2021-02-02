import React from 'react'
import { withDesign } from 'storybook-addon-designs'

import { withFigma } from '../../utils/withFigma'
import { Breadcrumbs } from './Breadcrumbs'

export default {
  title: 'Navigation/Breadcrumbs',
  component: Breadcrumbs,
  decorators: [withDesign],
  parameters: withFigma('Breadcrumbs'),
}

export const Default = () => (
  <Breadcrumbs
    items={[
      { title: 'link', href: '/' },
      { title: 'text' },
      { isTag: true, title: 'link tag', href: '/' },
      { isTag: true, title: 'text tag' },
    ]}
  />
)
