import React from 'react'
import { Text, GridContainer } from '@island.is/island-ui/core'
import { GridItems, IconTitleCard } from '@island.is/web/components'
import { LinkType, useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { GetFrontpageQuery } from '@island.is/web/graphql/schema'

interface LifeEventsSectionProps {
  heading: string
  headingId: string
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  items: GetFrontpageQuery['getFrontpage']['lifeEvents']
}

export const LifeEventsSection = ({
  heading,
  headingId,
  items = [],
}: LifeEventsSectionProps) => {
  const { linkResolver } = useLinkResolver()

  return (
    <>
      <GridContainer>
        <Text variant="h3" as="h2" id={headingId}>
          {heading}
        </Text>
      </GridContainer>
      <GridItems
        mobileItemWidth={270}
        mobileItemsRows={2}
        paddingTop={3}
        paddingBottom={3}
        insideGridContainer
      >
        {items
          .filter((x: { slug: string; title: string }) => x.slug && x.title)
          .map(
            (
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore make web strict
              { __typename: typename, title, shortTitle, slug, tinyThumbnail },
              index: number,
            ) => {
              return (
                <IconTitleCard
                  key={index}
                  heading={shortTitle || title}
                  imgSrc={tinyThumbnail?.url}
                  alt={tinyThumbnail?.title}
                  dataTestId={'lifeevent-card'}
                  href={linkResolver(typename as LinkType, [slug]).href}
                />
              )
            },
          )}
      </GridItems>
    </>
  )
}

export default LifeEventsSection
