import React, { forwardRef } from 'react'
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

export const SlideCard = forwardRef<HTMLDivElement, SliderCardProps>(
  ({ img, title, subTitle, description, linkText, link }, ref) => {
    return (
      <div className={styles.container}>
        <div className={styles.inner}>
          <div
            className={styles.image}
            style={{
              backgroundImage: `url(${img})`,
            }}
          />
          <Box padding={3}>
            <div className={styles.content}>
              <Box display="flex" flexGrow={1}>
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
                <Box display="flex" paddingTop={2}>
                  <Button variant="text" icon="arrowRight">
                    {linkText}
                  </Button>
                </Box>
              )}
            </div>
          </Box>
        </div>
      </div>
    )
  },
)

export default SlideCard
