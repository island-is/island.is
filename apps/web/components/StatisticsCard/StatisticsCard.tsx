import React from 'react'
import { useMeasure } from 'react-use'
import cn from 'classnames'
import { Box, Stack, Text, Hyphen } from '@island.is/island-ui/core'
import { BackgroundImage } from '@island.is/web/components'

import * as styles from './StatisticsCard.treat'

export type StatisticsCardsTagsProps = {
  href?: string
  title: string
  subTitle?: string
}

export interface StatisticsCardsProps {
  title: string
  subTitle?: string
  image?: { title: string; url: string }
  description: string
}

export const StatisticsCard = ({
  title,
  image,
  description,
}: StatisticsCardsProps) => {
  const [ref, { width }] = useMeasure()

  const shouldStack = width < 360
  const hasImage = image?.title.length > 0

  const items = (
    <Box
      display="flex"
      flexGrow={1}
      flexDirection={shouldStack ? 'columnReverse' : 'row'}
      alignItems="stretch"
    
    >
      <Box style={{ width: shouldStack ? '100%' : hasImage ? '60%' : '100%' }} paddingTop={8} paddingLeft={4}>
        <Stack space={1}>
          <Box display="flex" alignItems="center">
            <Box display="inlineFlex" flexGrow={1}>
              <Text variant="eyebrow">
                <Hyphen>{title}</Hyphen>
              </Text>
            </Box>
          </Box>
          {description && (
            <Text variant="h1" color="blue400">
              {description}
            </Text>
          )}
        </Stack>
      </Box>
      {hasImage && !shouldStack && (
        <Box
          position="relative"
          style={{
            width: shouldStack ? '100%' : '204px',
            height: shouldStack ? '100%' : '204px',
          }}
        >
          <BackgroundImage
            width={300}
            positionX={shouldStack ? undefined : 'right'}
            backgroundSize="contain"
            image={image}
          />
        </Box>
      )}
    </Box>
  )

  return <FrameWrapper>{items}</FrameWrapper>
}

const FrameWrapper = ({ children }) => {
  return (
    <Box
      className={cn(styles.card)}
      position="relative"
      borderRadius="large"
      overflow="visible"
      background="blue100"
      outline="none"
      justifyContent='center'
    >
      {children}
    </Box>
  )
}

export default StatisticsCard
