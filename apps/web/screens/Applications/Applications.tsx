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
  ColorSchemeContext,
  Inline,
  GridContainer,
  GridRow,
  GridColumn,
  Button,
  Table as T,
} from '@island.is/island-ui/core'
import { SearchInput, SearchableTagsFilter, useSearchableTagsFilter, BackgroundImage } from '@island.is/web/components'
import { useI18n } from '@island.is/web/i18n'
import { useNamespaceStrict as useNamespace } from '@island.is/web/hooks'
import { CustomNextError } from '@island.is/web/units/errors'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  Tag as TagType,
  GetApplicationsQuery,
  GetSearchCountTagsQuery,
  QuerySearchResultsArgs,
  ContentLanguage,
  QueryGetNamespaceArgs,
  GetNamespaceQuery,
  SearchableContentTypes,
  SearchableTags,
  SortField,
  SortDirection,
  Article,
} from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'
import { Screen } from '../../types'
import {
  GET_NAMESPACE_QUERY,
  GET_APPLICATIONS_QUERY,
  GET_SEARCH_COUNT_QUERY,
} from '../queries'

import {
  parseAsString,
  parseAsInteger,
  useQueryState,
  parseAsArrayOf,
} from 'next-usequerystate'
import type { ApplicationsTexts } from './ApplicationsText.types';

const PERPAGE = 10
interface CategoryProps {
  page: number
  searchResults: GetApplicationsQuery['searchResults']
  countResults: GetSearchCountTagsQuery['searchResults']
  namespace: ApplicationsTexts
}

const Applications: Screen<CategoryProps> = ({
  page,
  searchResults,
  countResults,
  namespace,
}) => {
  const { query } = useRouter();
  const [q] = useQueryState('q')
  const { activeLocale } = useI18n()
  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()
  const { category, organization, reset: resetFilters } = useSearchableTagsFilter()

  const articles = searchResults.items as Article[]
  const nothingFound = searchResults.items.length === 0
  const totalSearchResults = searchResults.total
  const totalPages = Math.ceil(totalSearchResults / PERPAGE)

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
              {nothingFound && !!q && (
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
                </>
              )}
            </Stack>
            <ColorSchemeContext.Provider value={{ colorScheme: 'blue' }}>
              <Box marginTop={4}>
                <T.Table>
                  <T.Head>
                    <T.Row>
                      <T.HeadData>{n('applicationName', 'Heiti umsóknar')}</T.HeadData>
                      <T.HeadData>{n('organization', 'Þjónustuaðili')}</T.HeadData>
                      <T.HeadData></T.HeadData>
                    </T.Row>
                  </T.Head>
                  <T.Body>
                    {articles.map(
                      (article, index) => (
                        <T.Row key={index}>
                          <T.Data>
                            <Text variant="h5">
                              {article.title}
                            </Text>
                          </T.Data>
                          <T.Data>
                            <Inline
                              justifyContent="flexStart"
                              alignY="center"
                              space={2}
                              flexWrap="nowrap"
                            >
                              <Box position="relative" style={{ width: '28px', height: '28px' }}>
                                <BackgroundImage
                                  width={60}
                                  backgroundSize="contain"
                                  image={{ ...article.organization?.[0]?.logo }}
                                  format="png"
                                />
                              </Box>
                              <Text>{article.organization?.[0]?.title}</Text>
                            </Inline>
                          </T.Data>
                          <T.Data align="right" style={{ whiteSpace: 'nowrap' }}>
                            <Link {...linkResolver('article', [article.slug])} skipTab>
                              <Button variant="text" size="small" icon="arrowForward">
                                {n('seeMore', 'Sjá nánar')}
                              </Button>
                            </Link>
                          </T.Data>
                        </T.Row>
                      ),
                    )}
                  </T.Body>
                </T.Table>
              </Box>
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

Applications.getProps = async ({ apolloClient, locale, query }) => {
  // TODO - file bugreport with next-usequerystate regarding missing default on server
  const {
    q = '*',
    page: pageParam = '1',
    order: orderParam = 'desc',
    category: categoryParam,
    organization: organizationParam,
  } = query;
  const queryString = parseAsString.withDefault('*').parseServerSide(q)
  const page = parseAsInteger.withDefault(1).parseServerSide(pageParam)
  const order = parseAsString.parseServerSide(orderParam) === 'asc' ? SortDirection.Asc : SortDirection.Desc
  const category = parseAsArrayOf(parseAsString).withDefault([]).parseServerSide(categoryParam)
  const organization = parseAsArrayOf(parseAsString).withDefault([]).parseServerSide(organizationParam)
  const types = ['webArticle'] as SearchableContentTypes[]
  const tags: TagType[] = [
    ...category.map(
      (key: string): TagType => ({
        type: SearchableTags.Category,
        key,
      }),
    ),
    ...organization.map(
      (key: string): TagType => ({
        type: SearchableTags.Organization,
        key,
      }),
    ),
    {
      type: SearchableTags.Processentry,
      key: 'true',
    },
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
    apolloClient.query<GetApplicationsQuery, QuerySearchResultsArgs>({
      fetchPolicy: 'no-cache', // overriding because at least local caching is broken
      query: GET_APPLICATIONS_QUERY,
      variables: {
        query: {
          language: locale as ContentLanguage,
          queryString,
          sort: SortField.Popular,
          order,
          types,
          ...(tags.length && { tags }),
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
          countTag: [SearchableTags.Category, SearchableTags.Organization],
          types,
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
    searchResults,
    countResults,
    namespace,
    showSearchInHeader: false,
    page,
  }
}

export default withMainLayout(Applications, { showSearchInHeader: false })
