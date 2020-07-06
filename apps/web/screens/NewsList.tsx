import React, { FC } from 'react'
import { groupBy, range } from 'lodash'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Head from 'next/head'
import DefaultErrorPage from 'next/error'
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
  Divider,
  Columns,
  Column,
  Option,
} from '@island.is/island-ui/core'
import { Sticky } from '@island.is/web/components'
import { GET_NEWS_LIST_QUERY } from './queries'
import { NewsListLayout } from './Layouts/Layouts'
import {
  Query,
  ContentLanguage,
  QueryGetNewsListArgs,
} from '@island.is/api/schema'

const PER_PAGE = 10

interface NewsListProps {
  newsList: any[]
  dateRange: string[]
  year?: number
  month?: number
}

const NewsList: Screen<NewsListProps> = ({
  newsList,
  dateRange,
  year,
  month,
}) => {
  if (year && newsList.length == 0) {
    return <DefaultErrorPage statusCode={404} />
  }

  const Router = useRouter()
  const { activeLocale } = useI18n()
  const { makePath } = useRouteNames(activeLocale as Locale)
  const { format } = useDateUtils()

  const dates = dateRange.map((s) => new Date(s))
  const datesByYear = groupBy(dates, (d) => d.getFullYear())

  const years = Object.keys(datesByYear)
  const months = datesByYear[year] ?? []

  const options = years.map((y) => ({
    label: y,
    value: y,
  }))

  const sidebar = (
    <Stack space={3}>
      <Typography variant="h4" as="h4">
        Fréttir og tilkynningar
      </Typography>
      <Divider weight="alternate" />
      <Select
        value={{ value: '' + year, label: '' + year }}
        name="year"
        options={options}
        onChange={({ value }: Option) => {
          Router.push({
            pathname: '/frett',
            query: { y: value },
          })
        }}
      />
      {months.map((date) => (
        <Typography key={date.toISOString()} variant="p" as="p">
          <Link
            href={{
              pathname: '/frett',
              query: {
                y: date.getFullYear(),
                m: date.getMonth(),
              },
            }}
          >
            <a>{format(date, 'MMMM')}</a>
          </Link>
        </Typography>
      ))}
    </Stack>
  )

  return (
    <>
      <Head>
        <title>Fréttir | Ísland.is</title>
      </Head>
      <NewsListLayout sidebar={sidebar}>
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
            {year}
          </Typography>

          {newsList.map((newsItem) => (
            <NewsListItem newsItem={newsItem} />
          ))}
        </Stack>
      </NewsListLayout>
    </>
  )
}

const NewsListItem = ({ newsItem }) => {
  const { format } = useDateUtils()

  return (
    <Box key={newsItem.id} boxShadow="subtle" padding={6} paddingRight={3}>
      <Columns space={4} collapseBelow="xl">
        <Column>
          <Stack space={2}>
            <Typography variant="eyebrow" as="p" color="purple400">
              {format(new Date(newsItem.date), 'do MMMM yyyy')}
            </Typography>
            <Typography variant="h3" as="h3" color="blue400">
              {newsItem.title}
            </Typography>
            <Typography variant="p" as="p">
              {newsItem.intro}
            </Typography>
          </Stack>
        </Column>
        {newsItem.image && (
          <Column width="2/5">
            <img src={newsItem.image.url + '?w=524'} />
          </Column>
        )}
      </Columns>
    </Box>
  )
}

NewsList.getInitialProps = async ({ apolloClient, locale, query }) => {
  let year = getIntParam(query.y)
  let month = year && getIntParam(query.m)

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
          year,
          month,
        },
      },
    }),
  ])

  // default to year of first result if no year is selected
  if (!year && newsList.length > 0) {
    year = new Date(newsList[0].date).getFullYear()
  }

  return {
    newsList,
    year,
    month,
    dateRange: createDateRange(
      oldest[0] && new Date(oldest[0].date),
      latest[0] && new Date(latest[0].date),
    ),
  }
}

const getIntParam = (s) => {
  const i = parseInt(s, 10)
  if (!isNaN(i)) return i
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
