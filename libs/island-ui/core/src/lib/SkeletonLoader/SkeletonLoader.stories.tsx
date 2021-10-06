import React from 'react'

import { Box } from '../Box/Box'
import { Columns } from '../Columns/Columns'
import { Column } from '../Column/Column'
import { SkeletonLoader as SL } from './SkeletonLoader'

export default {
  title: 'Components/SkeletonLoader',
  component: SL,
}

export const DefaultSkeletonLoader = (args) => (
  <Box padding={5}>
    <Columns space={3}>
      <Column width="content">
        <SL width={100} height={100} display="block" />
      </Column>
      <Column>
        <h1>
          <SL />
        </h1>
        <p>
          <SL repeat={args.repeat} />
        </p>
      </Column>
    </Columns>
  </Box>
)

DefaultSkeletonLoader.args = {
  repeat: 4,
}

export const StackedSkeletonLoader = (args) => (
  <Box padding={5}>
    <SL space={2} repeat={args.repeat} />
  </Box>
)

StackedSkeletonLoader.args = {
  repeat: 4,
}
