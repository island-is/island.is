import { useMemo, type FC } from 'react'
import { useLazyQuery } from '@apollo/client'
import Head from 'next/head'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
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
  Select,
  StringOption,
} from '@island.is/island-ui/core'
import { ProcessEntryLinkButton } from '@island.is/island-ui/contentful'
import { SearchInput, SearchableTagsFilter, useSearchableTagsFilter } from '@island.is/web/components'
import { useI18n } from '@island.is/web/i18n'
import { useNamespaceStrict as useNamespace } from '@island.is/web/hooks'
import { CustomNextError } from '@island.is/web/units/errors'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  Tag as TagType,
  GetSearchResultsDetailedQuery,
  GetSearchCountTagsQuery,
  QuerySearchResultsArgs,
  ContentLanguage,
  QueryGetNamespaceArgs,
  GetNamespaceQuery,
  SearchableContentTypes,
  SearchableTags,
  GetSearchResultsTotalQuery,
  SortField,
  SortDirection,
} from '@island.is/web/graphql/schema'
import { hasProcessEntries } from '@island.is/web/utils/article'
import { useLinkResolver, usePlausible } from '@island.is/web/hooks'
import { Screen } from '../../types'
import {
  GET_NAMESPACE_QUERY,
  GET_SEARCH_RESULTS_QUERY_DETAILED,
  GET_SEARCH_COUNT_QUERY,
  GET_SEARCH_RESULTS_TOTAL,
} from '../queries'

import type { SearchEntryType } from '../Search'
import {
  parseAsString,
  useQueryState,
  useQueryStates,
  type Options,
} from 'next-usequerystate'
import type { ApplicationsTexts } from './ApplicationsText.types';

const PERPAGE = 10
interface CategoryProps {
  page: number
  searchResults: GetSearchResultsDetailedQuery['searchResults']
  countResults: GetSearchCountTagsQuery['searchResults']
  namespace: ApplicationsTexts
}
interface SortByOption extends StringOption {
  sort: 'title' | 'popular',
  order: 'asc' | 'desc',
}

const stringToArray = (value: string | string[]) =>
  Array.isArray(value) ? value : value?.length ? [value] : []

// TODO - extract to util hook
const defaultQueryStateOptions: Options = { shallow: false }

