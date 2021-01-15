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
import { useI18n } from '@island.is/web/i18n'
import { GetOrganizationNewsQuery } from '@island.is/web/graphql/schema'
import { GlobalContext } from '@island.is/web/context/GlobalContext/GlobalContext'
import { useNamespace } from '@island.is/web/hooks'

import { NewsCard } from '../NewsCard'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'

// LatestOrganizationNewsSection on desktop displays latest 3 news cards in grid.
// On mobile it displays 3 news cards in a Swiper.

interface LatestOrganizationNewsProps {
  label: string
  labelId?: string
  items: GetOrganizationNewsQuery['getOrganizationNews']
  subtitle?: string
  organizationSlug: string
}

const LatestOrganizationNewsSection: React.FC<LatestOrganizationNewsProps> = ({
  items = [],
  label,
  labelId = '',
  subtitle = '',
  organizationSlug,
}) => {
  const newsItems = items.slice(0, 3)
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
            <Text variant="h5" as="p" paddingBottom={2}>
              <Link
                {...linkResolver('organizationnewsoverview', [
                  organizationSlug,
                ])}
              >
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
                  subtitle={subtitle}
                  introduction={newsItem.introduction}
                  slug={newsItem.slug}
                  readMoreText={t.readMore}
                  image={newsItem.featuredImage}
                  tags={[]}
                  as={
                    linkResolver('organizationnews', [
                      organizationSlug,
                      newsItem.slug,
                    ]).as
                  }
                  url={
                    linkResolver('organizationnews', [
                      organizationSlug,
                      newsItem.slug,
                    ]).href
                  }
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
              title={newsItem.title}
              subtitle="Sýslumenn"
              introduction={newsItem.introduction}
              slug={newsItem.slug}
              readMoreText={t.readMore}
              image={newsItem.featuredImage}
              tags={[]}
              as={
                linkResolver('organizationnews', [
                  organizationSlug,
                  newsItem.slug,
                ]).as
              }
              url={
                linkResolver('organizationnews', [
                  organizationSlug,
                  newsItem.slug,
                ]).href
              }
            />
          ))}
        </Swiper>
      </Hidden>
    </GridContainer>
  )
}

export default LatestOrganizationNewsSection
