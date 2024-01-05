import React, { FC } from 'react'
import { Text, Box, Stack, Tiles } from '@island.is/island-ui/core'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import { Image } from '@island.is/api/schema'
import * as styles from './LatestNews.css'

export interface LatestNewsItem {
  date: string | Date
  title: string
  intro: string
  image?: Image
}

export interface LatestNewsProps {
  title: string
  news: LatestNewsItem[]
}

export const LatestNews: FC<React.PropsWithChildren<LatestNewsProps>> = ({
  title,
  news,
}) => {
  const [first, ...rest] = news

  return (
    <>
      <div className={styles.indent}>
        {Boolean(title) && (
          <Box paddingBottom={6}>
            <Text variant="h1" as="h2">
              {title}
            </Text>
          </Box>
        )}
        {first && <BigNewsItem news={first} />}
      </div>
      {rest.length > 0 && (
        <Box paddingTop={15}>
          <Tiles space={3} columns={[1, 1, 2]}>
            {rest.map((news, i) => (
              <NewsItem key={i} news={news} />
            ))}
          </Tiles>
        </Box>
      )}
    </>
  )
}

const BigNewsItem = ({ news }: { news: LatestNewsItem }) => {
  const { format } = useDateUtils()

  return (
    <Stack space={2}>
      <Text variant="eyebrow" color="purple400">
        {format(new Date(news.date), 'do MMMM yyyy')}
      </Text>
      <Text variant="h2" as="h2">
        {news.title}
      </Text>
      <Text variant="intro">{news.intro}</Text>
      {news.image && (
        <Box paddingTop={4}>
          <img src={news.image.url} alt={news.image.title} />
        </Box>
      )}
    </Stack>
  )
}

const NewsItem = ({ news }: { news: LatestNewsItem }) => (
  <Box boxShadow="subtle" overflow="hidden" borderRadius="large">
    <img src={news.image?.url} alt={news.image?.title ?? ''} />
    <Box paddingX={3} paddingY={4}>
      <Stack space={2}>
        <Text variant="eyebrow">COVID-19???</Text>
        <Text variant="h3" as="h3">
          {news.title}
        </Text>
        <Text>{news.intro}</Text>
      </Stack>
    </Box>
  </Box>
)

export default LatestNews
