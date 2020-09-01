import React, { FC } from 'react'
import { Query } from '@island.is/api/schema'
import {
  Box,
  Columns,
  Column,
  Typography,
  Stack,
  Button,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import * as styles from './Hero.treat'
import { Link } from 'react-router-dom'
import { ServicePortalPath } from '@island.is/service-portal/core'

interface Props {
  content: Query['getFrontpageSliderList']
  loading: boolean
}

const Hero: FC<Props> = ({ content, loading }) => {
  const slide = content?.items[1]

  return (
    <Box marginBottom={1}>
      <Columns space={[1, 4, 4, 4, 12]}>
        <Column width="1/2">
          <Box marginY={[0, 0, 4, 8]}>
            <Stack space={[2, 2, 2, 4]}>
              {loading ? (
                <>
                  <SkeletonLoader width="100%" height={50} />
                  <SkeletonLoader
                    width="80%"
                    height={22}
                    repeat={3}
                    space={1}
                  />
                </>
              ) : (
                <Stack space={2}>
                  <Typography variant="h1">{slide.title}</Typography>
                  <Typography variant="p">{slide.content}</Typography>
                </Stack>
              )}
              {loading ? (
                <SkeletonLoader width={150} height={40} />
              ) : (
                <Link to={ServicePortalPath.MenntunRoot}>
                  <Button variant="text" icon="arrowRight">
                    Sjá nánar
                  </Button>
                </Link>
              )}
            </Stack>
          </Box>
        </Column>
        <Column>
          <Box
            position="relative"
            display="flex"
            alignItems="center"
            justifyContent="center"
            width="full"
            height="full"
            overflow="hidden"
          >
            <div className={styles.dots}>
              <img src="/assets/images/dots.svg" alt="bakgrunnur" />
            </div>
            {loading ? (
              <SkeletonLoader />
            ) : (
              <img src={slide.image.url} alt={slide.image.title} />
            )}
          </Box>
        </Column>
      </Columns>
    </Box>
  )
}

export default Hero
