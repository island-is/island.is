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
import { ProgressBar, useIsMobile } from '@island.is/portals/my-pages/core'

interface Props {
  children?: Array<ReactElement>
  title?: string
  progress?: number,
  className?: string
  tooltipText?: string
  box?: Omit<UseBoxStylesProps, 'component'>
}
export const Timeline: FC<Props> = ({
  children,
  title,
  progress,
  className,
  tooltipText,
  box,
}) => {
  const { isMobile } = useIsMobile()

  if (!children) {
    return null
  }

  const milestoneCount = children.length - 1

  const milestoneHalfStep = (1 / milestoneCount) / 2
  const milestoneQuarterStep = milestoneHalfStep / 2

  //get current progress as ratio of total milestones
  let currentProgress = (Math.min(Math.max(progress || 0, 0), milestoneCount)) / milestoneCount

  if (currentProgress > 0 && currentProgress > milestoneHalfStep && currentProgress < 1) {
    //more than half
    currentProgress += milestoneQuarterStep
  }


  return (
    <Box {...box}>
      {title && (
        <Text marginBottom={2} variant="eyebrow" color="purple400">
          {title}
        </Text>
      )}
      {isMobile && (
        <Box display="flex">
          <ProgressBar progress={currentProgress} vertical />
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
            <ProgressBar progress={currentProgress} />
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
          </Box>
          <Columns>
            {children?.map((child, index) => {
              const middleIndex = milestoneCount / 2
              return <Column key={`step-item-${index}`}>
                <Box textAlign={index < middleIndex ? 'left' : index === middleIndex ? 'center' : 'right'}>
                  {child}
                </Box>
              </Column>
            })}
          </Columns>
        </Stack>
      )}
    </Box>
  )
}

export default Timeline