const Applications: Screen<CategoryProps> = ({
  page,
  searchResults,
  countResults,
  namespace,
}) => {
  const { query } = useRouter();
  const [q] = useQueryState('q')
  const [sortOrder, setSortOrder] = useQueryStates(
    {
      sort: parseAsString.withDefault('popular'),
      order: parseAsString.withDefault('desc')
    },
    defaultQueryStateOptions
  )

  const { sort, order } = sortOrder;

  const { activeLocale } = useI18n()
  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()
  const { category, organization, reset: resetFilters } = useSearchableTagsFilter()

  const sortByOptions = useMemo<SortByOption[]>(() => ([
      {
        label: n('sortByPopularityDescending', 'Mest notað'),
        value: 'sort-by-popularity-descending',
        sort: 'popular',
        order: 'desc',
      },
      {
        label: n('sortByPopularityAscending', 'Minnst notað'),
        value: 'sort-by-popularity-ascending',
        sort: 'popular',
        order: 'asc',
      },
      {
        label: n('orderByTitleAscending', 'Titill (a-ö)'),
        value: 'sort-by-title-ascending',
        sort: 'title',
        order: 'asc',
      },
      {
        label: n('orderByTitleDescending', 'Titill (ö-a)'),
        value: 'sort-by-title-descending',
        sort: 'title',
        order: 'desc',
      },
    ]
  ), [])




  const selectedSortByOption = sortByOptions.find((option) => option.sort === sort && option.order === order) ?? sortByOptions[0]

  const searchResultsItems = (
    searchResults.items as Array<SearchEntryType>
  ).map((item) => ({
    typename: item.__typename,
    title: item.title,
    parentTitle: item.parent?.title,
    link: linkResolver('article', item.url ?? item.slug?.split('/')),
    description:
      item.intro ?? item.description ?? item.parent?.intro ?? item.subtitle,
    categorySlug: item.category?.slug ?? item.parent?.category?.slug,
    category: item.category ?? item.parent?.category,
    organizationTitle: item.organization?.length && item.organization[0].title,
    hasProcessEntry: item.__typename === 'Article' && hasProcessEntries(item),
    processEntry: item.processEntry,
    group: item.group,
  }))

  const filteredItems = [...searchResultsItems]
  const nothingFound = filteredItems.length === 0
  const totalSearchResults = searchResults.total
  const totalPages = Math.ceil(totalSearchResults / PERPAGE)

  const searchResultsText =
    totalSearchResults === 1
      ? (n('searchResult', 'leitarniðurstaða') as string).toLowerCase()
      : (n('searchResults', 'leitarniðurstöður') as string).toLowerCase()

  return (
    <>
      {/* <Head>
        <title>{n('searchResults', 'Leitarniðurstöður')} | Ísland.is</title>
      </Head> */}
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
              <Box width="full">
                <Inline
                  justifyContent="flexEnd"
                  alignY="center"
                  space={2}
                  flexWrap="nowrap"
                  collapseBelow="md"
                >
                  {/* TODO - sorting should be a component */}
                  <Select
                    name="sort-option-select"
                    size="xs"
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore make web strict
                    onChange={(option: SortByOption) => {
                      setSortOrder(option)
                    }}
                    value={selectedSortByOption}
                    options={sortByOptions}
                  />
                  <Inline
                    justifyContent="flexEnd"
                    alignY="center"
                    space={2}
                    flexWrap="nowrap"
                    collapseBelow="md"
                  >
                    <SearchInput
                      id="search_input_search_page"
                      size="medium"
                      placeholder={n('inputSearchQuery', 'Sláðu inn leitarorð')}
                      quickContentLabel={n('quickContentLabel', 'Beint að efninu')}
                      activeLocale={activeLocale}
                      initialInputValue={q ?? ''}
                      page="applications"
                    />
                    <SearchableTagsFilter
                      resultCount={totalSearchResults}
                      tags={countResults.tagCounts ?? []}
                    />
                  </Inline>
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
                      organization.length ||
                      category.length
                    ) && ` ${n('withChosenFilters', 'með völdum síum')}. `}
                  </Text>
                  {!!(
                    organization.length ||
                    category.length
                  ) && (
                    <Button
                      variant="text"
                      onClick={resetFilters}
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
                    <T.HeadData>{n('applicationName', 'Heiti umsóknar')}</T.HeadData>
                    <T.HeadData>{n('organization', 'Þjónustuaðili')}</T.HeadData>
                    <T.HeadData></T.HeadData>
                  </T.Row>
                </T.Head>
                <T.Body>
                  {filteredItems.map(
                    (
                      { link, title, organizationTitle, processEntry },
                      index,
                    ) => (
                      <T.Row key={index}>
                        <T.Data>
                          <Link {...link} skipTab>
                            <Button variant="text" as="span">
                              {title}
                            </Button>
                          </Link>
                        </T.Data>
                        <T.Data>
                          <Text fontWeight="medium">{organizationTitle}</Text>
                        </T.Data>
                        <T.Data>
                          <Box display="flex" justifyContent="flexEnd">
                            {processEntry?.processLink && (
                              <ProcessEntryLinkButton
                                processTitle={
                                  processEntry.processTitle ?? title
                                }
                                processLink={processEntry.processLink}
                                buttonText={n('application', 'Sækja um')}
                                size="small"
                              />
                            )}
                          </Box>
                        </T.Data>
                      </T.Row>
                    ),
                  )}
                </T.Body>
              </T.Table>
              <Stack space={2}>
                {totalSearchResults > 0 && (
                  <Box paddingTop={6}>
                    <Pagination
                      page={page ?? 1}
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
  const q = queryString !== '*' ? queryString : ''
  const page = Number(single(query.page)) || 1
  const sort =
    single(query.sort) === 'title' ? SortField.Title : SortField.Popular
  const order =
    single(query.order) === 'asc' ? SortDirection.Asc : SortDirection.Desc
  const category = query.category ?? ''
  const types = stringToArray('webArticle') as SearchableContentTypes[]
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
          sort,
          order,
          types,
          ...(tags.length && { tags }),
          ...countTag,
          countTypes: true,
          size: PERPAGE,
          page,
        },
      },
    }),
    apolloClient.query<GetSearchCountTagsQuery, QuerySearchResultsArgs>({
      fetchPolicy: 'no-cache', // overriding because at least local caching is broken
      query: GET_SEARCH_COUNT_QUERY,
      variables: {
        query: {
          language: locale as ContentLanguage,
          queryString,
          countTag: [
            'category' as SearchableTags,
            'organization' as SearchableTags,
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
      .then((variables) =>
        JSON.parse(variables?.data?.getNamespace?.fields || '[]'),
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
    sort: single(query.sort) ?? 'popular',
    order: single(query.order) ?? 'desc',
  }
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
