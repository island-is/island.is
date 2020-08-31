/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import {
  Typography,
  Stack,
  Breadcrumbs,
  Box,
  ContentBlock,
} from '@island.is/island-ui/core'
import { Content, Image } from '@island.is/island-ui/contentful'
import { Screen } from '../types'
import { useI18n } from '@island.is/web/i18n'
import { useDateUtils } from '../i18n/useDateUtils'
import useRouteNames from '@island.is/web/i18n/useRouteNames'
import { NewsItemLayout } from './Layouts/Layouts'
import { GET_NEWS_ITEM_QUERY, GET_NAMESPACE_QUERY } from './queries'
import {
  Query,
  ContentLanguage,
  QueryGetNewsArgs,
  QueryGetNamespaceArgs,
} from '@island.is/api/schema'
import { useNamespace } from '../hooks'

interface NewsItemProps {
  newsItem: Query['getNews']
  namespace: { [K: string]: string }
}

const NewsItem: Screen<NewsItemProps> = ({ newsItem, namespace }) => {
  const { activeLocale } = useI18n()
  const { makePath } = useRouteNames(activeLocale)
  const { format } = useDateUtils()
  const n = useNamespace(namespace)

  const sidebar = (
    <Stack space={3}>
      <Stack space={1}>
        <Typography variant="eyebrow" as="p" color="blue400">
          {n('published')}
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
                  <a>{n('listTitle')}</a>
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
                  <Image type="apiImage" image={newsItem.image} />
                </Box>
              )}
            </Stack>
          </ContentBlock>
        </Box>
        <Content document={newsItem.content} />
      </NewsItemLayout>
    </>
  )
}

NewsItem.getInitialProps = async ({ apolloClient, locale, query }) => {
  const [
    {
      data: { getNews: newsItem },
    },
    namespace,
  ] = await Promise.all([
    apolloClient.query<Query, QueryGetNewsArgs>({
      query: GET_NEWS_ITEM_QUERY,
      variables: {
        input: {
          slug: query.slug as string,
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient
      .query<Query, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'Newspages',
            lang: locale,
          },
        },
      })
      .then((variables) => {
        return JSON.parse(variables.data.getNamespace.fields)
      }),
  ])

  return {
    namespace,
    newsItem,
  }
}

export default NewsItem
