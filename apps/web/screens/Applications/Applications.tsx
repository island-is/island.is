import React, {
  useRef,
  useEffect,
  useState,
  FC,
  useMemo,
  useReducer,
} from 'react'
import { useLazyQuery } from '@apollo/client'
import Head from 'next/head'
import { useWindowSize } from 'react-use'
import { NextRouter, useRouter } from 'next/router'
import NextLink from 'next/link'
import { theme } from '@island.is/island-ui/theme'
import {
  Box,
  Text,
  Stack,
  Breadcrumbs,
  Pagination,
  Link,
  LinkContext,
  ColorSchemeContext,
  Inline,
  GridContainer,
  GridRow,
  GridColumn,
  Button,
  Table as T,
} from '@island.is/island-ui/core'
import { ProcessEntryLinkButton } from '@island.is/island-ui/contentful'
import { SearchInput, CardTagsProps } from '@island.is/web/components'
import { useI18n } from '@island.is/web/i18n'
import { useNamespace } from '@island.is/web/hooks'
import { CustomNextError } from '@island.is/web/units/errors'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  Image,
  Tag as TagType,
  GetSearchResultsDetailedQuery,
  GetSearchResultsNewsQuery,
  GetSearchCountTagsQuery,
  QuerySearchResultsArgs,
  ContentLanguage,
  QueryGetNamespaceArgs,
  GetNamespaceQuery,
  Article,
  LifeEventPage,
  News,
  SearchableContentTypes,
  SearchableTags,
  AdgerdirPage,
  SubArticle,
  GetSearchResultsTotalQuery,
  OrganizationSubpage,
  OrganizationPage,
  Link as LinkItem,
  ProjectPage,
} from '@island.is/web/graphql/schema'
import { AnchorPageType } from '@island.is/web/utils/anchorPage'
import { ActionType, reducer, initialState } from '../Search/Search.state'
import { useLinkResolver, usePlausible } from '@island.is/web/hooks'
import { Screen } from '../../types'
import {
  GET_NAMESPACE_QUERY,
  GET_SEARCH_RESULTS_QUERY_DETAILED,
  GET_SEARCH_COUNT_QUERY,
  GET_SEARCH_RESULTS_TOTAL,
} from '../queries'

import { FilterMenu, CategoriesProps, FilterLabels } from '../Search/FilterMenu'

const PERPAGE = 10

type SearchQueryFilters = {
  category: string
  type: string
}

interface CategoryProps {
  q: string
  page: number
  searchResults: GetSearchResultsDetailedQuery['searchResults']
  countResults: GetSearchCountTagsQuery['searchResults']
  namespace: GetNamespaceQuery['getNamespace']
}

type SearchType = Article &
  LifeEventPage &
  News &
  AdgerdirPage &
  SubArticle &
  OrganizationSubpage &
  OrganizationPage &
  LinkItem &
  ProjectPage

const stringToArray = (value: string | string[]) =>
  Array.isArray(value) ? value : value?.length ? [value] : []

