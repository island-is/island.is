import { useState } from 'react'
import { useRouter } from 'next/router'

import {
  GridColumn,
  GridContainer,
  GridRow,
  NavigationItem,
} from '@island.is/island-ui/core'
import { GenericList, OrganizationWrapper } from '@island.is/web/components'
import type {
  OrganizationPage,
  Query,
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
import { GET_ORGANIZATION_COURSES_QUERY } from '../../queries/Courses'

type CourseListScreenContext = ScreenContext & {
  organizationPage?: Query['getOrganizationPage']
}

export interface CourseListProps {
  organizationPage: OrganizationPage
  namespace: Record<string, string>
}

const CourseList: Screen<CourseListProps, CourseListScreenContext> = ({
  organizationPage,
  namespace,
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
  const categoryQueryId = 'category'

  const [itemsResponse, setItemsResponse] =
    useState<GenericListItemResponse | null>(null)
  const [errorOccurred, setErrorOccurred] = useState(false)

  const [fetchListItems, { loading, called }] = useLazyQuery<
    Query,
    GetGenericListItemsQueryVariables
  >(GET_GENERIC_LIST_ITEMS_QUERY, {
    onCompleted(data) {
      const searchParams = new URLSearchParams(window.location.search)

      const queryString = searchParams.get(searchQueryId) || ''
      const pageQuery = searchParams.get(pageQueryId) || '1'
      const tagQuery = searchParams.get(tagQueryId) || '{}'

      const tags: string[] = flatten(Object.values(JSON.parse(tagQuery)))

      if (
        // Make sure the response matches the request input
        queryString === data?.getGenericListItems?.input?.queryString &&
        pageQuery === data?.getGenericListItems?.input?.page?.toString() &&
        tags.every((tag) =>
          (data?.getGenericListItems?.input?.tags ?? []).includes(tag),
        )
      ) {
        setItemsResponse(data.getGenericListItems)
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
      <GenericList
        filterTags={[]}
        searchInputPlaceholder={n(
          'courseListSearchInputPlaceholder',
          activeLocale === 'is' ? 'Leit' : 'Search',
        )}
        displayError={errorOccurred}
        fetchListItems={({ page, searchValue, tags, tagGroups }) => {
          //   fetchListItems({
          //     variables: {
          //       input: {
          //         genericListId: id,
          //         size: ITEMS_PER_PAGE,
          //         lang: activeLocale,
          //         page: page,
          //         queryString: searchValue,
          //         tags,
          //         tagGroups,
          //         orderBy,
          //       },
          //     },
          //   })
        }}
        totalItems={totalItems}
        loading={loading || !called}
        pageQueryId={pageQueryId}
        searchQueryId={searchQueryId}
        tagQueryId={categoryQueryId}
        showSearchInput={false}
      >
        <GridContainer>
          <GridRow rowGap={3}>
            {items.map(() => (
              <GridColumn key={item.id} span="1/1">
                <div>...</div>
              </GridColumn>
            ))}
          </GridRow>
        </GridContainer>
      </GenericList>
    </OrganizationWrapper>
  )
}

CourseList.getProps = async ({
  apolloClient,
  locale,
  query,
  organizationPage,
}) => {
  // TODO: If there are no courses, default to trying to render an organization subpage?

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

  const coursesResponse = await apolloClient.query<Query, QueryGetCoursesArgs>({
    query: GET_ORGANIZATION_COURSES_QUERY,
    variables: {
      input: {
        lang: locale,
        organizationSlug: getOrganizationPage.organization?.slug,
      },
    },
  })

  return {
    organizationPage: getOrganizationPage,
    namespace,
  }
}

export default withMainLayout(CourseList)
