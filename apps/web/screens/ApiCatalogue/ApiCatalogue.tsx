import React, { useEffect, useState } from 'react'
import { useWindowSize } from 'react-use'
import { Screen } from '@island.is/web/types'
import { withMainLayout } from '@island.is/web/layouts/main'
import { SubpageLayout } from '@island.is/web/screens/Layouts/Layouts'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'

import {
  Text,
  Stack,
  Breadcrumbs,
  Box,
  Button,
  Navigation,
  Link,
  LoadingDots,
  ColorSchemeContext,
} from '@island.is/island-ui/core'

import {
  ServiceList,
  SubpageMainContent,
  RichText,
  ApiCatalogueFilter,
  GridContainer,
} from '@island.is/web/components'

import getConfig from 'next/config'
import { CustomNextError } from '@island.is/web/units/errors'
import {
  ContentLanguage,
  GetNamespaceQuery,
  QueryGetNamespaceArgs,
  GetSubpageHeaderQuery,
  QueryGetSubpageHeaderArgs,
} from '@island.is/web/graphql/schema'
import {
  Query,
  QueryGetApiCatalogueArgs,
  GetApiCatalogueInput,
} from '@island.is/api/schema'
import { Slice as SliceType } from '@island.is/island-ui/contentful'
import {
  GET_CATALOGUE_QUERY,
  GET_NAMESPACE_QUERY,
  GET_SUBPAGE_HEADER_QUERY,
} from '../queries'
import { useNamespace } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'
import { useQuery } from '@apollo/client'
import {
  AccessCategory,
  DataCategory,
  PricingCategory,
  TypeCategory,
} from '@island.is/api-catalogue/consts'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { theme } from '@island.is/island-ui/theme'

const { publicRuntimeConfig } = getConfig()
const LIMIT = 20

/* TEMPORARY LAYOUT CREATED TO SCAFFOLD API CATALOGUE INTO THE WEB */

interface ApiCatalogueProps {
  subpageHeader: GetSubpageHeaderQuery['getSubpageHeader']
  staticContent: GetNamespaceQuery['getNamespace']
  filterContent: GetNamespaceQuery['getNamespace']
  navigationLinks: GetNamespaceQuery['getNamespace']
}

