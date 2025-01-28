import React, { ReactNode } from 'react'
import { useMeasure } from 'react-use'
import cn from 'classnames'

import { Box, Hyphen, Stack, Text } from '@island.is/island-ui/core'
import { BackgroundImage } from '@island.is/web/components'

import * as styles from './StatisticsCard.css'

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

  const shouldStack = width < 370
  const hasImage = image?.title && image?.title.length > 0

  const items = (
    <Box
      ref={ref}
      display="flex"
      flexGrow={1}
      flexDirection={'row'}
      alignItems="stretch"
      justifyContent="flexEnd"
    >
      <Box
        style={{ width: hasImage ? '70%' : '100%' }}
        paddingTop={[2, 2, 3]}
        paddingLeft={[2, 2, 3]}
        // position='relative'
      >
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
      {hasImage && (
        <Box>
          <Box
            position="relative"
            style={{
              width: shouldStack ? '150px' : '204px',
              height: '204px',
              top: '-40px',
            }}
          >
            <BackgroundImage
              width={500}
              quality={100}
              positionX={'right'}
              backgroundSize="contain"
              image={image}
            />
          </Box>
        </Box>
      )}
    </Box>
  )

  return <FrameWrapper>{items}</FrameWrapper>
}

const FrameWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      className={cn(styles.card)}
      position="absolute"
      borderRadius="large"
      overflow="visible"
      background="blue100"
      outline="none"
      style={{ marginRight: '24px' }}
    >
      {children}
    </Box>
  )
}

export default StatisticsCard
