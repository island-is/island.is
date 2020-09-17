/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import Head from 'next/head'
import { Typography, Breadcrumbs, Box, Link } from '@island.is/island-ui/core'
import { Content, Image } from '@island.is/island-ui/contentful'
import { Screen } from '../types'
import { useI18n } from '@island.is/web/i18n'
import { useDateUtils } from '../i18n/useDateUtils'
import useRouteNames from '@island.is/web/i18n/useRouteNames'
import { NewsItemLayout } from './Layouts/Layouts'
import { withMainLayout } from '../layouts/main'
import { GET_SINGLE_NEWS_ITEM_QUERY } from './queries'
import { CustomNextError } from '@island.is/web/units/errors'
import {
  ContentLanguage,
  GetSingleNewsItemQuery,
  QueryGetSingleNewsArgs,
} from '../graphql/schema'

interface NewsItemProps {
  newsItem: GetSingleNewsItemQuery['getSingleNews']
}

const NewsItem: Screen<NewsItemProps> = ({ newsItem }) => {
  const { activeLocale } = useI18n()
  const { makePath } = useRouteNames(activeLocale)
  const { format } = useDateUtils()

  const sidebar = (
    <Box>
      <Typography variant="eyebrow" as="p" color="blue400" paddingBottom={1}>
        Höfundur
      </Typography>
      <Typography variant="h5" as="p" paddingBottom={2}>
        Jón Jónsson
      </Typography>
      <Typography variant="eyebrow" as="p" color="blue400" paddingBottom={1}>
        Birt
      </Typography>
      <Typography variant="h5" as="p" paddingBottom={2}>
        {format(new Date(newsItem.date), 'do MMMM yyyy')}
      </Typography>
    </Box>
  )

  return (
    <>
      <Head>
        <title>{newsItem.title} | Ísland.is</title>
      </Head>
      <NewsItemLayout>
        <Breadcrumbs>
          <Link href={makePath()}>Ísland.is</Link>
          <Link href={makePath('news')}>Fréttir og tilkynningar</Link>
        </Breadcrumbs>
        <Typography variant="h1" as="h1" paddingTop={1} paddingBottom={2}>
          {newsItem.title}
        </Typography>
        <Typography variant="intro" as="p" paddingBottom={2}>
          {newsItem.intro}
        </Typography>
        {Boolean(newsItem.image) && (
          <Box paddingY={2}>
            <Image type="apiImage" image={newsItem.image} />
          </Box>
        )}
        <Content document={newsItem.content} />
      </NewsItemLayout>
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
