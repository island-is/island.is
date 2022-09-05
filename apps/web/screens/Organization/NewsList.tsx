/* eslint-disable jsx-a11y/anchor-is-valid */
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
  QueryGetProjectPageArgs,
  OrganizationPage,
  ProjectPage,
} from '../../graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { LinkType, useLinkResolver } from '../../hooks/useLinkResolver'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import useLocalLinkTypeResolver from '@island.is/web/hooks/useLocalLinkTypeResolver'
import { GET_PROJECT_PAGE_QUERY } from '../queries/Project'
import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { CustomNextError } from '@island.is/web/units/errors'
import { ProjectWrapper } from '../Project/components/ProjectWrapper'

const PERPAGE = 10

interface NewsListProps {
  parentPage: OrganizationPage | ProjectPage
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
  parentPage,
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
  useContentfulId(parentPage.id)
  useLocalLinkTypeResolver()

  const typename =
    (parentPage.__typename?.toLowerCase() as LinkType) ?? 'organizationpage'

  const currentNavItem = getCurrentNavItem(parentPage, Router.asPath)

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

    if (parentPage.__typename === 'ProjectPage') {
      return {
        pathname: linkResolver('projectnewsoverview', [parentPage.slug]).href,
        query,
      }
    }
    return {
      pathname: linkResolver('organizationnewsoverview', [parentPage.slug])
        .href,
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
      title: parentPage.title,
      href: linkResolver(typename, [parentPage.slug]).href,
      typename: typename,
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

  const navList: NavigationItem[] = getSidebarLinks(parentPage).map(
    ({ primaryLink, childrenLinks }) => ({
      title: primaryLink.text,
      href: primaryLink.url,
      active:
        parentPage.newsTag?.slug === selectedTag &&
        primaryLink.url === Router.asPath,
      items: childrenLinks.map(({ text, url }) => ({
        title: text,
        href: url,
      })),
    }),
  )

  const content = (
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
            linkResolver('organizationnews', [parentPage.slug, newsItem.slug])
              .href
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
                    parentPage.slug,
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
  )

  if (parentPage.__typename === 'ProjectPage') {
    return <ProjectWrapper></ProjectWrapper>
  }

  return (
    <OrganizationWrapper
      pageTitle={newsTitle}
      organizationPage={parentPage}
      breadcrumbItems={breadCrumbs}
      sidebarContent={sidebar}
      navigationData={{
        title: n('navigationTitle', 'Efnisyfirlit'),
        items: navList,
      }}
    >
      {content}
    </OrganizationWrapper>
  )
}

const getSidebarLinks = (parentPage: OrganizationPage | ProjectPage) => {
  if ('menuLinks' in parentPage) {
    return parentPage.menuLinks
  }
  return parentPage.sidebarLinks
}

const getCurrentNavItem = (
  parentPage: OrganizationPage | ProjectPage,
  path: string,
) => {
  if (parentPage.__typename === 'ProjectPage') {
    return parentPage.sidebarLinks.find(
      ({ primaryLink }) => primaryLink.url === path,
    )?.primaryLink
  }
  return (
    parentPage.menuLinks.find(({ primaryLink }) => primaryLink.url === path)
      ?.primaryLink ??
    parentPage.secondaryMenu?.childrenLinks.find(({ url }) => url === path)
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

const getParentPage = async (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  pathname: string,
  locale: string,
  slug: string,
) => {
  const pathnameIsForProjectPage =
    (locale === 'is' && pathname.startsWith('/v/')) ||
    (locale === 'en' && pathname.startsWith('/en/p/'))

  if (pathnameIsForProjectPage) {
    const projectPage = (
      await Promise.resolve(
        apolloClient.query<Query, QueryGetProjectPageArgs>({
          query: GET_PROJECT_PAGE_QUERY,
          variables: {
            input: {
              slug: slug,
              lang: locale as ContentLanguage,
            },
          },
        }),
      )
    ).data?.getProjectPage
    return projectPage
  }

  const organizationPage = (
    await Promise.resolve(
      apolloClient.query<Query, QueryGetOrganizationPageArgs>({
        query: GET_ORGANIZATION_PAGE_QUERY,
        variables: {
          input: {
            slug: slug,
            lang: locale as ContentLanguage,
          },
        },
      }),
    )
  ).data?.getOrganizationPage
  return organizationPage
}

NewsList.getInitialProps = async ({
  apolloClient,
  locale,
  query,
  pathname,
}) => {
  const year = getIntParam(query.y)
  const month = year && getIntParam(query.m)
  const selectedPage = getIntParam(query.page) ?? 1

  const parentPage = await getParentPage(
    apolloClient,
    pathname,
    locale,
    query.slug as string,
  )

  if (!parentPage) {
    throw new CustomNextError(
      404,
      `Could not find parent page with slug: ${query.slug}`,
    )
  }

  const tag = (query.tag as string) ?? parentPage?.newsTag?.slug ?? ''

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
          tags: [tag],
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
    parentPage: parentPage,
    newsList: parentPage?.newsTag ? newsList : [],
    total,
    selectedYear: year,
    selectedMonth: month,
    selectedTag: tag,
    datesMap: createDatesMap(newsDatesList),
    selectedPage,
    namespace,
    ...getThemeConfig(parentPage?.theme, parentPage?.slug),
  }
}

export default withMainLayout(NewsList)
