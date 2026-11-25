import { useEffect, useState } from 'react'
import cn from 'classnames'
import { useRouter } from 'next/router'

import { EmbeddedVideo, Image } from '@island.is/island-ui/contentful'
import {
  Box,
  GridColumn,
  GridRow,
  Icon,
  ResponsiveSpace,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import type { Locale } from '@island.is/shared/types'
import {
  AddToCalendarButton,
  EventLocation,
  EventTime,
  Webreader,
} from '@island.is/web/components'
import {
  Event as EventModel,
  Image as ImageSchema,
} from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { useWindowSize } from '@island.is/web/hooks/useViewport'
import { useI18n } from '@island.is/web/i18n'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import { formatEventLocation } from '@island.is/web/utils/event'
import { formatEventDate } from '@island.is/web/utils/formatEventDate'
import { webRichText } from '@island.is/web/utils/richText'

import * as styles from './EventArticle.css'

const LAYOUT_CHANGE_BREAKPOINT = 1120
const ICON_TEXT_SPACE: ResponsiveSpace = [3, 3, 3, 2, 3]

const EventItemImage = ({
  eventItem,
  floatRight = true,
}: {
  eventItem: EventModel
  floatRight?: boolean | null
}) => {
  if (!eventItem?.contentImage?.url) return null
  return (
    <Box
      paddingY={2}
      className={cn(
        {
          [styles.floatedImage]: floatRight,
        },
        styles.imageContainer,
      )}
    >
      <img
        className={styles.image}
        src={
          eventItem.contentImage?.url
            ? eventItem.contentImage?.url + '?w=1000&fm=webp&q=80'
            : ''
        }
        alt={eventItem.contentImage?.description ?? ''}
      />
    </Box>
  )
}

const EventInformationBox = ({
  event,
  namespace,
  hasEventOccurred,
}: {
  event: EventModel
  namespace: Record<string, string>
  hasEventOccurred: boolean
}) => {
  const { activeLocale } = useI18n()
  const n = useNamespace(namespace)
  const { format } = useDateUtils()
  const timeSuffix = n(
    'timeSuffix',
    activeLocale === 'is' ? 'til' : 'to',
  ) as string
  const dateSuffix = n('dateSuffix', ' - ') as string
  const formattedDate = formatEventDate(
    format,
    ` ${dateSuffix} `,
    event.startDate,
    event.time?.endDate,
  )

  const router = useRouter()

  return (
    <Box background="blue100" borderRadius="large" padding={[3, 3, 3, 2, 3]}>
      <Stack space={3}>
        <Box display="flex" flexWrap="nowrap" columnGap={ICON_TEXT_SPACE}>
          <Icon color="blue400" icon="calendar" type="outline" />
          <Text>{formattedDate}</Text>
        </Box>
        {Boolean(event.time?.startTime) && (
          <Box display="flex" flexWrap="nowrap" columnGap={ICON_TEXT_SPACE}>
            <Icon color="blue400" icon="time" type="outline" />
            <EventTime
              startTime={event.time?.startTime ?? ''}
              endTime={event.time?.endTime ?? ''}
              timePrefix={n('timePrefix', '') as string}
              timeSuffix={timeSuffix}
            />
          </Box>
        )}
        {((Boolean(event.location?.useFreeText) &&
          Boolean(event.location?.freeText)) ||
          Boolean(event.location?.streetAddress)) && (
          <Box display="flex" flexWrap="nowrap" columnGap={ICON_TEXT_SPACE}>
            <Box>
              <Icon color="blue400" icon="location" type="outline" />
            </Box>
            <EventLocation location={event.location} />
          </Box>
        )}
        {!hasEventOccurred && Boolean(event.startDate) && (
          <Box
            display="flex"
            flexWrap="nowrap"
            columnGap={ICON_TEXT_SPACE}
            alignItems="center"
          >
            <Box>
              <Icon color="blue400" icon="add" type="outline" />
            </Box>
            <AddToCalendarButton
              event={{
                title: event.title,
                description: '',
                pageUrl: `${
                  typeof window !== 'undefined'
                    ? window.location.origin
                    : 'https://island.is'
                }${router.asPath}`,
                location: formatEventLocation(event.location),
                startDate: format(new Date(event.startDate), 'yyyy-MM-dd'),
                startTime: event.time?.startTime,
                endTime: event.time?.endTime,
                endDate: event.time?.endDate
                  ? format(new Date(event.time.endDate), 'yyyy-MM-dd')
                  : undefined,
              }}
            />
          </Box>
        )}
      </Stack>
    </Box>
  )
}

interface EventArticleProps {
  event: EventModel
  namespace: Record<string, string>
  locale: Locale
  hasEventOccurred: boolean
}

export const EventArticle = ({
  event,
  namespace,
  locale,
  hasEventOccurred,
}: EventArticleProps) => {
  const { activeLocale } = useI18n()
  const [isSmall, setIsSmall] = useState(false)
  const { width } = useWindowSize()

  useEffect(() => {
    setIsSmall(width <= LAYOUT_CHANGE_BREAKPOINT)
  }, [width])

  return (
    <>
      <Text variant="h1" as="h1">
        {event.title}
      </Text>

      <Webreader
        marginTop={3}
        marginBottom={5}
        readId={undefined}
        readClass="rs_read"
      />

      <Stack space={3}>
        <GridRow>
          {event.video?.url && (
            <GridColumn paddingBottom={3} span={isSmall ? '12/12' : '7/12'}>
              <EmbeddedVideo
                url={event.video.url}
                locale={locale}
                title={event.video.title}
                thumbnailImageUrl={event.video.thumbnailImageUrl}
              />
            </GridColumn>
          )}
          <GridColumn
            span={
              isSmall || (!event.video?.url && !event.contentImage?.url)
                ? '12/12'
                : '5/12'
            }
            paddingTop={[2, 2, 2, 0, 0]}
            paddingBottom={2}
          >
            <EventInformationBox
              event={event}
              namespace={namespace}
              hasEventOccurred={hasEventOccurred}
            />
          </GridColumn>
          {!isSmall && !event.video?.url && event.contentImage?.url && (
            <GridColumn paddingBottom={3} span={isSmall ? '12/12' : '7/12'}>
              <EventItemImage eventItem={event} floatRight={false} />
            </GridColumn>
          )}
        </GridRow>

        {event.contentImage?.url && !event.video?.url && isSmall && (
          <EventItemImage
            eventItem={event}
            floatRight={!event.fullWidthImageInContent}
          />
        )}

        <Box>
          {webRichText(
            event.content ?? [],
            {
              renderComponent: {
                Image: (slice: ImageSchema) => (
                  <Box className={styles.clearBoth}>
                    <Image {...slice} url={slice.url} />
                  </Box>
                ),
              },
            },
            activeLocale,
          )}
        </Box>
      </Stack>
    </>
  )
}
