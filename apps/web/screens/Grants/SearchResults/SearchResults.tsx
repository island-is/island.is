import { useCallback, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import format from 'date-fns/format'
import debounce from 'lodash/debounce'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useLazyQuery } from '@apollo/client'

import {
  Box,
  BreadCrumbItem,
  Breadcrumbs,
  TagVariant,
} from '@island.is/island-ui/core'
import { debounceTime } from '@island.is/shared/constants'
import { Locale } from '@island.is/shared/types'
import { isDefined } from '@island.is/shared/utils'
import {
  GrantHeaderWithImage,
  GrantWrapper,
  PlazaCard,
} from '@island.is/web/components'
import {
  ContentLanguage,
  CustomPageUniqueIdentifier,
  GenericTag,
  Grant,
  GrantList,
  GrantStatus,
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

  const [grants, setGrants] = useState<Array<Grant>>()
  const [searchState, setSearchState] = useState<SearchState>()

  const [getGrants] = useLazyQuery<
    { getGrants: GrantList },
    QueryGetGrantsArgs
  >(GET_GRANTS_QUERY, {
    fetchPolicy: 'no-cache',
  })

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
    if (!grants) {
      setGrants(initialGrants)
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
        if (res.data?.getGrants.items.length) {
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
  }, [searchState, initialGrants])

  //SEARCH STATE UPDATES
  const debouncedSearchUpdate = useMemo(() => {
    return debounce(() => {
      updateUrl()
      fetchGrants()
    }, debounceTime.search)
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
      title: 'Styrkjatorg',
      href: parentUrl,
    },
    {
      title: 'Leitarniðurstöður',
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

  return (
    <GrantWrapper
      pageTitle={'Styrkjatorg'}
      pageDescription={formatMessage(m.home.description)}
      pageFeaturedImage={formatMessage(m.home.featuredImage)}
    >
      <GrantHeaderWithImage
        title={'Styrkjatorg'}
        description="Non scelerisque risus amet tincidunt. Sit sed quis cursus hendrerit nulla egestas interdum. In varius quisque."
        featuredImage={formatMessage(m.home.featuredImage)}
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
        <SidebarLayout
          fullWidthContent={true}
          sidebarContent={
            <GrantsSearchResultsFilter
              searchState={searchState}
              onSearchUpdate={updateSearchStateValue}
              onReset={onResetFilter}
              tags={tags ?? []}
              url={currentUrl}
            />
          }
        >
          <Box display="flex" flexDirection="row" flexWrap="wrap">
            {grants?.map((grant) => {
              if (!grant) {
                return null
              }

              let tagVariant: TagVariant | undefined
              switch (grant.status) {
                case GrantStatus.Open:
                  tagVariant = 'mint'
                  break
                case GrantStatus.Closed:
                  tagVariant = 'rose'
                  break
                case GrantStatus.OpensSoon:
                  tagVariant = 'purple'
                  break
                default:
                  break
              }

              return (
                <Box marginLeft={3} marginTop={3}>
                  {grant.applicationId && (
                    <PlazaCard
                      eyebrow={grant.name}
                      subEyebrow={grant.organization?.title}
                      title={grant.name ?? ''}
                      text={grant.description ?? ''}
                      logo={grant.organization?.logo?.url ?? ''}
                      logoAlt={grant.organization?.logo?.title ?? ''}
                      tag={{
                        label: grant.statusText ?? '',
                        variant: tagVariant,
                      }}
                      cta={{
                        label: 'Skoða nánar',
                        variant: 'text',
                        onClick: () => {
                          router.push(
                            linkResolver(
                              'styrkjatorggrant',
                              [grant?.applicationId ?? ''],
                              locale,
                            ).href,
                          )
                        },
                        icon: 'arrowForward',
                      }}
                      detailLines={[
                        grant.dateFrom && grant.dateTo
                          ? {
                              icon: 'calendar' as const,
                              text: `${format(
                                new Date(grant.dateFrom),
                                'dd.MM.',
                              )}-${format(
                                new Date(grant.dateTo),
                                'dd.MM.yyyy',
                              )}`,
                            }
                          : null,
                        {
                          icon: 'time' as const,
                          text: 'Frestur til 16.08.2024, kl. 15.00',
                        },
                        grant.categoryTag?.title
                          ? {
                              icon: 'informationCircle' as const,
                              text: grant.categoryTag.title,
                            }
                          : undefined,
                      ].filter(isDefined)}
                    />
                  )}
                </Box>
              )
            })}
          </Box>
        </SidebarLayout>
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

GrantsSearchResults.getProps = async ({ apolloClient, locale }) => {
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