const ApiCatalogue: Screen<ApiCatalogueProps> = ({
  subpageHeader,
  staticContent,
  filterContent,
  navigationLinks,
}) => {
  const { width } = useWindowSize()
  const [isMobile, setIsMobile] = useState(false)

  /* DISABLE FROM WEB WHILE WIP */
  const { disableApiCatalog: disablePage } = publicRuntimeConfig

  if (disablePage === 'true') {
    throw new CustomNextError(404, 'Not found')
  }
  /* --- */
  const { activeLocale } = useI18n()
  const sn = useNamespace(staticContent)
  const fn = useNamespace(filterContent)
  const nn = useNamespace(navigationLinks)

  const { linkResolver } = useLinkResolver()

  useEffect(() => {
    if (width < theme.breakpoints.md) {
      return setIsMobile(true)
    }
    setIsMobile(false)
  }, [width])

  const onLoadMore = () => {
    if (data?.getApiCatalogue.pageInfo?.nextCursor === null) {
      return
    }

    const { nextCursor } = data?.getApiCatalogue?.pageInfo
    const param = { ...parameters, cursor: nextCursor }
    fetchMore({
      variables: { input: param },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        fetchMoreResult.getApiCatalogue.services = [
          ...prevResult.getApiCatalogue.services,
          ...fetchMoreResult.getApiCatalogue.services,
        ]
        return fetchMoreResult
      },
    })
  }
  const [parameters, setParameters] = useState<GetApiCatalogueInput>({
    cursor: null,
    limit: LIMIT,
    query: '',
    pricing: [],
    data: [],
    type: [],
    access: [],
  })

  const { data, loading, error, fetchMore, refetch } = useQuery<
    Query,
    QueryGetApiCatalogueArgs
  >(GET_CATALOGUE_QUERY, {
    variables: {
      input: parameters,
    },
  })

  useEffect(() => {
    refetch()
  }, [parameters])

  const filterCategories = [
    {
      id: 'pricing',
      label: fn('pricing'),
      selected: parameters.pricing,
      filters: [
        {
          value: PricingCategory.FREE,
          label: fn('pricingFree'),
        },
        {
          value: PricingCategory.PAID,
          label: fn('pricingPaid'),
        },
      ],
    },
    {
      id: 'data',
      label: fn('data'),
      selected: parameters.data,
      filters: [
        {
          value: DataCategory.FINANCIAL,
          label: fn('dataFinancial'),
        },
        {
          value: DataCategory.HEALTH,
          label: fn('dataHealth'),
        },
        {
          value: DataCategory.OFFICIAL,
          label: fn('dataOfficial'),
        },
        {
          value: DataCategory.OPEN,
          label: fn('dataOpen'),
        },
        {
          value: DataCategory.PERSONAL,
          label: fn('dataPersonal'),
        },
        {
          value: DataCategory.PUBLIC,
          label: fn('dataPublic'),
        },
      ],
    },
    {
      id: 'type',
      label: fn('type'),
      selected: parameters.type,
      filters: [
        {
          value: TypeCategory.REST,
          label: fn('typeRest'),
        },
        {
          value: TypeCategory.SOAP,
          label: fn('typeSoap'),
        },
      ],
    },
    {
      id: 'access',
      label: fn('access'),
      selected: parameters.access,
      filters: [
        {
          value: AccessCategory.APIGW,
          label: fn('accessApigw'),
        },
        {
          value: AccessCategory.XROAD,
          label: fn('accessXroad'),
        },
      ],
    },
  ]

  const navigationItems = [
    {
      active: true,
      href: linkResolver('webservicespage').href,
      title: nn('linkServicesText'),
    },
    {
      href: linkResolver('handbookpage').href,
      title: nn('linkHandbookNavText'),
    },
    {
      href: nn('linkIslandUI'),
      title: nn('linkIslandUIText'),
    },
    {
      href: nn('linkDesignSystem'),
      title: nn('linkDesignSystemText'),
    },
  ]

  return (
    <SubpageLayout
      main={
        <SidebarLayout
          paddingTop={[0, 0, 9]}
          paddingBottom={[4, 4, 12]}
          sidebarContent={
            <Navigation
              baseId="service-list-navigation"
              colorScheme="blue"
              items={navigationItems}
              title={nn('linkThrounText')}
              titleLink={{
                href: linkResolver('developerspage').href,
              }}
            />
          }
        >
          <SubpageMainContent
            main={
              <Box>
                <Box display={['inline', 'inline', 'none']}>
                  {/* Show when a device */}
                  <Box paddingBottom={3}>
                    <Button
                      colorScheme="default"
                      preTextIcon="arrowBack"
                      size="small"
                      variant="text"
                    >
                      <Link {...linkResolver('developerspage')}>
                        {nn('linkThrounText')}
                      </Link>
                    </Button>
                  </Box>
                  <Box marginBottom={3}>
                    <Navigation
                      baseId="service-list-navigation"
                      colorScheme="blue"
                      isMenuDialog
                      items={navigationItems}
                      title={nn('linkThrounText')}
                      titleLink={{
                        href: linkResolver('developerspage').href,
                      }}
                    />
                  </Box>
                </Box>
                <Box marginBottom={2} display={['none', 'none', 'inline']}>
                  {/* Show when NOT a device */}
                  <Breadcrumbs
                    items={[
                      {
                        title: nn('linkIslandIsText'),
                        href: linkResolver('homepage').href,
                      },

                      {
                        title: nn('linkThrounText'),
                        href: linkResolver('developerspage').href,
                      },
                    ]}
                  />
                </Box>
                <Stack space={1}>
                  <Text variant="h1">{subpageHeader.title}</Text>
                  <Text variant="intro">{subpageHeader.summary}</Text>
                  <Stack space={2}>
                    {subpageHeader.body ? (
                      <RichText
                        body={subpageHeader.body as SliceType[]}
                        config={{ defaultPadding: [2, 2, 4] }}
                        locale={activeLocale}
                      />
                    ) : null}
                  </Stack>
                </Stack>
              </Box>
            }
            image={
              <Box
                width="full"
                height="full"
                display="flex"
                alignItems="center"
              >
                <img
                  src={subpageHeader.featuredImage.url}
                  alt={subpageHeader.featuredImage.title}
                  width={subpageHeader.featuredImage.width}
                  height={subpageHeader.featuredImage.height}
                />
              </Box>
            }
          />
        </SidebarLayout>
      }
      details={
        <Box background="blue100" display="inlineBlock" width="full">
          <ColorSchemeContext.Provider value={{ colorScheme: 'blue' }}>
            <GridContainer id="service-list">
              <Box marginBottom={[3, 3, 6]}>
                <ApiCatalogueFilter
                  variant={isMobile ? 'dialog' : 'popover'}
                  align="right"
                  labelClearAll={fn('clearAll')}
                  labelClear={fn('clear')}
                  labelOpen={fn('openFilterButton')}
                  labelClose={fn('closeFilter')}
                  labelResult={fn('mobileResult')}
                  labelTitle={fn('mobileTitle')}
                  resultCount={data?.getApiCatalogue?.services?.length ?? 0}
                  onFilterClear={() =>
                    setParameters({
                      query: '',
                      pricing: [],
                      data: [],
                      type: [],
                      access: [],
                    })
                  }
                  inputPlaceholder={fn('search')}
                  inputValue={parameters.query}
                  onInputChange={(value) =>
                    setParameters({ ...parameters, query: value })
                  }
                  labelCategoryClear={fn('clearCategory')}
                  onCategoryChange={({ categoryId, selected }) => {
                    setParameters({
                      ...parameters,
                      [categoryId]: selected,
                    })
                  }}
                  onCategoryClear={(categoryId) =>
                    setParameters({
                      ...parameters,
                      [categoryId]: [],
                    })
                  }
                  categories={filterCategories}
                />
              </Box>
              {(error || data?.getApiCatalogue?.services.length < 1) && (
                <GridContainer>
                  {error ? (
                    <Text>{sn('errorHeading')}</Text>
                  ) : loading ? (
                    <LoadingDots />
                  ) : (
                    <Text>{sn('notFound')}</Text>
                  )}
                </GridContainer>
              )}
              {data?.getApiCatalogue?.services.length > 0 && (
                <GridContainer>
                  <ServiceList
                    baseUrl={linkResolver('webservicespage').href + '/'}
                    services={data?.getApiCatalogue?.services}
                    tagDisplayNames={filterContent}
                  />
                  {data?.getApiCatalogue?.pageInfo?.nextCursor != null && (
                    <Box display="flex" justifyContent="center">
                      <Button onClick={() => onLoadMore()} variant="ghost">
                        {!loading ? sn('fmButton') : <LoadingDots single />}
                      </Button>
                    </Box>
                  )}
                </GridContainer>
              )}
            </GridContainer>
          </ColorSchemeContext.Provider>
        </Box>
      }
    />
  )
}

