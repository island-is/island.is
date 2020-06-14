import React from 'react'
import { number } from '@storybook/addon-knobs'
import { SkeletonLoader as SL } from './SkeletonLoader'
import { Box } from '../Box/Box'

export default {
  title: 'Components/SkeletonLoader',
  component: SL,
}

export const DefaultSkeletonLoader = () => {
  return (
    <Box padding={2}>
      <h1>
        <SL />
      </h1>
      <p>
        <SL repeat={number('repeat', 4)} />
      </p>
    </Box>
  )
}
