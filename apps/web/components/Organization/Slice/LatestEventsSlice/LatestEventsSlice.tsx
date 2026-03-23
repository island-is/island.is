import {
  Box,
  Button,
  GridContainer,
  Hidden,
  Link,
  LinkV2,
  Text,
} from '@island.is/island-ui/core'
import { GridItems, LatestEventSliceCard } from '@island.is/web/components'
import { LatestEventsSlice as LatestEventsSliceSchema } from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { LinkType, useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { useI18n } from '@island.is/web/i18n'

interface LatestEventsSliceProps {
  slice: LatestEventsSliceSchema
  slug: string
  namespace: Record<string, string>
  linkType?: LinkType
  overview?: LinkType
}

export const LatestEventsSlice = ({
  slice,
  slug,
  namespace,
}: LatestEventsSliceProps) => {
  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()
  const { activeLocale } = useI18n()
  const overviewHref = linkResolver('organizationeventoverview', [slug]).href

  const seeMoreEventsText = n(
    'seeMoreEvents',
    activeLocale === 'is' ? 'Sjá fleiri viðburði' : 'View more events',
  )

  return (
    slice.events?.length > 0 && (
      <>
        <GridContainer>
          <Box display="flex" flexDirection="row" justifyContent="spaceBetween">
            <Text variant="h3" as="h2">
              {slice.title}
            </Text>
            <Box display={['none', 'none', 'none', 'block']}>
              <LinkV2 href={overviewHref}>
                <Button
                  icon="arrowForward"
                  iconType="filled"
                  variant="text"
                  as="span"
                  unfocusable={true}
                >
                  {seeMoreEventsText}
                </Button>
              </LinkV2>
            </Box>
          </Box>
        </GridContainer>

        <GridItems
          mobileItemWidth={316}
          mobileItemsRows={1}
          paddingTop={5}
          paddingBottom={5}
          insideGridContainer
          quarter
        >
          {slice.events
            .slice(0, 4)
            .map(
              (
                {
                  title,
                  thumbnailImage,
                  slug: eventSlug,
                  startDate,
                  time,
                  location,
                },
                index,
              ) => (
                <LatestEventSliceCard
                  key={index}
                  title={title}
                  startTime={time.startTime ?? ''}
                  endTime={time.endTime ?? ''}
                  endDate={time.endDate ?? ''}
                  href={linkResolver('event', [slug, eventSlug]).href}
                  date={startDate}
                  location={location}
                  namespace={namespace}
                  image={thumbnailImage?.url || ''}
                />
              ),
            )}
        </GridItems>
        <Hidden above="md">
          <GridContainer>
            <Box
              display="flex"
              width="full"
              justifyContent="center"
              alignItems="center"
              paddingTop={3}
              paddingBottom={5}
            >
              <Link href={overviewHref}>
                <Button
                  icon="arrowForward"
                  iconType="filled"
                  variant="text"
                  as="span"
                  unfocusable={true}
                >
                  {seeMoreEventsText}
                </Button>
              </Link>
            </Box>
          </GridContainer>
        </Hidden>
      </>
    )
  )
}
