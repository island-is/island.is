import { ReactNode } from 'react'

import {
  Box,
  type IconMapIcon,
  InfoCard,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import {
  EventLocation,
  EventTime,
  LatestEventSliceCard,
  NewsCard,
} from '@island.is/web/components'
import {
  GetEventsQuery,
  Image as ImageSchema,
} from '@island.is/web/graphql/schema'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import { useWindowSize } from '@island.is/web/hooks/useViewport'
import { useI18n } from '@island.is/web/i18n'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import {
  formatEventDates,
  formatEventLocation,
  formatEventTime,
} from '@island.is/web/utils/event'

interface EventListProps {
  namespace: Record<string, string>
  eventList: GetEventsQuery['getEvents']['items']
  parentPageSlug: string
  noEventsFoundFallback?: ReactNode
  variant?: 'NewsCard' | 'InfoCard'
}

export const EventList = ({
  eventList,
  namespace,
  parentPageSlug,
  noEventsFoundFallback,
  variant = 'NewsCard',
}: EventListProps) => {
  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()
  const { width } = useWindowSize()
  const { activeLocale } = useI18n()
  const isMobile = width < theme.breakpoints.sm
  const { format } = useDateUtils()

  return (
    <Box className="rs_read">
      {!eventList.length && (
        <Box>
          {noEventsFoundFallback ? (
            noEventsFoundFallback
          ) : (
            <Text variant="h4">
              {n(
                'eventListEmptyMonth',
                activeLocale === 'is'
                  ? 'Engir viðburðir framundan'
                  : 'No upcoming events',
              )}
            </Text>
          )}
        </Box>
      )}
      {variant === 'InfoCard' && (
        <Stack space={4}>
          {eventList.map((event) => {
            let formattedDateString: string | undefined
            if (event.startDateTime && event.endDateTime) {
              //use old date format
              formattedDateString = formatEventDates(
                event.startDateTime,
                event.endDateTime,
                activeLocale
              )
            } else {
              formattedDateString = event.startDate
                ? format(new Date(event.startDate), 'do MMMM yyyy')
                : undefined
            }

            const link = linkResolver('organizationevent', [
              parentPageSlug,
              event.slug,
            ])

            const detailLines: Array<{
              icon: IconMapIcon
              text: string
            }> = []

            const eventTime =
              !!event.startDateTime && !!event.endDateTime
                ? formatEventTime(
                    event.time,
                    n(
                      'timeSuffix',
                      activeLocale === 'is' ? 'til' : 'to',
                    ) as string,
                  )
                : ''

            if (eventTime) {
              detailLines.push({
                icon: 'time',
                text: eventTime,
              })
            }

            const eventLocation = formatEventLocation(event.location)
            if (eventLocation) {
              detailLines.push({
                icon: 'location',
                text: eventLocation,
              })
            }

            return (
              <InfoCard
                key={event.id}
                eyebrow={formattedDateString ?? ''}
                id={event.id}
                link={{
                  href: link.href,
                  label: activeLocale === 'is' ? 'Sjá nánar' : 'See more',
                }}
                size="large"
                title={event.title}
                borderColor="borderPrimary"
                variant="detailed"
                description=""
                detailLines={detailLines}
              />
            )
          })}
        </Stack>
      )}
      {!isMobile && variant === 'NewsCard' && (
        <Stack space={4}>
          {eventList.map((eventItem) => {
            const eventHref = linkResolver('organizationevent', [
              parentPageSlug,
              eventItem.slug,
            ]).href
            return (
              <NewsCard
                key={eventItem.id}
                href={eventHref}
                title={eventItem.title}
                titleVariant="h3"
                dateTextColor="purple400"
                introduction={
                  <Stack space={4}>
                    <EventLocation location={eventItem.location} />
                    <EventTime
                      startTime={eventItem.time?.startTime ?? ''}
                      endTime={eventItem.time?.endTime ?? ''}
                      timePrefix={
                        n(
                          'timePrefix',
                          activeLocale === 'is' ? 'kl.' : '',
                        ) as string
                      }
                      timeSuffix={
                        n(
                          'timeSuffix',
                          activeLocale === 'is' ? 'til' : 'to',
                        ) as string
                      }
                    />
                  </Stack>
                }
                date={
                  !!eventItem.startDateTime && !!eventItem.endDateTime
                    ? eventItem.startDateTime
                    : eventItem.startDate
                }
                dateTo={eventItem.endDateTime ?? undefined}
                image={eventItem.thumbnailImage as ImageSchema}
                titleAs="h2"
                readMoreText=""
              />
            )
          })}
        </Stack>
      )}
      {isMobile && variant === 'NewsCard' && (
        <Stack space={[3, 3, 4]}>
          {eventList.map((eventItem) => {
            const eventHref = linkResolver('organizationevent', [
              parentPageSlug,
              eventItem.slug,
            ]).href


            const startDateTime = eventItem.id === '1h7wcG9GRzYCHfeMLKJn0N' ? '2023-01-01' : eventItem.startDateTime
            const endDateTime = eventItem.id === '1h7wcG9GRzYCHfeMLKJn0N' ? '2023-03-01' : eventItem.endDateTime

            const isNewDateProcess =
              !!startDateTime && !!endDateTime

            return (
              <LatestEventSliceCard
                key={eventItem.id}
                title={eventItem.title}
                location={eventItem.location}
                namespace={namespace}
                image={eventItem.thumbnailImage?.url || ''}
                startTime={
                  isNewDateProcess ? '' : eventItem.time?.startTime ?? ''
                }
                endTime={isNewDateProcess ? '' : eventItem.time?.endTime ?? ''}
                href={eventHref}
                date={
                  isNewDateProcess
                    ? (startDateTime ?? '')
                    : eventItem.startDate
                }
                dateTo={
                  (isNewDateProcess && endDateTime) ? endDateTime : undefined
                }
              />
            )
          })}
        </Stack>
      )}
    </Box>
  )
}
