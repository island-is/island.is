import React from 'react'
import { useMeasure } from 'react-use'

import {
  Box,
  Button,
  FocusableBox,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { BackgroundImage } from '@island.is/web/components'
import { Image } from '@island.is/web/graphql/schema'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'

import * as styles from './NewsCard.css'

interface NewsCardProps {
  title: string
  introduction: string | React.ReactNode
  image?: Partial<Image>
  readMoreText?: string
  href: string
  date?: string
  formattedDateString?: string
  dateTextColor?: 'dark400' | 'purple400'
  titleVariant?: 'h2' | 'h3'
  titleAs?: 'h2' | 'h3' | 'h4'
  titleTextColor?: 'dark400' | 'blue400'
  mini?: boolean
}

export const NewsCard: React.FC<React.PropsWithChildren<NewsCardProps>> = ({
  title,
  introduction,
  image,
  readMoreText = 'Lesa nánar',
  href,
  date,
  formattedDateString,
  dateTextColor = 'dark400',
  titleVariant = 'h2',
  titleAs = 'h3',
  titleTextColor = 'dark400',
  mini,
}) => {
  const [ref, { width }] = useMeasure()
  const { format } = useDateUtils()

  const showImage = width > 600

  const formattedDate = formattedDateString
    ? formattedDateString
    : date
    ? format(new Date(date), 'do MMMM yyyy')
    : ''

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
            {!!formattedDate && (
              <Text variant="eyebrow" color={dateTextColor}>
                {formattedDate}
              </Text>
            )}
            <Text variant="h2" as={titleAs} color={titleTextColor}>
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
              <Text variant="eyebrow" color={dateTextColor}>
                {formattedDate}
              </Text>
              <Text variant={titleVariant} as={titleAs} color={titleTextColor}>
                {title}
              </Text>
              {React.isValidElement(introduction) ? (
                introduction
              ) : (
                <Text>{introduction}</Text>
              )}
            </Stack>
            {readMoreText && (
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
            )}
          </Box>
          {!!showImage && image && (
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
