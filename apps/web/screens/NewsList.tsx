import React, { FC } from 'react'
import { groupBy, range } from 'lodash'
import Link from 'next/link'
import Head from 'next/head'
import cn from 'classnames'
import { Screen } from '../types'
import { withApollo } from '../graphql'
import { useI18n } from '@island.is/web/i18n'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import { Locale } from '@island.is/web/i18n/I18n'
import useRouteNames from '@island.is/web/i18n/useRouteNames'
import {
  ContentBlock,
  Box,
  Typography,
  Stack,
  Breadcrumbs,
  Hidden,
  Select,
  BoxProps,
  Divider,
  Columns,
  Column,
} from '@island.is/island-ui/core'
import { Sticky } from '@island.is/web/components'
import { GET_NEWS_LIST_QUERY } from './queries'
import {
  Query,
  ContentLanguage,
  QueryGetNewsListArgs,
} from '@island.is/api/schema'

import * as styles from './Category/Category.treat'

const PER_PAGE = 10

interface NewsListProps {
  newsList: any[]
  dateRange: string[]
}

const NewsList: Screen<NewsListProps> = ({ newsList, dateRange }) => {
  const { activeLocale } = useI18n()
  const { makePath } = useRouteNames(activeLocale as Locale)
  const { format } = useDateUtils()

  const dates = dateRange.map((s) => new Date(s))
  const datesByYear = groupBy(dates, (d) => d.getFullYear())

  const years = Object.keys(datesByYear)
  const months = datesByYear[years[0]] ?? []

  const options = years.map((y) => ({
    label: y,
    value: y,
  }))

  return (
    <>
      <Head>
        <title>Fréttir | Ísland.is</title>
      </Head>
      <ContentBlock>
        <Box padding={[0, 0, 0, 6]}>
          <div className={styles.layout}>
            <div className={styles.side}>
              <Sticky>
                <Box background="purple100" padding={4}>
                  <Stack space={3}>
                    <Typography variant="h4" as="h4">
                      Fréttir og tilkynningar
                    </Typography>
                    <Divider weight="alternate" />
                    <Select value={options[0]} name="" options={options} />
                    {months.map((date) => (
                      <Typography variant="p" as="p">
                        <Link
                          href={`?y=${date.getFullYear()}&m=${date.getMonth()}`}
                        >
                          <a>{format(date, 'MMMM')}</a>
                        </Link>
                      </Typography>
                    ))}
                  </Stack>
                </Box>
              </Sticky>
            </div>

            <Box paddingLeft={[0, 0, 0, 4]} width="full">
              <Box padding={[3, 3, 6, 0]}>
                <ContentBlock width="small">
                  <Stack space={[3, 3, 4]}>
                    <Breadcrumbs>
                      <Link href={makePath()}>
                        <a>Ísland.is</a>
                      </Link>
                      <Link href={makePath()}>
                        <a>Fréttir og tilkynningar</a>
                      </Link>
                    </Breadcrumbs>
                    <Typography variant="h1" as="h1">
                      {years[0]}
                    </Typography>
                  </Stack>
                </ContentBlock>
              </Box>

              <Box padding={[3, 3, 6, 0]} paddingTop={[3, 3, 6, 6]}>
                <ContentBlock width="small">
                  <Stack space={4}>
                    {newsList.map((newsItem) => (
                      <Box key={newsItem.id} boxShadow="subtle" padding={6}>
                        <Columns space={8} collapseBelow='xl'>
                          <Column>
                            <Stack space={2}>
                              <Typography
                                variant="eyebrow"
                                as="p"
                                color="purple400"
                              >
                                {format(
                                  new Date(newsItem.created),
                                  'do MMMM yyyy',
                                )}
                              </Typography>
                              <Typography variant="h3" as="h3" color="blue400">
                                {newsItem.title}
                              </Typography>
                              <Typography variant="p" as="p">
                                {newsItem.intro}
                              </Typography>
                            </Stack>
                          </Column>
                          <Column>
                            <div
                              style={{
                                width: '100%',
                                height: '100%',
                                backgroundImage: `url(${newsItem.image.url}?w=500)`,
                                backgroundSize: 'contain',
                                backgroundPosition: 'center center',
                                backgroundRepeat: 'no-repeat',
                              }}
                            />
                          </Column>
                        </Columns>
                      </Box>
                    ))}
                  </Stack>
                </ContentBlock>
              </Box>
            </Box>
          </div>
        </Box>
      </ContentBlock>
    </>
  )
}

NewsList.getInitialProps = async ({ apolloClient, locale }) => {
  const [
    {
      data: { getNewsList: oldest },
    },
    {
      data: { getNewsList: latest },
    },
    {
      data: { getNewsList: newsList },
    },
  ] = await Promise.all([
    apolloClient.query<Query, QueryGetNewsListArgs>({
      query: GET_NEWS_LIST_QUERY,
      variables: {
        input: {
          limit: 1,
          ascending: true,
        },
      },
    }),
    apolloClient.query<Query, QueryGetNewsListArgs>({
      query: GET_NEWS_LIST_QUERY,
      variables: {
        input: {
          limit: 1,
        },
      },
    }),
    apolloClient.query<Query, QueryGetNewsListArgs>({
      query: GET_NEWS_LIST_QUERY,
      variables: {
        input: {
          lang: locale as ContentLanguage,
          limit: PER_PAGE,
        },
      },
    }),
  ])

  return {
    newsList,
    dateRange: createDateRange(
      latest[0] && new Date(latest[0].created),
      oldest[0] && new Date(oldest[0].created),
    ),
  }
}

const createDateRange = (min: Date, max: Date): string[] => {
  if (!min || !max) return []

  return range(
    max.getFullYear() * 12 + max.getMonth(),
    min.getFullYear() * 12 + min.getMonth() - 1,
    -1,
  ).map((i) => new Date(Math.floor(i / 12), i % 12).toISOString())
}

export default withApollo(NewsList)
