import React from 'react'
import { withDesign } from 'storybook-addon-designs'

import { withFigma } from '../../utils/withFigma'
import { Footer } from './Footer'

export default {
  title: 'Navigation/Footer',
  component: Footer,
  decorators: [withDesign],
  parameters: withFigma('Footer'),
}

export const Default = () => <Footer showMiddleLinks showTagLinks />
