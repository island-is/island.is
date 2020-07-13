/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Screen } from '../types'
import { withApollo } from '../graphql'
import { useI18n } from '@island.is/web/i18n'
import { Locale } from '@island.is/web/i18n/I18n'
import { useDateUtils } from '../i18n/useDateUtils'
import useRouteNames from '@island.is/web/i18n/useRouteNames'
import ArticleContent from '../units/Content/ArticleContent'
import {
  Typography,
  Stack,
  Breadcrumbs,
  Box,
  ContentBlock,
} from '@island.is/island-ui/core'
import { NewsItemLayout } from './Layouts/Layouts'
import { GET_NEWS_ITEM_QUERY } from './queries'
import { Query, ContentLanguage, QueryGetNewsArgs } from '@island.is/api/schema'

interface NewsItemProps {
  newsItem: Query['getNews']
}

const NewsItem: Screen<NewsItemProps> = ({ newsItem }) => {
  const { activeLocale } = useI18n()
  const { makePath } = useRouteNames(activeLocale as Locale)
  const { format } = useDateUtils()

  const sidebar = (
    <Stack space={3}>
      <Stack space={1}>
        <Typography variant="eyebrow" as="p" color="blue400">
          Höfundur
        </Typography>
        <Typography variant="h5" as="p">
          Jón Jónsson
        </Typography>
      </Stack>
      <Stack space={1}>
        <Typography variant="eyebrow" as="p" color="blue400">
          Birt
        </Typography>
        <Typography variant="h5" as="p">
          {format(new Date(newsItem.date), 'do MMMM yyyy')}
        </Typography>
      </Stack>
    </Stack>
  )

  return (
    <>
      <Head>
        <title>{newsItem.title} | Ísland.is</title>
      </Head>
      <NewsItemLayout sidebar={sidebar}>
        <Box padding={[3, 3, 6, 0]} paddingBottom={0}>
          <ContentBlock width="small">
            <Stack space={3}>
              <Breadcrumbs>
                <Link href={makePath()}>
                  <a>Ísland.is</a>
                </Link>
                <Link href={makePath('news')}>
                  <a>Fréttir og tilkynningar</a>
                </Link>
              </Breadcrumbs>
              <Box paddingTop={1}>
                <Typography variant="h1" as="h1">
                  {newsItem.title}
                </Typography>
              </Box>
              <Typography variant="intro" as="p">
                {newsItem.intro}
              </Typography>
              {Boolean(newsItem.image) && (
                <Box paddingY={2}>
                  <img
                    src={newsItem.image.url + '?w=774'}
                    alt={newsItem.image.title}
                  />
                </Box>
              )}
            </Stack>
          </ContentBlock>
        </Box>
        <ArticleContent
          document={newsItem.content}
          locale={activeLocale as Locale}
        />
      </NewsItemLayout>
    </>
  )
}

NewsItem.getInitialProps = async ({ apolloClient, locale, query }) => {
  const {
    data: { getNews: newsItem },
  } = await apolloClient.query<Query, QueryGetNewsArgs>({
    query: GET_NEWS_ITEM_QUERY,
    variables: {
      input: {
        slug: query.slug as string,
        lang: locale as ContentLanguage,
      },
    },
  })

  return {
    newsItem,
  }
}

export default withApollo(NewsItem)
