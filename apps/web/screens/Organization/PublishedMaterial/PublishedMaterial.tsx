import { useEffect, useMemo, useRef, useState } from 'react'
import { useDebounce } from 'react-use'
import isEqual from 'lodash/isEqual'
import { useRouter } from 'next/router'
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
  Inline,
  LoadingDots,
  NavigationItem,
  Select,
  StringOption as Option,
  Text,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import {
  FilterTag,
  getThemeConfig,
  OrganizationWrapper,
  Webreader,
} from '@island.is/web/components'
import {
  ContentLanguage,
  GenericTag,
  GetNamespaceQuery,
  Query,
  QueryGetNamespaceArgs,
  QueryGetOrganizationArgs,
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

import { Screen } from '../../../types'
import {
  GET_NAMESPACE_QUERY,
  GET_ORGANIZATION_PAGE_QUERY,
  GET_ORGANIZATION_QUERY,
} from '../../queries'
import { GET_PUBLISHED_MATERIAL_QUERY } from '../../queries/PublishedMaterial'
import { PublishedMaterialItem } from './components/PublishedMaterialItem'
import {
  extractFilterTags,
  getFilterCategories,
  getGenericTagGroupHierarchy,
  getInitialParameters,
} from './utils'
import * as styles from './PublishedMaterial.css'

const ASSETS_PER_PAGE = 20
const DEBOUNCE_TIME_IN_MS = 300

export interface PublishedMaterialProps {
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
  const filterValuesHaveBeenInitialized = useRef(false)
  const initialFilterParametersValueHasBeenSet = useRef(false)

  const n = useNamespace(namespace)

  const orderByOptions = useMemo(() => {
    return [
      {
        label: n('orderByReleaseDateDescending', 'Nýtt efst'),
        value: 'order-by-release-date-descending',
        field: 'releaseDate',
        order: 'desc',
      },
      {
        label: n('orderByReleaseDateAscending', 'Elsta efst'),
        value: 'order-by-release-date-ascending',
        field: 'releaseDate',
        order: 'asc',
      },
      {
        label: n('orderByTitleAscending', 'Titill (a-ö)'),
        value: 'order-by-title-ascending',
        field: 'title.sort',
        order: 'asc',
      },
      {
        label: n('orderByTitleDescending', 'Titill (ö-a)'),
        value: 'order-by-title-descending',
        field: 'title.sort',
        order: 'desc',
      },
    ]
  }, [])

  const [selectedOrderOption, setSelectedOrderOption] = useState<Option>(
    orderByOptions?.[0],
  )

  useContentfulId(organizationPage?.id)
  useLocalLinkTypeResolver()

  const pathWithoutQueryParams = router.asPath.split('?')[0]

  const { activeLocale } = useI18n()
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  const navList: NavigationItem[] = organizationPage?.menuLinks.map(
    ({ primaryLink, childrenLinks }) => ({
      title: primaryLink?.text,
      href: primaryLink?.url,
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

  const organizationSlug =
    organizationPage?.organization?.slug ?? (router.query.slug as string) ?? ''

  // The page number is 1-based meaning that page 1 is the first page
  const [page, setPage] = useState(1)
  const [isTyping, setIsTyping] = useState(false)
  const [parameters, setParameters] = useState<Record<string, string[]>>({})
  const [queryVariables, setQueryVariables] = useState({
    variables: {
      input: {
        lang: activeLocale,
        organizationSlug,
        tags: [] as string[],
        page: page,
        searchString: searchValue,
        size: ASSETS_PER_PAGE,
        tagGroups: {},
        sort: selectedOrderOption,
      },
    },
  })
  const [publishedMaterial, setPublishedMaterial] = useState({
    items: [],
    total: 0,
  })

  const { data, loading, fetchMore } = useQuery<
    Query,
    QueryGetPublishedMaterialArgs
  >(GET_PUBLISHED_MATERIAL_QUERY, queryVariables)

  const initialFilterCategories = useMemo(
    () => getFilterCategories(genericTagFilters),
    [genericTagFilters],
  )

  useEffect(() => {
    if (data?.getPublishedMaterial)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      setPublishedMaterial(data.getPublishedMaterial)
  }, [data?.getPublishedMaterial])

  const filterCategories = initialFilterCategories.map((category) => ({
    ...category,
    selected: parameters[category.id] ?? category.selected,
  }))

  useEffect(() => {
    if (!initialFilterParametersValueHasBeenSet.current) {
      setParameters(getInitialParameters(initialFilterCategories))
    }
  }, [initialFilterCategories])

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)

    const selectedCategories: string[] = []
    filterCategories.forEach((c) =>
      c.selected.forEach((t) => selectedCategories.push(t)),
    )

    fetchMore({
      variables: {
        input: {
          lang: activeLocale,
          organizationSlug,
          tags: selectedCategories,
          page: nextPage,
          searchString: searchValue,
          size: ASSETS_PER_PAGE,
          tagGroups: getGenericTagGroupHierarchy(filterCategories),
          sort: selectedOrderOption,
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
            organizationSlug,
            tags: selectedCategories,
            page: 1,
            searchString:
              searchValue[searchValue.length - 1] === '´'
                ? searchValue.slice(0, searchValue.length - 1)
                : searchValue,
            size: ASSETS_PER_PAGE,
            tagGroups: getGenericTagGroupHierarchy(filterCategories),
            sort: selectedOrderOption,
          },
        },
      })
      setIsTyping(false)

      const updatedQueryParams = { ...router.query }

      // Update search input state and query params
      if (!searchValue) {
        if (filterValuesHaveBeenInitialized.current) {
          delete updatedQueryParams['q']
        } else if (updatedQueryParams['q']) {
          setSearchValue(updatedQueryParams['q'] as string)
        }
      } else {
        updatedQueryParams['q'] = searchValue
      }

      // Update order dropdown state and query params
      if (!filterValuesHaveBeenInitialized.current) {
        if (updatedQueryParams.order) {
          const newOrder = orderByOptions.find(
            (o) => o.value === updatedQueryParams.order,
          )
          if (newOrder) setSelectedOrderOption(newOrder)
        }
      } else {
        if (
          !(
            selectedOrderOption?.value === orderByOptions[0].value &&
            !updatedQueryParams.order
          )
        ) {
          updatedQueryParams.order = selectedOrderOption.value as string
        }
      }

      // Update filter categories state and query params
      if (!filterValuesHaveBeenInitialized.current) {
        if (updatedQueryParams.filters) {
          try {
            const updatedFilters = JSON.parse(
              updatedQueryParams.filters as string,
            )
            setParameters(updatedFilters)
            initialFilterParametersValueHasBeenSet.current = true
          } catch (_) {
            delete updatedQueryParams.filters
          }
        }
      } else {
        if (Object.values(parameters).every((value) => !value?.length)) {
          delete updatedQueryParams.filters
        } else {
          updatedQueryParams.filters = JSON.stringify(parameters)
        }
      }

      filterValuesHaveBeenInitialized.current = true

      if (!isEqual(router.query, updatedQueryParams)) {
        router.replace(
          {
            pathname: router.pathname,
            query: updatedQueryParams,
          },
          undefined,
          { scroll: false, shallow: true },
        )
      }
    },
    DEBOUNCE_TIME_IN_MS,
    [parameters, activeLocale, searchValue, selectedOrderOption],
  )

  const pageTitle = n('pageTitle', 'Útgefið efni')

  const isMobile = width < theme.breakpoints.md

  const numberOfItemsThatCouldBeLoaded =
    (publishedMaterial?.total ?? page * ASSETS_PER_PAGE) -
    page * ASSETS_PER_PAGE

  const selectedFilters = extractFilterTags(filterCategories)

  return (
    <OrganizationWrapper
      pageTitle={pageTitle}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      organizationPage={organizationPage}
      showReadSpeaker={false}
      breadcrumbItems={[
        {
          title: 'Ísland.is',
          href: linkResolver('homepage').href,
        },
        {
          title: organizationPage?.title ?? '',
          href: linkResolver('organizationpage', [organizationPage?.slug ?? ''])
            .href,
        },
      ]}
      navigationData={{
        title: n('sidebarTitle', 'Efnisyfirlit'),
        items: navList,
      }}
    >
      <GridContainer className={styles.container}>
        <GridColumn span="12/12">
          <GridRow>
            <GridColumn span={['12/12', '12/12', '6/12', '6/12', '8/12']}>
              <Text variant="h1" as="h1" marginBottom={0} marginTop={1}>
                {pageTitle}
              </Text>
              <Webreader
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore make web strict
                readId={null}
                readClass="rs_read"
              />
            </GridColumn>
          </GridRow>
          <GridRow>
            <Filter
              resultCount={publishedMaterial?.total ?? 0}
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

          <GridRow align="flexStart" marginBottom={3} marginTop={3}>
            <Box className={styles.orderBySelect}>
              <Select
                name="order-by-select"
                label={n('orderBy', 'Raða eftir')}
                size="xs"
                options={orderByOptions}
                value={selectedOrderOption}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore make web strict
                onChange={(option) => {
                  setSelectedOrderOption(option as Option)
                }}
              />
            </Box>
          </GridRow>

          <GridRow marginTop={2} align="center">
            <Box
              style={{
                visibility: loading || isTyping ? 'visible' : 'hidden',
              }}
            >
              <LoadingDots />
            </Box>
          </GridRow>

          <GridRow alignItems="center">
            <GridColumn span="8/12">
              <Inline space={1}>
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
              </Inline>
            </GridColumn>
          </GridRow>

          {(publishedMaterial?.items ?? []).map((item, index) => {
            return (
              <GridRow
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore make web strict
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
    </OrganizationWrapper>
  )
}

PublishedMaterial.getProps = async ({ apolloClient, locale, query }) => {
  const organizationPageSlug = (query.slugs as string[])[0]
  const [
    {
      data: { getOrganizationPage },
    },
    namespace,
  ] = await Promise.all([
    apolloClient.query<Query, QueryGetOrganizationPageArgs>({
      query: GET_ORGANIZATION_PAGE_QUERY,
      variables: {
        input: {
          slug: organizationPageSlug,
          lang: locale as ContentLanguage,
          subpageSlugs: [
            locale === 'is' ? 'utgefid-efni' : 'published-material',
          ],
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
        return JSON.parse(variables?.data?.getNamespace?.fields || '{}')
      }),
  ])

  if (!getOrganizationPage) {
    throw new CustomNextError(404, 'Organization page not found')
  }

  const {
    data: { getOrganization },
  } = await apolloClient.query<Query, QueryGetOrganizationArgs>({
    query: GET_ORGANIZATION_QUERY,
    variables: {
      input: {
        slug: getOrganizationPage.organization?.slug ?? organizationPageSlug,
        lang: locale as ContentLanguage,
      },
    },
  })

  return {
    organizationPage: getOrganizationPage,
    genericTagFilters:
      (getOrganization ?? getOrganizationPage?.organization)
        ?.publishedMaterialSearchFilterGenericTags ?? [],
    namespace,
    ...getThemeConfig(
      getOrganizationPage?.theme,
      getOrganization ?? getOrganizationPage?.organization,
    ),
  }
}

export default withMainLayout(PublishedMaterial)