const Applications: Screen<CategoryProps> = ({
  q,
  page,
  searchResults,
  countResults,
  namespace,
}) => {
  const { query } = useRouter()
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    query: {
      q,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      category: stringToArray(query.category),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      organization: stringToArray(query.organization),
    },
  })
  usePlausible('Search Query', {
    query: (q ?? '').trim().toLowerCase(),
    source: 'Web',
  })
  const { width } = useWindowSize()
  const [isMobile, setIsMobile] = useState(false)
  const { activeLocale } = useI18n()
  const searchRef = useRef<HTMLInputElement | null>(null)
  const routerReplace = useRouterReplace()
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()

  useMemo(() => {
    if (width < theme.breakpoints.md) {
      return setIsMobile(true)
    }
    setIsMobile(false)
  }, [width])

  const filters: SearchQueryFilters = {
    category: query.category as string,
    type: query.type as string,
  }

  const getLabels = (item: SearchType) => {
    const labels = []

    switch (item.__typename) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      case 'LifeEventPage': {
        if (item.pageType === AnchorPageType.LIFE_EVENT) {
          labels.push(n('lifeEvent'))
        }
        break
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      case 'News':
        labels.push(n('newsTitle'))
        break
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      case 'AdgerdirPage':
        labels.push(n('adgerdirTitle'))
        break
      default:
        break
    }

    if (checkForProcessEntries(item)) {
      labels.push(n('applicationForm'))
    }

    if (item.group) {
      labels.push(item.group.title)
    }

    if (item.organization?.length) {
      labels.push(item.organization[0].title)
    }

    if (item.parent) {
      if (item.parent.group) {
        labels.push(item.parent.group.title)
      }

      if (item.parent.organization?.length) {
        labels.push(item.parent.organization[0].title)
      }
    }

    if (item.organizationPage?.organization?.title) {
      labels.push(item.organizationPage.organization.title)
    }

    return labels
  }

  const pathname = linkResolver('applications').href

  const checkForProcessEntries = (item: SearchType) => {
    if (item.__typename === 'Article') {
      const hasMainProcessEntry =
        !!item.processEntry?.processTitle || !!item.processEntry?.processLink
      const hasProcessEntryInBody = !!item.body?.filter((content) => {
        return content.__typename === 'ProcessEntry'
      }).length

      return hasMainProcessEntry || hasProcessEntryInBody
    }

    return false
  }

  const getItemLink = (item: SearchType) => {
    if (
      item.__typename === 'LifeEventPage' &&
      item.pageType === AnchorPageType.DIGITAL_ICELAND_SERVICE
    ) {
      return linkResolver('digitalicelandservicesdetailpage', [item.slug])
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore make web strict
    return linkResolver(item.__typename, item.url ?? item.slug?.split('/'))
  }

  const getItemImages = (item: SearchType) => {
    if (
      item.__typename === 'LifeEventPage' &&
      item.pageType === AnchorPageType.DIGITAL_ICELAND_SERVICE
    ) {
      return {
        image: undefined,
        thumbnail: undefined,
      }
    }
    if (item.__typename === 'OrganizationPage') {
      return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        image: (item as any)?.singleOrganization?.logo,
        thumbnail: undefined,
      }
    }

    return {
      ...(item.image && { image: item.image as Image }),
      ...(item.thumbnail && { thumbnail: item.thumbnail as Image }),
    }
  }

  const searchResultsItems = (searchResults.items as Array<SearchType>).map(
    (item) => ({
      typename: item.__typename,
      title: item.title,
      parentTitle: item.parent?.title,
      description:
        item.intro ?? item.description ?? item.parent?.intro ?? item.subtitle,
      link: getItemLink(item),
      categorySlug: item.category?.slug ?? item.parent?.category?.slug,
      category: item.category ?? item.parent?.category,
      organizationTitle: item.organization?.length && item.organization[0].title,
      hasProcessEntry: checkForProcessEntries(item),
      processEntry: item.processEntry,
      group: item.group,
      ...getItemImages(item),
      labels: getLabels(item),
    }),
  )
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  const noUncategorized = (item) => {
    if (!item.category && filters.category === 'uncategorized') {
      return true
    }

    return !filters.category || filters.category === item.categorySlug
  }

  const filteredItems = [...searchResultsItems].filter(noUncategorized)
  const nothingFound = filteredItems.length === 0
  const totalSearchResults = searchResults.total
  const totalPages = Math.ceil(totalSearchResults / PERPAGE)

  const searchResultsText =
    totalSearchResults === 1
      ? (n('searchResult', 'leitarniðurstaða') as string).toLowerCase()
      : (n('searchResults', 'leitarniðurstöður') as string).toLowerCase()

  useEffect(() => {
    if (state.searchLocked) {
      return
    }

    const newQuery = {
      ...state.query,
      q,
    }

    routerReplace({
      pathname,
      query: newQuery,
    }).then(() => {
      window.scrollTo(0, 0)
    })
  }, [state, pathname, q, routerReplace])

  const getSearchParams = () => {
    return {
      q,
      ...(query.category?.length && { category: query.category }),
      ...(query.organization?.length && {
        organization: query.organization,
      }),
    }
  }

  const categories: CategoriesProps[] = [
    {
      id: 'category',
      label: n('categories', 'Þjónustuflokkar'),
      selected: state.query.category ?? [],
      singleOption: true,
      filters: (countResults?.tagCounts ?? [])
        .filter((x) => x.value.trim() && x.type === 'category')
        .map(({ key, value }) => ({
          label: value,
          value: key,
        })),
    },
    {
      id: 'organization',
      label: n('organizations', 'Opinberir aðilar'),
      selected: state.query.organization ?? [],
      singleOption: true,
      filters: (countResults?.tagCounts ?? [])
        .filter((x) => x.value.trim() && x.type === 'organization')
        .map(({ key, value }) => ({
          label: value,
          value: key,
        })),
    },
  ]

  const filterLabels: FilterLabels = {
    labelClearAll: n('labelClearAll', 'Hreinsa allar síur'),
    labelClear: n('labelClear', 'Hreinsa síu'),
    labelOpen: n('labelOpen', 'Sía niðurstöður'),
    labelClose: n('labelClose', 'Loka síu'),
    labelTitle: n('labelTitle', 'Sía mannanöfn'),
    labelResult: n('labelResult', 'Sjá niðurstöður'),
    inputPlaceholder: n('inputPlaceholder', 'Leita að nafni'),
  }
  return (
    <>
      <Head>
        <title>{n('searchResults', 'Leitarniðurstöður')} | Ísland.is</title>
      </Head>
      <GridContainer>
        <GridRow>
          <GridColumn
            span={['12/12']}
            paddingBottom={6}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore make web strict
          >
            <Stack space={[3, 3, 4]}>
              <Breadcrumbs
                items={[
                  {
                    title: 'Ísland.is',
                    href: '/',
                  },
                ]}
                renderLink={(link) => {
                  return (
                    <NextLink
                      {...linkResolver('homepage')}
                      passHref
                      legacyBehavior
                    >
                      {link}
                    </NextLink>
                  )
                }}
              />
              <SearchInput
                id="search_input_search_page"
                ref={searchRef}
                size="medium"
                placeholder={n('inputSearchQuery', 'Sláðu inn leitarorð')}
                quickContentLabel={n('quickContentLabel', 'Beint að efninu')}
                activeLocale={activeLocale}
                initialInputValue={q}
                page="applications"
              />
              <Box width="full">
                <Inline
                  justifyContent="flexEnd"
                  alignY="center"
                  space={1}
                  flexWrap="nowrap"
                  collapseBelow="md"
                >
                  <FilterMenu
                    {...filterLabels}
                    categories={categories}
                    resultCount={totalSearchResults}
                    filter={{
                      category: state.query.category ?? [],
                      organization: state.query.organization ?? [],
                    }}
                    setFilter={(payload) =>
                      dispatch({
                        type: ActionType.SET_PARAMS,
                        payload: {
                          query: {
                            ...getSearchParams(),
                            ...payload,
                          },
                        },
                      })
                    }
                    align="right"
                    variant={isMobile ? 'dialog' : 'popover'}
                  />
                </Inline>
              </Box>
              {nothingFound && !!q ? (
                <>
                  <Text variant="intro" as="p">
                    {n(
                      'nothingFoundWhenSearchingFor',
                      'Ekkert fannst við leit á',
                    )}{' '}
                    <strong>{q}</strong>
                    {!!(
                      state.query.organization?.length ||
                      state.query.category?.length
                    ) && ` ${n('withChosenFilters', 'með völdum síum')}. `}
                  </Text>
                  {!!(
                    state.query.organization?.length ||
                    state.query.category?.length
                  ) && (
                    <Button
                      variant="text"
                      onClick={() =>
                        dispatch({
                          type: ActionType.RESET_SEARCH,
                        })
                      }
                    >
                      {`${n(
                        'clickHereToRemoveFilters',
                        'Smelltu hér til að fjarlægja allar síur.',
                      )}`}
                    </Button>
                  )}
                  <Text variant="intro" as="p">
                    {n('nothingFoundExtendedExplanation')}
                  </Text>
                  {q.length &&
                  searchResultsItems.length === 0 &&
                  activeLocale === 'is' ? (
                    <EnglishResultsLink q={q} />
                  ) : null}
                </>
              ) : (
                <Box marginBottom={2}>
                  <Text variant="intro" as="p">
                    {totalSearchResults} {searchResultsText}
                  </Text>
                </Box>
              )}
            </Stack>
            <ColorSchemeContext.Provider value={{ colorScheme: 'blue' }}>
              <T.Table>
                <T.Head>
                  <T.Row>
                    <T.HeadData>Name</T.HeadData>
                    <T.HeadData>Government Agency</T.HeadData>
                    <T.HeadData></T.HeadData>
                  </T.Row>
                </T.Head>
                <T.Body>
                {filteredItems.map(
                  (
                    {
                      labels,
                      link,
                      title,
                      organizationTitle,
                      processEntry,
                    },
                    index,
                  ) => {
                    const tags: Array<CardTagsProps> = []

                    labels.forEach((label) => {
                      tags.push({
                        title: label,
                        tagProps: {
                          outlined: true,
                        },
                      })
                    })

                    console.log(processEntry);

                    return (
                      <T.Row key={index}>
                        <T.Data>
                          <NextLink
                            {...link}
                            passHref
                            legacyBehavior
                          >
                            {title}
                          </NextLink>
                        </T.Data>
                        <T.Data>{organizationTitle}</T.Data>
                        <T.Data>
                          <Box display="flex" justifyContent="flexEnd">
                            {processEntry?.processLink && (
                              <ProcessEntryLinkButton
                                processTitle={processEntry.processTitle ?? title}
                                processLink={processEntry.processLink}
                                buttonText="Apply"
                                size="small"
                              />
                            )}
                          </Box>
                        </T.Data>
                      </T.Row>
                    )
                  },
                )}
                </T.Body>
              </T.Table>
              <Stack space={2}>
                {totalSearchResults > 0 && (
                  <Box paddingTop={6}>
                    <Pagination
                      page={page}
                      totalPages={totalPages}
                      variant="blue"
                      renderLink={(page, className, children) => (
                        <Link
                          href={{
                            pathname: linkResolver('applications').href,
                            query: { ...query, page },
                          }}
                        >
                          <span className={className}>{children}</span>
                        </Link>
                      )}
                    />
                  </Box>
                )}
              </Stack>
            </ColorSchemeContext.Provider>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </>
  )
}

