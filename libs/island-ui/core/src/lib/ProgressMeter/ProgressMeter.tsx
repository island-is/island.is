import * as React from 'react'
import cn from 'classnames'
import { Box } from '../Box/Box'
import { Text } from '../Text/Text'
import * as styles from './ProgressMeter.css'

export type ProgressMeterVariant = 'blue' | 'red' | 'rose' | 'mint'

type ProgressMeterProps = {
  /**
   * Number from 0 to 1
   */
  progress: number
  variant?: ProgressMeterVariant
  className?: string
  withLabel?: boolean
  labelMin?: number
  labelMax?: number
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
  mint: {
    outer: 'mint100',
    inner: 'mint600',
  },
} as const

export const ProgressMeter: React.FC<
  React.PropsWithChildren<ProgressMeterProps>
> = ({
  progress,
  variant = 'blue',
  className,
  withLabel,
  labelMin,
  labelMax,
}) => {
  return (
    <Box
      display={withLabel ? 'flex' : 'block'}
      justifyContent={withLabel ? 'spaceBetween' : 'flexStart'}
    >
      <Box
        className={cn(styles.outer, className)}
        position="relative"
        background={colorSchemes[variant].outer}
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
            background={colorSchemes[variant].inner}
            borderRadius="large"
            position="absolute"
            style={{ transform: `translateX(${(progress - 1) * 100}%)` }}
          />
        </Box>
      </Box>
      {withLabel && (
        <Box marginLeft={3}>
          <Text fontWeight="semiBold" color="blue400" variant="small">
            {labelMin + '/' + labelMax}
          </Text>
        </Box>
      )}
    </Box>
  )
}
