import { useQuery } from '@apollo/client'
import {
  Box,
  Button,
  Filter,
  FilterInput,
  FilterMultiChoice,
  GridColumn,
  GridContainer,
  GridRow,
  LoadingDots,
  NavigationItem,
  Text,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { getThemeConfig, OrganizationWrapper } from '@island.is/web/components'
import {
  ContentLanguage,
  GenericTag,
  GetNamespaceQuery,
  Query,
  QueryGetNamespaceArgs,
  QueryGetOrganizationPageArgs,
  QueryGetPublishedMaterialArgs,
} from '@island.is/web/graphql/schema'
import { linkResolver, useNamespace } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import useLocalLinkTypeResolver from '@island.is/web/hooks/useLocalLinkTypeResolver'
import { useWindowSize } from '@island.is/web/hooks/useViewport'
import { useI18n } from '@island.is/web/i18n'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useState } from 'react'
import { useDebounce } from 'react-use'
import { Screen } from '../../../types'
import {
  GET_NAMESPACE_QUERY,
  GET_ORGANIZATION_PAGE_QUERY,
  GET_ORGANIZATION_QUERY,
} from '../../queries'
import { GET_PUBLISHED_MATERIAL_QUERY } from '../../queries/PublishedMaterial'
import FilterTag from './components/FilterTag'
import PublishedMaterialItem from './components/PublishedMaterialItem'
import {
  getFilterCategories,
  getFilterTags,
  getInitialParameters,
} from './utils'
import * as styles from './PublishedMaterial.css'

const ASSETS_PER_PAGE = 20
const DEBOUNCE_TIME_IN_MS = 300

interface PublishedMaterialProps {
  organizationPage: Query['getOrganizationPage']
  genericTagFilters: GenericTag[]
  namespace: Record<string, string>
}

