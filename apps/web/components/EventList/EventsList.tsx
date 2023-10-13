import { Stack, Text, Box, LinkV2 } from '@island.is/island-ui/core'
import { LinkType, useLinkResolver, useNamespace } from '@island.is/web/hooks'
import { EventCard, EventSliceCard, Webreader } from '@island.is/web/components'
import { GetEventsQuery } from '@island.is/web/graphql/schema'
import { useEffect, useState } from 'react'
import { useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'

interface EventsListProps {
  title: string
  namespace: Record<string, string>
  eventList: GetEventsQuery['getEvents']['items']
  selectedPage: number
  eventOverviewUrl: string
  eventItemLinkType: LinkType
  parentPageSlug: string
  eventPerPage?: number
}

export const EventsList = ({
  title,
  eventList,
  namespace,
  eventOverviewUrl,
  eventItemLinkType,
  parentPageSlug,
  eventPerPage = 10,
}: EventsListProps) => {
  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()
  const { width } = useWindowSize()
  const [isMobile, setIsMobile] = useState<boolean | null>(null)

  useEffect(() => {
    setIsMobile(width < theme.breakpoints.md)
  }, [width])

  return (
    <Stack space={[3, 3, 4]}>
      <Text variant="h1" as="h1" marginBottom={0}>
        {title}
      </Text>

      <Webreader
        marginTop={0}
        marginBottom={0}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        readId={null}
        readClass="rs_read"
      />

      <LinkV2
        href={linkResolver('organizationeventoverview', [parentPageSlug]).href}
      ></LinkV2>
      {!eventList.length && (
        <Text variant="h4">
          {n('eventListEmptyMonth', 'Engir viðburðir fundust í þessum mánuði.')}
        </Text>
      )}
      {!isMobile && (
        <Box className="rs_read">
          <Stack space={4}>
            {eventList.map((eventItem, index) => (
              <EventCard
                key={index}
                namespace={namespace}
                title={eventItem.title}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore make web strict
                location={eventItem.location}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore make web strict
                image={eventItem.image}
                startTime={eventItem.time.startTime}
                endTime={eventItem.time.endTime}
                titleAs="h2"
                href={
                  linkResolver(eventItemLinkType, [
                    parentPageSlug,
                    eventItem.slug,
                  ]).href
                }
                date={eventItem.date}
              />
            ))}
          </Stack>
        </Box>
      )}
      {isMobile && (
        <Box className="rs_read">
          <Stack space={[3, 3, 4]}>
            {eventList.map((eventItem, index) => (
              <EventSliceCard
                key={index}
                title={eventItem.title}
                postalCode={eventItem.location.postalCode}
                streetAddress={eventItem.location.streetAddress}
                floor={eventItem.location.floor}
                namespace={namespace}
                image={{
                  url: eventItem.image?.url || '',
                  title: eventItem.image?.title || '',
                }}
                startTime={eventItem.time.startTime}
                endTime={eventItem.time.endTime}
                href={
                  linkResolver(eventItemLinkType, [
                    parentPageSlug,
                    eventItem.slug,
                  ]).href
                }
                date={eventItem.date}
              />
            ))}
          </Stack>
        </Box>
      )}
    </Stack>
  )
}
