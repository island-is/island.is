import React from 'react'
import { Typography } from '../Typography/Typography'
import { Hidden } from './Hidden'

export default {
  title: 'Layout/Hidden',
  component: Hidden,
}

export const Default = () => (
  <>
    <Typography variant="p">
      Allows you to hide content responsively.
    </Typography>
    <Hidden below="md">
      <Typography variant="p">
        I'm hidden below `md` (hidden on `xs`, `sm`)
      </Typography>
    </Hidden>
    <Hidden above="md">
      <Typography variant="p">
        I'm hidden above `md` (hidden on `lg`, `xl`)
      </Typography>
    </Hidden>
  </>
)
