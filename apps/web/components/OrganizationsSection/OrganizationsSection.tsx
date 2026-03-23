import React, { useRef } from 'react'

import {
  Box,
  Button,
  FocusableBox,
  GridContainer,
  Hidden,
  Hyphen,
  Inline,
  Link,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { GridItems } from '@island.is/web/components'

import type { ScrollIndicatorColors } from '../GridItems/ScrollIndicator'
import { ScrollIndicator } from '../GridItems/ScrollIndicator'
import * as styles from './OrganizationsSection.css'

type OrganizationTag = {
  id: string
  title: string
}

interface OrganizationItem {
  title: string
  href?: string
  logoUrl?: string
  logoAlt?: string
  tags?: OrganizationTag[]
}

interface OrganizationsSectionProps {
  heading: string
  headingId: string
  items: OrganizationItem[]
  seeMoreText?: string
  seeMoreHref?: string
  indicator?: ScrollIndicatorColors
}

export const OrganizationsSection = ({
  heading,
  headingId,
  items = [],
  seeMoreText,
  seeMoreHref,
  indicator,
}: OrganizationsSectionProps) => {
  const scrollContainerRef = useRef<HTMLElement>(null)

  return (
    <>
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
      <GridItems
        mobileItemWidth={270}
        mobileItemsRows={2}
        paddingTop={4}
        paddingBottom={3}
        insideGridContainer
        scrollContainerRef={indicator ? scrollContainerRef : undefined}
      >
        {items.slice(0, 8).map((item, index) => {
          const hasTags = (item.tags?.length ?? 0) > 0
          return (
            <FocusableBox
              key={index}
              href={item.href}
              display="flex"
              flexDirection="column"
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
              <Box
                display="flex"
                flexDirection="row"
                alignItems="flexStart"
                flexGrow={1}
              >
                <Box flexGrow={1}>
                  <Text as="h3" variant="h4" color="dark400">
                    <Hyphen>{item.title}</Hyphen>
                  </Text>
                </Box>
                {item.logoUrl && (
                  <Box marginLeft={2} display="flex" flexShrink={0}>
                    <img
                      src={item.logoUrl}
                      alt={item.logoAlt ?? ''}
                      className={styles.logo}
                    />
                  </Box>
                )}
              </Box>
              {hasTags && (
                <Box paddingTop={2} className={styles.tag}>
                  <Inline space="smallGutter">
                    {item.tags?.map((tag) => (
                      <Tag
                        key={tag.id}
                        outlined
                        variant="blue"
                        truncate
                        textLeft
                        hyphenate
                      >
                        {tag.title}
                      </Tag>
                    ))}
                  </Inline>
                </Box>
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
        <ScrollIndicator
          scrollRef={scrollContainerRef}
          colors={indicator}
        />
      )}
    </>
  )
}

export default OrganizationsSection
