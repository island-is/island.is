import { useCallback, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { useWindowSize } from 'react-use'
import debounce from 'lodash/debounce'
import NextLink from 'next/link'
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryState,
} from 'next-usequerystate'
import { useLazyQuery } from '@apollo/client'

import {
  Box,
  BreadCrumbItem,
  Breadcrumbs,
  FilterInput,
  Pagination,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { debounceTime } from '@island.is/shared/constants'
import { Locale } from '@island.is/shared/types'
import {
  CustomPageLayoutHeader,
  CustomPageLayoutWrapper,
} from '@island.is/web/components'
import {
  ContentLanguage,
  CustomPage,
  CustomPageUniqueIdentifier,
  GenericTag,
  GetGrantsInputAvailabilityStatusEnum,
  GetGrantsInputSortByEnum,
  Grant,
  GrantList,
  Query,
  QueryGetCustomSubpageArgs,
  QueryGetGenericTagsInTagGroupsArgs,
  QueryGetGrantsArgs,
} from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import useLocalLinkTypeResolver from '@island.is/web/hooks/useLocalLinkTypeResolver'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'

import {
  CustomScreen,
  withCustomPageWrapper,
} from '../../CustomPage/CustomPageWrapper'
import SidebarLayout from '../../Layouts/SidebarLayout'
import { GET_CUSTOM_SUBPAGE_QUERY } from '../../queries/CustomPage'
import { GET_GENERIC_TAGS_IN_TAG_GROUPS_QUERY } from '../../queries/GenericTag'
import { GET_GRANTS_QUERY } from '../../queries/Grants'
import { m } from '../messages'
import { Availability } from '../types'
import { SearchResultsContent } from './SearchResultsContent'
import { GrantsSearchResultsFilter } from './SearchResultsFilter'
import * as styles from './SearchResults.css'

const PAGE_SIZE = 8

interface GrantsHomeProps {
  locale: Locale
  initialGrantList?: GrantList
  tags?: Array<GenericTag>
  customPageData?: CustomPage
  customSubpage?: CustomPage
}

const GrantsSearchResults: CustomScreen<GrantsHomeProps> = ({
  locale,
  initialGrantList,
  tags,
  customSubpage,
}) => {
  useContentfulId(customSubpage?.id)
  useLocalLinkTypeResolver('grantsplazasearch')

  const { formatMessage } = useIntl()
  const { linkResolver } = useLinkResolver()

  const parentUrl = linkResolver('grantsplaza', [], locale).href
  const currentUrl = linkResolver('grantsplazasearch', [], locale).href

  const [grants, setGrants] = useState<Array<Grant>>(
    initialGrantList?.items ?? [],
  )
  const [totalHits, setTotalHits] = useState<number | undefined>(
    initialGrantList?.total ?? 0,
  )

  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))
  const [query, setQuery] = useQueryState('query')
  const [categories, setCategories] = useQueryState(
    'category',
    parseAsArrayOf(parseAsString),
  )
  const [types, setTypes] = useQueryState('type', parseAsArrayOf(parseAsString))
  const [organizations, setOrganizations] = useQueryState(
    'organization',
    parseAsArrayOf(parseAsString),
  )
  const [status, setStatus] = useQueryState(
    'status',
    parseAsStringLiteral(Availability),
  )
  const [searchString, setSearchString] = useState<string | null>()

  const [initialRender, setInitialRender] = useState<boolean>(true)

  const { width } = useWindowSize()
  const isTablet = width <= theme.breakpoints.lg

  const [getGrants] = useLazyQuery<
    { getGrants: GrantList },
    QueryGetGrantsArgs
  >(GET_GRANTS_QUERY)

  const totalPages = useMemo(() => {
    if (!totalHits) {
      return
    }
    return totalHits > PAGE_SIZE ? Math.ceil(totalHits / PAGE_SIZE) : 1
  }, [totalHits])

  const fetchGrants = useCallback(() => {
    if (initialRender) {
      setInitialRender(false)
      return
    }
    getGrants({
      variables: {
        input: {
          categories: categories ? [...categories] : null,
          lang: locale,
          organizations: organizations ? [...organizations] : null,
          page,
          sort: GetGrantsInputSortByEnum.RecentlyUpdated,
          search: searchString,
          size: PAGE_SIZE,
          types: types ? [...types] : null,
          status: status
            ? status === 'closed'
              ? GetGrantsInputAvailabilityStatusEnum.Closed
              : GetGrantsInputAvailabilityStatusEnum.Open
            : undefined,
        },
      },
    })
      .then((res) => {
        if (res.data) {
          setGrants(res.data.getGrants.items)
          setTotalHits(res.data.getGrants.total)
        } else if (res.error) {
          setGrants([])
        }
      })
      .catch(() => {
        setGrants([])
      })
  }, [
    categories,
    getGrants,
    locale,
    organizations,
    page,
    status,
    searchString,
    types,
    initialRender,
  ])

  useEffect(() => {
    fetchGrants()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, locale, organizations, page, searchString, types, status])

  //SEARCH STATE UPDATES
  const debouncedSearchUpdate = useMemo(() => {
    return debounce(() => {
      setSearchString(query)
      setPage(null)
    }, debounceTime.search)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  useEffect(() => {
    debouncedSearchUpdate()
    return () => {
      debouncedSearchUpdate.cancel()
    }
  }, [debouncedSearchUpdate])

  const breadcrumbItems: Array<BreadCrumbItem> = [
    {
      title: 'Ísland.is',
      href: linkResolver('homepage', [], locale).href,
    },
    {
      title: formatMessage(m.home.title),
      href: parentUrl,
    },
    {
      title: formatMessage(m.search.results),
      href: currentUrl,
      isTag: true,
    },
  ]

  const onResetFilter = () => {
    setPage(null)
    setQuery(null)
    setSearchString(null)
    setCategories(null)
    setTypes(null)
    setOrganizations(null)
    setStatus(null)
  }

  const hitsMessage = useMemo(() => {
    if (!totalHits) {
      return
    }
    if (totalHits === 1) {
      return formatMessage(m.search.resultFound, {
        arg: <strong>{totalHits}</strong>,
      })
    }
    return formatMessage(m.search.resultsFound, {
      arg: <strong>{totalHits}</strong>,
    })
  }, [formatMessage, totalHits])

  const onSearchFilterUpdate = (categoryId: string, values?: Array<string>) => {
    const filteredValues = values?.length ? [...values] : null
    switch (categoryId) {
      case 'status': {
        const slug = values?.[0]
          ? Availability.find((v) => v === values[0])
          : undefined
        if (slug) {
          setStatus(slug === 'open' ? 'open' : 'closed')
        } else setStatus(null)
        break
      }
      case 'category': {
        setCategories(filteredValues)
        break
      }
      case 'type': {
        setTypes(filteredValues)
        break
      }
      case 'organization': {
        setOrganizations(filteredValues)
        break
      }
    }
    setPage(null)
  }

  return (
    <CustomPageLayoutWrapper
      pageTitle={formatMessage(m.home.title)}
      pageDescription={formatMessage(m.search.description)}
      pageFeaturedImage={formatMessage(m.home.featuredImage)}
    >
      <CustomPageLayoutHeader
        title={formatMessage(m.home.title)}
        description={formatMessage(m.home.description)}
        featuredImage={{
          src:
            customSubpage?.ogImage?.url ?? formatMessage(m.home.featuredImage),
          alt: formatMessage(m.home.featuredImageAlt),
        }}
        breadcrumbs={
          breadcrumbItems && (
            <Breadcrumbs
              items={breadcrumbItems ?? []}
              renderLink={(link, item) => {
                return item?.href ? (
                  <NextLink href={item?.href} legacyBehavior>
                    {link}
                  </NextLink>
                ) : (
                  link
                )
              }}
            />
          )
        }
      />
      <Box background="blue100" marginY={isTablet ? 6 : 8}>
        {!isTablet && (
          <SidebarLayout
            fullWidthContent={true}
            sidebarContent={
              <Stack space={3}>
                <Text variant="h4" as="h4" paddingY={1}>
                  {formatMessage(m.search.search)}
                </Text>
                <FilterInput
                  name="query"
                  placeholder={formatMessage(m.search.inputPlaceholder)}
                  value={query ?? ''}
                  onChange={(option) => setQuery(option)}
                />
                <GrantsSearchResultsFilter
                  searchState={{
                    category: categories ?? undefined,
                    type: types ?? undefined,
                    organization: organizations ?? undefined,
                    status: status ?? undefined,
                  }}
                  onSearchUpdate={onSearchFilterUpdate}
                  onReset={onResetFilter}
                  tags={tags ?? []}
                  url={currentUrl}
                  variant={'default'}
                  hits={totalHits}
                />
              </Stack>
            }
          >
            <Box marginLeft={2}>
              <SearchResultsContent
                grants={grants}
                subheader={hitsMessage}
                locale={locale}
              />
            </Box>

            <Box marginTop={2} marginBottom={0} hidden={(totalPages ?? 0) < 1}>
              <Pagination
                variant="purple"
                page={page}
                itemsPerPage={PAGE_SIZE}
                totalItems={totalHits}
                totalPages={totalPages}
                renderLink={(page, className, children) => (
                  <Box
                    cursor="pointer"
                    className={className}
                    onClick={() => {
                      setPage(page)
                    }}
                  >
                    {children}
                  </Box>
                )}
              />
            </Box>
          </SidebarLayout>
        )}
        {isTablet && (
          <Box margin={3} paddingTop={3}>
            <Text fontWeight="semiBold">{formatMessage(m.search.search)}</Text>
            <Box marginTop={2} className={styles.searchInput}>
              <FilterInput
                name="query"
                placeholder={formatMessage(m.search.inputPlaceholder)}
                value={query ?? ''}
                onChange={(option) => setQuery(option)}
                backgroundColor={'white'}
              />
            </Box>
            <Box
              marginTop={2}
              display="flex"
              justifyContent="spaceBetween"
              height="full"
              alignItems={'center'}
            >
              <Text>{hitsMessage}</Text>

              <GrantsSearchResultsFilter
                searchState={{
                  category: categories ?? undefined,
                  type: types ?? undefined,
                  organization: organizations ?? undefined,
                  status: status ?? undefined,
                }}
                onSearchUpdate={onSearchFilterUpdate}
                onReset={onResetFilter}
                tags={tags ?? []}
                url={currentUrl}
                variant={'dialog'}
                hits={totalHits}
              />
            </Box>
            <Box marginTop={2}>
              <SearchResultsContent grants={grants} locale={locale} />
            </Box>
            <Box marginTop={2} paddingBottom={2} hidden={(totalPages ?? 0) < 1}>
              <Pagination
                variant="purple"
                page={page}
                itemsPerPage={PAGE_SIZE}
                totalItems={totalHits}
                totalPages={totalPages}
                renderLink={(page, className, children) => (
                  <Box
                    cursor="pointer"
                    className={className}
                    onClick={() => {
                      setPage(page)
                    }}
                  >
                    {children}
                  </Box>
                )}
              />
            </Box>
          </Box>
        )}
      </Box>
    </CustomPageLayoutWrapper>
  )
}

GrantsSearchResults.getProps = async ({
  apolloClient,
  locale,
  query,
  customPageData,
}) => {
  const arrayParser = parseAsArrayOf<string>(parseAsString)

  const filterArray = <T,>(array: Array<T> | null | undefined) => {
    if (array && array.length > 0) {
      return array
    }

    return undefined
  }

  const status =
    parseAsStringLiteral(Availability).parseServerSide(query?.status) ??
    undefined

  const [
    {
      data: { getGrants },
    },
    {
      data: { getGenericTagsInTagGroups },
    },
    {
      data: { getCustomSubpage },
    },
  ] = await Promise.all([
    apolloClient.query<Query, QueryGetGrantsArgs>({
      query: GET_GRANTS_QUERY,
      variables: {
        input: {
          lang: locale as ContentLanguage,
          sort: GetGrantsInputSortByEnum.RecentlyUpdated,
          page: parseAsInteger.withDefault(1).parseServerSide(query?.page),
          search: parseAsString.parseServerSide(query?.query) ?? undefined,
          categories: filterArray<string>(
            arrayParser.parseServerSide(query?.category),
          ),
          types: filterArray<string>(arrayParser.parseServerSide(query?.type)),
          organizations: filterArray<string>(
            arrayParser.parseServerSide(query?.organization),
          ),
          status: status
            ? status === 'closed'
              ? GetGrantsInputAvailabilityStatusEnum.Closed
              : GetGrantsInputAvailabilityStatusEnum.Open
            : undefined,
        },
      },
    }),
    apolloClient.query<Query, QueryGetGenericTagsInTagGroupsArgs>({
      query: GET_GENERIC_TAGS_IN_TAG_GROUPS_QUERY,
      variables: {
        input: {
          lang: locale as ContentLanguage,
          tagGroupSlugs: ['grant-category', 'grant-type'],
        },
      },
    }),
    apolloClient.query<Query, QueryGetCustomSubpageArgs>({
      query: GET_CUSTOM_SUBPAGE_QUERY,
      variables: {
        input: {
          slug:
            (locale as ContentLanguage) === ContentLanguage.Is
              ? 'styrkir'
              : 'grants',
          parentPageId: customPageData?.id ?? '',
          lang: locale as ContentLanguage,
        },
      },
    }),
  ])

  if (!getCustomSubpage) {
    throw new CustomNextError(404, 'Custom subpage not found')
  }

  return {
    initialGrantList: getGrants,
    tags: getGenericTagsInTagGroups ?? undefined,
    locale: locale as Locale,
    themeConfig: {
      footerVersion: 'organization',
    },
    customPageData: customPageData ?? undefined,
    customSubpage: getCustomSubpage ?? undefined,
  }
}

export default withMainLayout(
  withCustomPageWrapper(CustomPageUniqueIdentifier.Grants, GrantsSearchResults),
)
