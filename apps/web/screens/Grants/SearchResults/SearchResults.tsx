import { useCallback, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { useWindowSize } from 'react-use'
import format from 'date-fns/format'
import debounce from 'lodash/debounce'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
} from 'next-usequerystate'
import { useLazyQuery } from '@apollo/client'

import {
  Box,
  BreadCrumbItem,
  Breadcrumbs,
  FilterInput,
  Inline,
  TagVariant,
  Text,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { debounceTime } from '@island.is/shared/constants'
import { Locale } from '@island.is/shared/types'
import { isDefined } from '@island.is/shared/utils'
import { GrantHeaderWithImage, GrantWrapper } from '@island.is/web/components'
import {
  ContentLanguage,
  CustomPageUniqueIdentifier,
  GenericTag,
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
import { SearchResultsContent } from './SearchResultsContent'
import { GrantsSearchResultsFilter } from './SearchResultsFilter'

export interface SearchState {
  page?: number
  query?: string
  status?: Array<string>
  category?: Array<string>
  type?: Array<string>
  organization?: Array<string>
}

const GrantsSearchResultsPage: CustomScreen<GrantsHomeProps> = ({
  locale,
  initialGrants,
  tags,
}) => {
  const { formatMessage } = useIntl()
  const router = useRouter()
  const { linkResolver } = useLinkResolver()

  const parentUrl = linkResolver('styrkjatorg', [], locale).href
  const currentUrl = linkResolver('styrkjatorgsearch', [], locale).href

  const [grants, setGrants] = useState<Array<Grant>>(initialGrants ?? [])
  const [searchState, setSearchState] = useState<SearchState>()
  const [initialRender, setInitialRender] = useState<boolean>(true)

  const { width } = useWindowSize()
  const isMobile = width <= theme.breakpoints.md

  const [getGrants, { error }] = useLazyQuery<
    { getGrants: GrantList },
    QueryGetGrantsArgs
  >(GET_GRANTS_QUERY)

  //load params into search state on first render
  useEffect(() => {
    const searchParams = new URLSearchParams(document.location.search)
    const page = searchParams.get('page')
    const statuses = searchParams.getAll('status')
    const categories = searchParams.getAll('category')
    const types = searchParams.getAll('type')
    const organizations = searchParams.getAll('organization')

    setSearchState({
      page: page ? Number.parseInt(page) : undefined,
      query: searchParams.get('query') ?? undefined,
      status: statuses.length ? statuses : undefined,
      category: categories.length ? categories : undefined,
      type: types.length ? types : undefined,
      organization: organizations.length ? organizations : undefined,
    })
  }, [])

  const updateUrl = useCallback(() => {
    if (!searchState) {
      return
    }
    router.replace(
      {
        pathname: currentUrl,
        query: Object.entries(searchState)
          .filter(([_, value]) => !!value)
          .reduce(
            (accumulator, [searchStateKey, searchStateValue]) => ({
              ...accumulator,
              [searchStateKey]: searchStateValue,
            }),
            {},
          ),
      },
      undefined,
      { shallow: true },
    )
  }, [searchState, router, currentUrl])

  const fetchGrants = useCallback(() => {
    if (initialRender) {
      setInitialRender(false)
      return
    }
    getGrants({
      variables: {
        input: {
          categories: searchState?.category,
          lang: locale,
          organizations: searchState?.organization,
          page: searchState?.page,
          search: searchState?.query,
          size: 8,
          statuses: searchState?.status,
          types: searchState?.type,
        },
      },
    })
      .then((res) => {
        if (res.data) {
          setGrants(res.data.getGrants.items)
        } else if (res.error) {
          setGrants([])
          console.error('Error fetching grants', res.error)
        }
      })
      .catch((err) => {
        setGrants([])
        console.error('Error fetching grants', err)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchState, initialRender])

  //SEARCH STATE UPDATES
  const debouncedSearchUpdate = useMemo(() => {
    return debounce(() => {
      updateUrl()
      fetchGrants()
    }, debounceTime.search)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchState])

  useEffect(() => {
    debouncedSearchUpdate()
    return () => {
      debouncedSearchUpdate.cancel()
    }
  }, [debouncedSearchUpdate])

  const updateSearchStateValue = (
    categoryId: keyof SearchState,
    values: unknown,
  ) => {
    setSearchState({
      ...searchState,
      [categoryId]: values,
    })
  }

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
    setSearchState({
      page: undefined,
      query: undefined,
      status: undefined,
      category: undefined,
      type: undefined,
      organization: undefined,
    })
    router.replace(currentUrl, {}, { shallow: true })
  }

  const hitsMessage = useMemo(() => {
    if (!grants) {
      return
    }
    if (grants.length === 1) {
      return formatMessage(m.search.resultFound, {
        arg: <strong>{grants.length}</strong>,
      })
    }
    return formatMessage(m.search.resultsFound, {
      arg: <strong>{grants.length}</strong>,
    })
  }, [formatMessage, grants])

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
                    value={searchState?.query ?? ''}
                    onChange={(option) =>
                      updateSearchStateValue('query', option)
                    }
                  />
                </Box>
                <GrantsSearchResultsFilter
                  searchState={searchState}
                  onSearchUpdate={updateSearchStateValue}
                  onReset={onResetFilter}
                  tags={tags ?? []}
                  url={currentUrl}
                />
              </Box>
            }
          >
            <SearchResultsContent
              grants={grants}
              subheader={hitsMessage}
              locale={locale}
            />
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
                value={searchState?.query ?? ''}
                onChange={(option) => updateSearchStateValue('query', option)}
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
                searchState={searchState}
                onReset={onResetFilter}
                onSearchUpdate={updateSearchStateValue}
                tags={tags ?? []}
                url={currentUrl}
                variant="popover"
              />
            </Box>
            <SearchResultsContent grants={grants} locale={locale} />
          </Box>
        )}
      </Box>
    </GrantWrapper>
  )
}

interface GrantsHomeProps {
  locale: Locale
  initialGrants?: Array<Grant>
  tags?: Array<GenericTag>
}

const GrantsSearchResults: CustomScreen<GrantsHomeProps> = ({
  initialGrants,
  tags,
  customPageData,
  locale,
}) => {
  return (
    <GrantsSearchResultsPage
      initialGrants={initialGrants}
      tags={tags}
      locale={locale}
      customPageData={customPageData}
    />
  )
}

GrantsSearchResults.getProps = async ({ apolloClient, locale, query }) => {
  const arrayParser = parseAsArrayOf<string>(parseAsString)

  const parseArray = (arg: string | string[] | undefined) => {
    const array = arrayParser.parseServerSide(arg)

    if (array && array.length > 0) {
      return array
    }

    return undefined
  }
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
          categories: parseArray(query?.category),
          statuses: parseArray(query?.status),
          types: parseArray(query?.type),
          organizations: parseArray(query?.organization),
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
    initialGrants: getGrants.items,
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
