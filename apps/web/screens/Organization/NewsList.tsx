/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import capitalize from 'lodash/capitalize'
import { useRouter } from 'next/router'
import { Screen } from '../../types'
import {
  Select as NativeSelect,
  OrganizationWrapper,
  NewsCard,
  getThemeConfig,
} from '@island.is/web/components'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import {
  Box,
  Text,
  Stack,
  BreadCrumbItem,
  Divider,
  Pagination,
  Hidden,
  Select,
  Option,
  Link,
  GridColumn,
  NavigationItem,
} from '@island.is/island-ui/core'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  GET_NAMESPACE_QUERY,
  GET_NEWS_DATES_QUERY,
  GET_NEWS_QUERY,
  GET_ORGANIZATION_PAGE_QUERY,
} from '../queries'
import {
  GetNewsDatesQuery,
  QueryGetNewsDatesArgs,
  GetNewsQuery,
  QueryGetNewsArgs,
  ContentLanguage,
  QueryGetNamespaceArgs,
  GetNamespaceQuery,
  Query,
  QueryGetOrganizationPageArgs,
} from '../../graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { useLinkResolver } from '../../hooks/useLinkResolver'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import useLocalLinkTypeResolver from '@island.is/web/hooks/useLocalLinkTypeResolver'

const PERPAGE = 10

interface NewsListProps {
  organizationPage: Query['getOrganizationPage']
  newsList: GetNewsQuery['getNews']['items']
  total: number
  datesMap: { [year: string]: number[] }
  selectedYear: number
  selectedMonth: number
  selectedPage: number
  selectedTag: string
  namespace: GetNamespaceQuery['getNamespace']
}

const NewsList: Screen<NewsListProps> = ({
  organizationPage,
  newsList,
  total,
  datesMap,
  selectedYear,
  selectedMonth,
  selectedPage,
  selectedTag,
  namespace,
}) => {
  const Router = useRouter()
  const { linkResolver } = useLinkResolver()
  const { getMonthByIndex } = useDateUtils()
  const n = useNamespace(namespace)
  useContentfulId(organizationPage.id)
  useLocalLinkTypeResolver()

  const currentNavItem =
    organizationPage.menuLinks.find(
      ({ primaryLink }) => primaryLink.url === Router.asPath,
    )?.primaryLink ??
    organizationPage.secondaryMenu?.childrenLinks.find(
      ({ url }) => url === Router.asPath,
    )

  const newsTitle =
    currentNavItem?.text ??
    newsList[0]?.genericTags.find((x) => x.slug === selectedTag)?.title ??
    n('newsTitle', 'Fréttir og tilkynningar')

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

  const makeHref = (y: number | string, m?: number | string) => {
    const params = { y, m, tag: selectedTag }
    const query = Object.entries(params).reduce((queryObject, [key, value]) => {
      if (value) {
        queryObject[key] = value
      }
      return queryObject
    }, {})

    return {
      pathname: linkResolver('organizationnewsoverview', [
        organizationPage.slug,
      ]).href,
      query,
    }
  }

  const breadCrumbs: BreadCrumbItem[] = [
    {
      title: 'Ísland.is',
      href: linkResolver('homepage').href,
      typename: 'homepage',
    },
    {
      title: organizationPage.title,
      href: linkResolver('organizationpage', [organizationPage.slug]).href,
      typename: 'organizationpage',
    },
  ]

  const sidebar = (
    <Hidden below="md">
      <Box
        background="purple100"
        borderRadius="large"
        padding={4}
        marginTop={4}
      >
        <Stack space={3}>
          <Text variant="h4" as="h1" color="purple600">
            {newsTitle}
          </Text>
          <Divider weight="purple200" />
          <NativeSelect
            name="year"
            value={selectedYear ? selectedYear.toString() : allYearsString}
            options={yearOptions}
            onChange={(e) => {
              const selectedValue =
                e.target.value !== allYearsString ? e.target.value : null
              Router.push(makeHref(selectedValue))
            }}
            color="purple400"
          />
          {selectedYear && (
            <div>
              <Link href={makeHref(selectedYear)}>
                <Text
                  as="span"
                  fontWeight={!selectedMonth ? 'semiBold' : 'regular'}
                >
                  {allMonthsString}
                </Text>
              </Link>
            </div>
          )}
          {months.map((month) => (
            <div key={month}>
              <Link href={makeHref(selectedYear, month)}>
                <Text
                  as="span"
                  fontWeight={selectedMonth === month ? 'semiBold' : 'regular'}
                >
                  {capitalize(getMonthByIndex(month - 1))}
                </Text>
              </Link>
            </div>
          ))}
        </Stack>
      </Box>
    </Hidden>
  )

  const navList: NavigationItem[] = organizationPage.menuLinks.map(
    ({ primaryLink, childrenLinks }) => ({
      title: primaryLink.text,
      href: primaryLink.url,
      active:
        organizationPage.newsTag?.slug === selectedTag &&
        primaryLink.url === Router.asPath,
      items: childrenLinks.map(({ text, url }) => ({
        title: text,
        href: url,
      })),
    }),
  )

  return (
    <OrganizationWrapper
      pageTitle={newsTitle}
      organizationPage={organizationPage}
      breadcrumbItems={breadCrumbs}
      sidebarContent={sidebar}
      navigationData={{
        title: n('navigationTitle', 'Efnisyfirlit'),
        items: navList,
      }}
    >
      <Stack space={[3, 3, 4]}>
        <Text variant="h1" as="h1" marginBottom={2}>
          {newsTitle}
        </Text>
        {selectedYear && (
          <Hidden below="lg">
            <Text variant="h2" as="h2">
              {selectedYear}
            </Text>
          </Hidden>
        )}
        <GridColumn hiddenAbove="sm" paddingTop={4} paddingBottom={1}>
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
            {n('newsListEmptyMonth', 'Engar fréttir fundust í þessum mánuði.')}
          </Text>
        )}
        {newsList.map((newsItem, index) => (
          <NewsCard
            key={index}
            title={newsItem.title}
            introduction={newsItem.intro}
            image={newsItem.image}
            titleAs="h2"
            href={
              linkResolver('organizationnews', [
                organizationPage.slug,
                newsItem.slug,
              ]).href
            }
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
                    pathname: linkResolver('organizationnewsoverview', [
                      organizationPage.slug,
                    ]).href,
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
    </OrganizationWrapper>
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
  const organizationPage = (
    await Promise.resolve(
      apolloClient.query<Query, QueryGetOrganizationPageArgs>({
        query: GET_ORGANIZATION_PAGE_QUERY,
        variables: {
          input: {
            slug: query.slug as string,
            lang: locale as ContentLanguage,
          },
        },
      }),
    )
  ).data.getOrganizationPage
  const tag = (query.tag as string) ?? organizationPage.newsTag?.slug ?? ''
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
          tag,
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
          tag,
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
    organizationPage: organizationPage,
    newsList: organizationPage.newsTag ? newsList : [],
    total,
    selectedYear: year,
    selectedMonth: month,
    selectedTag: tag,
    datesMap: createDatesMap(newsDatesList),
    selectedPage,
    namespace,
    ...getThemeConfig(organizationPage.theme, organizationPage.slug),
  }
}

export default withMainLayout(NewsList)
