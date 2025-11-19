import * as React from 'react'
import cn from 'classnames'
import * as styles from './QuestionTypes.css'
import { Box, Text } from '@island.is/island-ui/core'
import times from 'lodash/times'

type SliderProps = {
  id: string
  label: string
  className?: string
  draftTotalSteps: number
  draftFinishedSteps: number
  steps: {
    label: string
    value: string
    selected?: boolean
  }[]
  description: string
}

export const Slider: React.FC<React.PropsWithChildren<SliderProps>> = ({
  draftFinishedSteps,
  draftTotalSteps,
  description,
  steps,
  className,
}) => {
  return (
    <>
      <Box
        className={cn(styles.outerSlider, className)}
        position="relative"
        background={'blue100'}
        borderRadius="large"
        width="half"
        overflow="hidden"
      >
        <Box
          position="relative"
          overflow="hidden"
          borderRadius="standard"
          height="full"
          width="half"
          display="flex"
          columnGap={1}
        >
          {times(draftTotalSteps ?? 1, (i) => {
            return (
              <Box
                key={`slider-${i}-${steps[i]?.value}`}
                background={draftFinishedSteps > i ? 'blue400' : 'blue200'}
                borderRadius="standard"
                width="full"
              />
            )
          })}
        </Box>
      </Box>
      <Box marginTop={1}>
        <Text variant="small" color="blue400">
          {description}
        </Text>
      </Box>
    </>
  )
}
