import * as React from 'react'
import cn from 'classnames'
import { Box } from '../Box/Box'
import * as styles from './DraftProgressMeter.css'
import { times } from 'lodash'
import { Text } from '../Text/Text'

export type DraftProgressMeterVariant = 'blue' | 'red' | 'rose' | 'mint'

type DraftProgressMeterProps = {
  variant?: DraftProgressMeterVariant
  className?: string
  draftTotalSteps: number
  draftFinishedSteps: number
}

const colorSchemes = {
  blue: {
    unfinished: 'blue200',
    outer: 'blue100',
    inner: 'blue400',
  },
  red: {
    unfinished: 'red200',
    outer: 'red100',
    inner: 'red400',
  },
  rose: {
    unfinished: 'roseTinted200',
    outer: 'roseTinted100',
    inner: 'roseTinted400',
  },
  mint: {
    unfinished: 'mint200',
    outer: 'mint100',
    inner: 'mint600',
  },
} as const

export const DraftProgressMeter: React.FC<
  React.PropsWithChildren<DraftProgressMeterProps>
> = ({ draftFinishedSteps, draftTotalSteps, variant = 'blue', className }) => {
  return (
    <>
      <Box
        className={cn(styles.outer, className)}
        position="relative"
        background={colorSchemes[variant].outer}
        borderRadius="large"
        width="full"
        overflow="hidden"
      >
        <Box
          position="relative"
          overflow="hidden"
          borderRadius="standard"
          height="full"
          width="full"
          display="flex"
          columnGap={1}
        >
          {times(draftTotalSteps ?? 1, (i) => {
            return (
              <Box
                key={`draft-progress-meter-${i}`}
                background={
                  draftFinishedSteps > i
                    ? colorSchemes[variant].inner
                    : colorSchemes[variant].unfinished
                }
                borderRadius="standard"
                width="full"
              />
            )
          })}
        </Box>
      </Box>
      <Box marginTop={1}>
        <Text variant="small" color="blue400">
          Þú hefur klárað {draftFinishedSteps} af {draftTotalSteps} skrefum
        </Text>
      </Box>
    </>
  )
}