ApiCatalogue.getInitialProps = async ({ apolloClient, locale }) => {
  const [
    {
      data: { getSubpageHeader: subpageHeader },
    },
    staticContent,
    filterContent,
    navigationLinks,
  ] = await Promise.all([
    apolloClient.query<GetSubpageHeaderQuery, QueryGetSubpageHeaderArgs>({
      query: GET_SUBPAGE_HEADER_QUERY,
      variables: {
        input: {
          lang: locale as ContentLanguage,
          id: 'VefthjonusturHome',
        },
      },
    }),
    apolloClient
      .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'ApiCatalog',
            lang: locale as ContentLanguage,
          },
        },
      })
      .then((res) => JSON.parse(res.data.getNamespace.fields)),
    apolloClient
      .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'ApiCatalogFilter',
            lang: locale as ContentLanguage,
          },
        },
      })
      .then((res) => JSON.parse(res.data.getNamespace.fields)),
    apolloClient
      .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'ApiCatalogueLinks',
            lang: locale as ContentLanguage,
          },
        },
      })
      .then((res) => JSON.parse(res.data.getNamespace.fields)),
  ])

  return {
    subpageHeader,
    staticContent,
    filterContent,
    navigationLinks,
  }
}

export default withMainLayout(ApiCatalogue)
