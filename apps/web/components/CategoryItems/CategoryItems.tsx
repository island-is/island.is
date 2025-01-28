import React from 'react'

import { CategoryCard, GridContainer, Text } from '@island.is/island-ui/core'
import { GridItems } from '@island.is/web/components'
import { GetArticleCategoriesQuery } from '@island.is/web/graphql/schema'
import { LinkType, useLinkResolver } from '@island.is/web/hooks/useLinkResolver'

interface CategoryItemsProps {
  heading: string
  headingId: string
  items: GetArticleCategoriesQuery['getArticleCategories']
}

export const CategoryItems = ({
  heading,
  headingId,
  items = [],
}: CategoryItemsProps) => {
  const { linkResolver } = useLinkResolver()

  return (
    <>
      <GridContainer>
        <Text variant="h2" as="h2" id={headingId}>
          {heading}
        </Text>
      </GridContainer>
      <GridItems
        mobileItemWidth={270}
        mobileItemsRows={3}
        paddingTop={4}
        paddingBottom={3}
        insideGridContainer
      >
        {items
          .filter(
            (item) =>
              item.slug !== 'thjonusta-island-is' &&
              item.slug !== 'services-on-island-is',
          )
          .map(({ title, description, slug, __typename: typename }, index) => (
            <CategoryCard
              key={index}
              heading={title}
              headingAs="h3"
              headingVariant="h4"
              text={description ?? ''}
              href={linkResolver(typename as LinkType, [slug]).href}
            />
          ))}
      </GridItems>
    </>
  )
}

export default CategoryItems
