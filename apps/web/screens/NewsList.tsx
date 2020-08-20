/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { groupBy, range, capitalize } from 'lodash'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Head from 'next/head'
import DefaultErrorPage from 'next/error'
import { Screen } from '../types'
import NativeSelect from '../components/Select/Select'
import Bullet from '../components/Bullet/Bullet'
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
  Hidden,
  Select,
  Option,
  Tiles,
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
  selectedYear: number
  selectedMonth: number
}

const NewsList: Screen<NewsListProps> = ({
  newsList,
  page,
  dateRange,
  selectedYear,
  selectedMonth,
}) => {
  const Router = useRouter()
  const { activeLocale } = useI18n()
  const { makePath } = useRouteNames(activeLocale as Locale)
  const { format } = useDateUtils()

  if ((selectedYear || page.page > 1) && newsList.length === 0) {
    return <DefaultErrorPage statusCode={404} />
  }

  const dates = dateRange.map((s) => new Date(s))
  const datesByYear = groupBy(dates, (d: Date) => d.getFullYear())

  const years = Object.keys(datesByYear)
  const months = datesByYear[selectedYear] ?? []

  const yearOptions = years.map((year) => ({
    label: year,
    value: year,
  }))

  const monthOptions = [
    {
      label: 'Allt árið',
      value: undefined,
    },
  ].concat(
    months.map((date) => ({
      label: capitalize(format(date, 'MMMM')),
      value: date.getMonth(),
    })),
  )

  const makeHref = (y: string | number, m?: string | number) => {
    const query: { [k: string]: number | string } = { y }
    if (m != null) {
      query.m = m
    }

    return {
      pathname: makePath('news'),
      query,
    }
  }

  const sidebar = (
    <Stack space={3}>
      <Typography variant="h4" as="h4">
        Fréttir og tilkynningar
      </Typography>
      <Divider weight="alternate" />
      <NativeSelect
        name="year"
        value={selectedYear.toString()}
        options={yearOptions}
        onChange={(e) => Router.push(makeHref(e.target.value))}
      />
      <Typography variant="p" as="p">
        <Link href={makeHref(selectedYear)}>
          <a>Allt árið</a>
        </Link>
        {selectedMonth === undefined && <Bullet align="right" />}
      </Typography>
      {months.map((date: Date) => (
        <Typography key={date.toISOString()} variant="p" as="p">
          <Link href={makeHref(date.getFullYear(), date.getMonth())}>
            <a>{capitalize(format(date, 'MMMM'))}</a>
          </Link>
          {selectedMonth === date.getMonth() && <Bullet align="right" />}
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
            <Link href={makePath('news')}>
              <a>Fréttir og tilkynningar</a>
            </Link>
          </Breadcrumbs>
          <Hidden below="lg">
            <Typography variant="h1" as="h1">
              {selectedYear}
            </Typography>
          </Hidden>

          <Hidden above="md">
            <Tiles space={3} columns={2}>
              <Select
                label="Ár"
                placeholder="Ár"
                value={yearOptions.find(
                  (o) => o.value === selectedYear.toString(),
                )}
                options={yearOptions}
                onChange={({ value }: Option) => Router.push(makeHref(value))}
                name="year"
              />
              <Select
                label="Mánuður"
                placeholder="Allt árið"
                value={monthOptions.find((o) => o.value === selectedMonth)}
                options={monthOptions}
                onChange={({ value }: Option) =>
                  Router.push(makeHref(selectedYear, value))
                }
                name="month"
              />
            </Tiles>
          </Hidden>

          {newsList.map((newsItem) => (
            <NewsListItem key={newsItem.id} newsItem={newsItem} />
          ))}

          <Box paddingTop={8}>
            <Pagination
              {...page}
              linkComp={PageLink}
              makeHref={(p: number) => ({
                pathname: makePath('news'),
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
  const { activeLocale } = useI18n()
  const { makePath } = useRouteNames(activeLocale as Locale)
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
              <Link href={makePath('news', newsItem.slug)}>
                <a>{newsItem.title}</a>
              </Link>
            </Typography>
            <Typography variant="p" as="p">
              {newsItem.intro}
            </Typography>
          </Stack>
        </Column>
        {newsItem.image && (
          <Column width="2/5">
            <Link href={makePath('news', newsItem.slug)}>
              <a>
                <img
                  src={newsItem.image.url + '?w=524'}
                  alt={`Skoða frétt ${newsItem.title}`}
                />
              </a>
            </Link>
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
    selectedYear: year,
    selectedMonth: month,
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

export default NewsList
