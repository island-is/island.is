/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useEffect } from 'react'
import Head from 'next/head'
import {
  Typography,
  Breadcrumbs,
  Box,
  Link,
  GridRow,
  GridColumn,
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
import {
  ContentLanguage,
  GetSingleNewsItemQuery,
  QueryGetSingleNewsArgs,
} from '@island.is/web/graphql/schema'
import { RichText } from '../components/RichText/RichText'
import { GlobalContext } from '../context'

interface NewsItemProps {
  newsItem: GetSingleNewsItemQuery['getSingleNews']
}

const NewsItem: Screen<NewsItemProps> = ({ newsItem }) => {
  const { activeLocale, t } = useI18n()
  const { makePath } = routeNames(activeLocale)
  const { format } = useDateUtils()
  const { setContentfulId } = useContext(GlobalContext)

  useEffect(() => {
    if (newsItem?.id) {
      setContentfulId(newsItem.id)
    }

    return () => setContentfulId('')
  }, [newsItem])

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
      <StandardLayout sidebar={{ position: 'right', node: null }}>
        <GridRow>
          <GridColumn
            span={['9/9', '9/9', '7/8', '7/8', '7/9']}
            offset={['0', '0', '0', '0', '1/9']}
          >
            <Breadcrumbs>
              <Link href={makePath()}>Ísland.is</Link>
              <Link href={makePath('news')}>{t.newsAndAnnouncements}</Link>
            </Breadcrumbs>
            <Typography variant="h1" as="h1" paddingTop={1} paddingBottom={2}>
              {newsItem.title}
            </Typography>
            <Typography variant="intro" as="p" paddingBottom={2}>
              {newsItem.intro}
            </Typography>
            {Boolean(newsItem.image) && (
              <Box paddingY={2}>
                <Image
                  {...newsItem.image}
                  url={newsItem.image.url + '?w=774'}
                  thumbnail={newsItem.image.url + '?w=50'}
                />
              </Box>
            )}
          </GridColumn>
        </GridRow>
        <RichText body={newsItem.content} />
      </StandardLayout>
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
