import React, { useState } from 'react'
import { Screen } from '@island.is/web/types'
import { withMainLayout } from '@island.is/web/layouts/main'
import getConfig from 'next/config'
import { CustomNextError } from '@island.is/web/units/errors'

import {
  GetNamespaceQuery,
  Query,
  QueryGetApiServiceByIdArgs,
  QueryGetNamespaceArgs,
  Service,
} from '@island.is/web/graphql/schema'
import { GET_NAMESPACE_QUERY, GET_API_SERVICE_QUERY } from '../queries'
import {
  SubpageMainContent,
  ServiceInformation,
  OpenApiView,
} from '@island.is/web/components'
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
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'

const { publicRuntimeConfig } = getConfig()

interface ServiceDetailsProps {
  strings: GetNamespaceQuery['getNamespace']
  filterContent: GetNamespaceQuery['getNamespace']
  openApiContent: GetNamespaceQuery['getNamespace']
  service: Service
}
type SelectOption = {
  label: string
  value: any
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

  const { linkResolver } = useLinkResolver()

  if (disablePage === 'true') {
    throw new CustomNextError(404, 'Not found')
  }

  const navigationItems = [
    {
      active: true,
      href: linkResolver('webservicespage').as,
      title: n('linkServicesText'),
      items: [
        {
          active: true,
          title: service?.title,
        },
      ],
    },
    {
      href: linkResolver('handbookpage').as,
      title: n('linkHandbookNavText'),
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

  const [selectedVersionOption, setSelectedVersionOption] = useState<
    SelectOption
  >(null)
  const [selectedInstanceOption, setSelectedInstanceOption] = useState<
    SelectOption
  >(null)

  const setOpenApiContent = (option: any) => {
    console.log('setApiContent: ', option)
    setSelectedVersionOption(option)
  }

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
                href: linkResolver('developerspage').as,
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
                    <Button
                      colorScheme="default"
                      preTextIcon="arrowBack"
                      size="small"
                      variant="text"
                    >
                      <Link href={linkResolver('webservicespage').as}>
                        {n('linkServicesText')}
                      </Link>
                    </Button>
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
                        href: linkResolver('developerspage').as,
                      }}
                    />
                  </Box>
                </Box>
                <Box marginBottom={2} display={['none', 'none', 'inline']}>
                  {/* Show when NOT a device */}
                  <Breadcrumbs
                    items={[
                      {
                        title: n('linkIslandIsText'),
                        href: linkResolver('homepage').as,
                      },
                      {
                        title: n('linkThrounText'),
                        href: linkResolver('developerspage').as,
                      },
                      {
                        title: n('linkServicesText'),
                        href: linkResolver('webservicespage').as,
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
                    onSelectChange={(option) => setOpenApiContent(option)}
                  />
                )}
              </Box>
            }
          />
        </SidebarLayout>
      }
      details={
        !selectedVersionOption ? (
          <></>
        ) : (
          <OpenApiView
            service={service}
            strings={openApiContent}
            getOpenApiInput={selectedVersionOption.value}
          />
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
