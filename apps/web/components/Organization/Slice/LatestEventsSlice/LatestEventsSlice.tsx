import {
  Box,
  Button,
  GridContainer,
  Hidden,
  Link,
  LinkV2,
  Text,
} from '@island.is/island-ui/core'
import { LatestEventsSlice as LatestEventsSliceSchema } from '@island.is/web/graphql/schema'
import { EventSliceCard, GridItems } from '@island.is/web/components'
import { LinkType, useLinkResolver } from '@island.is/web/hooks/useLinkResolver'

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
  linkType = 'organizationevent',
  overview = 'organizationeventoverview',
}: LatestEventsSliceProps) => {
  const { linkResolver } = useLinkResolver()
  const linkProps = slice.readMoreLink?.url
    ? { href: slice.readMoreLink?.url }
    : linkResolver(overview, [slug])

  const parameters = [slug]

  return (
    slice.events.length > 0 && (
      <>
        <GridContainer>
          <Box display="flex" flexDirection="row" justifyContent="spaceBetween">
            <Text variant="h2" as="h2">
              {slice.title}
            </Text>
            <Box display={['none', 'none', 'none', 'block']}>
              <LinkV2 {...linkProps} skipTab>
                <Button
                  icon="arrowForward"
                  iconType="filled"
                  variant="text"
                  as="span"
                >
                  {slice.readMoreText}
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
            .map(({ title, image, slug, date, time, location }, index) => (
              <EventSliceCard
                key={index}
                title={title}
                startTime={time.startTime}
                endTime={time.endTime}
                href={linkResolver(linkType, [...parameters, slug]).href}
                date={date}
                streetAddress={location.streetAddress}
                postalCode={location.postalCode}
                floor={location.floor}
                namespace={namespace}
                image={{
                  url: image?.url || '',
                  title: image?.title || '',
                }}
              ></EventSliceCard>
            ))}
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
              <Link {...linkProps} skipTab>
                <Button
                  icon="arrowForward"
                  iconType="filled"
                  variant="text"
                  as="span"
                >
                  {slice.readMoreText}
                </Button>
              </Link>
            </Box>
          </GridContainer>
        </Hidden>
      </>
    )
  )
}
