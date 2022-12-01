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
  Icon,
  Inline,
  LoadingDots,
  NavigationItem,
  Option,
  Select,
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
import { useEffect, useMemo, useState } from 'react'
import { useDebounce } from 'react-use'
import { Screen } from '../../../types'
import {
  GET_NAMESPACE_QUERY,
  GET_ORGANIZATION_PAGE_QUERY,
  GET_ORGANIZATION_QUERY,
} from '../../queries'
import { GET_PUBLISHED_MATERIAL_QUERY } from '../../queries/PublishedMaterial'
import FilterTag from './components/FilterTag/FilterTag'
import { PublishedMaterialItem } from './components/PublishedMaterialItem'
import {
  getFilterCategories,
  getFilterTags,
  getGenericTagGroupHierarchy,
  getInitialParameters,
} from './utils'
import { ValueType } from 'react-select'
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

  const orderByOptions = useMemo(() => {
    return [
      {
        label: n('orderByReleaseDateDescending', 'Útgáfudagur (nýtt)'),
        value: 'order-by-release-date-descending',
        field: 'releaseDate',
        order: 'desc',
      },
      {
        label: n('orderByReleaseDateAscending', 'Útgáfudagur (gamalt)'),
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

  const [selectedOrderOption, setSelectedOrderOption] = useState<
    ValueType<Option>
  >(orderByOptions?.[0])

  useContentfulId(organizationPage.id)
  useLocalLinkTypeResolver()
  const { activeLocale } = useI18n()

  const navList: NavigationItem[] = organizationPage.menuLinks.map(
    ({ primaryLink, childrenLinks }) => ({
      title: primaryLink?.text,
      href: primaryLink?.url,
      active:
        primaryLink?.url === router.asPath ||
        childrenLinks.some((link) => link.url === router.asPath),
      items: childrenLinks.map(({ text, url }) => ({
        title: text,
        href: url,
        active: url === router.asPath,
      })),
    }),
  )

  // The page number is 1-based meaning that page 1 is the first page
  const [page, setPage] = useState(1)
  const [isTyping, setIsTyping] = useState(false)
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
      setPublishedMaterial(data.getPublishedMaterial)
  }, [data?.getPublishedMaterial])

  const filterCategories = initialFilterCategories.map((category) => ({
    ...category,
    selected: parameters[category.id] ?? category.selected,
  }))

  useEffect(() => {
    setParameters(getInitialParameters(initialFilterCategories))
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
          organizationSlug: (router.query.slug as string) ?? '',
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
            organizationSlug: (router.query.slug as string) ?? '',
            tags: selectedCategories,
            page: 1,
            searchString: searchValue,
            size: ASSETS_PER_PAGE,
            tagGroups: getGenericTagGroupHierarchy(filterCategories),
            sort: selectedOrderOption,
          },
        },
      })
      setIsTyping(false)
    },
    DEBOUNCE_TIME_IN_MS,
    [parameters, activeLocale, searchValue, selectedOrderOption],
  )

  const pageTitle = n('pageTitle', 'Útgefið efni')

  const isMobile = width < theme.breakpoints.md

  const numberOfItemsThatCouldBeLoaded =
    (publishedMaterial?.total ?? page * ASSETS_PER_PAGE) -
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
      <GridContainer className={styles.container}>
        <GridColumn span="12/12">
          <GridRow>
            <GridColumn span={['12/12', '12/12', '6/12', '6/12', '8/12']}>
              <Text variant="h1" as="h1" marginBottom={4} marginTop={1}>
                {pageTitle}
              </Text>
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
                onChange={(option) => {
                  setSelectedOrderOption(option)
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
    ...getThemeConfig(getOrganizationPage.theme, getOrganizationPage.slug),
  }
}

export default withMainLayout(PublishedMaterial)
