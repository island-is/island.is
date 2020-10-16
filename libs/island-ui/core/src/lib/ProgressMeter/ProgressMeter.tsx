import * as React from 'react'
import { Box } from '../Box/Box'
import * as styles from './ProgressMeter.treat'

type ProgressMeterProps = {
  /**
   * Number from 0 to 1
   */
  progress: number
  colorScheme?: 'blue' | 'red' | 'rose'
}

const colorSchemes = {
  blue: {
    outer: 'blue100',
    inner: 'blue400',
  },
  red: {
    outer: 'red100',
    inner: 'red400',
  },
  rose: {
    outer: 'roseTinted100',
    inner: 'roseTinted400',
  },
} as const

export const ProgressMeter: React.FC<ProgressMeterProps> = ({
  progress,
  colorScheme = 'blue',
}) => {
  return (
    <Box
      className={styles.outer}
      position="relative"
      background={colorSchemes[colorScheme].outer}
      borderRadius="large"
      width="full"
    >
      <Box
        position="relative"
        overflow="hidden"
        borderRadius="large"
        height="full"
        width="full"
      >
        <Box
          className={styles.inner}
          background={colorSchemes[colorScheme].inner}
          borderRadius="large"
          position="absolute"
          style={{ transform: `translateX(${(progress - 1) * 100}%)` }}
        />
      </Box>
    </Box>
  )
}
