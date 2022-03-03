import React from 'react'

import {
  Image,
  richText,
  Slice as SliceType,
} from '@island.is/island-ui/contentful'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { Main, SidebarBox, Sticky } from '@island.is/web/components'
import { useNamespace } from '@island.is/web/hooks'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'

import {
  GetNamespaceQuery,
  GetSingleNewsItemQuery,
} from '../../../graphql/schema'

interface NewsArticleProps {
  newsItem: GetSingleNewsItemQuery['getSingleNews']
  namespace: GetNamespaceQuery['getNamespace']
}

export const NewsArticle: React.FC<NewsArticleProps> = ({
  newsItem,
  namespace,
}) => {
  const { format } = useDateUtils()
  const n = useNamespace(namespace)

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
        {richText(newsItem.content as SliceType[])}
      </Box>
    </Box>
  )
}
