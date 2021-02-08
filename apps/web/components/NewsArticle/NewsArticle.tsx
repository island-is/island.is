import React from 'react'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { Main, SidebarBox, Sticky } from '@island.is/web/components'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'

import { GetNamespaceQuery, GetSingleNewsItemQuery } from '../../graphql/schema'
import { Image } from '../../../../libs/island-ui/contentful/src/lib/Image/Image'
import { richText, Slice as SliceType } from '@island.is/island-ui/contentful'
import { useNamespace } from '@island.is/web/hooks'

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

  return (
    <GridContainer id="main-content">
      <Box paddingTop={[2, 2, 10]} paddingBottom={[0, 0, 10]}>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '8/12', '8/12', '9/12']}>
            <Main>
              <GridRow>
                <GridColumn
                  offset={['0', '0', '0', '0', '1/9']}
                  span={['9/9', '9/9', '9/9', '9/9', '7/9']}
                >
                  <Text variant="h1" as="h1" paddingTop={1} paddingBottom={2}>
                    {newsItem.title}
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
                </GridColumn>
              </GridRow>
            </Main>
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '4/12', '4/12', '3/12']}>
            <Sticky>
              <SidebarBox>
                <Stack space={3}>
                  {Boolean(newsItem.author) && (
                    <Stack space={1}>
                      <Text variant="eyebrow" as="p" color="blue400">
                        {n('author', 'Höfundur')}
                      </Text>
                      <Text variant="h5" as="p">
                        {newsItem.author.name}
                      </Text>
                    </Stack>
                  )}
                  {Boolean(newsItem.date) && (
                    <Stack space={1}>
                      <Text variant="eyebrow" as="p" color="blue400">
                        {n('published', 'Birt')}
                      </Text>
                      <Text variant="h5" as="p">
                        {format(new Date(newsItem.date), 'do MMMM yyyy')}
                      </Text>
                    </Stack>
                  )}
                </Stack>
              </SidebarBox>
            </Sticky>
          </GridColumn>
        </GridRow>
      </Box>
    </GridContainer>
  )
}
