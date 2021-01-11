import React from 'react'
import { Screen } from '@island.is/web/types'
import { withMainLayout } from '@island.is/web/layouts/main'
import getConfig from 'next/config'
import { default as NextLink } from 'next/link'
import { CustomNextError } from '@island.is/web/units/errors'

import {
  GetNamespaceQuery,
  Query,
  QueryGetApiServiceByIdArgs,
  QueryGetNamespaceArgs,
  ApiService,
} from '@island.is/web/graphql/schema'
import { GET_NAMESPACE_QUERY, GET_API_SERVICE_QUERY } from '../queries'
import {
  SubpageMainContent,
  ServiceInformation,
  OpenApiView,
} from '../../components'
import { SubpageLayout } from '../Layouts/Layouts'
import SidebarLayout from '../Layouts/SidebarLayout'
import {
  Box,
  Breadcrumbs,
  Button,
  Link,
  Navigation,
  Text,
} from '@island.is/island-ui/core'
import { useNamespace } from '../../hooks'
import { useScript } from '../../hooks/useScript'

const { publicRuntimeConfig } = getConfig()

interface ServiceDetailsProps {
  strings: GetNamespaceQuery['getNamespace']
  filterContent: GetNamespaceQuery['getNamespace']
  openApiContent: GetNamespaceQuery['getNamespace']
  service: ApiService
}

const ServiceDetails: Screen<ServiceDetailsProps> = ({
  strings,
  filterContent,
  openApiContent,
  service = null,
}) => {
  useScript(
    'https://cdn.jsdelivr.net/npm/redoc@next/bundles/redoc.standalone.js',
    true,
    'redoc',
  )

  const n = useNamespace(strings)
  const nfc = useNamespace(filterContent)
  const { disableApiCatalog: disablePage } = publicRuntimeConfig

  if (disablePage === 'true') {
    throw new CustomNextError(404, 'Not found')
  }

  const navigationItems = [
    {
      active: true,
      href: n('linkServices'),
      title: n('linkServicesText'),
      items: [
        {
          href: n('linkServiceList'),
          title: n('linkServiceListText'),
        },
        {
          href: n('linkDesignGuide'),
          title: n('linkDesignGuideText'),
        },
        {
          active: true,
          title: n('linkDetailsLastText'),
        },
      ],
    },
    {
      href: n('linkIslandUI'),
      title: n('linkIslandUIText'),
    },
    {
      href: n('linkDesignSystem'),
      title: n('linkDesignSystemText'),
    },
    {
      href: n('linkContentPolicy'),
      title: n('linkContentPolicyText'),
    },
  ]

  return (
    <SubpageLayout
      main={
        <SidebarLayout
          sidebarContent={
            <Navigation
              baseId="service-details-navigation"
              colorScheme="blue"
              items={navigationItems}
              title={n('linkThrounText')}
              titleLink={{
                active: true,
                href: n('linkThroun'),
              }}
            />
          }
        >
          <SubpageMainContent
            main={
              <Box>
                <Box display={['inline', 'inline', 'none']}>
                  {/* Show when a device */}
                  <Box paddingBottom="gutter">
                    <NextLink passHref href={n('linkServiceList')}>
                      <a href={n('linkServiceList')}>
                        <Button
                          colorScheme="default"
                          iconType="filled"
                          preTextIcon="arrowBack"
                          preTextIconType="filled"
                          size="small"
                          type="button"
                          variant="text"
                        >
                          {n('linkServiceListText')}
                        </Button>
                      </a>
                    </NextLink>
                  </Box>
                  <Box marginBottom="gutter">
                    <Navigation
                      baseId="service-details-navigation"
                      colorScheme="blue"
                      isMenuDialog
                      items={navigationItems}
                      title={n('linkThrounText')}
                      titleLink={{
                        active: true,
                        href: n('linkThroun'),
                      }}
                    />
                  </Box>
                </Box>
                <Box marginBottom={2} display={['none', 'none', 'inline']}>
                  {/* Show when NOT a device */}
                  <Breadcrumbs
                    items={[
                      { title: n('linkIslandIsText'), href: n('linkIslandIs') },
                      { title: n('linkThrounText'), href: n('linkThroun') },
                      {
                        title: n('linkServiceListText'),
                        href: n('linkServiceList'),
                      },
                    ]}
                  />
                </Box>
                {!service ? (
                  <Box>
                    <Text variant="h3" as="h3">
                      {nfc('serviceNotFound')}
                    </Text>
                  </Box>
                ) : (
                  <ServiceInformation
                    strings={filterContent}
                    service={service}
                  />
                )}
              </Box>
            }
          />
        </SidebarLayout>
      }
      details={
        !service ? (
          <></>
        ) : (
          <OpenApiView strings={openApiContent} service={service} />
        )
      }
    />
  )
}

ServiceDetails.getInitialProps = async ({ apolloClient, locale, query }) => {
  const serviceId = String(query.slug)

  const [
    linkStrings,
    filterContent,
    openApiContent,
    { data },
  ] = await Promise.all([
    apolloClient
      .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'ApiCatalogueLinks',
            lang: locale,
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
            lang: locale,
          },
        },
      })
      .then((res) => JSON.parse(res.data.getNamespace.fields)),
    apolloClient
      .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'OpenApiView',
            lang: locale,
          },
        },
      })
      .then((res) => JSON.parse(res.data.getNamespace.fields)),
    apolloClient.query<Query, QueryGetApiServiceByIdArgs>({
      query: GET_API_SERVICE_QUERY,
      variables: {
        input: {
          id: serviceId,
        },
      },
    }),
  ])

  return {
    serviceId: serviceId,
    strings: linkStrings,
    filterContent: filterContent,
    openApiContent: openApiContent,
    service: data?.getApiServiceById,
  }
}

export default withMainLayout(ServiceDetails)
