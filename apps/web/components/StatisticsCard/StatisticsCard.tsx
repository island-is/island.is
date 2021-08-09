import React from 'react'
import cn from 'classnames'
import { Box, Stack, Text, Hyphen, Hidden } from '@island.is/island-ui/core'
import { BackgroundImage } from '@island.is/web/components'

import * as styles from './StatisticsCard.treat'

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
  const hasImage = image?.title.length > 0

  const items = (
    <Box
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
        <Hidden below="md">
          <Box
            position="relative"
            style={{
              width: '204px',
              height: '204px',
              top: '-40px',
            }}
          >
            <BackgroundImage
              width={204}
              positionX={'right'}
              backgroundSize="contain"
              image={image}
            />
          </Box>
        </Hidden>
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
    >
      {children}
    </Box>
  )
}

export default StatisticsCard
