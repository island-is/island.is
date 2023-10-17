import React from 'react'

import { Box, FocusableBox, Stack, Text } from '@island.is/island-ui/core'
import { Image } from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'

import * as styles from './EventSliceCard.css'

interface EventCardProps {
  title: string
  image?: Partial<Image>
  namespace: Record<string, string>
  parameters?: Array<string>
  startTime: string
  endTime: string
  href: string
  date?: string
  streetAddress: string
  postalCode: string
  floor: string
}

export const EventSliceCard: React.FC<
  React.PropsWithChildren<EventCardProps>
> = ({
  title,
  image,
  streetAddress,
  namespace,
  postalCode,
  floor,
  startTime,
  endTime,
  href,
  date,
}) => {
  const { format } = useDateUtils()
  const formattedDate = date && format(new Date(date), 'do MMMM yyyy')
  const { activeLocale } = useI18n()
  const n = useNamespace(namespace)

  return (
    <FocusableBox
      href={href}
      display="flex"
      flexDirection="column"
      background="white"
      borderColor="blue200"
      borderRadius="large"
      borderWidth="standard"
      height="full"
      color="blue"
    >
      <Box>
        <Box marginBottom={2} width="full">
          <img src={image?.url} alt={image?.title} className={styles.image} />
        </Box>
        <Box>
          <Box
            height="full"
            paddingBottom={2}
            paddingX={[2, 2, 4]}
            flexGrow={1}
          >
            <Stack space={1}>
              <Text color="purple400" variant="eyebrow">
                {formattedDate}
              </Text>
              <Text as="h3" variant="h3" title={title}>
                {title}
              </Text>
              <Box>
                <Text>
                  {streetAddress}
                  {', '}
                  {floor ? floor + ', ' : ''}
                </Text>
                <Text>{postalCode}</Text>
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
          </Box>
        </Box>
      </Box>
    </FocusableBox>
  )
}

export default EventSliceCard
