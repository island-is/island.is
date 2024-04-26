import { ReactNode, useEffect, useState } from 'react'

import { Box, Stack, Text } from '@island.is/island-ui/core'
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

interface EventListProps {
  namespace: Record<string, string>
  eventList: GetEventsQuery['getEvents']['items']
  parentPageSlug: string
  noEventsFoundFallback?: ReactNode
}

export const EventList = ({
  eventList,
  namespace,
  parentPageSlug,
  noEventsFoundFallback,
}: EventListProps) => {
  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()
  const { width } = useWindowSize()
  const { activeLocale } = useI18n()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(width < theme.breakpoints.sm)
  }, [width])

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
      {!isMobile && (
        <Stack space={4}>
          {eventList.map((eventItem, index) => {
            const eventHref = linkResolver('organizationevent', [
              parentPageSlug,
              eventItem.slug,
            ]).href
            return (
              <NewsCard
                key={index}
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
                date={eventItem.startDate}
                image={eventItem.thumbnailImage as ImageSchema}
                titleAs="h2"
                readMoreText=""
              />
            )
          })}
        </Stack>
      )}
      {isMobile && (
        <Stack space={[3, 3, 4]}>
          {eventList.map((eventItem, index) => {
            const eventHref = linkResolver('organizationevent', [
              parentPageSlug,
              eventItem.slug,
            ]).href
            return (
              <LatestEventSliceCard
                key={index}
                title={eventItem.title}
                location={eventItem.location}
                namespace={namespace}
                image={eventItem.thumbnailImage?.url || ''}
                startTime={eventItem.time?.startTime ?? ''}
                endTime={eventItem.time?.endTime ?? ''}
                href={eventHref}
                date={eventItem.startDate}
              />
            )
          })}
        </Stack>
      )}
    </Box>
  )
}
