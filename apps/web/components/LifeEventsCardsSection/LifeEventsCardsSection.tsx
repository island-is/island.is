import React from 'react'
import { GridContainer, Box, Link, Button } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { Card, SimpleSlider } from '@island.is/web/components'
import { GetLifeEventsQuery } from '@island.is/web/graphql/schema'
import { LinkType, useLinkResolver } from '@island.is/web/hooks/useLinkResolver'

interface LifeEventsSectionProps {
  title?: string
  linkTitle?: string
  lifeEvents: GetLifeEventsQuery['getLifeEvents']
}

export const LifeEventsCardsSection = ({
  title = 'Lífsviðburðir',
  linkTitle,
  lifeEvents = [],
}: LifeEventsSectionProps) => {
  const { linkResolver } = useLinkResolver()

  return (
    <GridContainer>
      <Box marginTop={[4, 4, 10]}>
        <SimpleSlider
          title={title}
          breakpoints={{
            0: {
              gutterWidth: theme.grid.gutter.mobile,
              slideCount: 1,
              slideWidthOffset: 100,
            },
            [theme.breakpoints.sm]: {
              gutterWidth: theme.grid.gutter.mobile,
              slideCount: 2,
            },
            [theme.breakpoints.md]: {
              gutterWidth: theme.spacing[3],
              slideCount: 2,
            },
            [theme.breakpoints.lg]: {
              gutterWidth: theme.spacing[3],
              slideCount: 3,
            },
          }}
          items={lifeEvents
            .filter((x) => x.slug && x.title)
            .map(
              (
                { title, __typename: typename, thumbnail, image, intro, slug },
                index,
              ) => {
                return (
                  <Card
                    key={index}
                    title={title}
                    description={intro}
                    link={linkResolver(typename as LinkType, [slug])}
                    image={
                      thumbnail
                        ? {
                            title: thumbnail.title,
                            url: thumbnail.url,
                          }
                        : { title: image.title, url: image.url }
                    }
                  />
                )
              },
            )}
        />
        <Box display={'flex'} justifyContent="flexEnd" marginTop={[3, 3, 4]}>
          <Link {...linkResolver('lifeevents')} skipTab>
            <Button
              icon="arrowForward"
              iconType="filled"
              variant="text"
              as="span"
            >
              {linkTitle}
            </Button>
          </Link>
        </Box>
      </Box>
    </GridContainer>
  )
}

export default LifeEventsCardsSection
