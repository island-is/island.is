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
  Text,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { Problem } from '@island.is/react-spa/shared'
import { debounceTime } from '@island.is/shared/constants'
import { Locale } from '@island.is/shared/types'
import { GrantHeaderWithImage, GrantWrapper } from '@island.is/web/components'
import {
  ContentLanguage,
  CustomPageUniqueIdentifier,
  GenericTag,
  GetGrantsInputAvailabilityStatusEnum,
  Grant,
  GrantList,
  Query,
  QueryGetGenericTagsInTagGroupsArgs,
  QueryGetGrantsArgs,
} from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'
import { withMainLayout } from '@island.is/web/layouts/main'

import {
  CustomScreen,
  withCustomPageWrapper,
} from '../../CustomPage/CustomPageWrapper'
import SidebarLayout from '../../Layouts/SidebarLayout'
import { GET_GENERIC_TAGS_IN_TAG_GROUPS_QUERY } from '../../queries/GenericTag'
import { GET_GRANTS_QUERY } from '../../queries/Grants'
import { m } from '../messages'
import { Availability } from '../types'
import { SearchResultsContent } from './SearchResultsContent'
import { GrantsSearchResultsFilter } from './SearchResultsFilter'

const PAGE_SIZE = 8

const GrantsSearchResultsPage: CustomScreen<GrantsHomeProps> = ({
  locale,
  initialGrantList,
  tags,
}) => {
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

  const [initialRender, setInitialRender] = useState<boolean>(true)

  const { width } = useWindowSize()
  const isMobile = width <= theme.breakpoints.md

  const [getGrants, { error, loading }] = useLazyQuery<
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
          search: query,
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
    query,
    types,
    initialRender,
  ])

  //SEARCH STATE UPDATES
  const debouncedSearchUpdate = useMemo(() => {
    return debounce(() => {
      fetchGrants()
    }, debounceTime.search)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, locale, organizations, page, query, types, status])

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
    setPage(1)
    setQuery(null)
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
  }

  return (
    <GrantWrapper
      pageTitle={formatMessage(m.home.title)}
      pageDescription={formatMessage(m.search.description)}
      pageFeaturedImage={formatMessage(m.home.featuredImage)}
    >
      <GrantHeaderWithImage
        title={formatMessage(m.home.title)}
        description={formatMessage(m.home.description)}
        featuredImage={formatMessage(m.home.featuredImage)}
        featuredImageAlt={formatMessage(m.home.featuredImageAlt)}
        imageLayout="left"
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
      <Box background="blue100">
        {!isMobile && (
          <SidebarLayout
            fullWidthContent={true}
            sidebarContent={
              <Box marginBottom={[1, 1, 2]}>
                <Box marginBottom={3}>
                  <Text fontWeight="semiBold">
                    {formatMessage(m.search.search)}
                  </Text>
                </Box>
                <Box marginBottom={[1, 1, 2]}>
                  <FilterInput
                    name="query"
                    placeholder={formatMessage(m.search.inputPlaceholder)}
                    value={query ?? ''}
                    onChange={(option) => setQuery(option)}
                  />
                </Box>
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
                />
              </Box>
            }
          >
            <Box marginLeft={3}>
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
        {isMobile && (
          <Box padding={[1, 1, 2]} margin={[1, 1, 2]} paddingBottom={3}>
            <Box marginBottom={3}>
              <Text fontWeight="semiBold">
                {formatMessage(m.search.search)}
              </Text>
            </Box>
            <Box marginBottom={[1, 1, 2]}>
              <FilterInput
                name="query"
                placeholder={formatMessage(m.search.inputPlaceholder)}
                value={query ?? ''}
                onChange={(option) => setQuery(option)}
                backgroundColor={'white'}
              />
            </Box>
            <Box
              marginY={2}
              display="flex"
              alignItems="center"
              justifyContent="spaceBetween"
            >
              <Text>{hitsMessage}</Text>
              <GrantsSearchResultsFilter
                searchState={{
                  category: categories ?? undefined,
                  type: types ?? undefined,
                  organization: organizations ?? undefined,
                }}
                onSearchUpdate={onSearchFilterUpdate}
                onReset={onResetFilter}
                tags={tags ?? []}
                url={currentUrl}
                variant={'popover'}
              />
            </Box>

            <SearchResultsContent grants={grants} locale={locale} />
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
          </Box>
        )}
      </Box>
    </GrantWrapper>
  )
}

interface GrantsHomeProps {
  locale: Locale
  initialGrantList?: GrantList
  tags?: Array<GenericTag>
}

const GrantsSearchResults: CustomScreen<GrantsHomeProps> = ({
  initialGrantList,
  tags,
  customPageData,
  locale,
}) => {
  return (
    <GrantsSearchResultsPage
      initialGrantList={initialGrantList}
      tags={tags}
      locale={locale}
      customPageData={customPageData}
    />
  )
}

GrantsSearchResults.getProps = async ({ apolloClient, locale, query }) => {
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
  ] = await Promise.all([
    apolloClient.query<Query, QueryGetGrantsArgs>({
      query: GET_GRANTS_QUERY,
      variables: {
        input: {
          lang: locale as ContentLanguage,
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
  ])

  return {
    initialGrantList: getGrants,
    tags: getGenericTagsInTagGroups ?? undefined,
    locale: locale as Locale,
    themeConfig: {
      footerVersion: 'organization',
    },
  }
}

export default withMainLayout(
  withCustomPageWrapper(CustomPageUniqueIdentifier.Grants, GrantsSearchResults),
)
