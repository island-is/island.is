/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState, useRef, useReducer } from 'react'
import { useApolloClient } from '@apollo/client/react'
import {
  AlertBanner,
  Box,
  Button,
  GridColumn,
  GridRow,
  Input,
  LoadingDots,
  NavigationItem,
  Text,
} from '@island.is/island-ui/core'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  ContentLanguage,
  Query,
  QueryGetOperatingLicensesArgs,
  QueryGetNamespaceArgs,
  QueryGetOrganizationPageArgs,
  QueryGetOrganizationSubpageArgs,
  OperatingLicense,
} from '@island.is/web/graphql/schema'
import {
  GET_NAMESPACE_QUERY,
  GET_ORGANIZATION_PAGE_QUERY,
  GET_ORGANIZATION_SUBPAGE_QUERY,
  GET_OPERATING_LICENSES_QUERY,
} from '../../queries'
import { Screen } from '../../../types'
import { useNamespace } from '@island.is/web/hooks'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { OrganizationWrapper } from '@island.is/web/components'
import { CustomNextError } from '@island.is/web/units/errors'
import { richText, SliceType } from '@island.is/island-ui/contentful'
import { useRouter } from 'next/router'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'

type SearchState = {
  term: string
  results: OperatingLicense[]
  currentPageNumber: number,
  hasNextPage: boolean,
  totalCount: number,
  isLoading: boolean,
  hasError: boolean,
}

const SEARCH_REDUCER_ACTION_TYPES = {
  START_LOADING: 'START_LOADING',
  SEARCH_SUCCESS_FIRST_PAGE: 'SEARCH_SUCCESS_FIRST_PAGE',
  SEARCH_SUCCESS_NEXT_PAGE: 'SEARCH_SUCCESS_NEXT_PAGE',
  SEARCH_ERROR: 'SEARCH_ERROR',
}

const searchReducer = (state: SearchState, action): SearchState => {
  switch (action.type) {
    case SEARCH_REDUCER_ACTION_TYPES.START_LOADING:
      return { ...state,
        isLoading: true,
        hasError: false,
      }
    case SEARCH_REDUCER_ACTION_TYPES.SEARCH_SUCCESS_FIRST_PAGE:
      // TODO: Do Request-Response matching
      return { ...state,
        results: action.results,
        currentPageNumber: 1,
        hasNextPage: action.hasNextPage,
        totalCount: action.totalCount,
        isLoading: false,
        hasError: false,
      }
    case SEARCH_REDUCER_ACTION_TYPES.SEARCH_SUCCESS_NEXT_PAGE:
      return { ...state,
        results: [ ...state.results, ...action.results],
        currentPageNumber: action.currentPageNumber,
        hasNextPage: action.hasNextPage,
        totalCount: action.totalCount,
        isLoading: false,
        hasError: false,
      }
    case SEARCH_REDUCER_ACTION_TYPES.SEARCH_ERROR:
      console.error(action.error)
      return { ...state,
        hasError: true,
        isLoading: false
      }
    default: {
      console.error('Unhandled search reducer action type.')
      return { ...state,
        hasError: true,
        isLoading: false
      }
    }
  }
}


interface OperatingLicensesProps {
  organizationPage: Query['getOrganizationPage']
  subpage: Query['getOrganizationSubpage']
  namespace: Query['getNamespace']
}

// TODO: Find an appropriate debounce timer
const DEBOUNCE_TIMER = 400
// TODO: Find an appropriate page size.
const PAGE_SIZE = 10