const single = <T,>(x: T | T[]): T => (Array.isArray(x) ? x[0] : x)

Applications.getProps = async ({ apolloClient, locale, query }) => {
  const queryString = single(query.q) || '*'
  const q = queryString !== '*' ? queryString : '';
  const page = Number(single(query.page)) || 1
  const category = query.category ?? ''
  const types = stringToArray('webArticle') as SearchableContentTypes[];
  const organization = query.organization ?? ''
  const processentry = true
  const countTag = {}
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  const tags: TagType[] = [
    ...stringToArray(category).map(
      (key: string): TagType => ({
        type: 'category' as SearchableTags,
        key,
      }),
    ),
    ...stringToArray(organization).map(
      (key: string): TagType => ({
        type: 'organization' as SearchableTags,
        key,
      }),
    ),
    ...(processentry && [
      {
        type: 'processentry' as SearchableTags,
        key: 'true',
      },
    ]),
  ]

  const [
    {
      data: { searchResults },
    },
    {
      data: { searchResults: countResults },
    },
    namespace,
  ] = await Promise.all([
    apolloClient.query<GetSearchResultsDetailedQuery, QuerySearchResultsArgs>({
      fetchPolicy: 'no-cache', // overriding because at least local caching is broken
      query: GET_SEARCH_RESULTS_QUERY_DETAILED,
      variables: {
        query: {
          language: locale as ContentLanguage,
          queryString,
          types,
          ...(tags.length && { tags }),
          ...countTag,
          countTypes: true,
          size: PERPAGE,
          page,
        },
      },
    }),
    apolloClient.query<GetSearchResultsNewsQuery, QuerySearchResultsArgs>({
      fetchPolicy: 'no-cache', // overriding because at least local caching is broken
      query: GET_SEARCH_COUNT_QUERY,
      variables: {
        query: {
          language: locale as ContentLanguage,
          queryString,
          countTag: [
            'category' as SearchableTags,
            'organization' as SearchableTags,
            'processentry' as SearchableTags,
          ],
          types,
          countTypes: true,
          countProcessEntry: true,
        },
      },
    }),
    apolloClient
      .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'Search',
            lang: locale,
          },
        },
      })
      // map data here to reduce data processing in component
      .then((variables) =>
        variables.data.getNamespace?.fields
          ? JSON.parse(variables.data.getNamespace.fields)
          : {},
      ),
  ])

  if (searchResults.items.length === 0 && page > 1) {
    throw new CustomNextError(404)
  }
  return {
    q,
    searchResults,
    countResults,
    namespace,
    showSearchInHeader: false,
    page,
  }
}

