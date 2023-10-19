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
            <Text variant="h2" as="h2">
              {slice.title}
            </Text>
            <Box display={['none', 'none', 'none', 'block']}>
              <LinkV2 href={overviewHref}>
                <Button
                  icon="arrowForward"
                  iconType="filled"
                  variant="text"
                  as="span"
                >
                  {seeMoreEventsText}
                </Button>
              </LinkV2>
            </Box>
          </Box>
        </GridContainer>

        <GridItems
          mobileItemWidth={270}
          mobileItemsRows={1}
          paddingTop={5}
          paddingBottom={5}
          insideGridContainer
          third
        >
          {slice.events
            .slice(0, 3)
            .map(
              (
                { title, image, slug: eventSlug, startDate, time, location },
                index,
              ) => (
                <LatestEventSliceCard
                  key={index}
                  title={title}
                  startTime={time.startTime ?? ''}
                  endTime={time.endTime ?? ''}
                  href={
                    linkResolver('organizationevent', [slug, eventSlug]).href
                  }
                  date={startDate}
                  streetAddress={location.streetAddress ?? ''}
                  postalCode={location.postalCode ?? ''}
                  floor={location.floor ?? ''}
                  namespace={namespace}
                  image={{
                    url: image?.url || '',
                    title: image?.title || '',
                  }}
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
