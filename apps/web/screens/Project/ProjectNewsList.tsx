import { BreadCrumbItem } from '@island.is/island-ui/core'
import { NewsList } from '@island.is/web/components'
import {
  ContentLanguage,
  GetNamespaceQuery,
  GetNewsDatesQuery,
  GetNewsQuery,
  ProjectPage,
  Query,
  QueryGetNamespaceArgs,
  QueryGetNewsArgs,
  QueryGetNewsDatesArgs,
  QueryGetProjectPageArgs,
} from '@island.is/web/graphql/schema'
import { linkResolver, useNamespaceStrict } from '@island.is/web/hooks'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import { withMainLayout } from '@island.is/web/layouts/main'
import type { Screen } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'
import { Router } from 'express'
import capitalize from 'lodash/capitalize'
import { useRouter } from 'next/router'
import {
  GET_NAMESPACE_QUERY,
  GET_NEWS_DATES_QUERY,
  GET_NEWS_QUERY,
} from '../queries'
import { GET_PROJECT_PAGE_QUERY } from '../queries/Project'
import { ProjectWrapper } from './components/ProjectWrapper'
import { getThemeConfig } from './utils'

const PERPAGE = 10

interface ProjectNewsListProps {
  projectPage: ProjectPage
  newsList: GetNewsQuery['getNews']['items']
  total: number
  datesMap: { [year: string]: number[] }
  selectedYear: number
  selectedMonth: number
  selectedPage: number
  selectedTag: string
  namespace: GetNamespaceQuery['getNamespace']
}

const ProjectNewsList: Screen<ProjectNewsListProps> = ({
  projectPage,
  newsList,
  total,
  datesMap,
  selectedYear,
  selectedMonth,
  selectedPage,
  selectedTag,
  namespace,
}) => {
  const router = useRouter()
  const { getMonthByIndex } = useDateUtils()

  const n = useNamespaceStrict(namespace)

  const breadCrumbs: BreadCrumbItem[] = [
    {
      title: 'Ísland.is',
      href: linkResolver('homepage').href,
      typename: 'homepage',
    },
    {
      title: projectPage.title,
      href: linkResolver('projectnewsoverview', [projectPage.slug]).href,
      typename: 'projectnewsoverview',
    },
  ]

  const currentNavItem = projectPage.sidebarLinks.find(
    ({ primaryLink }) => primaryLink.url === router.asPath,
  )?.primaryLink

  const newsTitle =
    currentNavItem?.text ??
    newsList[0]?.genericTags.find((x) => x.slug === selectedTag)?.title ??
    n('newsTitle', 'Fréttir og tilkynningar')

  const allYearsString = n('allYears', 'Allar fréttir')
  const allMonthsString = n('allMonths', 'Allt árið')
  const yearString = n('year', 'Ár')
  const monthString = n('month', 'Mánuður')

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

  return (
    <ProjectWrapper
      projectPage={projectPage}
      breadcrumbItems={breadCrumbs}
      sidebarNavigationTitle={n('navigationTitle', 'Efnisyfirlit')}
      withSidebar={true}
    >
      <NewsList
        datesMap={datesMap}
        namespace={namespace}
        newsItemLinkType="projectnews"
        newsOverviewUrl={
          linkResolver('projectnewsoverview', [projectPage.slug]).href
        }
        newsList={newsList}
        parentPageSlug={projectPage.slug}
        selectedMonth={selectedMonth}
        selectedPage={selectedPage}
        selectedTag={selectedTag}
        selectedYear={selectedYear}
        total={total}
        yearOptions={yearOptions}
        monthOptions={monthOptions}
        title={newsTitle}
        noNewsFoundForSelectedMonth={n(
          'newsListEmptyMonth',
          'Engar fréttir fundust í þessum mánuði.',
        )}
      />
    </ProjectWrapper>
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

ProjectNewsList.getInitialProps = async ({ apolloClient, query, locale }) => {
  const year = getIntParam(query.y)
  const month = year && getIntParam(query.m)
  const selectedPage = getIntParam(query.page) ?? 1

  const projectPage = (
    await Promise.resolve(
      apolloClient.query<Query, QueryGetProjectPageArgs>({
        query: GET_PROJECT_PAGE_QUERY,
        variables: {
          input: {
            slug: query.slug as string,
            lang: locale as ContentLanguage,
          },
        },
      }),
    )
  ).data?.getProjectPage

  if (!projectPage) {
    throw new CustomNextError(
      404,
      `Could not find project page with slug: ${query.slug}`,
    )
  }

  const tag = (query.tag as string) ?? projectPage?.newsTag?.slug ?? ''

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
    projectPage,
    newsList: projectPage?.newsTag ? newsList : [],
    total,
    selectedYear: year,
    selectedMonth: month,
    selectedTag: tag,
    datesMap: createDatesMap(newsDatesList),
    selectedPage,
    namespace,
    ...getThemeConfig(projectPage?.theme),
  }
}

export default withMainLayout(ProjectNewsList)
