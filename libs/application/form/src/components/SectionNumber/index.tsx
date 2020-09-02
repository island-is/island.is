import React, { FC } from 'react'
import { Box, Icon } from '@island.is/island-ui/core'

import SectionNumberColumn from '../SectionNumberColumn'

import * as styles from './SectionNumber.treat'

interface SectionNumberProps {
  currentState: 'active' | 'previous' | 'next'
  number: number
  lineHeight?: number
}

const SectionNumber: FC<SectionNumberProps> = ({
  currentState,
  number,
  lineHeight,
}) => (
  <SectionNumberColumn>
    <Box
      position="absolute"
      background={currentState === 'previous' ? 'purple400' : 'purple200'}
      className={styles.progressLine}
      style={{ height: `${lineHeight}px` }}
    />
    {(currentState === 'next' && (
      <Icon type="bullet" color="purple200" width="16" height="16" />
    )) || (
      <Box
        position="absolute"
        display="flex"
        alignItems="center"
        textAlign="center"
        background={
          currentState === 'active'
            ? 'purple400'
            : currentState === 'previous'
            ? 'purple400'
            : 'purple200'
        }
        justifyContent="center"
        pointerEvents="none"
        className={styles.number}
      >
        {(currentState === 'previous' && (
          <Icon type="check" color="white" width="16" height="16" />
        )) ||
          number}
      </Box>
    )}
  </SectionNumberColumn>
)

export default SectionNumber
