/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { groupBy, range, capitalize } from 'lodash'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { Screen } from '../types'
import NativeSelect from '../components/Select/Select'
import Bullet from '../components/Bullet/Bullet'
import { useI18n } from '@island.is/web/i18n'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import useRouteNames from '@island.is/web/i18n/useRouteNames'
import {
  Box,
  Typography,
  Stack,
  Breadcrumbs,
  Divider,
  Pagination,
  Hidden,
  Select,
  Option,
  Link,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import { GET_NEWS_LIST_QUERY } from './queries'
import { NewsListLayout } from './Layouts/Layouts'
import { CustomNextError } from '../units/ErrorBoundary'
import {
  GetNewsListQuery,
  QueryGetNewsListArgs,
  ContentLanguage,
} from '../graphql/schema'
import { withMainLayout } from '../layouts/main'
import { NewsCard } from '../components/NewsCard'

interface NewsListProps {
  newsList: GetNewsListQuery['getNewsList']['news']
  page: GetNewsListQuery['getNewsList']['page']
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
  const { makePath } = useRouteNames(activeLocale)
  const { format } = useDateUtils()

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
        <Link href={makeHref(selectedYear)}>Allt árið</Link>
        {selectedMonth === undefined && <Bullet align="right" />}
      </Typography>
      {months.map((date: Date) => (
        <Typography key={date.toISOString()} variant="p" as="p">
          <Link href={makeHref(date.getFullYear(), date.getMonth())}>
            {capitalize(format(date, 'MMMM'))}
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
            <Link href={makePath()}>Ísland.is</Link>
            <Link href={makePath('news')}>Fréttir og tilkynningar</Link>
          </Breadcrumbs>
          <Hidden below="lg">
            <Typography variant="h1" as="h1">
              {selectedYear}
            </Typography>
          </Hidden>

          <GridRow>
            <GridColumn hideAbove="sm" span="12/12" paddingBottom={1}>
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
            </GridColumn>
            <GridColumn hideAbove="sm" span="12/12">
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
            </GridColumn>
          </GridRow>

          {newsList.map((newsItem) => (
            <NewsCard
              title={newsItem.title}
              introduction={newsItem.intro}
              slug={newsItem.slug}
              image={newsItem.image}
              url={makePath('news', newsItem.slug)}
              date={newsItem.date}
            />
          ))}
          <Box paddingTop={[4, 4, 8]}>
            <Pagination
              {...page}
              renderLink={(page, className, children) => (
                <Link
                  href={{
                    pathname: makePath('news'),
                    query: { ...Router.query, page },
                  }}
                >
                  <span className={className}>{children}</span>
                </Link>
              )}
            />
          </Box>
        </Stack>
      </NewsListLayout>
    </>
  )
}

NewsList.getInitialProps = async ({ apolloClient, locale, query }) => {
  let year = getIntParam(query.y)
  const month = year && getIntParam(query.m)
  const selectedPage = getIntParam(query.page) ?? 1

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
    apolloClient.query<GetNewsListQuery, QueryGetNewsListArgs>({
      query: GET_NEWS_LIST_QUERY,
      variables: {
        input: {
          perPage: 1,
          ascending: true,
        },
      },
    }),
    apolloClient.query<GetNewsListQuery, QueryGetNewsListArgs>({
      query: GET_NEWS_LIST_QUERY,
      variables: {
        input: {
          perPage: 1,
        },
      },
    }),
    apolloClient.query<GetNewsListQuery, QueryGetNewsListArgs>({
      query: GET_NEWS_LIST_QUERY,
      variables: {
        input: {
          lang: locale as ContentLanguage,
          perPage: 10,
          page: selectedPage,
          year,
          month,
        },
      },
    }),
  ])

  if ((year || page.page > 1) && newsList.length === 0) {
    throw new CustomNextError(404)
  }

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

export default withMainLayout(NewsList)
