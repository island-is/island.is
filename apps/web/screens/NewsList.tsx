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
import routeNames from '@island.is/web/i18n/routeNames'
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
import { withMainLayout } from '@island.is/web/layouts/main'
import { GET_NEWS_LIST_QUERY } from './queries'
import { NewsListLayout } from './Layouts/Layouts'
import { CustomNextError } from '../units/errors'
import {
  GetNewsListQuery,
  QueryGetNewsListArgs,
  ContentLanguage,
} from '../graphql/schema'
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
  const { makePath } = routeNames(activeLocale)
  const { format } = useDateUtils()

  const dates = dateRange.map((s) => new Date(s))
  const datesByYear = groupBy(dates, (d: Date) => d.getFullYear())

  const years = Object.keys(datesByYear)
  const months = datesByYear[selectedYear] ?? []

  const allYearsString = 'Allar fréttir'
  const allMonthsString = 'Allt árið'

  const yearString = 'Ár'
  const monthString = 'Mánuður'

  const yearOptions = [
    {
      label: allYearsString,
      value: allYearsString,
    },
  ].concat(
    years.map((year) => ({
      label: year,
      value: year,
    })),
  )

  const monthOptions = [
    {
      label: allMonthsString,
      value: undefined,
    },
  ].concat(
    months.map((date) => ({
      label: capitalize(format(date, 'MMMM')),
      value: date.getMonth(),
    })),
  )

  const makeHref = (y: string | number, m?: string | number) => {
    const query: { [k: string]: number | string } = y ? { y } : null
    if (y && m != null) {
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
        value={selectedYear ? selectedYear.toString() : allYearsString}
        options={yearOptions}
        onChange={(e) => {
          const selectedValue =
            e.target.value !== allYearsString ? e.target.value : null
          Router.push(makeHref(selectedValue))
        }}
      />
      {selectedYear && (
        <Typography variant="p" as="p">
          <Link href={makeHref(selectedYear)}>{allMonthsString}</Link>
          {selectedMonth === undefined && <Bullet align="right" />}
        </Typography>
      )}
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
          {selectedYear && (
            <Hidden below="lg">
              <Typography variant="h1" as="h1">
                {selectedYear}
              </Typography>
            </Hidden>
          )}

          <GridColumn hiddenAbove="sm" paddingBottom={1}>
            <Select
              label={yearString}
              placeholder={yearString}
              value={yearOptions.find(
                (option) =>
                  option.value ===
                  (selectedYear ? selectedYear.toString() : allYearsString),
              )}
              options={yearOptions}
              onChange={({ value }: Option) => {
                Router.push(makeHref(value === allYearsString ? null : value))
              }}
              name="year"
            />
          </GridColumn>
          {selectedYear && (
            <GridColumn hiddenAbove="sm">
              <Select
                label={monthString}
                placeholder={monthString}
                value={monthOptions.find((o) => o.value === selectedMonth)}
                options={monthOptions}
                onChange={({ value }: Option) =>
                  Router.push(makeHref(selectedYear, value))
                }
                name="month"
              />
            </GridColumn>
          )}

          {newsList.map((newsItem, index) => (
            <NewsCard
              key={index}
              title={newsItem.title}
              introduction={newsItem.intro}
              slug={newsItem.slug}
              image={newsItem.image}
              as={makePath('news', newsItem.slug)}
              url={makePath('news', '[slug]')}
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
  const year = getIntParam(query.y)
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

  return {
    newsList,
    page,
    selectedYear: year ?? null,
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
