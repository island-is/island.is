import React, { useContext } from 'react'
import {
  GridContainer,
  GridColumn,
  GridRow,
  Text,
  Link,
  Button,
  Box,
  Swiper,
  Hidden,
} from '@island.is/island-ui/core'
import routeNames from '@island.is/web/i18n/routeNames'
import { useI18n } from '@island.is/web/i18n'
import { GetNewsQuery } from '@island.is/web/graphql/schema'
import { GlobalContext } from '@island.is/web/context/GlobalContext/GlobalContext'
import { useNamespace } from '@island.is/web/hooks'

import { NewsCard } from '../NewsCard'

// LatestNewsSection on desktop displays latest 3 news cards in grid.
// On mobile it displays 3 news cards in a Swiper.

interface LatestNewsProps {
  label: string
  items: GetNewsQuery['getNews']['items']
}

const LatestNewsSection: React.FC<LatestNewsProps> = ({
  items = [],
  label,
}) => {
  const newsItems = items.slice(0, 3)
  const { activeLocale, t } = useI18n()
  const { globalNamespace } = useContext(GlobalContext)
  const n = useNamespace(globalNamespace)
  const { makePath } = routeNames(activeLocale)

  return (
    <GridContainer>
      <GridRow>
        <GridColumn span={['12/12', '12/12', '6/12']}>
          <Text variant="h3" as="h2" paddingBottom={2}>
            {label}
          </Text>
        </GridColumn>
        <GridColumn paddingBottom={0} span="6/12" hiddenBelow="md">
          <Box display="flex" justifyContent="flexEnd" paddingBottom={2}>
            <Text variant="h5" as="p" paddingBottom={2}>
              <Link href={makePath('news')}>
                <Button
                  icon="arrowForward"
                  iconType="filled"
                  type="button"
                  variant="text"
                >
                  {n('seeMore')}
                </Button>
              </Link>
            </Text>
          </Box>
        </GridColumn>
      </GridRow>
      <Hidden below="lg">
        <GridRow>
          {newsItems.map((newsItem) => {
            return (
              <GridColumn
                span={['12/12', '12/12', '12/12', '4/12']}
                key={newsItem.slug}
              >
                <NewsCard
                  title={newsItem.title}
                  subtitle={newsItem.subtitle}
                  introduction={newsItem.intro}
                  slug={newsItem.slug}
                  readMoreText={t.readMore}
                  image={newsItem.image}
                  tags={newsItem.genericTags.map(({ title }) => ({ title }))}
                  as={makePath('news', newsItem.slug)}
                  url={makePath('news', '[slug]')}
                />
              </GridColumn>
            )
          })}
        </GridRow>
      </Hidden>
      <Hidden above="md">
        <Swiper>
          {newsItems.map((newsItem) => (
            <NewsCard
              key={newsItem.slug}
              title={newsItem.title}
              subtitle={newsItem.subtitle}
              introduction={newsItem.intro}
              slug={newsItem.slug}
              image={newsItem.image}
              tags={newsItem.genericTags.map(({ title }) => ({ title }))}
              as={makePath('news', newsItem.slug)}
              url={makePath('news', '[slug]')}
            />
          ))}
        </Swiper>
      </Hidden>
    </GridContainer>
  )
}

export default LatestNewsSection
