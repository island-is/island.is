import React from 'react'
import { Text, CategoryCard } from '@island.is/island-ui/core'
import { GridItems, GridContainer } from '@island.is/web/components'
import { LinkType, useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { GetArticleCategoriesQuery } from '@island.is/web/graphql/schema'

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
        <Text variant="h3" as="h2" id={headingId}>
          {heading}
        </Text>
      </GridContainer>
      <GridItems
        mobileItemWidth={270}
        mobileItemsRows={3}
        paddingTop={3}
        paddingBottom={3}
        insideGridContainer
      >
        {items.map(
          ({ title, description, slug, __typename: typename }, index) => (
            <CategoryCard
              key={index}
              heading={title}
              headingAs="h4"
              headingVariant="h4"
              text={description}
              href={linkResolver(typename as LinkType, [slug]).href}
            />
          ),
        )}
      </GridItems>
    </>
  )
}

export default CategoryItems
