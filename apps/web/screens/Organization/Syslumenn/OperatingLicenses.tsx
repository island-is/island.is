/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState, useRef, useReducer } from 'react'
import { useApolloClient } from '@apollo/client/react'
import {
  AlertMessage,
  Box,
  Button,
  Input,
  LoadingDots,
  NavigationItem,
  Tag,
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
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import { richText, SliceType } from '@island.is/island-ui/contentful'
import {
  getOrganizationPageSlugFromPathname,
  getOrganizationSubpageSlugFromPathname,
} from '@island.is/web/utils/organizationUtils'

const DEBOUNCE_TIMER = 400
const PAGE_SIZE = 10

type SearchState = {
  currentTerm: string
  results: OperatingLicense[]
  currentPageNumber: number
  hasNextPage: boolean
  totalCount: number
  isLoadingFirstPage: boolean
  isLoadingNextPage: boolean
  hasError: boolean
}

const SEARCH_REDUCER_ACTION_TYPES = {
  START_LOADING_FIRST_PAGE: 'START_LOADING_FIRST_PAGE',
  START_LOADING_NEXT_PAGE: 'START_LOADING_NEXT_PAGE',
  SEARCH_SUCCESS_FIRST_PAGE: 'SEARCH_SUCCESS_FIRST_PAGE',
  SEARCH_SUCCESS_NEXT_PAGE: 'SEARCH_SUCCESS_NEXT_PAGE',
  SEARCH_ERROR: 'SEARCH_ERROR',
}

const searchReducer = (state: SearchState, action): SearchState => {
  switch (action.type) {
    case SEARCH_REDUCER_ACTION_TYPES.START_LOADING_FIRST_PAGE:
      return {
        ...state,
        currentTerm: action.currentTerm,
        currentPageNumber: action.currentPageNumber,
        isLoadingFirstPage: true,
        hasError: false,
      }
    case SEARCH_REDUCER_ACTION_TYPES.START_LOADING_NEXT_PAGE:
      return {
        ...state,
        currentTerm: action.currentTerm,
        currentPageNumber: action.currentPageNumber,
        isLoadingNextPage: true,
        hasError: false,
      }
    case SEARCH_REDUCER_ACTION_TYPES.SEARCH_SUCCESS_FIRST_PAGE:
      // Request-Response matching based on current search term and current page number.
      if (
        action.searchQuery === state.currentTerm &&
        action.currentPageNumber === state.currentPageNumber
      ) {
        return {
          ...state,
          results: action.results,
          hasNextPage: action.hasNextPage,
          totalCount: action.totalCount,
          isLoadingFirstPage: false,
          hasError: false,
        }
      } else {
        // Request-Response mismatch. Ignore outdated action.
        return state
      }

    case SEARCH_REDUCER_ACTION_TYPES.SEARCH_SUCCESS_NEXT_PAGE:
      // Request-Response matching, based on current search term and current page.
      if (
        action.searchQuery === state.currentTerm &&
        action.currentPageNumber === state.currentPageNumber
      ) {
        return {
          ...state,
          results: [...state.results, ...action.results],
          hasNextPage: action.hasNextPage,
          totalCount: action.totalCount,
          isLoadingNextPage: false,
          hasError: false,
        }
      } else {
        // Request-Response mismatch. Ignore outdated action.
        return state
      }
    case SEARCH_REDUCER_ACTION_TYPES.SEARCH_ERROR:
      console.error(action.error)
      return {
        ...state,
        hasError: true,
        isLoadingFirstPage: false,
        isLoadingNextPage: false,
      }
    default: {
      console.error('Unhandled search reducer action type.')
      return {
        ...state,
        hasError: true,
        isLoadingFirstPage: false,
        isLoadingNextPage: false,
      }
    }
  }
}

const useSearch = (term: string, currentPageNumber: number): SearchState => {
  const [state, dispatch] = useReducer(searchReducer, {
    currentTerm: term,
    results: [],
    currentPageNumber: currentPageNumber,
    hasNextPage: false,
    totalCount: 0,
    isLoadingFirstPage: true,
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
        currentPageNumber: currentPageNumber,
      })
    } else {
      dispatch({
        type: SEARCH_REDUCER_ACTION_TYPES.START_LOADING_NEXT_PAGE,
        currentTerm: term,
        currentPageNumber: currentPageNumber,
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
        .then(
          ({
            data: {
              getOperatingLicenses: { results, paginationInfo, searchQuery },
            },
          }) => {
            if (paginationInfo.pageNumber === 1) {
              // First page
              dispatch({
                type: SEARCH_REDUCER_ACTION_TYPES.SEARCH_SUCCESS_FIRST_PAGE,
                results,
                currentPageNumber: paginationInfo.pageNumber,
                hasNextPage: paginationInfo.hasNext,
                totalCount: paginationInfo.totalCount,
                searchQuery: searchQuery ?? '',
              })
            } else {
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
          },
        )
        .catch((error) => {
          dispatch({
            type: SEARCH_REDUCER_ACTION_TYPES.SEARCH_ERROR,
            error,
          })
        })
    }, DEBOUNCE_TIMER))

    return () => clearTimeout(thisTimerId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, term, currentPageNumber, dispatch])

  return state
}

