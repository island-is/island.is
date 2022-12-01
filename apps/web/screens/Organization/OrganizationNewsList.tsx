import { BreadCrumbItem, NavigationItem } from '@island.is/island-ui/core'
import {
  getThemeConfig,
  NewsList,
  OrganizationWrapper,
} from '@island.is/web/components'
import { NewsListSidebar } from '@island.is/web/components'
import {
  GetNamespaceQuery,
  GetNewsDatesQuery,
  GetNewsQuery,
  OrganizationPage,
  Query,
  QueryGetNamespaceArgs,
  QueryGetNewsArgs,
  QueryGetNewsDatesArgs,
  QueryGetOrganizationPageArgs,
} from '@island.is/web/graphql/schema'
import { linkResolver, useNamespaceStrict } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import useLocalLinkTypeResolver from '@island.is/web/hooks/useLocalLinkTypeResolver'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import { withMainLayout } from '@island.is/web/layouts/main'
import type { Screen } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'
import { Locale } from 'locale'
import capitalize from 'lodash/capitalize'
import { useRouter } from 'next/router'
import {
  GET_NAMESPACE_QUERY,
  GET_NEWS_DATES_QUERY,
  GET_NEWS_QUERY,
  GET_ORGANIZATION_PAGE_QUERY,
} from '../queries'

const PERPAGE = 10

interface OrganizationNewsListProps {
  organizationPage: OrganizationPage
  newsList: GetNewsQuery['getNews']['items']
  total: number
  datesMap: { [year: string]: number[] }
  selectedYear: number
  selectedMonth: number
  selectedPage: number
  selectedTag: string
  namespace: GetNamespaceQuery['getNamespace']
  locale: Locale
}

const OrganizationNewsList: Screen<OrganizationNewsListProps> = ({
  organizationPage,
  newsList,
  total,
  datesMap,
  selectedYear,
  selectedMonth,
  selectedPage,
  selectedTag,
  namespace,
  locale,
}) => {
  const router = useRouter()
  const { getMonthByIndex } = useDateUtils()
  useContentfulId(organizationPage.id)
  useLocalLinkTypeResolver()

  const n = useNamespaceStrict(namespace)

  const newsOverviewUrl = linkResolver(
    'organizationnewsoverview',
    [organizationPage.slug],
    locale,
  ).href

  const breadCrumbs: BreadCrumbItem[] = [
    {
      title: 'Ísland.is',
      href: linkResolver('homepage', [], locale).href,
      typename: 'homepage',
    },
    {
      title: organizationPage.title,
      href: linkResolver('organizationpage', [organizationPage.slug], locale)
        .href,
      typename: 'organizationpage',
    },
  ]

  const baseRouterPath = router.asPath.split('?')[0].split('#')[0]

  const currentNavItem =
    organizationPage.menuLinks.find(
      ({ primaryLink }) => primaryLink?.url === baseRouterPath,
    )?.primaryLink ??
    organizationPage.secondaryMenu?.childrenLinks.find(
      ({ url }) => url === baseRouterPath,
    )

  const newsTitle =
    currentNavItem?.text ??
    newsList[0]?.genericTags.find((x) => x.slug === selectedTag)?.title ??
    n('newsTitle', 'Fréttir og tilkynningar')

  const allYearsString = n('allYears', 'Allar fréttir')
  const allMonthsString = n('allMonths', 'Allt árið')
  const years = Object.keys(datesMap)
  const months = datesMap[selectedYear] ?? []

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

  const navList: NavigationItem[] = organizationPage.menuLinks.map(
    ({ primaryLink, childrenLinks }) => ({
      title: primaryLink?.text,
      href: primaryLink?.url,
      active:
        primaryLink?.url === baseRouterPath ||
        childrenLinks.some((link) => link.url === baseRouterPath),
      items: childrenLinks.map(({ text, url }) => ({
        title: text,
        href: url,
        active: url === baseRouterPath,
      })),
    }),
  )

  return (
    <OrganizationWrapper
      pageTitle={newsTitle}
      organizationPage={organizationPage}
      breadcrumbItems={breadCrumbs}
      navigationData={{
        title: n('navigationTitle', 'Efnisyfirlit'),
        items: navList,
      }}
      sidebarContent={
        <NewsListSidebar
          months={months}
          namespace={namespace}
          newsOverviewUrl={newsOverviewUrl}
          selectedMonth={selectedMonth}
          selectedTag={selectedTag}
          selectedYear={selectedYear}
          title={newsTitle}
          yearOptions={yearOptions}
        />
      }
    >
      <NewsList
        namespace={namespace}
        newsItemLinkType="organizationnews"
        newsOverviewUrl={newsOverviewUrl}
        newsList={newsList}
        parentPageSlug={organizationPage.slug}
        selectedMonth={selectedMonth}
        selectedPage={selectedPage}
        selectedTag={selectedTag}
        selectedYear={selectedYear}
        total={total}
        yearOptions={yearOptions}
        monthOptions={monthOptions}
        title={newsTitle}
        newsPerPage={PERPAGE}
      />
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

OrganizationNewsList.getInitialProps = async ({
  apolloClient,
  query,
  locale,
}) => {
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
            lang: locale as Locale,
          },
        },
      }),
    )
  ).data?.getOrganizationPage

  if (!organizationPage) {
    throw new CustomNextError(
      404,
      `Could not find organization page with slug: ${query.slug}`,
    )
  }

  const tag = (query.tag as string) ?? organizationPage?.newsTag?.slug ?? ''

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
          lang: locale as Locale,
          tag,
        },
      },
    }),
    apolloClient.query<GetNewsQuery, QueryGetNewsArgs>({
      query: GET_NEWS_QUERY,
      variables: {
        input: {
          lang: locale as Locale,
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
            lang: locale as Locale,
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
    organizationPage,
    newsList: organizationPage?.newsTag ? newsList : [],
    total,
    selectedYear: year,
    selectedMonth: month,
    selectedTag: tag,
    datesMap: createDatesMap(newsDatesList),
    selectedPage,
    namespace,
    locale: locale as Locale,
    ...getThemeConfig(organizationPage.theme, organizationPage.slug),
  }
}

export default withMainLayout(OrganizationNewsList)
