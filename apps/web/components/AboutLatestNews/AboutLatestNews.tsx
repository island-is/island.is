import React from 'react'
import {
  Text,
  Box,
  Stack,
  GridColumn,
  GridRow,
  Link,
  Button,
} from '@island.is/island-ui/core'
import { NewsCard } from '@island.is/web/components'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import { useNamespace } from '@island.is/web/hooks'
import {
  AllSlicesImageFragment as Image,
  GetNamespaceQuery,
} from '@island.is/web/graphql/schema'
import {
  useLinkResolver,
  LinkResolverResponse,
} from '@island.is/web/hooks/useLinkResolver'

import * as styles from './AboutLatestNews.css'

// This component is used to display latest news on the About page only.
// It's not how we display the latest news on the front page.
// We will probably merge the two later.

export interface LatestNewsItem {
  date: string
  title: string
  intro?: string
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

export const AboutLatestNews = ({
  title,
  news,
  namespace,
}: LatestNewsProps) => {
  const { linkResolver } = useLinkResolver()
  const [first, ...rest] = news
  const n = useNamespace(namespace)

  return (
    <>
      <div className={styles.indent}>
        {Boolean(title) && (
          <Box paddingBottom={[4, 4, 8]}>
            <Text variant="h1" as="h2">
              {title}
            </Text>
          </Box>
        )}
        {first && (
          <BigNewsItem
            news={first}
            link={linkResolver('news', [first.slug])}
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
              introduction={newsItem.intro}
              image={newsItem.image}
              {...linkResolver('news', [newsItem.slug])}
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
  link,
  readMore,
}: {
  news: LatestNewsItem
  link: LinkResolverResponse
  readMore: string
}) => {
  const { format } = useDateUtils()

  return (
    <Stack space={3}>
      {news.image && (
        <Box
          component="img"
          marginTop={4}
          src={`${news.image.url}?fm=webp&q=80`}
          alt={news.image.title}
          borderRadius="large"
          overflow="hidden"
        />
      )}
      <Text variant="eyebrow" color="purple400">
        {format(new Date(news.date), 'do MMMM yyyy')}
      </Text>
      <Text variant="h2" as="h3">
        {news.title}
      </Text>
      <Text variant="intro">{news.intro}</Text>
      <Link {...link}>
        <Button
          as="span"
          icon="arrowForward"
          iconType="filled"
          type="button"
          variant="text"
        >
          {readMore}
        </Button>
      </Link>
    </Stack>
  )
}
