import React, { useState } from 'react'
import { Screen } from '@island.is/web/types'
import { withMainLayout } from '@island.is/web/layouts/main'
import getConfig from 'next/config'
import { CustomNextError } from '@island.is/web/units/errors'
import { useI18n } from '@island.is/web/i18n'
import {
  GetNamespaceQuery,
  GetOpenApiInput,
  Query,
  QueryGetApiServiceByIdArgs,
  QueryGetNamespaceArgs,
  Service,
  ServiceDetail,
  XroadIdentifier,
  Environment,
} from '@island.is/web/graphql/schema'
import { GET_NAMESPACE_QUERY, GET_API_SERVICE_QUERY } from '../queries'
import {
  SubpageMainContent,
  ServiceInformation,
  OpenApiView,
  InstitutionPanel,
  SubpageDetailsContent,
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
  Stack,
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

const ServiceDetails: Screen<ServiceDetailsProps> = ({
  strings,
  filterContent,
  openApiContent,
  service = null,
}) => {
  const n = useNamespace(strings)
  const nfc = useNamespace(filterContent)
  const noa = useNamespace(openApiContent)
  const { disableApiCatalog: disablePage } = publicRuntimeConfig

  const { linkResolver } = useLinkResolver()
  const [
    selectedServiceDetail,
    setselectedServiceDetail,
  ] = useState<ServiceDetail>(service.environments[0].details[0])
  //TODO look into how to initialize

  const xroadIdentifierToOpenApiInput = (xroadIdentifier: XroadIdentifier) => {
    const { __typename, ...identifier } = xroadIdentifier
    return identifier
  }

  const [
    selectedGetOpenApiInput,
    setSelectedGetOpenApiInput,
  ] = useState<GetOpenApiInput>(
    xroadIdentifierToOpenApiInput(selectedServiceDetail.xroadIdentifier),
  )

  const setApiContent = (serviceDetail: ServiceDetail) => {
    setselectedServiceDetail(serviceDetail)
    setSelectedGetOpenApiInput(
      xroadIdentifierToOpenApiInput(serviceDetail.xroadIdentifier),
    )
  }

  if (disablePage === 'true') {
    throw new CustomNextError(404, 'Not found')
  }

  const navigationItems = [
    {
      active: true,
      href: linkResolver('webservicespage').href,
      title: n('linkServicesText'),
      items: [
        {
          active: true,
          title: service?.title,
        },
      ],
    },
    {
      href: linkResolver('handbookpage').href,
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
  ]
  const { activeLocale } = useI18n()
  return (
    <SubpageLayout
      main={
        <SidebarLayout
          paddingTop={[0, 0, 9]}
          paddingBottom={[4, 4, 6]}
          sidebarContent={
            <Stack space={2}>
              <Navigation
                baseId="service-details-navigation"
                colorScheme="blue"
                items={navigationItems}
                title={n('linkThrounText')}
                titleLink={{
                  href: linkResolver('developerspage').href,
                }}
              />
            </Stack>
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
                      <Link {...linkResolver('webservicespage')}>
                        {n('linkServicesText')}
                      </Link>
                    </Button>
                  </Box>
                  <Box marginBottom={3}>
                    <Navigation
                      baseId="service-details-navigation"
                      colorScheme="blue"
                      isMenuDialog
                      items={navigationItems}
                      title={n('linkThrounText')}
                      titleLink={{
                        active: true,
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
                        title: n('linkIslandIsText'),
                        href: linkResolver('homepage').href,
                      },
                      {
                        title: n('linkThrounText'),
                        href: linkResolver('developerspage').href,
                      },
                      {
                        title: n('linkServicesText'),
                        href: linkResolver('webservicespage').href,
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
                    onSelectChange={(selectedServiceDetail) =>
                      setApiContent(selectedServiceDetail)
                    }
                  />
                )}
              </Box>
            }
          />
        </SidebarLayout>
      }
      details={
        <SubpageDetailsContent
          header={
            <Text variant="h4" color="blue600">
              {noa('title')}
            </Text>
          }
          content={
            selectedGetOpenApiInput && (
              <OpenApiView
                strings={openApiContent}
                openApiInput={selectedGetOpenApiInput}
              />
            )
          }
        />
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
