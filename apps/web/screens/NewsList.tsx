/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { groupBy, range } from 'lodash'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Head from 'next/head'
import DefaultErrorPage from 'next/error'
import { Screen } from '../types'
import Select from '../components/Select/Select'
import { withApollo } from '../graphql'
import { useI18n } from '@island.is/web/i18n'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import { Locale } from '@island.is/web/i18n/I18n'
import useRouteNames from '@island.is/web/i18n/useRouteNames'
import {
  Box,
  Typography,
  Stack,
  Breadcrumbs,
  Divider,
  Columns,
  Column,
  Pagination,
} from '@island.is/island-ui/core'
import { GET_NEWS_LIST_QUERY } from './queries'
import { NewsListLayout } from './Layouts/Layouts'
import {
  Query,
  ContentLanguage,
  QueryGetNewsListArgs,
} from '@island.is/api/schema'

const PageLink = ({ children, href, ...props }) => (
  <Link href={href}>
    <a {...props}>{children}</a>
  </Link>
)

interface NewsListProps {
  newsList: Query['getNewsList']['news']
  page: Query['getNewsList']['page']
  dateRange: string[]
  year?: number
  month?: number
}

const NewsList: Screen<NewsListProps> = ({
  newsList,
  page,
  dateRange,
  year,
  month,
}) => {
  const Router = useRouter()
  const { activeLocale } = useI18n()
  const { makePath } = useRouteNames(activeLocale as Locale)
  const { format } = useDateUtils()

  if ((year || page.page > 1) && newsList.length === 0) {
    return <DefaultErrorPage statusCode={404} />
  }

  const dates = dateRange.map((s) => new Date(s))
  const datesByYear = groupBy(dates, (d: Date) => d.getFullYear())

  const years = Object.keys(datesByYear)
  const months = datesByYear[year] ?? []

  const options = years.map((year) => ({
    label: year,
    value: year,
  }))

  const sidebar = (
    <Stack space={3}>
      <Typography variant="h4" as="h4">
        Fréttir og tilkynningar
      </Typography>
      <Divider weight="alternate" />
      <Select
        name="year"
        value={year.toString()}
        options={options}
        onChange={(e) => {
          Router.push({
            pathname: '/frett',
            query: { y: e.target.value },
          })
        }}
      />

      <Typography variant="p" as="p">
        <Link
          href={{
            pathname: '/frett',
            query: {
              y: year,
            },
          }}
        >
          <a>Allt árið {year}</a>
        </Link>
      </Typography>
      {months.map((date: Date) => (
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
            <NewsListItem key={newsItem.id} newsItem={newsItem} />
          ))}

          <Box paddingTop={8}>
            <Pagination
              {...page}
              linkComp={PageLink}
              makeHref={(p: number) => ({
                pathname: '/frett',
                query: {
                  ...Router.query,
                  page: p,
                },
              })}
            />
          </Box>
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
            <img
              src={newsItem.image.url + '?w=524'}
              alt={newsItem.image.title}
            />
          </Column>
        )}
      </Columns>
    </Box>
  )
}

NewsList.getInitialProps = async ({ apolloClient, locale, query }) => {
  let year = getIntParam(query.y)
  const month = year && getIntParam(query.m)

  const [
    {
      data: {
        getNewsList: { news: oldest },
      },
    },
    {
      data: {
        getNewsList: { news: latest },
      },
    },
    {
      data: {
        getNewsList: { news: newsList, page },
      },
    },
  ] = await Promise.all([
    apolloClient.query<Query, QueryGetNewsListArgs>({
      query: GET_NEWS_LIST_QUERY,
      variables: {
        input: {
          perPage: 1,
          ascending: true,
        },
      },
    }),
    apolloClient.query<Query, QueryGetNewsListArgs>({
      query: GET_NEWS_LIST_QUERY,
      variables: {
        input: {
          perPage: 1,
        },
      },
    }),
    apolloClient.query<Query, QueryGetNewsListArgs>({
      query: GET_NEWS_LIST_QUERY,
      variables: {
        input: {
          lang: locale as ContentLanguage,
          page: getIntParam(query.page) ?? 1,
          perPage: 10,
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
    page,
    year,
    month,
    dateRange: createDateRange(
      oldest[0] && new Date(oldest[0].date),
      latest[0] && new Date(latest[0].date),
    ),
  }
}

const getIntParam = (s: string | string[]) => {
  const i = parseInt(Array.isArray(s) ? s[0] : s, 10)
  if (!isNaN(i)) return i
}

const createDateRange = (min: Date, max: Date): string[] => {
  if (!min || !max) return []

  return range(
    max.getFullYear() * 12 + max.getMonth(),
    min.getFullYear() * 12 + min.getMonth() - 1,
    -1,
  ).map((i: number) => new Date(Math.floor(i / 12), i % 12).toISOString())
}

export default withApollo(NewsList)
