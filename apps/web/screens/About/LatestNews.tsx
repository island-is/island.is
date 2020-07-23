import React, { FC } from 'react'
import cn from 'classnames'
import { News } from '@island.is/api/schema'
import { Typography, Box, Stack, Tiles } from '@island.is/island-ui/core'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import * as styles from './LatestNews.treat'

export interface LatestNewsProps {
  title: string
  newsList: News[]
}

const LatestNews: FC<LatestNewsProps> = ({ title, newsList }) => {
  const [first, ...rest] = newsList

  return (
    <>
      <div className={styles.indent}>
        {Boolean(title) && (
          <Box paddingBottom={6}>
            <Typography variant="h1" as="h2">
              Fréttir og tilkynningar
            </Typography>
          </Box>
        )}
        {first && <BigNewsItem news={first} />}
      </div>
      {rest.length > 0 && (
        <Box paddingTop={15}>
          <Tiles space={3} columns={[1, 1, 2]}>
            {rest.map((news, i) => (
              <NewsItem key={i} news={news} index={i} />
            ))}
          </Tiles>
        </Box>
      )}
    </>
  )
}

const BigNewsItem = ({ news }: { news: News }) => {
  const { format } = useDateUtils()

  return (
    <Stack space={3}>
      <Typography variant="eyebrow" color="purple400">
        {format(new Date(news.date), 'do MMMM yyyy')}
      </Typography>
      <Typography variant="h2" as="h2">
        {news.title}
      </Typography>
      <Typography variant="intro">{news.intro}</Typography>
      {news.image && (
        <Box paddingTop={4}>
          <img src={news.image.url} alt={news.image.title} />
        </Box>
      )}
    </Stack>
  )
}

const NewsItem = ({ news, index }: { news: News, index: number }) => (
  <Box boxShadow="subtle" overflow="hidden" borderRadius="large">
    <img src={news.image.url} alt={news.image.title} />
    <Box paddingX={3} paddingY={4}>
      <Stack space={2}>
        <Typography variant="eyebrow">COVID-19???</Typography>
        <Typography variant="h3" as="h3">
          {news.title}
        </Typography>
        <Typography variant="p">{news.intro}</Typography>
      </Stack>
    </Box>
  </Box>
)

export default LatestNews
