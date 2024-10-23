import { useEffect, useMemo, useState } from 'react'
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
  Filter,
  FilterMultiChoice,
  Input,
  TagVariant,
  Text,
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

const initialFilterState = {
  page: '',
  query: '',
  applicationStatuses: new Array<string>,
  categories: new Array<string>,
  types: new Array<string>,
  organizations: new Array<string>,
}

const GrantsSearchResultsPage: CustomScreen<GrantsHomeProps> = ({
  locale,
  initialGrants,
  tags,
}) => {
  const { formatMessage } = useIntl()
  const router = useRouter()
  const { linkResolver } = useLinkResolver()

  const [searchState, setSearchState] = useState(initialFilterState)
  const [grants, setGrants] = useState(initialGrants)

  const [getGrants] = useLazyQuery<GrantList, QueryGetGrantsArgs>(
    GET_GRANTS_QUERY,
    {
      fetchPolicy: 'no-cache',
    },
  )

  useEffect(() => {
    const searchParams = new URLSearchParams(document.location.search)
    setSearchState({
      page: searchParams.get('page') ?? '',
      query: searchParams.get('query') ?? '',
      applicationStatus: searchParams.getAll('applicationStatus') ?? [],
      category: searchParams.getAll('category') ?? [],
      type: searchParams.getAll('type') ?? [],
      organization: searchParams.getAll('organization') ?? [],
    })
  }, [])

  const fetchGrants = useMemo(() => {
    return debounce((state: typeof initialFilterState) => {
      getGrants({
        variables: {
          input: {
            categories: state.categories,
            lang: locale,
            organizations: state.organizations,
            page: state.page ? Number.parseInt(state.page) : undefined,
            search: state.query,
            size: 8,
            status: state.applicationStatus,
            type: state.type,
          },
        },
      })
        .then((res) => {
          if (res.data?.items.length) {
            setGrants(res.data.items)
          } else if (res.error) {
            setGrants([])
            console.error('Error fetching grants', res.error)
          }
        })
        .catch((err) => {
          setGrants([])
          console.error('Error fetching grants', err)
        })
    }, debounceTime.search)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const isEmpty = !Object.entries(searchState).filter(([_, v]) => !!v).length
    if (isEmpty) {
      setGrants(initialGrants)
    } else {
      fetchGrants(searchState)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchState])

  const parentUrl = linkResolver('styrkjatorg', [], locale).href
  const currentUrl = linkResolver('styrkjatorgsearch', [], locale).href

  const removeEmptyFromObject = (obj: Record<string, string>) => {
    return Object.entries(obj)
      .filter(([_, v]) => !!v)
      .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {})
  }

  const updateSearchParams = useMemo(() => {
    return debounce((state: Record<string, string>) => {
      router.replace(
        currentUrl,
        {
          query: removeEmptyFromObject(state),
        },
        { shallow: true },
      )
    }, debounceTime.search)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const resetFilter = () => {
    setSearchState(initialFilterState)
    updateSearchParams(initialFilterState)
    setGrants(initialGrants)
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

  const categoryFilters = tags?.filter(
    (t) => t.genericTagGroup?.slug === 'grant-category',
  )

  const typeFilters = tags?.filter(
    (t) => t.genericTagGroup?.slug === 'grant-type',
  )

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
            <Box component="form" borderRadius="large" action={currentUrl}>
              <Box marginBottom={[1, 1, 2]}>
                <Text variant="h4">Leit</Text>

                <Input
                  name="q"
                  placeholder={formatMessage(m.search.inputPlaceholder)}
                  size="xs"
                  value={searchState.query}
                  onChange={() => console.log('update search')}
                />
              </Box>
              <Box background="white" padding={[1, 1, 2]}>
                <Filter
                  labelClearAll={'Hreina síu'}
                  labelClear={''}
                  labelOpen={''}
                  onFilterClear={resetFilter}
                >
                  <FilterMultiChoice
                    labelClear={''}
                    onChange={() => console.log('change')}
                    onClear={() => console.log('clear')}
                    categories={[
                      {
                        id: 'bleble',
                        label: 'Staða umsóknar',
                        selected: [],
                        filters: [
                          {
                            value: 'Opið fyrir umsóknir',
                            label: 'Opið fyrir umsóknir',
                          },
                          {
                            value: 'Opnar fljótlega',
                            label: 'Opnar fljótlega',
                          },
                          {
                            value: 'Lokað fyrir umsóknir',
                            label: 'Lokað fyrir umsóknir',
                          },
                          {
                            value: 'Óvirkur sjóður',
                            label: 'Óvirkur sjóður',
                          },
                        ],
                      },
                      categoryFilters
                        ? {
                            id: 'grant-categories',
                            label: 'Flokkur',
                            selected: [],
                            filters: categoryFilters.map((t) => ({
                              value: t.slug,
                              label: t.title,
                            })),
                          }
                        : undefined,
                      typeFilters
                        ? {
                            id: 'grant-types',
                            label: 'Tegund',
                            selected: [],
                            filters: typeFilters.map((t) => ({
                              value: t.slug,
                              label: t.title,
                            })),
                          }
                        : undefined,
                      {
                        id: 'bleble3',
                        label: 'Stofnun',
                        selected: [],
                        filters: [
                          {
                            value: 'Rannís',
                            label: 'Rannís',
                          },
                          {
                            value: 'Tónlistarmiðstöð',
                            label: 'Tónlistarmiðstöð',
                          },
                          {
                            value: 'Kvikmyndastöð',
                            label: 'Kvikmyndastöð',
                          },
                          {
                            value: 'Félags- og vinnumarkaðsráðuneytið',
                            label: 'Félags- og vinnumarkaðsráðuneytið',
                          },
                          {
                            value: 'Menningar- og viðskiptaráðuneytið',
                            label: 'Menningar- og viðskiptaráðuneytið',
                          },
                        ],
                      },
                    ].filter(isDefined)}
                  />
                </Filter>
              </Box>
            </Box>
          }
        >
          <Box display="flex" flexDirection="row" flexWrap="wrap">
            {[...Array(8)].map((_) => {
              const grant = grants?.[0]

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
                      onClick: () => console.log('click'),
                      icon: 'arrowForward',
                    }}
                    detailLines={[
                      grant.dateFrom && grant.dateTo
                        ? {
                            icon: 'calendar' as const,
                            text: `${format(
                              new Date(grant.dateFrom),
                              'dd.MM.',
                            )}-${format(new Date(grant.dateTo), 'dd.MM.yyyy')}`,
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