interface OperatingLicensesProps {
  organizationPage: Query['getOrganizationPage']
  subpage: Query['getOrganizationSubpage']
  namespace: Query['getNamespace']
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
  const DATE_FORMAT = n('operatingLicenseDateFormat', 'd. MMMM yyyy')

  useContentfulId(organizationPage.id, subpage.id)

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

  const getLicenseValidPeriod = (license: OperatingLicense) => {
    const validFrom = license.validFrom ? new Date(license.validFrom) : null
    const validTo = license.validTo ? new Date(license.validTo) : null

    if (validFrom && validTo) {
      return `${format(validFrom, DATE_FORMAT)} - ${format(
        validTo,
        DATE_FORMAT,
      )}`
    }
    if (!validFrom && validTo) {
      return `${n('operatingLicensesValidUntil', 'Til')} ${format(
        validTo,
        DATE_FORMAT,
      )}`
    }
    if (!validTo) {
      return n('operatingLicenseValidPeriodIndefinite', 'Ótímabundið')
    }
  }

  const getLicenseAddress = (license: OperatingLicense) => {
    // In many cases, both the street and location fields contain the same value. To avoid
    // repeating the info, we don't show the street value if it is the same as the location value.
    const street = license.street === license.location ? '' : license.street
    let address = ''
    if (license.location) {
      address += license.location
    }
    if (street) {
      if (address) {
        // Add whitespace between location and street
        address += ' '
      }
      address += street
    }
    if (license.postalCode) {
      if (address) {
        // Add separator between location/street and postal code.
        address += ', '
      }
      address += license.postalCode
    }
    return address
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
      {richText(subpage.description as SliceType[])}
      <Box marginBottom={3}>
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
            visibility: search.isLoadingFirstPage ? 'visible' : 'hidden',
          }}
        >
          <LoadingDots />
        </Box>
      </Box>
      {!search.isLoadingFirstPage &&
        !search.isLoadingNextPage &&
        !search.hasError &&
        search.results.length === 0 && (
          <Box display="flex" marginTop={4} justifyContent="center">
            <Text variant="h3">
              {n(
                'operatingLicensesNoSearchResults',
                'Engin rekstrarleyfi fundust.',
              )}
            </Text>
          </Box>
        )}
      {search.results.map((operatingLicense) => {
        return (
          <Box
            key={operatingLicense.id}
            border="standard"
            borderRadius="large"
            marginY={2}
            paddingY={3}
            paddingX={4}
          >
            <Box
              alignItems="flexStart"
              display="flex"
              flexDirection={[
                'columnReverse',
                'columnReverse',
                'columnReverse',
                'row',
              ]}
              justifyContent="spaceBetween"
            >
              <Text variant="eyebrow" color="purple400" paddingTop={1}>
                {operatingLicense.type2 ?? operatingLicense.type}
                {operatingLicense.category && ` - ${operatingLicense.category}`}
                {operatingLicense.restaurantType &&
                  ` (${operatingLicense.restaurantType})`}
              </Text>
              <Box marginBottom={[2, 2, 2, 0]}>
                <Tag disabled>{operatingLicense.issuedBy}</Tag>
              </Box>
            </Box>
            <Box>
              <Text variant="h3">
                {operatingLicense.name ?? operatingLicense.location}
              </Text>
              <Text paddingBottom={1}>
                {getLicenseAddress(operatingLicense)}
              </Text>

              <Text paddingBottom={0}>
                {n('operatingLicensesLicenseNumber', 'Leyfisnúmer')}:{' '}
                {operatingLicense.licenseNumber}
              </Text>
              <Text paddingBottom={2}>
                {n('operatingLicensesValidPeriod', 'Gildistími')}:{' '}
                {getLicenseValidPeriod(operatingLicense)}
              </Text>

              <Text paddingBottom={0}>
                {n('operatingLicensesLicenseHolder', 'Leyfishafi')}:{' '}
                {operatingLicense.licenseHolder}
              </Text>
              <Text paddingBottom={2}>
                {n('operatingLicensesLicenseResponsible', 'Ábyrgðarmaður')}:{' '}
                {operatingLicense.licenseResponsible}
              </Text>

              {operatingLicense.outdoorLicense && (
                <Text paddingBottom={0}>
                  {n(
                    'operatingLicensesOutdoorLicense',
                    'Leyfi til útiveitinga',
                  )}
                  : {operatingLicense.outdoorLicense}
                </Text>
              )}
              {operatingLicense.alcoholWeekdayLicense && (
                <Text paddingBottom={0}>
                  {n(
                    'operatingLicensesAlcoholWeekdayLicense',
                    'Afgreiðslutími áfengis virka daga',
                  )}
                  : {operatingLicense.alcoholWeekdayLicense}
                </Text>
              )}
              {operatingLicense.alcoholWeekendLicense && (
                <Text paddingBottom={0}>
                  {n(
                    'operatingLicensesAlcoholWeekendLicense',
                    'Afgreiðslutími áfengis um helgar',
                  )}
                  : {operatingLicense.alcoholWeekendLicense}
                </Text>
              )}
              {operatingLicense.alcoholWeekdayOutdoorLicense && (
                <Text paddingBottom={0}>
                  {n(
                    'operatingLicensesAlcoholWeekdayOutdoorLicense',
                    'Afgreiðslutími áfengis virka daga (útiveitingar)',
                  )}
                  : {operatingLicense.alcoholWeekdayOutdoorLicense}
                </Text>
              )}
              {operatingLicense.alcoholWeekendOutdoorLicense && (
                <Text paddingBottom={0}>
                  {n(
                    'operatingLicensesAlcoholWeekendOutdoorLicense',
                    'Afgreiðslutími áfengis um helgar (útiveitingar)',
                  )}
                  : {operatingLicense.alcoholWeekendOutdoorLicense}
                </Text>
              )}
              {operatingLicense.maximumNumberOfGuests > 0 && (
                <Text paddingBottom={0}>
                  {n(
                    'operatingLicensesAlcoholMaximumNumberOfGuests',
                    'Hámarksfjöldi gesta',
                  )}
                  : {operatingLicense.maximumNumberOfGuests}
                </Text>
              )}
              {operatingLicense.numberOfDiningGuests > 0 && (
                <Text paddingBottom={0}>
                  {n(
                    'operatingLicensesNumberOfDiningGuests',
                    'Fjöldi gesta í veitingum',
                  )}
                  : {operatingLicense.numberOfDiningGuests}
                </Text>
              )}
            </Box>
          </Box>
        )
      })}
      {search.hasError && (
        <AlertMessage
          title={n('operatingLicensesErrorTitle', 'Villa')}
          message={n(
            'operatingLicensesErrorDescription',
            'Villa kom upp við að sækja rekstrarleyfi.',
          )}
          type="error"
        />
      )}
      <Box
        display="flex"
        justifyContent="center"
        paddingTop={1}
        paddingBottom={2}
        textAlign="center"
        style={{
          visibility: search.isLoadingNextPage ? 'visible' : 'hidden',
        }}
      >
        <LoadingDots />
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        marginY={2}
        textAlign="center"
      >
        {search.hasNextPage && (
          <Button
            onClick={onLoadMore}
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

OperatingLicenses.getInitialProps = async ({
  apolloClient,
  locale,
  pathname,
}) => {
  const path = pathname?.split('/') ?? []
  const slug = path?.[path.length - 2] ?? 'syslumenn'
  const subSlug = path.pop() ?? 'rekstrarleyfi'

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
          slug: slug,
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient.query<Query, QueryGetOrganizationSubpageArgs>({
      query: GET_ORGANIZATION_SUBPAGE_QUERY,
      variables: {
        input: {
          organizationSlug: slug,
          slug: subSlug,
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