const useRouterReplace = (): NextRouter['replace'] => {
  const Router = useRouter()
  const routerRef = useRef(Router)

  routerRef.current = Router

  const [{ replace }] = useState<Pick<NextRouter, 'replace'>>({
    replace: (path) => {
      return routerRef.current.push(path)
    },
  })

  return replace
}

interface EnglishResultsLinkProps {
  q: string
}

const EnglishResultsLink: FC<
  React.PropsWithChildren<EnglishResultsLinkProps>
> = ({ q }) => {
  const { linkResolver } = useLinkResolver()
  const [getCount, { data }] = useLazyQuery<
    GetSearchResultsTotalQuery,
    QuerySearchResultsArgs
  >(GET_SEARCH_RESULTS_TOTAL)

  useMemo(() => {
    getCount({
      variables: {
        query: {
          queryString: q,
          language: 'en' as ContentLanguage,
        },
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q])

  const total = data?.searchResults?.total ?? 0

  if (total > 0) {
    return (
      <LinkContext.Provider
        value={{
          linkRenderer: (href, children) => (
            <Link color="blue600" underline="normal" href={href}>
              {children}
            </Link>
          ),
        }}
      >
        <Text variant="intro" as="p">
          <a href={linkResolver('applications', [], 'en').href + `?q=${q}`}>
            {total} niðurstöður
          </a>{' '}
          fundust á ensku.
        </Text>
      </LinkContext.Provider>
    )
  }

  return null
}

export default withMainLayout(Applications, { showSearchInHeader: false })
