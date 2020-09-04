import React from 'react'
import { number } from '@storybook/addon-knobs'
import { SkeletonLoader as SL } from './SkeletonLoader'
import { Box } from '../Box/Box'
import { Columns } from '../Columns/Columns'
import { Column } from '../Column/Column'

export default {
  title: 'Components/SkeletonLoader',
  component: SL,
}

export const DefaultSkeletonLoader = () => {
  return (
    <Box padding={5}>
      <Columns space={3}>
        <Column width="content">
          <SL width={100} height={100} />
        </Column>
        <Column>
          <h1>
            <SL />
          </h1>
          <p>
            <SL repeat={number('repeat', 4)} />
          </p>
        </Column>
      </Columns>
    </Box>
  )
}

export const StackedSkeletonLoader = () => (
  <Box padding={5}>
    <SL space={2} repeat={number('repeat', 4)} />
  </Box>
)
