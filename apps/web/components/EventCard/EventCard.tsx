import React from 'react'

import {
  Box,
  FocusableBox,
  Hidden,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { Image } from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'

import * as styles from './EventCard.css'

interface EventCardProps {
  title: string
  image?: Partial<Image>
  namespace: Record<string, string>
  readMoreText?: string
  startTime: string
  endTime: string
  href: string
  date?: string
  location: {
    streetAddress?: string
    postalCode?: string
    floor?: string
  }
  titleAs?: 'h2' | 'h3' | 'h4'
  mini?: boolean
}

export const EventCard: React.FC<React.PropsWithChildren<EventCardProps>> = ({
  title,
  location,
  namespace,
  image,
  startTime,
  endTime,
  href,
  date,
  titleAs = 'h3',
}) => {
  const { format } = useDateUtils()
  const { activeLocale } = useI18n()
  const n = useNamespace(namespace)
  const formattedDate = date && format(new Date(date), 'do MMMM yyyy')

  return (
    <FocusableBox
      href={href}
      paddingRight={2}
      paddingX={[2, 2, 3, 4]}
      paddingY={3}
      display="flex"
      height="full"
      borderRadius="large"
      borderColor="blue200"
      borderWidth="standard"
    >
      <Box
        display="flex"
        flexDirection="column"
        width="full"
        justifyContent="spaceBetween"
        className={styles.wrapper}
      >
        <Stack space={1}>
          <Text variant="eyebrow" color="purple400">
            {formattedDate}
          </Text>
          <Text variant="h3" as={titleAs}>
            {title}
          </Text>
          <Box>
            <Text>
              {location.streetAddress as string}
              {', '}
              {location.floor + ', '}
            </Text>
            <Text>{location.postalCode as string}</Text>
          </Box>
          <Text>
            {startTime as string}
            {
              n(
                'timeSuffix',
                activeLocale === 'is' ? ' til ' : ' to ',
              ) as string
            }
            {endTime as string}
          </Text>
        </Stack>
        <Hidden below={'lg'}>
          <Box className={styles.imageContainer}>
            <img
              className={styles.image}
              src={image?.url || ''}
              alt={image?.title || ''}
            />
          </Box>
        </Hidden>
      </Box>
    </FocusableBox>
  )
}

export default EventCard
