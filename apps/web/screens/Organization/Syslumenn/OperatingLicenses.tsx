/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useReducer, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { ApolloClient } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'

import { SliceType } from '@island.is/island-ui/contentful'
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
import {
  OrganizationWrapper,
  SyslumennListCsvExport,
  Webreader,
} from '@island.is/web/components'
import {
  ContentLanguage,
  OperatingLicense,
  Query,
  QueryGetNamespaceArgs,
  QueryGetOperatingLicensesArgs,
  QueryGetOrganizationPageArgs,
  QueryGetOrganizationSubpageArgs,
} from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'
import { webRichText } from '@island.is/web/utils/richText'
import { safelyExtractPathnameFromUrl } from '@island.is/web/utils/safelyExtractPathnameFromUrl'

import { Screen } from '../../../types'
import {
  GET_NAMESPACE_QUERY,
  GET_OPERATING_LICENSES_CSV_QUERY,
  GET_OPERATING_LICENSES_QUERY,
  GET_ORGANIZATION_PAGE_QUERY,
  GET_ORGANIZATION_SUBPAGE_QUERY,
} from '../../queries'

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
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore make web strict
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

const useSearch = (
  term: string,
  currentPageNumber: number,
  client: ApolloClient<object>,
): SearchState => {
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore make web strict
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
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()
  const Router = useRouter()
  const { format } = useDateUtils()
  const DATE_FORMAT = n('operatingLicenseDateFormat', 'd. MMMM yyyy')

  useContentfulId(organizationPage?.id, subpage?.id)

  const pageUrl = Router.pathname
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  const navList: NavigationItem[] = organizationPage?.menuLinks.map(
    ({ primaryLink, childrenLinks }) => ({
      title: primaryLink?.text,
      href: primaryLink?.url,
      active: pageUrl === primaryLink?.url,
      items: childrenLinks.map(({ text, url }) => ({
        title: text,
        href: url,
      })),
    }),
  )

  const [query, setQuery] = useState(' ')
  const [currentPageNumber, setCurrentPageNumber] = useState(1)
  const client = useApolloClient()
  const search = useSearch(query, currentPageNumber, client)

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

  const csvStringProvider = () => {
    return new Promise<string>((resolve, reject) => {
      client
        .query<Query>({
          query: GET_OPERATING_LICENSES_CSV_QUERY,
        })
        .then(({ data: { getOperatingLicensesCSV } }) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore make web strict
          return resolve(getOperatingLicensesCSV.value)
        })
        .catch(() => {
          reject('Unable to fetch CSV data.')
        })
    })
  }

  return (
    <OrganizationWrapper
      pageTitle={subpage?.title ?? ''}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      organizationPage={organizationPage}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      pageFeaturedImage={
        subpage?.featuredImage ?? organizationPage?.featuredImage
      }
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
        title: n('navigationTitle', 'Efnisyfirlit'),
        items: navList,
      }}
    >
      <Box paddingBottom={0}>
        <Text variant="h1" as="h2">
          {subpage?.title}
        </Text>
        <Webreader
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore make web strict
          readId={null}
          readClass="rs_read"
        />
      </Box>
      {webRichText((subpage?.description ?? []) as SliceType[])}
      <Box marginBottom={3}>
        <Input
          name="operatingLicenseSearchInput"
          placeholder={n('operatingLicensesFilterSearch', 'Leita')}
          backgroundColor={['blue', 'blue', 'white']}
          size="sm"
          icon={{ name: 'search', type: 'outline' }}
          onChange={(event) => onSearch(event.target.value)}
        />
        <Box textAlign="right" marginRight={1} marginTop={1}>
          <SyslumennListCsvExport
            defaultLabel={n(
              'operatingLicensesCSVButtonLabelDefault',
              'Sækja öll rekstrarleyfi (CSV)',
            )}
            loadingLabel={n(
              'operatingLicensesCSVButtonLabelLoading',
              'Sæki öll rekstrarleyfi...',
            )}
            errorLabel={n(
              'operatingLicensesCSVButtonLabelError',
              'Ekki tókst að sækja rekstrarleyfi, reyndu aftur',
            )}
            csvFilenamePrefix={n(
              'operatingLicensesCSVFileTitlePrefix',
              'Rekstrarleyfi',
            )}
            csvStringProvider={csvStringProvider}
          />
        </Box>
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
                {getLicenseValidPeriod(operatingLicense)}{' '}
                {operatingLicense.validTo ? (
                  <span>
                    -{' '}
                    <strong>
                      {n(
                        'operatingLicensesTemporaryPermit',
                        'Bráðabirgðaleyfi',
                      )}
                    </strong>
                  </span>
                ) : null}
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
              {typeof operatingLicense.maximumNumberOfGuests === 'number' &&
                operatingLicense.maximumNumberOfGuests > 0 && (
                  <Text paddingBottom={0}>
                    {n(
                      'operatingLicensesMaximumNumberOfAccommodationGuests',
                      'Hámarksfjöldi gesta í gistingu',
                    )}
                    : {operatingLicense.maximumNumberOfGuests}
                  </Text>
                )}
              {typeof operatingLicense.numberOfDiningGuests === 'number' &&
                operatingLicense.numberOfDiningGuests > 0 && (
                  <Text paddingBottom={0}>
                    {n(
                      'operatingLicensesMaximumNumberOfDiningGuests',
                      'Hámarksfjöldi gesta í veitingum',
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

OperatingLicenses.getProps = async ({ apolloClient, locale, req }) => {
  const pathname = safelyExtractPathnameFromUrl(req.url)
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
          subpageSlugs: [subSlug],
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
        variables.data.getNamespace?.fields
          ? JSON.parse(variables.data.getNamespace.fields)
          : {},
      ),
  ])

  if (!getOrganizationSubpage) {
    throw new CustomNextError(404, 'Organization subpage not found')
  }

  const usingDefaultHeader: boolean = namespace['usingDefaultHeader'] ?? false

  return {
    organizationPage: getOrganizationPage,
    subpage: getOrganizationSubpage,
    namespace,
    showSearchInHeader: false,
    themeConfig: !usingDefaultHeader
      ? {
          headerButtonColorScheme: 'negative',
          headerColorScheme: 'white',
        }
      : {},
  }
}

export default withMainLayout(OperatingLicenses, {
  footerVersion: 'organization',
})
