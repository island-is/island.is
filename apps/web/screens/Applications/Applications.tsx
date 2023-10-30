import { useContext } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import {
  Box,
  Text,
  Pagination,
  Link,
  Inline,
  GridContainer,
  GridRow,
  GridColumn,
  Button,
  Table as T,
} from '@island.is/island-ui/core'
import {
  QueryFilterInput,
  SearchableTagsFilter,
  BackgroundImage,
  useSearchableTagsFilter,
  useQueryFilter,
} from '@island.is/web/components'
import { useNamespaceStrict as useNamespace } from '@island.is/web/hooks'
import { GlobalContext } from '@island.is/web/context'
import { CustomNextError } from '@island.is/web/units/errors'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  SearchableContentTypes,
  SearchableTags,
  SortField,
  SortDirection,
  type Tag as TagType,
  type GetApplicationsQuery,
  type GetSearchCountTagsQuery,
  type QuerySearchResultsArgs,
  type ContentLanguage,
  type QueryGetNamespaceArgs,
  type GetNamespaceQuery,
  type Article,
} from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'
import type { Screen } from '../../types'
import {
  GET_NAMESPACE_QUERY,
  GET_APPLICATIONS_QUERY,
  GET_SEARCH_COUNT_QUERY,
} from '../queries'

import {
  parseAsString,
  parseAsInteger,
  parseAsArrayOf,
} from 'next-usequerystate'
import type { ApplicationsTexts } from './Applications.types'

import * as styles from './Applications.css'

interface CategoryProps {
  page: number
  searchResults: GetApplicationsQuery['searchResults']
  countResults: GetSearchCountTagsQuery['searchResults']
  namespace: ApplicationsTexts
}

const PERPAGE = 10

const Applications: Screen<CategoryProps> = ({
  page,
  searchResults,
  countResults,
  namespace,
}) => {
  const { query } = useRouter()
  const { globalNamespace } = useContext(GlobalContext)
  const gn = useNamespace(globalNamespace)
  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()
  const { reset: resetFilters } = useSearchableTagsFilter()
  const { reset: resetFilterInput } = useQueryFilter()

  const articles = searchResults.items as Article[]
  const nothingFound = searchResults.items.length === 0
  const totalSearchResults = searchResults.total
  const totalPages = Math.ceil(totalSearchResults / PERPAGE)

  const handleCLearAllFilter = () => {
    resetFilterInput()
    resetFilters()
  }

  return (
    <>
      <Head>
        <title>{n('pageTitle', 'Umsóknir á Ísland.is')} | Ísland.is</title>
      </Head>
      <GridContainer>
        <GridRow>
          <GridColumn span={['12/12']} paddingBottom={6}>
            <Text variant="h1" as="h2" marginBottom={2}>
              {n('pageTitle', 'Umsóknir á Ísland.is')}
            </Text>
            <Text variant="intro" as="p" marginBottom={8}>
              {n(
                'pageBody',
                'Hér getur þú fundið allar umsóknir island.is á einum stað.',
              )}
            </Text>
            <Inline
              justifyContent="flexEnd"
              alignY="center"
              space={2}
              flexWrap="nowrap"
              collapseBelow="md"
            >
              <QueryFilterInput />
              <SearchableTagsFilter
                resultCount={totalSearchResults}
                tags={countResults.tagCounts ?? []}
              />
            </Inline>
            <Box marginTop={5}>
              {nothingFound ? (
                <>
                  <Text variant="intro" as="p" marginBottom={1}>
                    {gn(
                      'cantFindWhatYouAreLookingForText',
                      'Finnurðu ekki það sem þig vantar?',
                    )}
                  </Text>
                  <Button
                    variant="text"
                    onClick={handleCLearAllFilter}
                    icon="reload"
                    nowrap
                  >
                    {gn('filterClearAll', 'Hreinsa allar síur')}
                  </Button>
                </>
              ) : (
                <T.Table>
                  <T.Head>
                    <T.Row>
                      <T.HeadData text={{ variant: 'small' }}>
                        {n('applicationName', 'Heiti umsóknar')}
                      </T.HeadData>
                      <T.HeadData
                        text={{ variant: 'small' }}
                        box={{ className: styles.organizationColumn }}
                      >
                        {n('organization', 'Þjónustuaðili')}
                      </T.HeadData>
                      <T.HeadData></T.HeadData>
                    </T.Row>
                  </T.Head>
                  <T.Body>
                    {articles.map((article, index) => (
                      <T.Row key={index}>
                        <T.Data text={{ variant: 'h5' }}>
                          {article.title}
                        </T.Data>
                        <T.Data
                          text={{ variant: 'default' }}
                          box={{ className: styles.organizationColumn }}
                        >
                          <Inline
                            justifyContent="flexStart"
                            alignY="center"
                            space={2}
                            flexWrap="nowrap"
                          >
                            <Box className={styles.organizationLogo}>
                              <BackgroundImage
                                width={60}
                                backgroundSize="contain"
                                image={{ ...article.organization?.[0]?.logo }}
                                format="png"
                              />
                            </Box>
                            {article.organization?.[0]?.title}
                          </Inline>
                        </T.Data>
                        <T.Data align="right">
                          <Link
                            {...linkResolver('article', [article.slug])}
                            skipTab
                          >
                            <Button
                              variant="text"
                              size="small"
                              icon="arrowForward"
                              nowrap
                            >
                              {gn('readMore', 'Sjá nánar')}
                            </Button>
                          </Link>
                        </T.Data>
                      </T.Row>
                    ))}
                  </T.Body>
                </T.Table>
              )}
            </Box>
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
    category: categoryParam,
    organization: organizationParam,
  } = query
  const queryString = parseAsString.withDefault('*').parseServerSide(q)
  const page = parseAsInteger.withDefault(1).parseServerSide(pageParam)
  const order = SortDirection.Desc
  const category = parseAsArrayOf(parseAsString)
    .withDefault([])
    .parseServerSide(categoryParam)
  const organization = parseAsArrayOf(parseAsString)
    .withDefault([])
    .parseServerSide(organizationParam)
  const types = [SearchableContentTypes['WebArticle']]
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
            namespace: 'Applications',
            lang: locale,
          },
        },
      })
      .then<ApplicationsTexts>((variables) =>
        variables.data.getNamespace?.fields
          ? JSON.parse(variables.data.getNamespace.fields)
          : {} satisfies ApplicationsTexts,
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
