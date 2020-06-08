import React, { FC } from 'react'
import { Button, Box, Typography, Stack } from '../..'

import * as styles from './SlideCard.treat'

interface SliderCardProps {
  img: string
  title: string
  subTitle: string
  description?: string
  linkText?: string
  link?: string
}

export const SlideCard: FC<SliderCardProps> = ({
  img,
  title,
  subTitle,
  description,
  linkText,
  link,
}) => {
  return (
    <Box className={styles.container}>
      <Box
        className={styles.inner}
        display="flex"
        width="full"
        flexDirection="column"
      >
        <Box
          className={styles.image}
          style={{
            backgroundImage: `url(${img})`,
          }}
        />
        <Box
          padding={3}
          display="flex"
          flexDirection="column"
          width="full"
          height="full"
        >
          <Box flexGrow={1}>
            <Stack space={2}>
              {subTitle && (
                <Typography variant="eyebrow" as="h4" color="mint400">
                  {subTitle}
                </Typography>
              )}
              {title && (
                <Typography variant="h3" as="h3">
                  {title}
                </Typography>
              )}
              {description && (
                <Typography variant="p">{description}</Typography>
              )}
            </Stack>
          </Box>
          {linkText && link && (
            <Box paddingTop={2}>
              <Button variant="text" icon="arrowRight">
                {linkText}
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default SlideCard
