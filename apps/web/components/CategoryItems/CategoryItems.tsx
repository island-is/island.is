import React, { useRef } from 'react'

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

import type { ScrollIndicatorColors } from '../GridItems/ScrollIndicator'
import { ScrollIndicator } from '../GridItems/ScrollIndicator'
import * as styles from './CategoryItems.css'

const EXCLUDED_CATEGORY_SLUGS = ['thjonusta-island-is', 'services-on-island-is']

interface CategoryItemsProps {
  heading?: string
  headingId?: string
  items: GetArticleCategoriesQuery['getArticleCategories']
  seeMoreText?: string
  seeMoreHref?: string
  indicator?: ScrollIndicatorColors
}

export const CategoryItems = ({
  heading,
  headingId,
  items = [],
  seeMoreText,
  seeMoreHref,
  indicator,
}: CategoryItemsProps) => {
  const { linkResolver } = useLinkResolver()
  const scrollContainerRef = useRef<HTMLElement>(null)

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
                    size="small"
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
        third
        mobileItemWidth={270}
        mobileItemsRows={3}
        paddingTop={4}
        paddingBottom={3}
        insideGridContainer
        scrollContainerRef={indicator ? scrollContainerRef : undefined}
      >
        {items
          .filter((item) => !EXCLUDED_CATEGORY_SLUGS.includes(item.slug))
          .map(({ title, description, slug, __typename: typename }) => {
            const href = linkResolver(typename as LinkType, [slug]).href
            return (
              <FocusableBox
                key={slug}
                href={href}
                display="flex"
                flexDirection="column"
                paddingTop={2}
                paddingRight={2}
                paddingBottom={3}
                paddingLeft={3}
                borderRadius="large"
                borderColor="blue200"
                borderWidth="standard"
                height="full"
                width="full"
                background="white"
                color="blue"
                className={styles.card}
              >
                <Text
                  as="h3"
                  variant="h4"
                  color="dark400"
                  truncate
                >
                  {title}
                </Text>
                {description && (
                  <Text
                    paddingTop={2}
                    variant="medium"
                    fontWeight="light"
                  >
                    {description}
                  </Text>
                )}
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
                  size="small"
                  as="span"
                >
                  {seeMoreText}
                </Button>
              </Link>
            </Box>
          </GridContainer>
        </Hidden>
      )}
      {indicator && (
        <ScrollIndicator scrollRef={scrollContainerRef} colors={indicator} />
      )}
    </>
  )
}

export default CategoryItems
