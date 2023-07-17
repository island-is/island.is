import React, { FC, ReactElement } from 'react'
import cn from 'classnames'
import * as styles from './Timeline.css'
import { Box, Column, Columns, Stack, Text } from '@island.is/island-ui/core'
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays'

interface Props {
  children?: Array<ReactElement>
  title?: string
  maxDate?: Date | null
  minDate?: Date | null
  className?: string
}
export const Timeline: FC<Props> = ({
  children,
  title,
  maxDate,
  minDate,
  className,
}) => {
  if (!children) {
    return null
  }

  const today = new Date()
  console.log(typeof maxDate)
  let currentProgress = 0

  if (maxDate && minDate) {
    const dateDifferenceStart = differenceInCalendarDays(minDate, today)
    const dateDifferenceEnd = differenceInCalendarDays(today, maxDate)

    currentProgress = (dateDifferenceStart + 1) / (dateDifferenceEnd + 1)
    console.log(minDate)
    console.log(today)
    console.log(dateDifferenceEnd)
  }

  console.log(currentProgress)

  return (
    <Stack space={5}>
      {title && (
        <Text variant="eyebrow" color="purple400">
          {title}
        </Text>
      )}
      <Stack space="p1">
        <Box
          className={cn(styles.outer, className)}
          position="relative"
          background="blue100"
          borderRadius="large"
          width="full"
        >
          {currentProgress && currentProgress > 1 && (
            <Box
              position="relative"
              overflow="hidden"
              borderRadius="large"
              height="full"
              width="full"
            >
              <Box
                className={styles.inner}
                background={'blue400'}
                borderRadius="large"
                position="absolute"
                style={{
                  transform: `translateX(${1 - currentProgress * 100}%)`,
                }}
              />
            </Box>
          )}
        </Box>
        <Columns>
          {children?.map((child, index) => (
            <Column key={`step-item-${index}`}>
              <Box textAlign={index === children.length - 1 ? 'right' : 'left'}>
                {child}
              </Box>
            </Column>
          ))}
        </Columns>
      </Stack>
    </Stack>
  )
}

export default Timeline