const useSearch = ( term: string, currentPageNumber: number ): SearchState => {
  const [state, dispatch] = useReducer(searchReducer, {
    term: term,
    results: [],
    // TODO: Show loading animation in the input field, similar to how it's done on the home screen.
    currentPageNumber: currentPageNumber,
    hasNextPage: false,
    totalCount: 0,
    isLoading: false,
    hasError: false,
  })
  const client = useApolloClient()
  const timer = useRef(null)

  useEffect(() => {
    dispatch({ type: SEARCH_REDUCER_ACTION_TYPES.START_LOADING })

    const thisTimerId = (timer.current = setTimeout(async () => {
      client
        .query<Query, QueryGetOperatingLicensesArgs>({
          query: GET_OPERATING_LICENSES_QUERY,
          variables: {
            input: {
              searchBy: term,
              pageNumber: currentPageNumber,
              pageSize: PAGE_SIZE,
            },
          },
        })
        .then(({ data: { getOperatingLicenses: { results, paginationInfo, searchQuery} }}) => {
          if (paginationInfo.pageNumber === 1)
          {
            // First page
            dispatch({
              type: SEARCH_REDUCER_ACTION_TYPES.SEARCH_SUCCESS_FIRST_PAGE,
              results,
              currentPageNumber: paginationInfo.pageNumber,
              hasNextPage: paginationInfo.hasNext,
              totalCount: paginationInfo.totalCount,
              searchQuery,  // TODO: Use for request-response matching
            })
          }
          else
          {
            // Next pages
            dispatch({
              type: SEARCH_REDUCER_ACTION_TYPES.SEARCH_SUCCESS_NEXT_PAGE,
              results,
              currentPageNumber: paginationInfo.pageNumber,
              hasNextPage: paginationInfo.hasNext,
              totalCount: paginationInfo.totalCount,
              searchQuery,  // TODO: Use for request-response matching
            })
          }

        })
        .catch((error) => {
          // TODO: Test the error handling by producing an error, e.g. by commenting out the Authenitication call in the client.
          dispatch({
            type: SEARCH_REDUCER_ACTION_TYPES.SEARCH_ERROR,
            error
          })
        })
    }, DEBOUNCE_TIMER))

    return () => clearTimeout(thisTimerId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, term, currentPageNumber, dispatch])

  return state
}

const OperatingLicenses: Screen<OperatingLicensesProps> = ({
  organizationPage,
  subpage,
  namespace,
}) => {
  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()
  const Router = useRouter()
  const { format } = useDateUtils()

  const pageUrl = Router.pathname

  const navList: NavigationItem[] = organizationPage.menuLinks.map(
    ({ primaryLink, childrenLinks }) => ({
      title: primaryLink.text,
      href: primaryLink.url,
      active: pageUrl.includes(primaryLink.url),
      items: childrenLinks.map(({ text, url }) => ({
        title: text,
        href: url,
      })),
    }),
  )

  const [query, setQuery] = useState(' ')
  const [currentPageNumber, setCurrentPageNumber] = useState(1)
  const search = useSearch(query, currentPageNumber)

  useEffect(() => {
    // Note: This is a workaround to fix an issue where the search input looses focus after the first keypress.
    setQuery('')
  }, [])

  const onSearch = (query: string) => {
    setCurrentPageNumber(1)
    setQuery(query)
  }

  const onLoadMore = () => {
    setCurrentPageNumber(currentPageNumber + 1)
  }

  return (
    <OrganizationWrapper
      pageTitle={subpage.title}
      organizationPage={organizationPage}
      pageFeaturedImage={subpage.featuredImage}
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
      <Box paddingBottom={4}>
        <Text variant="h1" as="h2">
          {subpage.title}
        </Text>
      </Box>
      <Box
        marginBottom={6}
      >
        <Input
          name="operatingLicenseSearchInput"
          placeholder={n('operatingLicensesFilterSearch', 'Leita')}
          backgroundColor={['blue', 'blue', 'white']}
          size="sm"
          icon="search"
          iconType="outline"
          onChange={(event) => onSearch(event.target.value)}
        />
      </Box>
      {!search.isLoading && !search.hasError && search.results.length === 0 &&
        <Box display="flex" marginTop={4} justifyContent="center">
          <Text variant="h3">
            {n('operatingLicensesNoSearchResults', 'Engin rekstrarleyfi fundust.')}
          </Text>
        </Box>
      }
      {search.results.map((operatingLicense, index) => {
        return (
          <Box
            key={index}
            border="standard"
            borderRadius="large"
            marginY={2}
            paddingY={3}
            paddingX={4}
          >
            <Text variant="h4" color="blue400" marginBottom={1}>
              {operatingLicense.name ? operatingLicense.name : operatingLicense.location}
            </Text>
            <GridRow>
              <GridColumn span={['12/12', '12/12', '12/12']}>
                <Text>Leyfisnúmer: {operatingLicense.licenseNumber}</Text>
                <Text>Staður: {operatingLicense.location}</Text>
                <Text>Gata: {operatingLicense.street}</Text>
                {operatingLicense.postalCode && (
                  <Text>Póstnúmer: {operatingLicense.postalCode}</Text>
                )}
                {operatingLicense.validUntil && (
                  <Text>
                    Gildir til{' '}
                    {format(new Date(operatingLicense.validUntil), 'd. MMMM yyyy')}
                  </Text>
                )}
                <Text>{operatingLicense.type}</Text>
                <Text>{operatingLicense.category}</Text>
                <Text>Útgefandi: {operatingLicense.issuedBy}</Text>
                <Text>Leyfishafi: {operatingLicense.licenseHolder}</Text>
              </GridColumn>
            </GridRow>
          </Box>
        )
      })}
      {search.hasError &&
        <AlertBanner
          title={n('operatingLicensesErrorTitle', 'Villa')}
          description={n('operatingLicensesErrorDescription', 'Villa kom upp við að sækja rekstrarleyfi.')}
          variant="error"
        />
      }
      <Box
        display="flex"
        justifyContent="center"
        // TODO: Fix the UI so that id does not shift when pushing the "Load more" button.
        paddingTop={2}
        paddingBottom={2}
        textAlign="center"
      >
        {search.isLoading &&
          <LoadingDots />
        }
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        marginY={3}
        textAlign="center"
      >
        {search.hasNextPage && (
          <Button
            onClick={() => onLoadMore()}
            disabled={search.isLoading}
          >
            {n('operatingLicensesSeeMore', 'Sjá fleiri')} (
            {search.totalCount - search.results.length})
          </Button>
        )}
      </Box>
    </OrganizationWrapper>
  )
}

OperatingLicenses.getInitialProps = async ({ apolloClient, locale, query }) => {
  const [
    {
      data: { getOrganizationPage },
    },
    {
      data: { getOrganizationSubpage },
    },
    namespace,
  ] = await Promise.all([
    apolloClient.query<Query, QueryGetOrganizationPageArgs>({
      query: GET_ORGANIZATION_PAGE_QUERY,
      variables: {
        input: {
          slug: 'syslumenn',
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient.query<Query, QueryGetOrganizationSubpageArgs>({
      query: GET_ORGANIZATION_SUBPAGE_QUERY,
      variables: {
        input: {
          organizationSlug: 'syslumenn',
          slug: 'rekstrarleyfi',
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient
      .query<Query, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'Syslumenn',
            lang: locale,
          },
        },
      })
      .then((variables) =>
        variables.data.getNamespace.fields
          ? JSON.parse(variables.data.getNamespace.fields)
          : {},
      ),
  ])

  if (!getOrganizationSubpage) {
    throw new CustomNextError(404, 'Organization subpage not found')
  }

  return {
    organizationPage: getOrganizationPage,
    subpage: getOrganizationSubpage,
    namespace,
    showSearchInHeader: false,
  }
}

export default withMainLayout(OperatingLicenses, {
  headerButtonColorScheme: 'negative',
  headerColorScheme: 'white',
})
