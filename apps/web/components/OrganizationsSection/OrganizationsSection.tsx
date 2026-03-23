import { useRef } from 'react'

import {
  Box,
  Button,
  GridContainer,
  Hidden,
  Link,
  Text,
} from '@island.is/island-ui/core'
import { GridItems } from '@island.is/web/components'

import { OrganizationCard } from '../../screens/Organizations/OrganizationCard'
import { ScrollIndicator } from '../GridItems/ScrollIndicator'
import type { ScrollIndicatorColors } from '../GridItems/ScrollIndicator'

const MAX_HOMEPAGE_ITEMS = 8

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
        {items.slice(0, MAX_HOMEPAGE_ITEMS).map((item) => (
          <OrganizationCard
            key={item.href ?? item.title}
            heading={item.title}
            href={item.href}
            src={item.logoUrl}
            alt={item.logoAlt}
            tags={item.tags?.map((t) => ({ id: t.id, label: t.title }))}
          />
        ))}
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

