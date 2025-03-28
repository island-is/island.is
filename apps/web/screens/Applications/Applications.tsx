import { useContext } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
} from 'next-usequerystate'

import {
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  Inline,
  Link,
  Pagination,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import {
  BackgroundImage,
  QueryFilterInput,
  SearchableTagsFilter,
  useQueryFilter,
  useSearchableTagsFilter,
} from '@island.is/web/components'
import { GlobalContext } from '@island.is/web/context'
import {
  type Article,
  type ContentLanguage,
  type GetApplicationsQuery,
  type GetNamespaceQuery,
  type GetSearchCountTagsQuery,
  type QueryGetNamespaceArgs,
  type QuerySearchResultsArgs,
  SearchableContentTypes,
  SearchableTags,
  SortDirection,
  SortField,
  type Tag as TagType,
} from '@island.is/web/graphql/schema'
import { useNamespaceStrict as useNamespace } from '@island.is/web/hooks'
import { useLinkResolver } from '@island.is/web/hooks'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'

import type { Screen } from '../../types'
import {
  GET_APPLICATIONS_QUERY,
  GET_NAMESPACE_QUERY,
  GET_SEARCH_COUNT_QUERY,
} from '../queries'
import type { ApplicationsTexts } from './Applications.types'
import * as styles from './Applications.css'

interface CategoryProps {
  page: number
  searchResults: GetApplicationsQuery['searchResults']
  countResults: GetSearchCountTagsQuery['searchResults']
  namespace: ApplicationsTexts
}

const PERPAGE = 15

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
  const {
    organization,
    category,
    reset: resetFilters,
  } = useSearchableTagsFilter()
  const { query: searchQuery, reset: resetFilterInput } = useQueryFilter()

  const articles = searchResults.items as Article[]
  const nothingFound = searchResults.items.length === 0
  const totalSearchResults = searchResults.total
  const totalPages = Math.ceil(totalSearchResults / PERPAGE)
  const hasFilters = organization.length || category.length || searchQuery

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
              {hasFilters && (
                <Button
                  variant="text"
                  size="small"
                  onClick={handleCLearAllFilter}
                  icon="reload"
                  nowrap
                >
                  {gn('filterClearAll', 'Hreinsa allar síur')}
                </Button>
              )}

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
          : {},
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
