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
import { useRouter } from 'next/router'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'

type SearchState = {
  currentTerm: string
  results: OperatingLicense[]
  currentPageNumber: number,
  hasNextPage: boolean,
  totalCount: number,
  isLoadingFirstPage: boolean,
  isLoadingNextPage: boolean,
  hasError: boolean,
}

const SEARCH_REDUCER_ACTION_TYPES = {
  START_LOADING_FIRST_PAGE: 'START_LOADING_FIRST_PAGE',
  START_LOADING_NEXT_PAGE: 'START_LOADING_NEXT_PAGE',
  SEARCH_SUCCESS_FIRST_PAGE: 'SEARCH_SUCCESS_FIRST_PAGE',
  SEARCH_SUCCESS_NEXT_PAGE: 'SEARCH_SUCCESS_NEXT_PAGE',
  SEARCH_ERROR: 'SEARCH_ERROR',
}

const searchReducer = (state: SearchState, action): SearchState => {
  // TODO: Refactor this switch statement to if statements, altering the state and returning it in the end.
  switch (action.type) {
    case SEARCH_REDUCER_ACTION_TYPES.START_LOADING_FIRST_PAGE:
      return { ...state,
        currentTerm: action.currentTerm,
        currentPageNumber: action.currentPageNumber,
        isLoadingFirstPage: true,
        hasError: false,
      }
    case SEARCH_REDUCER_ACTION_TYPES.START_LOADING_NEXT_PAGE:
      return { ...state,
        currentTerm: action.currentTerm,
        currentPageNumber: action.currentPageNumber,
        isLoadingNextPage: true,
        hasError: false,
      }
    case SEARCH_REDUCER_ACTION_TYPES.SEARCH_SUCCESS_FIRST_PAGE:
      // Request-Response matching based on current search term and current page number.
      if (action.searchQuery === state.currentTerm && action.currentPageNumber === state.currentPageNumber) {
        return { ...state,
          results: action.results,
          hasNextPage: action.hasNextPage,
          totalCount: action.totalCount,
          isLoadingFirstPage: false,
          hasError: false,
        }
      }
      else {
        // Request-Response mismatch. Ignore outdated action.
        return state
      }

    case SEARCH_REDUCER_ACTION_TYPES.SEARCH_SUCCESS_NEXT_PAGE:
      // Request-Response matching, based on current search term and current page.
      // TODO: BUG, trailing space in search string, makes loading hang. (Potentially fixed by trimming the values before comparing for request-response match)
      if (action.searchQuery === state.currentTerm && action.currentPageNumber === state.currentPageNumber) {
        return { ...state,
          results: [ ...state.results, ...action.results],
          hasNextPage: action.hasNextPage,
          totalCount: action.totalCount,
          isLoadingNextPage: false,
          hasError: false,
        }
      }
      else {
        // Request-Response mismatch. Ignore outdated action.
        return state
      }
    case SEARCH_REDUCER_ACTION_TYPES.SEARCH_ERROR:
      console.error(action.error)
      return { ...state,
        hasError: true,
        isLoadingFirstPage: false,
        isLoadingNextPage: false,
      }
    default: {
      console.error('Unhandled search reducer action type.')
      return { ...state,
        hasError: true,
        isLoadingFirstPage: false,
        isLoadingNextPage: false,
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
    currentTerm: term,
    results: [],
    // TODO: Only show loading dots on initial load and next page load.
    // TODO: The reload icon in the search bar disappears before the results have been fully loaded. It's not in sync with the loading dots that are shown depending on the same boolean variable.
    currentPageNumber: currentPageNumber,
    hasNextPage: false,
    totalCount: 0,
    isLoadingFirstPage: false,
    isLoadingNextPage: false,
    hasError: false,
  })
  const client = useApolloClient()
  const timer = useRef(null)

  useEffect(() => {
    if (currentPageNumber === 1) {
      dispatch({
        type: SEARCH_REDUCER_ACTION_TYPES.START_LOADING_FIRST_PAGE,
        currentTerm: term,
        currentPageNumber: currentPageNumber
      })
    }
    else
    {
      dispatch({
        type: SEARCH_REDUCER_ACTION_TYPES.START_LOADING_NEXT_PAGE,
        currentTerm: term,
        currentPageNumber: currentPageNumber
      })
    }


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
              searchQuery: searchQuery ?? '',
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
              searchQuery: searchQuery ?? '',
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
      <Box paddingBottom={2}>
        <Text variant="h1" as="h2">
          {subpage.title}
        </Text>
      </Box>
      <Box
        marginBottom={3}
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
        <Box
          paddingTop={1}
          textAlign="center"
          style={{
            visibility: search.isLoadingFirstPage ? 'visible' : 'hidden'
          }}
        >
          <LoadingDots/>
        </Box>
      </Box>
      {!search.isLoadingFirstPage && !search.isLoadingNextPage && !search.hasError && search.results.length === 0 &&
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
        paddingTop={1}
        paddingBottom={2}
        textAlign="center"
        style={{
          visibility: search.isLoadingNextPage ? 'visible' : 'hidden'
        }}
      >
        <LoadingDots/>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        marginY={2}
        textAlign="center"
      >
        {search.hasNextPage && (
          <Button
            onClick={() => onLoadMore()}
            disabled={search.isLoadingFirstPage || search.isLoadingNextPage}
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
