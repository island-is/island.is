import React, { FC, ReactElement } from 'react'
import cn from 'classnames'
import * as styles from './Timeline.css'
import { Box, Column, Columns, Stack, Text } from '@island.is/island-ui/core'

interface Props {
  children?: Array<ReactElement>
  step?: number
  title?: string
  className?: string
}
export const Timeline: FC<Props> = ({
  children,
  title,
  step = 0,
  className,
}) => {
  if (!children) {
    return null
  }

  const isFirstOrLastStep = step === children.length || step === 0

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
                transform: `translateX(${
                  1 -
                  ((children.length - step) / children.length -
                    (isFirstOrLastStep ? 0 : 0.05)) *
                    100
                }%)`,
              }}
            />
          </Box>
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
