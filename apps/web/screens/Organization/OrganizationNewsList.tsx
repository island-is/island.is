import { BreadCrumbItem, NavigationItem } from '@island.is/island-ui/core'
import {
  getThemeConfig,
  NewsList,
  OrganizationWrapper,
} from '@island.is/web/components'
import { NewsListSidebar } from '@island.is/web/components'
import {
  GetContentSlugQuery,
  GetContentSlugQueryVariables,
  GetGenericTagBySlugQuery,
  GetGenericTagBySlugQueryVariables,
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
import { LayoutProps, withMainLayout } from '@island.is/web/layouts/main'
import type { Screen } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'
import { Locale } from 'locale'
import capitalize from 'lodash/capitalize'
import { useRouter } from 'next/router'
import {
  GET_CONTENT_SLUG,
  GET_NAMESPACE_QUERY,
  GET_NEWS_DATES_QUERY,
  GET_NEWS_QUERY,
  GET_ORGANIZATION_PAGE_QUERY,
} from '../queries'
import { GET_GENERIC_TAG_BY_SLUG_QUERY } from '../queries/GenericTag'

const PERPAGE = 10

interface OrganizationNewsListProps {
  organizationPage: OrganizationPage
  newsList: GetNewsQuery['getNews']['items']
  total: number
  datesMap: { [year: string]: number[] }
  selectedYear: number
  selectedMonth: number
  selectedPage: number
  selectedTag: string | string[]
  namespace: GetNamespaceQuery['getNamespace']
  locale: Locale
}
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore make web strict
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
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
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
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      pageTitle={newsTitle}
      organizationPage={organizationPage}
      showReadSpeaker={false}
      breadcrumbItems={breadCrumbs}
      navigationData={{
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        title: n('navigationTitle', 'Efnisyfirlit'),
        items: navList,
      }}
      sidebarContent={
        <NewsListSidebar
          months={months}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore make web strict
          namespace={namespace}
          newsOverviewUrl={newsOverviewUrl}
          selectedMonth={selectedMonth}
          selectedTag={selectedTag}
          selectedYear={selectedYear}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore make web strict
          title={newsTitle}
          yearOptions={yearOptions}
        />
      }
    >
      <NewsList
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        title={newsTitle}
        newsPerPage={PERPAGE}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        newsTags={organizationPage.secondaryNewsTags}
      />
    </OrganizationWrapper>
  )
}

const createDatesMap = (datesList: string[]) => {
  return datesList.reduce(
    (datesMap: Record<string, number[]>, date: string) => {
      const [year, month] = date.split('-')
      if (datesMap[year]) {
        datesMap[year].push(parseInt(month)) // we can assume each month only appears once
      } else {
        datesMap[year] = [parseInt(month)]
      }
      return datesMap
    },
    {},
  )
}

const getIntParam = (s: string | string[]) => {
  const i = parseInt(Array.isArray(s) ? s[0] : s, 10)
  if (!isNaN(i)) return i
}
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore make web strict
OrganizationNewsList.getProps = async ({ apolloClient, query, locale }) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  const year = getIntParam(query.y)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  const month = year && getIntParam(query.m)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
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

  const newsTags = query.tag
    ? Array.isArray(query.tag)
      ? query.tag
      : [query.tag]
    : []
  const organizationSlug = organizationPage.organization?.slug

  const [
    {
      data: { getNewsDates: newsDatesList },
    },
    {
      data: {
        getNews: { items: newsList, total },
      },
    },
    genericTagResponse,
    namespace,
  ] = await Promise.all([
    apolloClient.query<GetNewsDatesQuery, QueryGetNewsDatesArgs>({
      query: GET_NEWS_DATES_QUERY,
      variables: {
        input: {
          lang: locale as Locale,
          tags: newsTags,
          organization: organizationSlug,
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
          tags: newsTags,
          organization: organizationSlug,
        },
      },
    }),
    query.tag
      ? apolloClient.query<
          GetGenericTagBySlugQuery,
          GetGenericTagBySlugQueryVariables
        >({
          query: GET_GENERIC_TAG_BY_SLUG_QUERY,
          variables: {
            input: {
              lang: locale as Locale,
              slug: query.tag as string,
            },
          },
        })
      : null,
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
      .then((variables) =>
        variables.data.getNamespace?.fields
          ? JSON.parse(variables.data.getNamespace.fields)
          : {},
      ),
  ])

  const genericTag = genericTagResponse?.data?.getGenericTagBySlug

  const languageToggleQueryParams: LayoutProps['languageToggleQueryParams'] = {
    en: {},
    is: {},
    [locale as Locale]: genericTag?.slug ? { tag: genericTag.slug } : {},
  }

  if (genericTag?.id) {
    const contentSlugResponse = await apolloClient.query<
      GetContentSlugQuery,
      GetContentSlugQueryVariables
    >({
      query: GET_CONTENT_SLUG,
      variables: {
        input: {
          id: genericTag.id,
        },
      },
    })

    const slugs = contentSlugResponse?.data?.getContentSlug?.slug ?? {
      en: '',
      is: '',
    }

    for (const lang of Object.keys(slugs)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      languageToggleQueryParams[lang as Locale] = { tag: slugs[lang] }
    }
  }

  return {
    organizationPage,
    newsList: newsList ?? [],
    total,
    selectedYear: year,
    selectedMonth: month,
    selectedTag: newsTags,
    datesMap: createDatesMap(newsDatesList),
    selectedPage,
    namespace,
    locale: locale as Locale,
    languageToggleQueryParams,
    ...getThemeConfig(organizationPage?.theme, organizationPage?.organization),
  }
}

export default withMainLayout(OrganizationNewsList)
