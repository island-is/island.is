import React, { FC } from 'react'
import {
  Typography,
  Box,
  Stack,
  GridColumn,
  GridRow,
  ArrowLink,
} from '@island.is/island-ui/core'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'

import { Image } from '../../graphql/schema'
import * as styles from './AboutLatestNews.treat'
import NewsCard from '../NewsCard/NewsCard'
import { useNamespace } from '@island.is/web/hooks'
import routeNames from '@island.is/web/i18n/routeNames'
import { useI18n } from '@island.is/web/i18n'
import { GetNamespaceQuery } from '@island.is/web/graphql/schema'

// This component is used to display latest news on the About page only.
// It's not how we display the latest news on the front page.
// We will probably merge the two later.

export interface LatestNewsItem {
  date: string
  title: string
  intro: string
  image?: Image
  slug: string
  content?: string
  subtitle?: string
}

export interface LatestNewsProps {
  title: string
  news: LatestNewsItem[]
  namespace: GetNamespaceQuery['getNamespace']
}

export const AboutLatestNews: FC<LatestNewsProps> = ({
  title,
  news,
  namespace,
}) => {
  const { activeLocale } = useI18n()
  const { makePath } = routeNames(activeLocale)
  const [first, ...rest] = news
  const n = useNamespace(namespace)

  return (
    <>
      <div className={styles.indent}>
        {Boolean(title) && (
          <Box paddingBottom={[4, 4, 8]}>
            <Typography variant="h1" as="h2">
              {title}
            </Typography>
          </Box>
        )}
        {first && (
          <BigNewsItem
            news={first}
            href={makePath('news', '[slug]')}
            as={makePath('news', first.slug)}
            readMore={n('readMore', 'Lesa nánar')}
          />
        )}
      </div>
      <GridRow>
        {rest.map((newsItem, index) => (
          <GridColumn
            key={index}
            span={['1/1', '1/1', '1/2']}
            paddingTop={[7, 7, 15]}
          >
            <NewsCard
              key={index}
              title={newsItem.title}
              subtitle={newsItem.subtitle}
              introduction={newsItem.intro}
              slug={newsItem.slug}
              image={newsItem.image}
              url={makePath('news', '[slug]')}
              as={makePath('news', newsItem.slug)}
              readMoreText={n('readMore', 'Lesa nánar')}
            />
          </GridColumn>
        ))}
      </GridRow>
    </>
  )
}

const BigNewsItem = ({
  news,
  as,
  href,
  readMore,
}: {
  news: LatestNewsItem
  as: string
  href: string
  readMore: string
}) => {
  const { format } = useDateUtils()

  return (
    <Stack space={3}>
      {news.image && (
        <Box
          component="img"
          marginTop={4}
          src={news.image.url}
          alt={news.image.title}
          borderRadius="large"
          overflow="hidden"
        />
      )}
      <Typography variant="eyebrow" color="purple400">
        {format(new Date(news.date), 'do MMMM yyyy')}
      </Typography>
      <Typography variant="h2" as="h3">
        {news.title}
      </Typography>
      <Typography variant="intro">{news.intro}</Typography>
      <ArrowLink as={as} href={href}>
        {readMore}
      </ArrowLink>
    </Stack>
  )
}
