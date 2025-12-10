import { useState } from 'react'
import flatten from 'lodash/flatten'
import { useRouter } from 'next/router'
import { useLazyQuery } from '@apollo/client'

import {
  GridColumn,
  GridContainer,
  GridRow,
  NavigationItem,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import {
  ClickableItem,
  GenericList,
  getThemeConfig,
  OrganizationWrapper,
} from '@island.is/web/components'
import type {
  OrganizationPage,
  Query,
  QueryGetCourseCategoriesArgs,
  QueryGetCoursesArgs,
  QueryGetNamespaceArgs,
  QueryGetOrganizationPageArgs,
} from '@island.is/web/graphql/schema'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'
import { withMainLayout } from '@island.is/web/layouts/main'
import type { Screen, ScreenContext } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'

import { GET_NAMESPACE_QUERY, GET_ORGANIZATION_PAGE_QUERY } from '../../queries'
import {
  GET_COURSE_CATEGORIES_QUERY,
  GET_ORGANIZATION_COURSES_QUERY,
} from '../../queries/Courses'

type CourseListScreenContext = ScreenContext & {
  organizationPage?: Query['getOrganizationPage']
}

export interface CourseListProps {
  organizationPage: OrganizationPage
  namespace: Record<string, string>
  initialItemsResponse: Query['getCourses']
  courseCategories: Query['getCourseCategories']['items']
}

const CourseList: Screen<CourseListProps, CourseListScreenContext> = ({
  organizationPage,
  namespace,
  initialItemsResponse,
  courseCategories,
}) => {
  const { activeLocale } = useI18n()
  const { linkResolver } = useLinkResolver()
  const router = useRouter()

  const pathWithoutQueryParams = router.asPath.split('?')[0]

  const n = useNamespace(namespace)

  const navList: NavigationItem[] = organizationPage.menuLinks.map(
    ({ primaryLink, childrenLinks }) => ({
      title: primaryLink?.text ?? '',
      href: primaryLink?.url ?? '',
      active:
        primaryLink?.url === pathWithoutQueryParams ||
        childrenLinks.some((link) => link.url === pathWithoutQueryParams),
      items: childrenLinks.map(({ text, url }) => ({
        title: text,
        href: url,
        active: url === pathWithoutQueryParams,
      })),
    }),
  )

  const searchQueryId = 'q'
  const pageQueryId = 'page'
  const tagQueryId = 'tag'

  const [itemsResponse, setItemsResponse] = useState<
    Query['getCourses'] | null
  >(initialItemsResponse)
  const [errorOccurred, setErrorOccurred] = useState(false)

  const [fetchListItems, { loading, called }] = useLazyQuery<
    Query,
    QueryGetCoursesArgs
  >(GET_ORGANIZATION_COURSES_QUERY, {
    onCompleted(data) {
      const searchParams = new URLSearchParams(window.location.search)

      const pageQuery = searchParams.get(pageQueryId) || '1'
      const tagQuery = searchParams.get(tagQueryId) || '{}'

      const tags: string[] = flatten(Object.values(JSON.parse(tagQuery)))

      if (
        // Make sure the response matches the request input
        pageQuery === data?.getCourses?.input?.page?.toString() &&
        tags.every((tag) =>
          (data?.getCourses?.input?.categoryKeys ?? []).includes(tag),
        ) &&
        data?.getCourses?.input?.lang === activeLocale &&
        data?.getCourses?.input?.organizationSlug ===
          organizationPage.organization?.slug
      ) {
        setItemsResponse(data.getCourses)
        setErrorOccurred(false)
      }
    },
    onError(_) {
      setErrorOccurred(true)
    },
  })

  const totalItems = itemsResponse?.total ?? 0
  const items = itemsResponse?.items ?? []

  return (
    <OrganizationWrapper
      organizationPage={organizationPage}
      pageTitle={n(
        'courseListPageTitle',
        activeLocale === 'is' ? 'Námskeið' : 'Courses',
      )}
      showReadSpeaker={false}
      breadcrumbItems={[
        {
          title: 'Ísland.is',
          href: linkResolver('homepage').href,
        },
        {
          title: organizationPage.title,
          href: linkResolver('organizationpage', [organizationPage.slug]).href,
        },
      ]}
      navigationData={{
        title: n('navigationTitle', 'Efnisyfirlit'),
        items: navList,
      }}
    >
      <Stack space={3}>
        <Text variant="h1" as="h1">
          {n('courseListPageTitle', 'Námskeið')}
        </Text>
        <GenericList
          filterTags={courseCategories.map((category) => ({
            id: category.key,
            slug: category.key,
            title: category.label,
            genericTagGroup: {
              id: 'course-categories',
              slug: 'course-categories',
              title:
                activeLocale === 'is'
                  ? 'Námskeiðsflokkar'
                  : 'Course Categories',
            },
          }))}
          searchInputPlaceholder={n(
            'courseListSearchInputPlaceholder',
            activeLocale === 'is' ? 'Leit' : 'Search',
          )}
          displayError={errorOccurred}
          fetchListItems={({ page, tags }) => {
            fetchListItems({
              variables: {
                input: {
                  categoryKeys: tags,
                  lang: activeLocale,
                  organizationSlug: organizationPage.organization?.slug,
                  page,
                },
              },
            })
          }}
          totalItems={totalItems}
          loading={loading || !called}
          pageQueryId={pageQueryId}
          searchQueryId={searchQueryId}
          tagQueryId={tagQueryId}
          showSearchInput={false}
          showSearchFilters={true}
        >
          <GridContainer>
            <GridRow rowGap={3}>
              {items.map((item) => (
                <GridColumn key={item.id} span="1/1">
                  <ClickableItem
                    item={{
                      title: item.title,
                      slug: item.id,
                      cardIntro: item.cardIntro,
                      id: item.id,
                      filterTags: item.categories.map((category) => ({
                        id: category.id,
                        slug: category.slug,
                        title: category.title,
                      })),
                    }}
                  />
                </GridColumn>
              ))}
            </GridRow>
          </GridContainer>
        </GenericList>
      </Stack>
    </OrganizationWrapper>
  )
}

CourseList.getProps = async ({
  apolloClient,
  locale,
  query,
  organizationPage,
}) => {
  const querySlugs = (query.slugs ?? []) as string[]
  const [organizationPageSlug] = querySlugs

  const [
    {
      data: { getOrganizationPage },
    },
    namespace,
  ] = await Promise.all([
    !organizationPage
      ? apolloClient.query<Query, QueryGetOrganizationPageArgs>({
          query: GET_ORGANIZATION_PAGE_QUERY,
          variables: {
            input: {
              slug: organizationPageSlug,
              lang: locale,
              subpageSlugs: querySlugs.slice(1),
            },
          },
        })
      : {
          data: { getOrganizationPage: organizationPage },
        },
    apolloClient
      .query<Query, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'OrganizationPages',
            lang: locale,
          },
        },
      })
      .then((variables) =>
        variables?.data?.getNamespace?.fields
          ? JSON.parse(variables.data.getNamespace.fields)
          : {},
      ),
  ])

  if (!getOrganizationPage) {
    throw new CustomNextError(404, 'Organization page not found')
  }

  const organizationSlug = getOrganizationPage.organization?.slug

  const [coursesResponse, courseCategoriesResponse] = await Promise.all([
    apolloClient.query<Query, QueryGetCoursesArgs>({
      query: GET_ORGANIZATION_COURSES_QUERY,
      variables: {
        input: {
          lang: locale,
          organizationSlug,
        },
      },
    }),
    apolloClient.query<Query, QueryGetCourseCategoriesArgs>({
      query: GET_COURSE_CATEGORIES_QUERY,
      variables: {
        input: {
          lang: locale,
          organizationSlug,
        },
      },
    }),
  ])

  return {
    organizationPage: getOrganizationPage,
    namespace,
    initialItemsResponse: coursesResponse.data?.getCourses,
    courseCategories:
      courseCategoriesResponse.data?.getCourseCategories?.items ?? [],
    ...getThemeConfig(
      getOrganizationPage?.theme,
      getOrganizationPage?.organization,
    ),
  }
}

export default withMainLayout(CourseList)
