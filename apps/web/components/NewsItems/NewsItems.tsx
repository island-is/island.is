import React from 'react'
import { Box, Text, Button, Hidden, Link } from '@island.is/island-ui/core'
import { GridItems, GridContainer } from '@island.is/web/components'
import { GetNewsQuery } from '@island.is/web/graphql/schema'
import { LinkType, useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import Item from './Item'

interface NewsItemsProps {
  heading: string
  headingTitle: string
  seeMoreText: string
  items: GetNewsQuery['getNews']['items']
  linkType?: LinkType
  overview?: LinkType
  parameters?: Array<string>
}

export const NewsItems = ({
  heading,
  headingTitle,
  seeMoreText,
  items = [],
  linkType,
  overview = 'newsoverview',
  parameters = [],
}: NewsItemsProps) => {
  const { linkResolver } = useLinkResolver()

  return (
    <>
      <GridContainer>
        <Box display="flex" flexDirection="row" justifyContent="spaceBetween">
          <Text variant="h3" as="h2" id={headingTitle}>
            {heading}
          </Text>
          <Box display={['none', 'none', 'block']}>
            <Link {...linkResolver(overview, parameters)} skipTab>
              <Button
                icon="arrowForward"
                iconType="filled"
                variant="text"
                as="span"
              >
                {seeMoreText}
              </Button>
            </Link>
          </Box>
        </Box>
      </GridContainer>
      <GridItems
        mobileItemsRows={1}
        mobileItemWidth={270}
        paddingTop={3}
        paddingBottom={3}
        insideGridContainer
        half
      >
        {items
          .slice(0, 2)
          .map(
            (
              { __typename: tn, title, intro, image, slug, date, genericTags },
              index,
            ) => (
              <Item
                key={index}
                date={date}
                heading={title}
                text={intro}
                href={
                  linkResolver(linkType ?? (tn as LinkType), [
                    ...parameters,
                    slug,
                  ]).href
                }
                image={image}
                tags={genericTags.map(({ slug, title, __typename: tn }) => {
                  return {
                    label: title,
                    href: linkResolver(linkType ?? (tn as LinkType), [
                      ...parameters,
                      slug,
                    ]).href,
                  }
                })}
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
          >
            <Link {...linkResolver('newsoverview', [])} skipTab>
              <Button
                icon="arrowForward"
                iconType="filled"
                variant="text"
                as="span"
              >
                {seeMoreText}
              </Button>
            </Link>
          </Box>
        </GridContainer>
      </Hidden>
    </>
  )
}

export default NewsItems