const PublishedMaterial: Screen<PublishedMaterialProps> = ({
  organizationPage,
  genericTagFilters,
  namespace,
}) => {
  const router = useRouter()
  const { width } = useWindowSize()
  const [searchValue, setSearchValue] = useState('')
  const n = useNamespace(namespace)

  useContentfulId(organizationPage.id)
  useLocalLinkTypeResolver()
  const { activeLocale } = useI18n()

  const pageUrl = `${organizationPage.slug}/${router.asPath.split('/').pop()}`

  const navList: NavigationItem[] = organizationPage.menuLinks.map(
    ({ primaryLink, childrenLinks }) => ({
      title: primaryLink.text,
      href: primaryLink.url,
      active:
        primaryLink.url.includes(pageUrl) ||
        childrenLinks.some((link) => link.url.includes(pageUrl)),
      items: childrenLinks.map(({ text, url }) => ({
        title: text,
        href: url,
        active: url.includes(pageUrl),
      })),
    }),
  )

  const [isTyping, setIsTyping] = useState(false)
  const [page, setPage] = useState(1)
  const [parameters, setParameters] = useState<Record<string, string[]>>({})
  const [queryVariables, setQueryVariables] = useState({
    variables: {
      input: {
        lang: activeLocale,
        organizationSlug: (router.query.slug as string) ?? '',
        tags: [],
        page: page,
        searchString: searchValue,
        size: ASSETS_PER_PAGE,
      },
    },
  })

  const { data, loading, fetchMore } = useQuery<
    Query,
    QueryGetPublishedMaterialArgs
  >(GET_PUBLISHED_MATERIAL_QUERY, queryVariables)

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchMore({
      variables: {
        input: {
          lang: activeLocale,
          organizationSlug: (router.query.slug as string) ?? '',
          tags: [],
          page: nextPage,
          searchString: searchValue,
          size: ASSETS_PER_PAGE,
        },
      },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        fetchMoreResult.getPublishedMaterial.items = [
          ...prevResult.getPublishedMaterial.items,
          ...fetchMoreResult.getPublishedMaterial.items,
        ]
        return fetchMoreResult
      },
    })
  }

  const initialFilterCategories = useMemo(
    () => getFilterCategories(genericTagFilters),
    [genericTagFilters],
  )

  const filterCategories = initialFilterCategories.map((category) => ({
    ...category,
    selected: parameters[category.id] ?? category.selected,
  }))

  useEffect(() => {
    setParameters(getInitialParameters(initialFilterCategories))
  }, [initialFilterCategories])

  useDebounce(
    () => {
      setPage(1)

      const selectedCategories: string[] = []
      filterCategories.forEach((c) =>
        c.selected.forEach((t) => selectedCategories.push(t)),
      )

      setQueryVariables({
        variables: {
          input: {
            lang: activeLocale,
            organizationSlug: (router.query.slug as string) ?? '',
            tags: selectedCategories,
            page: 1,
            searchString: searchValue,
            size: ASSETS_PER_PAGE,
          },
        },
      })
      setIsTyping(false)
    },
    DEBOUNCE_TIME_IN_MS,
    [parameters, activeLocale, searchValue],
  )

  const pageTitle = n('pageTitle', 'Útgefið efni')

  const isMobile = width < theme.breakpoints.md

  const numberOfItemsThatCouldBeLoaded =
    (data?.getPublishedMaterial?.total ?? page * ASSETS_PER_PAGE) -
    page * ASSETS_PER_PAGE

  const selectedFilters = getFilterTags(filterCategories)

  return (
    <OrganizationWrapper
      pageTitle={pageTitle}
      organizationPage={organizationPage}
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
        title: n('sidebarTitle', 'Efnisyfirlit'),
        items: navList,
      }}
    >
      <GridContainer>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '6/12', '6/12', '8/12']}>
            <Text variant="h1" as="h1" marginBottom={4} marginTop={1}>
              {pageTitle}
            </Text>
          </GridColumn>
        </GridRow>
        <GridRow>
          <Filter
            variant={isMobile ? 'dialog' : 'popover'}
            align="right"
            labelClear={n('clearFilter', 'Hreinsa síu')}
            labelClearAll={n('clearAllFilters', 'Hreinsa allar síur')}
            labelOpen={n('openFilter', 'Opna síu')}
            labelClose={n('closeFilter', 'Loka síu')}
            labelResult={n('viewResults', 'Skoða niðurstöður')}
            labelTitle={n('filterMenuTitle', 'Sía útgefið efni')}
            filterInput={
              <FilterInput
                placeholder={n(
                  'filterSearchPlaceholder',
                  'Sía eftir leitarorði',
                )}
                name="filterInput"
                value={searchValue}
                onChange={(value) => {
                  setSearchValue(value)
                  setIsTyping(true)
                }}
              />
            }
            onFilterClear={() => {
              setParameters(getInitialParameters(filterCategories))
              setSearchValue('')
              setIsTyping(true)
            }}
          >
            <FilterMultiChoice
              labelClear={n('clearSelection', 'Hreinsa val')}
              onChange={({ categoryId, selected }) => {
                setIsTyping(true)
                setParameters((prevParameters) => ({
                  ...prevParameters,
                  [categoryId]: selected,
                }))
              }}
              onClear={(categoryId) => {
                setIsTyping(true)
                setParameters((prevParameters) => ({
                  ...prevParameters,
                  [categoryId]: [],
                }))
              }}
              categories={filterCategories}
            ></FilterMultiChoice>
          </Filter>
        </GridRow>

        <GridContainer>
          <GridColumn span="12/12">
            <GridRow marginTop={2} align="center">
              <Box
                style={{
                  visibility: loading || isTyping ? 'visible' : 'hidden',
                }}
              >
                <LoadingDots />
              </Box>
            </GridRow>
            <GridRow>
              <GridColumn span="8/12">
                <GridRow>
                  <div className={styles.filterTagContainer}>
                    {selectedFilters.map(({ label, value, category }) => (
                      <FilterTag
                        key={value}
                        onClick={() => {
                          setIsTyping(true)
                          setParameters((prevParameters) => ({
                            ...prevParameters,
                            [category]: (prevParameters[category] ?? []).filter(
                              (prevValue) => prevValue !== value,
                            ),
                          }))
                        }}
                      >
                        {label}
                      </FilterTag>
                    ))}
                  </div>
                </GridRow>
              </GridColumn>
            </GridRow>
            {(data?.getPublishedMaterial?.items ?? []).map((item, index) => {
              return (
                <GridRow
                  key={`${item.id}-${index}`}
                  marginTop={2}
                  marginBottom={2}
                >
                  <PublishedMaterialItem item={item} />
                </GridRow>
              )
            })}
            {numberOfItemsThatCouldBeLoaded > 0 && (
              <GridRow marginTop={8} align="center">
                <Button onClick={loadMore} disabled={loading}>
                  {n('seeMore', 'Sjá meira')} ({numberOfItemsThatCouldBeLoaded})
                </Button>
              </GridRow>
            )}
          </GridColumn>
        </GridContainer>
      </GridContainer>
    </OrganizationWrapper>
  )
}

PublishedMaterial.getInitialProps = async ({ apolloClient, locale, query }) => {
  const [
    {
      data: { getOrganizationPage },
    },
    {
      data: { getOrganization },
    },
    namespace,
  ] = await Promise.all([
    apolloClient.query<Query, QueryGetOrganizationPageArgs>({
      query: GET_ORGANIZATION_PAGE_QUERY,
      variables: {
        input: {
          slug: query.slug as string,
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient.query<Query, QueryGetOrganizationPageArgs>({
      query: GET_ORGANIZATION_QUERY,
      variables: {
        input: {
          slug: query.slug as string,
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient
      .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            lang: locale as ContentLanguage,
            namespace: 'OrganizationPublishedMaterial',
          },
        },
      })
      .then((variables) => {
        // map data here to reduce data processing in component
        return JSON.parse(variables?.data?.getNamespace?.fields ?? '{}')
      }),
  ])

  if (!getOrganizationPage || !getOrganization) {
    throw new CustomNextError(404, 'Organization page not found')
  }

  return {
    organizationPage: getOrganizationPage,
    genericTagFilters:
      getOrganization.publishedMaterialSearchFilterGenericTags ?? [],
    namespace,
    ...getThemeConfig(getOrganizationPage.theme),
  }
}

export default withMainLayout(PublishedMaterial)
