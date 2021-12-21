import React, { useContext } from 'react'
import {
  GridContainer,
  GridColumn,
  GridRow,
  Text,
  Link,
  Button,
  Box,
} from '@island.is/island-ui/core'
import { GridItems, NewsCard } from '@island.is/web/components'
import { useI18n } from '@island.is/web/i18n'
import { GetNewsQuery } from '@island.is/web/graphql/schema'
import { GlobalContext } from '@island.is/web/context/GlobalContext/GlobalContext'
import { useNamespace } from '@island.is/web/hooks'

import { LinkType, useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import Item from '@island.is/web/components/NewsItems/Item'

// LatestNewsSection on desktop displays latest 3 news cards in grid.
// On mobile it displays 3 news cards in a Swiper.

interface LatestNewsProps {
  label: string
  labelId?: string
  items: GetNewsQuery['getNews']['items']
  linkType?: LinkType
  overview?: LinkType
  parameters?: Array<string>
  newsTag?: string
  readMoreText?: string
  itemMaxDisplayedCount?: number
  variant?: 'default' | 'bigCards'
}

export const LatestNewsSection: React.FC<LatestNewsProps> = ({
  items = [],
  label,
  labelId = '',
  linkType = 'news',
  overview = 'newsoverview',
  parameters = [],
  newsTag,
  readMoreText = '',
  itemMaxDisplayedCount = 3,
  variant = 'default',
}) => {
  const newsItems = items.slice(0, itemMaxDisplayedCount)
  const { t } = useI18n()
  const { globalNamespace } = useContext(GlobalContext)
  const n = useNamespace(globalNamespace)
  const { linkResolver } = useLinkResolver()
  const titleProps = labelId ? { id: labelId } : {}

  return (
    <>
      <GridContainer>
        <Box display="flex" flexDirection="row" justifyContent="spaceBetween">
          <Text variant="h3" as="h2" {...titleProps}>
            {label}
          </Text>
          <Box display={['none', 'none', 'block']}>
            <Link {...linkResolver(overview, parameters)} skipTab>
              <Button
                icon="arrowForward"
                iconType="filled"
                variant="text"
                as="span"
              >
                {readMoreText ?? n('seeMore')}
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
        {newsItems.map(
          (
            { __typename: tn, title, intro, image, slug, date, genericTags },
            index,
          ) => (
            <Item
              key={index}
              date={date}
              heading={title}
              text={intro}
              href={linkResolver(linkType, [...parameters, slug]).href}
              image={image}
              tags={genericTags.map(({ slug, title, __typename: tn }) => {
                return {
                  label: title,
                  href: linkResolver(linkType, [...parameters, slug]).href,
                }
              })}
            />
          ),
        )}
      </GridItems>
    </>
  )
}

export default LatestNewsSection
