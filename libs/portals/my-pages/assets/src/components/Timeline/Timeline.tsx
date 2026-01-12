import { FC, ReactElement } from 'react'
import cn from 'classnames'
import * as styles from './Timeline.css'
import {
  Box,
  Column,
  Columns,
  Stack,
  Text,
  Tooltip,
  UseBoxStylesProps,
} from '@island.is/island-ui/core'
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays'
import { ProgressBar, useIsMobile } from '@island.is/portals/my-pages/core'

interface Props {
  children?: Array<ReactElement>
  title?: string
  maxDate?: Date | null
  minDate?: Date | null
  className?: string
  tooltipText?: string
  box?: Omit<UseBoxStylesProps, 'component'>
}
export const Timeline: FC<Props> = ({
  children,
  title,
  maxDate,
  minDate,
  className,
  tooltipText,
  box,
}) => {
  const { isMobile } = useIsMobile()

  if (!children) {
    return null
  }

  const today = new Date()
  let currentProgress = 0

  if (maxDate && minDate) {
    const dateDifferenceEnd = differenceInCalendarDays(
      maxDate instanceof Date ? maxDate : new Date(maxDate),
      today,
    )
    const dateDifference = differenceInCalendarDays(
      maxDate instanceof Date ? maxDate : new Date(maxDate),
      minDate instanceof Date ? minDate : new Date(minDate),
    )
    currentProgress = (dateDifference - dateDifferenceEnd) / dateDifference
  }

  return (
    <Box {...box}>
      {title && (
        <Text marginBottom={2} variant="eyebrow" color="purple400">
          {title}
        </Text>
      )}
      {isMobile && currentProgress && (
        <Box display="flex">
          <ProgressBar
            id="timeline-progress"
            progress={currentProgress}
            vertical
          />
          <Box marginLeft="gutter">
            <Stack space={5}>
              {children?.map((child, index) => (
                <Box key={`step-item-${index}`}>{child}</Box>
              ))}
            </Stack>
          </Box>
        </Box>
      )}
      {!isMobile && (
        <Stack space="p1">
          <Box
            className={cn(styles.outer, className)}
            position="relative"
            background="blue100"
            borderRadius="large"
            width="full"
          >
            {currentProgress && (
              <>
                <ProgressBar
                  id="timeline-progress-current"
                  progress={currentProgress}
                />
                {tooltipText && (
                  <Tooltip text={tooltipText} placement="top">
                    <Box
                      position="absolute"
                      className={styles.tooltip}
                      style={{
                        left: `${currentProgress * 100}%`,
                      }}
                    />
                  </Tooltip>
                )}
              </>
            )}
          </Box>
          <Columns>
            {children?.map((child, index) => (
              <Column key={`step-item-${index}`}>
                <Box
                  textAlign={index === children.length - 1 ? 'right' : 'left'}
                >
                  {child}
                </Box>
              </Column>
            ))}
          </Columns>
        </Stack>
      )}
    </Box>
  )
}

export default Timeline
