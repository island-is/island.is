import React from 'react'

import {
  Box,
  Button,
  FocusableBox,
  GridContainer,
  Link,
  Text,
} from '@island.is/island-ui/core'
import { GridItems } from '@island.is/web/components'
import { GetArticleCategoriesQuery } from '@island.is/web/graphql/schema'
import { LinkType, useLinkResolver } from '@island.is/web/hooks/useLinkResolver'

import * as styles from './CategoryItems.css'

interface CategoryItemsProps {
  heading?: string
  headingId?: string
  items: GetArticleCategoriesQuery['getArticleCategories']
  viewCategoryText?: string
}

export const CategoryItems = ({
  heading,
  headingId,
  items = [],
  viewCategoryText = 'Skoða þjónustuflokk',
}: CategoryItemsProps) => {
  const { linkResolver } = useLinkResolver()

  return (
    <>
      {heading && (
        <GridContainer>
          <Text variant="h2" as="h2" id={headingId}>
            {heading}
          </Text>
        </GridContainer>
      )}
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
          .map(({ title, description, slug, __typename: typename }, index) => {
            const href = linkResolver(typename as LinkType, [slug]).href
            return (
              <FocusableBox
                key={index}
                href={href}
                display="flex"
                flexDirection="column"
                justifyContent="spaceBetween"
                paddingY={3}
                paddingX={3}
                borderRadius="large"
                borderColor="blue200"
                borderWidth="standard"
                height="full"
                width="full"
                background="white"
                color="blue"
                className={styles.card}
              >
                <Box>
                  <Text as="h3" variant="h4" color="dark400">
                    {title}
                  </Text>
                  {description && (
                    <Text paddingTop={1} variant="default">
                      {description}
                    </Text>
                  )}
                </Box>
                <Box paddingTop={2} className={styles.cardLink}>
                  <Link href={href} skipTab>
                    <Button
                      variant="text"
                      as="span"
                      icon="arrowForward"
                      size="small"
                    >
                      {viewCategoryText}
                    </Button>
                  </Link>
                </Box>
              </FocusableBox>
            )
          })}
      </GridItems>
    </>
  )
}

export default CategoryItems
