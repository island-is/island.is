import React from 'react'

import {
  Box,
  LinkV2,
  ProfileCard,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { EventLocation as EventLocationSchema } from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import { formatEventDate } from '@island.is/web/utils/formatEventDate'

import { EventLocation } from '../EventLocation'
import { EventTime } from '../EventTime'
import * as styles from './LatestEventSliceCard.css'

interface EventCardProps {
  title: string
  image?: string
  namespace: Record<string, string>
  parameters?: Array<string>
  startTime: string
  endTime: string
  href: string
  date?: string
  location?: EventLocationSchema
  endDate?: string | null
}

export const LatestEventSliceCard: React.FC<
  React.PropsWithChildren<EventCardProps>
> = ({
  title,
  image,
  namespace,
  location,
  startTime,
  endTime,
  href,
  date,
  endDate,
}) => {
  const n = useNamespace(namespace)
  const { activeLocale } = useI18n()

  const timeSuffix = n(
    'timeSuffix',
    activeLocale === 'is' ? 'til' : 'to',
  ) as string

  const dateSuffix = n('dateSuffix', ' - ') as string

  const { format } = useDateUtils()
  const formattedDate = formatEventDate(
    format,
    ` ${dateSuffix} `,
    date,
    endDate,
  )

  return (
    <LinkV2 href={href} className={styles.container}>
      <ProfileCard
        image={image}
        heightFull={true}
        description={
          <Box>
            <Box height="full" paddingBottom={2}>
              <Stack space={1}>
                <Text color="purple400" variant="eyebrow">
                  {formattedDate}
                </Text>
                <Text as="h3" variant="h3" title={title}>
                  {title}
                </Text>
                <EventLocation location={location} />
                <EventTime
                  startTime={startTime}
                  endTime={endTime}
                  timePrefix={n('timePrefix', '') as string}
                  timeSuffix={timeSuffix}
                />
              </Stack>
            </Box>
          </Box>
        }
      />
    </LinkV2>
  )
}

export default LatestEventSliceCard
