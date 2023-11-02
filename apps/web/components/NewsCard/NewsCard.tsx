import React from 'react'
import { useMeasure } from 'react-use'
import {
  Text,
  Box,
  Button,
  FocusableBox,
  Stack,
} from '@island.is/island-ui/core'
import { BackgroundImage } from '@island.is/web/components'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import { Image } from '@island.is/web/graphql/schema'

import * as styles from './NewsCard.css'

interface NewsCardProps {
  title: string
  introduction: string
  image?: Partial<Image>
  readMoreText?: string
  href: string
  date?: string
  titleAs?: 'h2' | 'h3' | 'h4'
  mini?: boolean
}

export const NewsCard: React.FC<React.PropsWithChildren<NewsCardProps>> = ({
  title,
  introduction,
  image,
  readMoreText = 'Lesa nánar',
  href,
  date,
  titleAs = 'h3',
  mini,
}) => {
  const [ref, { width }] = useMeasure()
  const { format } = useDateUtils()

  const showImage = width > 600

  const formattedDate = date && format(new Date(date), 'do MMMM yyyy')

  if (mini) {
    return (
      <FocusableBox
        href={href}
        paddingX={[0, 2, 5]}
        paddingY={[2, 2, 3]}
        className={styles.mini}
      >
        <Box
          display="flex"
          flexGrow={1}
          width="full"
          height="full"
          paddingX={[3, 3, 0]}
        >
          <Stack space={2}>
            {!!formattedDate && <Text variant="eyebrow">{formattedDate}</Text>}
            <Text variant="h2" as={titleAs}>
              {title}
            </Text>
          </Stack>
        </Box>
      </FocusableBox>
    )
  }

  return (
    <Box ref={ref}>
      <FocusableBox
        href={href}
        paddingX={[2, 2, 5, 5]}
        paddingY={[3, 3, 5, 5]}
        display="flex"
        height="full"
        background="white"
        borderRadius="large"
        borderColor="blue200"
        borderWidth="standard"
      >
        <Box
          display="flex"
          flexDirection="row"
          background="white"
          width="full"
          justifyContent="spaceBetween"
        >
          <Box
            display="flex"
            flexDirection="column"
            flexGrow={1}
            width="full"
            justifyContent="spaceBetween"
          >
            <Stack space={2}>
              <Text variant="eyebrow">{formattedDate}</Text>
              <Text variant="h2" as={titleAs}>
                {title}
              </Text>
              <Text>{introduction}</Text>
            </Stack>
            <Box marginTop={2}>
              <Button
                icon="arrowForward"
                iconType="filled"
                variant="text"
                as="span"
                unfocusable
              >
                {readMoreText}
              </Button>
            </Box>
          </Box>
          {!!showImage && (
            <Box flexGrow={0} width="full" className={styles.image}>
              <BackgroundImage
                width={600}
                quality={60}
                positionX="left"
                backgroundSize="cover"
                ratio="1:1"
                thumbnailColor="blue100"
                image={{
                  url: image?.url,
                  title: image?.title,
                }}
              />
            </Box>
          )}
        </Box>
      </FocusableBox>
    </Box>
  )
}

export default NewsCard
