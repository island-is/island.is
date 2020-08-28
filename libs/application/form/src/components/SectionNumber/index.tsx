import React, { FC } from 'react'
import { Box, Icon } from '@island.is/island-ui/core'

import * as styles from './SectionNumber.treat'

interface SectionNumberProps {
  currentState: 'active' | 'previous' | 'next'
  number: number
}

const SectionNumber: FC<SectionNumberProps> = ({ currentState, number }) => (
  <Box position="relative">
    <Box
      position="absolute"
      display="flex"
      alignItems="center"
      textAlign="center"
      background={
        currentState === 'active'
          ? 'blue400'
          : currentState === 'previous'
          ? 'blue400'
          : 'blue300'
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
  </Box>
)

export default SectionNumber
