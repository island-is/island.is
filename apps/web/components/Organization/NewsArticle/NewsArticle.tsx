import React from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'

import { GetSingleNewsItemQuery } from '../../../graphql/schema'
import { Slice as SliceType, Image } from '@island.is/island-ui/contentful'
import { webRichText } from '@island.is/web/utils/richText'

interface NewsArticleProps {
  newsItem: GetSingleNewsItemQuery['getSingleNews']
}

export const NewsArticle: React.FC<NewsArticleProps> = ({ newsItem }) => {
  const { format } = useDateUtils()

  const formattedDate = newsItem.date
    ? format(new Date(newsItem.date), 'do MMMM yyyy')
    : ''

  return (
    <Box paddingBottom={[0, 0, 4]}>
      <Text variant="h1" as="h1" paddingBottom={2}>
        {newsItem.title}
      </Text>
      <Text variant="h4" as="p" paddingBottom={2} color="blue400">
        {formattedDate}
      </Text>
      <Text variant="intro" as="p" paddingBottom={2}>
        {newsItem.intro}
      </Text>
      {Boolean(newsItem.image) && (
        <Box paddingY={2}>
          <Image
            {...newsItem.image}
            url={newsItem.image.url + '?w=774&fm=webp&q=80'}
            thumbnail={newsItem.image.url + '?w=50&fm=webp&q=80'}
          />
        </Box>
      )}
      <Box paddingBottom={4} width="full">
        {webRichText(newsItem.content as SliceType[])}
      </Box>
    </Box>
  )
}
