/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import capitalize from 'lodash/capitalize'
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
  Text,
  Stack,
  Breadcrumbs,
  Divider,
  Pagination,
  Hidden,
  Select,
  Option,
  Link,
  GridColumn,
} from '@island.is/island-ui/core'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  GET_NAMESPACE_QUERY,
  GET_NEWS_DATES_QUERY,
  GET_NEWS_QUERY,
} from './queries'
import { NewsListLayout } from './Layouts/Layouts'
import {
  GetNewsDatesQuery,
  QueryGetNewsDatesArgs,
  GetNewsQuery,
  QueryGetNewsArgs,
  ContentLanguage,
  QueryGetNamespaceArgs,
  GetNamespaceQuery,
} from '../graphql/schema'
import { NewsCard } from '../components/NewsCard'
import { useNamespace } from '@island.is/web/hooks'

const PERPAGE = 10

interface NewsListProps {
  newsList: GetNewsQuery['getNews']['items']
  total: number
  datesMap: { [year: string]: number[] }
  selectedYear: number
  selectedMonth: number
  selectedPage: number
  namespace: GetNamespaceQuery['getNamespace']
}

const NewsList: Screen<NewsListProps> = ({
  newsList,
  total,
  datesMap,
  selectedYear,
  selectedMonth,
  selectedPage,
  namespace,
}) => {
  const Router = useRouter()
  const { activeLocale } = useI18n()
  const { makePath } = routeNames(activeLocale)
  const { getMonthByIndex } = useDateUtils()
  const n = useNamespace(namespace)

  const years = Object.keys(datesMap)
  const months = datesMap[selectedYear] ?? []

  const allYearsString = n('allYears', 'Allar fréttir')
  const allMonthsString = n('allMonths', 'Allt árið')
  const yearString = n('year', 'Ár')
  const monthString = n('month', 'Mánuður')

  const yearOptions = [
    {
      label: allYearsString,
      value: allYearsString,
    },
    ...years.map((year) => ({
      label: year,
      value: year,
    })),
  ]

  const monthOptions = [
    {
      label: allMonthsString,
      value: undefined,
    },
    ...months.map((month) => ({
      label: capitalize(getMonthByIndex(month - 1)), // api returns months with index starting from 1 not 0 so we compensate
      value: month,
    })),
  ]

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
      <Text variant="h4" as="h1">
        {n('newsTitle', 'Fréttir og tilkynningar')}
      </Text>
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
        <div>
          <Link href={makeHref(selectedYear)}>
            <Text as="span">{allMonthsString}</Text>
          </Link>
          <Text as="span">
            {selectedMonth === undefined && <Bullet align="right" />}
          </Text>
        </div>
      )}
      {months.map((month) => (
        <div key={month}>
          <Link href={makeHref(selectedYear, month)}>
            <Text as="span">{capitalize(getMonthByIndex(month - 1))}</Text>
          </Link>
          <Text as="span">
            {selectedMonth === month && <Bullet align="right" />}
          </Text>
        </div>
      ))}
    </Stack>
  )

  return (
    <>
      <Head>
        <title>{n('pageTitle')} | Ísland.is</title>
      </Head>
      <NewsListLayout sidebar={sidebar}>
        <Stack space={[3, 3, 4]}>
          <Breadcrumbs>
            <Link href={makePath()}>Ísland.is</Link>
            <Link href={makePath('news')}>
              {n('newsTitle', 'Fréttir og tilkynningar')}
            </Link>
          </Breadcrumbs>
          {selectedYear && (
            <Hidden below="lg">
              <Text variant="h1" as="h1">
                {selectedYear}
              </Text>
            </Hidden>
          )}

          <GridColumn hiddenAbove="sm" paddingBottom={1}>
            <Select
              label={yearString}
              placeholder={yearString}
              isSearchable={false}
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
          {!newsList.length && (
            <Text variant="h4">
              {n(
                'newsListEmptyMonth',
                'Engar fréttir fundust í þessum mánuði.',
              )}
            </Text>
          )}
          {newsList.map((newsItem, index) => (
            <NewsCard
              key={index}
              title={newsItem.title}
              introduction={newsItem.intro}
              slug={newsItem.slug}
              image={newsItem.image}
              as={makePath('news', newsItem.slug)}
              titleAs="h2"
              url={makePath('news', '[slug]')}
              date={newsItem.date}
              readMoreText={n('readMore', 'Lesa nánar')}
            />
          ))}
          {newsList.length > 0 && (
            <Box paddingTop={[4, 4, 8]}>
              <Pagination
                totalPages={Math.ceil(total / PERPAGE)}
                page={selectedPage}
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
          )}
        </Stack>
      </NewsListLayout>
    </>
  )
}

const createDatesMap = (datesList) => {
  return datesList.reduce((datesMap, date) => {
    const [year, month] = date.split('-')
    if (datesMap[year]) {
      datesMap[year].push(parseInt(month)) // we can assume each month only appears once
    } else {
      datesMap[year] = [parseInt(month)]
    }
    return datesMap
  }, {})
}

const getIntParam = (s: string | string[]) => {
  const i = parseInt(Array.isArray(s) ? s[0] : s, 10)
  if (!isNaN(i)) return i
}

NewsList.getInitialProps = async ({ apolloClient, locale, query }) => {
  const year = getIntParam(query.y)
  const month = year && getIntParam(query.m)
  const selectedPage = getIntParam(query.page) ?? 1

  const [
    {
      data: { getNewsDates: newsDatesList },
    },
    {
      data: {
        getNews: { items: newsList, total },
      },
    },
    namespace,
  ] = await Promise.all([
    apolloClient.query<GetNewsDatesQuery, QueryGetNewsDatesArgs>({
      query: GET_NEWS_DATES_QUERY,
      variables: {
        input: {
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient.query<GetNewsQuery, QueryGetNewsArgs>({
      query: GET_NEWS_QUERY,
      variables: {
        input: {
          lang: locale as ContentLanguage,
          size: PERPAGE,
          page: selectedPage,
          year,
          month,
        },
      },
    }),
    apolloClient
      .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            lang: locale as ContentLanguage,
            namespace: 'NewsList',
          },
        },
      })
      .then((variables) => {
        // map data here to reduce data processing in component
        return JSON.parse(variables.data.getNamespace.fields)
      }),
  ])

  return {
    newsList,
    total,
    selectedYear: year,
    selectedMonth: month,
    datesMap: createDatesMap(newsDatesList),
    selectedPage,
    namespace,
  }
}

export default withMainLayout(NewsList)
