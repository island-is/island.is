import React from 'react'

import { Button } from '../Button/Button'
import { withFigma } from '../../utils/withFigma'
import { Drawer } from './Drawer'

export default {
  title: 'Components/Drawer',
  component: Drawer,
  parameters: withFigma('Drawer'),
}

export const Default = () => {
  return (
    <Drawer
      baseId="demo_drawer"
      ariaLabel="Use aria-label to explain what this is doing"
      disclosure={<Button variant="primary">Open drawer</Button>}
      content={<div>Hello world</div>}
    />
  )
}
