/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import Head from 'next/head'
import {
  Typography,
  Breadcrumbs,
  Box,
  Link,
  GridRow,
  GridColumn,
  Stack,
  GridContainer,
} from '@island.is/island-ui/core'
import { Image } from '@island.is/island-ui/contentful'
import { Screen } from '@island.is/web/types'
import { useI18n } from '@island.is/web/i18n'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import routeNames from '@island.is/web/i18n/routeNames'
import { StandardLayout } from '@island.is/web/screens/Layouts/Layouts'
import { GET_SINGLE_NEWS_ITEM_QUERY } from '@island.is/web/screens/queries'
import { CustomNextError } from '@island.is/web/units/errors'
import { withMainLayout } from '@island.is/web/layouts/main'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import {
  ContentLanguage,
  GetSingleNewsItemQuery,
  QueryGetSingleNewsArgs,
} from '@island.is/web/graphql/schema'
import { RichText } from '../components/RichText/RichText'
import { SidebarBox, Sticky } from '../components'

interface NewsItemProps {
  newsItem: GetSingleNewsItemQuery['getSingleNews']
}

const NewsItem: Screen<NewsItemProps> = ({ newsItem }) => {
  useContentfulId(newsItem?.id)
  const { activeLocale, t } = useI18n()
  const { makePath } = routeNames(activeLocale)
  const { format } = useDateUtils()

  const sidebar = (
    <SidebarBox>
      <Stack space={3}>
        {Boolean(newsItem.author) && (
          <Stack space={1}>
            <Typography variant="eyebrow" as="p" color="blue400">
              {t.author ?? 'Höfundur'}
            </Typography>
            <Typography variant="h5" as="p">
              {newsItem.author.name}
            </Typography>
          </Stack>
        )}
        {Boolean(newsItem.date) && (
          <Stack space={1}>
            <Typography variant="eyebrow" as="p" color="blue400">
              {t.publishDate ?? 'Birt'}
            </Typography>
            <Typography variant="h5" as="p">
              {format(new Date(newsItem.date), 'do MMMM yyyy')}
            </Typography>
          </Stack>
        )}
      </Stack>
    </SidebarBox>
  )

  return (
    <>
      <Head>
        <title>{newsItem.title} | Ísland.is</title>
      </Head>
      <GridContainer>
        <Box paddingTop={[2, 2, 10]} paddingBottom={[0, 0, 10]}>
          <GridRow>
            <GridColumn span={['12/12', '12/12', '8/12', '8/12', '9/12']}>
              <GridRow>
                <GridColumn
                  offset={['0', '0', '0', '0', '1/9']}
                  span={['9/9', '9/9', '9/9', '9/9', '7/9']}
                >
                  <Breadcrumbs>
                    <Link href={makePath()}>Ísland.is</Link>
                    <Link href={makePath('news')}>
                      {t.newsAndAnnouncements}
                    </Link>
                  </Breadcrumbs>
                  <Typography
                    variant="h1"
                    as="h1"
                    paddingTop={1}
                    paddingBottom={2}
                  >
                    {newsItem.title}
                  </Typography>
                  <Typography variant="intro" as="p" paddingBottom={2}>
                    {newsItem.intro}
                  </Typography>
                  {Boolean(newsItem.image) && (
                    <Box paddingY={2}>
                      <Image
                        {...newsItem.image}
                        url={newsItem.image.url + '?w=774&fm=webp&q=80'}
                        thumbnail={newsItem.image.url + '?w=50&fm=webp&q=80'}
                      />
                    </Box>
                  )}
                </GridColumn>
              </GridRow>
              <RichText
                body={newsItem.content}
                config={{ defaultPadding: 4 }}
              />
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '4/12', '4/12', '3/12']}>
              <Sticky>
                <SidebarBox>
                  <Stack space={3}>
                    {Boolean(newsItem.author) && (
                      <Stack space={1}>
                        <Typography variant="eyebrow" as="p" color="blue400">
                          {t.author ?? 'Höfundur'}
                        </Typography>
                        <Typography variant="h5" as="p">
                          {newsItem.author.name}
                        </Typography>
                      </Stack>
                    )}
                    {Boolean(newsItem.date) && (
                      <Stack space={1}>
                        <Typography variant="eyebrow" as="p" color="blue400">
                          {t.publishDate ?? 'Birt'}
                        </Typography>
                        <Typography variant="h5" as="p">
                          {format(new Date(newsItem.date), 'do MMMM yyyy')}
                        </Typography>
                      </Stack>
                    )}
                  </Stack>
                </SidebarBox>
              </Sticky>
            </GridColumn>
          </GridRow>
        </Box>
      </GridContainer>
    </>
  )
}

NewsItem.getInitialProps = async ({ apolloClient, locale, query }) => {
  const {
    data: { getSingleNews: newsItem },
  } = await apolloClient.query<GetSingleNewsItemQuery, QueryGetSingleNewsArgs>({
    query: GET_SINGLE_NEWS_ITEM_QUERY,
    variables: {
      input: {
        slug: query.slug as string,
        lang: locale as ContentLanguage,
      },
    },
  })

  if (!newsItem) {
    throw new CustomNextError(404, 'NewsItem not found')
  }

  return {
    newsItem,
  }
}

export default withMainLayout(NewsItem)
