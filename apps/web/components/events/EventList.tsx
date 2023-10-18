import { useEffect, useState } from 'react'

import { Box, Stack, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import {
  EventCard,
  LatestEventSliceCard,
  Webreader,
} from '@island.is/web/components'
import { GetEventsQuery } from '@island.is/web/graphql/schema'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import { useWindowSize } from '@island.is/web/hooks/useViewport'
import { useI18n } from '@island.is/web/i18n'

interface EventListProps {
  title: string
  namespace: Record<string, string>
  eventList: GetEventsQuery['getEvents']['items']
  parentPageSlug: string
}

export const EventList = ({
  title,
  eventList,
  namespace,
  parentPageSlug,
}: EventListProps) => {
  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()
  const { width } = useWindowSize()
  const { activeLocale } = useI18n()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(width < theme.breakpoints.md)
  }, [width])

  return (
    <Box className="rs_read">
      <Stack space={[3, 3, 4]}>
        <Text variant="h1" as="h1" marginBottom={0}>
          {title}
        </Text>

        <Webreader
          marginTop={0}
          marginBottom={0}
          readId={undefined}
          readClass="rs_read"
        />

        {!eventList.length && (
          <Text variant="h4">
            {n(
              'eventListEmptyMonth',
              activeLocale === 'is'
                ? 'Engir viðburðir framundan'
                : 'No upcoming events',
            )}
          </Text>
        )}
        {!isMobile && (
          <Stack space={4}>
            {eventList.map((eventItem, index) => {
              const eventHref = linkResolver('organizationevent', [
                parentPageSlug,
                eventItem.slug,
              ]).href
              return (
                <EventCard
                  key={index}
                  namespace={namespace}
                  title={eventItem.title}
                  location={eventItem.location}
                  image={eventItem.image}
                  startTime={eventItem.time?.startTime ?? ''}
                  endTime={eventItem.time?.endTime ?? ''}
                  titleAs="h2"
                  href={eventHref}
                  date={eventItem.startDate}
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
                  postalCode={eventItem.location.postalCode ?? ''}
                  streetAddress={eventItem.location.streetAddress ?? ''}
                  floor={eventItem.location.floor ?? ''}
                  namespace={namespace}
                  image={{
                    url: eventItem.image?.url || '',
                    title: eventItem.image?.title || '',
                  }}
                  startTime={eventItem.time?.startTime ?? ''}
                  endTime={eventItem.time?.endTime ?? ''}
                  href={eventHref}
                  date={eventItem.startDate}
                />
              )
            })}
          </Stack>
        )}
      </Stack>
    </Box>
  )
}
