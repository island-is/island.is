import { useMemo } from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

import {
  Box,
  Breadcrumbs,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  Link,
  LinkContext,
  Pagination,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { Locale } from '@island.is/shared/types'
import {
  Card,
  CardTagsProps,
  ServiceWebWrapper,
} from '@island.is/web/components'
import { ServiceWebSearchInput } from '@island.is/web/components'
import { useNamespace } from '@island.is/web/hooks'
import { useLinkResolver, usePlausible } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import useLocalLinkTypeResolver from '@island.is/web/hooks/useLocalLinkTypeResolver'
import { useI18n } from '@island.is/web/i18n'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'

import {
  ContentLanguage,
  GetNamespaceQuery,
  GetSupportSearchResultsQuery,
  Organization,
  Query,
  QueryGetNamespaceArgs,
  QueryGetOrganizationArgs,
  QueryGetServiceWebPageArgs,
  QuerySearchResultsArgs,
  SearchableContentTypes,
  SupportQna,
} from '../../../graphql/schema'
import { Screen } from '../../../types'
import {
  GET_NAMESPACE_QUERY,
  GET_SERVICE_WEB_ORGANIZATION,
  GET_SERVICE_WEB_PAGE_QUERY,
  GET_SUPPORT_SEARCH_RESULTS_QUERY,
} from '../../queries'
import ContactBanner from '../ContactBanner/ContactBanner'
import {
  getServiceWebSearchTagQuery,
  getSlugPart,
  shouldShowInstitutionContactBanner,
} from '../utils'

const PERPAGE = 10

interface ServiceSearchProps {
  q: string
  page: number
  namespace: Record<string, string>
  organization?: Organization
  searchResults: GetSupportSearchResultsQuery['searchResults']
  locale: Locale
  serviceWebPage?: Query['getServiceWebPage']
}

const ServiceSearch: Screen<ServiceSearchProps> = ({
  q,
  page,
  namespace,
  organization,
  searchResults,
  locale,
  serviceWebPage,
}) => {
  const Router = useRouter()
  const n = useNamespace(namespace)
  const { activeLocale } = useI18n()
  usePlausible('Search Query', {
    query: (q ?? '').trim().toLowerCase(),
    source: 'Service Web',
  })
  const { linkResolver } = useLinkResolver()
  const organizationNamespace = useMemo(
    () => JSON.parse(organization?.namespace?.fields || '{}'),
    [organization?.namespace?.fields],
  )
  const o = useNamespace(organizationNamespace)

  useContentfulId(organization?.id)
  useLocalLinkTypeResolver()

  const institutionSlug = getSlugPart(Router.asPath, locale === 'is' ? 2 : 3)

  const institutionSlugBelongsToMannaudstorg =
    institutionSlug.includes('mannaudstorg')
  const showContactBanner = shouldShowInstitutionContactBanner(institutionSlug)

  const searchResultsItems = (searchResults.items as Array<SupportQna>)
    .filter(
      (item) => item.organization?.slug && item.category?.slug && item.slug,
    )
    .map((item) => ({
      title: item.title,
      parentTitle: item.organization?.title,
      description: item.organization?.description,
      link: {
        href: linkResolver('supportqna', [
          item.organization?.slug || '',
          item.category?.slug || '',
          item.slug,
        ]).href,
      },
      categorySlug: item.category?.slug,
      category: item.category?.title,
      labels: [item.category?.title],
    }))

  const totalSearchResults = searchResults.total
  const totalPages = Math.ceil(totalSearchResults / PERPAGE)

  const pageTitle = `${n('search', 'Leit')} `

  const breadcrumbItems = [
    institutionSlugBelongsToMannaudstorg
      ? {
          title: organization?.title,
          typename: 'serviceweb',
          href: linkResolver('serviceweb', [institutionSlug]).href,
        }
      : {
          title: n('assistanceForIslandIs', 'Aðstoð fyrir Ísland.is'),
          href: linkResolver('serviceweb').href,
        },
    {
      title: n('search', 'Leit'),
      isTag: true,
    },
  ]

  return (
    <ServiceWebWrapper
      pageTitle={pageTitle}
      institutionSlug={institutionSlug}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      organization={organization}
      smallBackground
      searchPlaceholder={o(
        'serviceWebSearchPlaceholder',
        activeLocale === 'is'
          ? 'Leitaðu á þjónustuvefnum'
          : 'Search the service web',
      )}
      pageData={serviceWebPage}
    >
      <Box marginY={[3, 3, 10]}>
        <GridContainer>
          <GridRow marginBottom={3}>
            <GridColumn
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore make web strict
              offset={[null, null, null, '1/12']}
              span={['12/12', '12/12', '12/12', '10/12', '7/12']}
            >
              <Stack space={[3, 3, 4]}>
                <Box display={['none', 'none', 'block']} printHidden>
                  <Breadcrumbs
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore make web strict
                    items={breadcrumbItems}
                    renderLink={(link, { href }) => {
                      return (
                        <NextLink
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore make web strict
                          href={href}
                          passHref
                          legacyBehavior
                        >
                          {link}
                        </NextLink>
                      )
                    }}
                  />
                </Box>
                <Box
                  paddingBottom={[2, 2, 4]}
                  display={['flex', 'flex', 'none']}
                  justifyContent="spaceBetween"
                  alignItems="center"
                  printHidden
                >
                  <Box flexGrow={1} marginRight={6} overflow={'hidden'}>
                    <LinkContext.Provider
                      value={{
                        linkRenderer: (href, children) => (
                          <Link href={href} pureChildren skipTab>
                            {children}
                          </Link>
                        ),
                      }}
                    >
                      <Text truncate>
                        <a href={linkResolver('serviceweb').href}>
                          <Button
                            preTextIcon="arrowBack"
                            preTextIconType="filled"
                            size="small"
                            type="button"
                            variant="text"
                          >
                            {n(
                              'assistanceForIslandIs',
                              'Aðstoð fyrir Ísland.is',
                            )}
                          </Button>
                        </a>
                      </Text>
                    </LinkContext.Provider>
                  </Box>
                </Box>

                <ServiceWebSearchInput
                  colored={true}
                  size="large"
                  initialInputValue={q}
                  placeholder={o(
                    'serviceWebSearchPlaceholder',
                    activeLocale === 'is'
                      ? 'Leitaðu á þjónustuvefnum'
                      : 'Search the service web',
                  )}
                  nothingFoundText={n(
                    'nothingFoundText',
                    activeLocale === 'is' ? 'Ekkert fannst' : 'Nothing found',
                  )}
                />

                {!!q &&
                  (searchResultsItems.length === 0 ? (
                    <>
                      <Text variant="intro" as="p">
                        {n(
                          'nothingFoundWhenSearchingFor',
                          'Ekkert fannst við leit á',
                        )}{' '}
                        <strong>{q}</strong>
                      </Text>

                      <Text variant="intro" as="p">
                        {n('nothingFoundExtendedExplanation')}
                      </Text>
                    </>
                  ) : (
                    <Box marginBottom={2}>
                      <Text variant="intro" as="p">
                        {totalSearchResults}{' '}
                        {totalSearchResults === 1
                          ? n('searchResult', 'leitarniðurstaða')
                          : n('searchResults', 'leitarniðurstöður')}{' '}
                      </Text>
                    </Box>
                  ))}
              </Stack>
            </GridColumn>
          </GridRow>

          <GridRow marginBottom={9}>
            <GridColumn
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore make web strict
              offset={[null, null, null, '1/12']}
              span={['12/12', '12/12', '12/12', '10/12', '7/12']}
            >
              <Stack space={2}>
                {searchResultsItems.map(
                  ({ labels, parentTitle, ...rest }, index) => {
                    const tags: Array<CardTagsProps> = []

                    labels.forEach((label) => {
                      tags.push({
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore make web strict
                        title: label,
                        tagProps: {
                          outlined: true,
                        },
                      })
                    })

                    return (
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore make web strict
                      <Card
                        key={index}
                        tags={tags}
                        subTitle={parentTitle}
                        highlightedResults={true}
                        {...rest}
                      />
                    )
                  },
                )}
              </Stack>
            </GridColumn>
          </GridRow>

          {totalSearchResults > 0 && (
            <GridRow>
              <GridColumn
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore make web strict
                offset={[null, null, null, '1/12']}
                span={['12/12', '12/12', '12/12', '10/12', '7/12']}
              >
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  renderLink={(page, className, children) => (
                    <Link
                      href={{
                        pathname: linkResolver('servicewebsearch').href,
                        query: { ...Router.query, page },
                      }}
                    >
                      <span className={className}>{children}</span>
                    </Link>
                  )}
                />
              </GridColumn>
            </GridRow>
          )}

          {showContactBanner && (
            <GridRow>
              <GridColumn
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore make web strict
                offset={[null, null, null, '1/12']}
                span={['12/12', '12/12', '12/12', '10/12']}
              >
                <Box marginTop={[10, 10, 20]}>
                  <ContactBanner
                    slug={institutionSlug}
                    cantFindWhatYouAreLookingForText={o(
                      'cantFindWhatYouAreLookingForText',
                      n(
                        'cantFindWhatYouAreLookingForText',
                        'Finnurðu ekki það sem þig vantar?',
                      ),
                    )}
                    contactUsText={o(
                      'contactUsText',
                      n('contactUsText', 'Hafa samband'),
                    )}
                    howCanWeHelpText={o(
                      'howCanWeHelpText',
                      n('howCanWeHelpText', 'Hvernig getum við aðstoðað?'),
                    )}
                  />
                </Box>
              </GridColumn>
            </GridRow>
          )}
        </GridContainer>
      </Box>
    </ServiceWebWrapper>
  )
}

const single = <T,>(x: T | T[]): T => (Array.isArray(x) ? x[0] : x)

ServiceSearch.getProps = async ({ apolloClient, locale, query }) => {
  const defaultSlug = locale === 'is' ? 'stafraent-island' : 'digital-iceland'

  const q = single(query.q) || ''
  const slug = query.slug ? (query.slug as string) : defaultSlug
  const page = Number(single(query.page)) || 1

  const types = ['webQNA' as SearchableContentTypes]

  const queryString = q

  const [
    organization,
    {
      data: { searchResults },
    },
    namespace,
    {
      data: { getServiceWebPage },
    },
  ] = await Promise.all([
    !!slug &&
      apolloClient.query<Query, QueryGetOrganizationArgs>({
        query: GET_SERVICE_WEB_ORGANIZATION,
        variables: {
          input: {
            slug,
            lang: locale as ContentLanguage,
          },
        },
      }),
    apolloClient.query<GetSupportSearchResultsQuery, QuerySearchResultsArgs>({
      query: GET_SUPPORT_SEARCH_RESULTS_QUERY,
      variables: {
        query: {
          language: locale as ContentLanguage,
          queryString,
          types,
          size: PERPAGE,
          page,
          highlightResults: true,
          ...getServiceWebSearchTagQuery(slug),
        },
      },
    }),
    apolloClient
      .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'Search',
            lang: locale,
          },
        },
      })
      .then((variables) => {
        // map data here to reduce data processing in component
        return JSON.parse(variables?.data?.getNamespace?.fields || '{}')
      }),
    apolloClient.query<Query, QueryGetServiceWebPageArgs>({
      query: GET_SERVICE_WEB_PAGE_QUERY,
      variables: {
        input: {
          slug: slug,
          lang: locale as ContentLanguage,
        },
      },
    }),
  ])

  if (searchResults.items.length === 0 && page > 1) {
    throw new CustomNextError(404)
  }

  return {
    q,
    page,
    namespace,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore make web strict
    organization: organization?.data?.getOrganization,
    searchResults,
    locale: locale as Locale,
    serviceWebPage: getServiceWebPage,
    customAlertBanner: getServiceWebPage?.alertBanner,
  }
}

export default withMainLayout(ServiceSearch, {
  showHeader: false,
  footerVersion: 'organization',
})
