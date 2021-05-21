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
import { NewsCardNew } from '@island.is/web/components'
import { useI18n } from '@island.is/web/i18n'
import { GetNewsQuery } from '@island.is/web/graphql/schema'
import { GlobalContext } from '@island.is/web/context/GlobalContext/GlobalContext'
import { useNamespace } from '@island.is/web/hooks'

import { LinkType, useLinkResolver } from '@island.is/web/hooks/useLinkResolver'

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
    <GridContainer>
      <GridRow>
        <GridColumn span={['12/12', '12/12', '6/12']}>
          <Text variant="h3" as="h2" paddingBottom={2} {...titleProps}>
            {label}
          </Text>
        </GridColumn>
        <GridColumn paddingBottom={0} span="6/12" hiddenBelow="md">
          <Box display="flex" justifyContent="flexEnd" paddingBottom={2}>
            <Link
              href={{
                pathname: linkResolver(overview, parameters).href,
                ...(!!newsTag && { query: { tag: newsTag } }),
              }}
              skipTab
            >
              <Text variant="h5" as="p" paddingBottom={2}>
                <Button
                  icon="arrowForward"
                  iconType="filled"
                  variant="text"
                  as="span"
                >
                  {readMoreText ?? n('seeMore')}
                </Button>
              </Text>
            </Link>
          </Box>
        </GridColumn>
      </GridRow>
      <GridRow>
        {newsItems.map((newsItem) => {
          return (
            <GridColumn
              span={[
                '12/12',
                '12/12',
                '12/12',
                '12/12',
                variant === 'default' ? '4/12' : '6/12',
              ]}
              key={newsItem.slug}
              paddingBottom={2}
            >
              <NewsCardNew
                title={newsItem.title}
                introduction={newsItem.intro}
                readMoreText={t.readMore}
                image={newsItem.image}
                href={
                  linkResolver(linkType, [...parameters, newsItem.slug]).href
                }
              />
            </GridColumn>
          )
        })}
      </GridRow>
    </GridContainer>
  )
}

export default LatestNewsSection
