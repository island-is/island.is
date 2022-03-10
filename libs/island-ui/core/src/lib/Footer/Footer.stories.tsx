import React from 'react'

import { withFigma } from '../../utils/withFigma'
import { Footer } from './Footer'

export default {
  title: 'Navigation/Footer',
  component: Footer,
  parameters: withFigma('Footer'),
}

export const Default = () => <Footer showMiddleLinks showTagLinks />
