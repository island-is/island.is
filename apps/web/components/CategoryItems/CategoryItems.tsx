import React from 'react'

import {
  Box,
  Button,
  FocusableBox,
  GridContainer,
  Hidden,
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
  seeMoreText?: string
  seeMoreHref?: string
}

export const CategoryItems = ({
  heading,
  headingId,
  items = [],
  viewCategoryText = 'Skoða þjónustuflokk',
  seeMoreText,
  seeMoreHref,
}: CategoryItemsProps) => {
  const { linkResolver } = useLinkResolver()

  return (
    <>
      {heading && (
        <GridContainer>
          <Box display="flex" flexDirection="row" justifyContent="spaceBetween">
            <Text variant="h2" as="h2" id={headingId}>
              {heading}
            </Text>
            {seeMoreText && seeMoreHref && (
              <Box display={['none', 'none', 'none', 'block']}>
                <Link href={seeMoreHref} skipTab>
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
            )}
          </Box>
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
      {seeMoreText && seeMoreHref && (
        <Hidden above="md">
          <GridContainer>
            <Box
              display="flex"
              width="full"
              justifyContent="center"
              alignItems="center"
              paddingY={[3, 3, 3, 0]}
            >
              <Link skipTab href={seeMoreHref}>
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
      )}
    </>
  )
}

export default CategoryItems
