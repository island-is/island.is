import React, { useState } from 'react'
import { useRouter } from 'next/router'

import { Box, NavigationItem, Text } from '@island.is/island-ui/core'
import {
  getThemeConfig,
  OpenApiView,
  OrganizationWrapper,
  ServiceInformation,
  SubpageDetailsContent,
} from '@island.is/web/components'
import {
  ContentLanguage,
  GetNamespaceQuery,
  GetOpenApiInput,
  Query,
  QueryGetApiServiceByIdArgs,
  QueryGetNamespaceArgs,
  QueryGetOrganizationPageArgs,
  Service,
  ServiceDetail,
  XroadIdentifier,
} from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import useLocalLinkTypeResolver from '@island.is/web/hooks/useLocalLinkTypeResolver'
import { withMainLayout } from '@island.is/web/layouts/main'
import SubpageLayout from '@island.is/web/screens/Layouts/Layouts'
import { Screen } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'

import {
  GET_API_SERVICE_QUERY,
  GET_NAMESPACE_QUERY,
  GET_ORGANIZATION_PAGE_QUERY,
} from '../../queries'

interface ServiceDetailsProps {
  organizationPage: Query['getOrganizationPage']
  strings: GetNamespaceQuery['getNamespace']
  filterContent: GetNamespaceQuery['getNamespace']
  openApiContent: GetNamespaceQuery['getNamespace']
  service: Service
}

const ServiceDetails: Screen<ServiceDetailsProps> = ({
  organizationPage,
  strings,
  filterContent,
  openApiContent,
  service = null,
}) => {
  const Router = useRouter()
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  const n = useNamespace(strings)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  const nfc = useNamespace(filterContent)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  const noa = useNamespace(openApiContent)
  const { linkResolver } = useLinkResolver()
  const [selectedServiceDetail, setselectedServiceDetail] =
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore make web strict
    useState<ServiceDetail>(service.environments[0].details[0])

  useLocalLinkTypeResolver()

  //TODO look into how to initialize
  const xroadIdentifierToOpenApiInput = (xroadIdentifier: XroadIdentifier) => {
    const { __typename, ...identifier } = xroadIdentifier
    return identifier
  }

  const [selectedGetOpenApiInput, setSelectedGetOpenApiInput] =
    useState<GetOpenApiInput>(
      xroadIdentifierToOpenApiInput(selectedServiceDetail.xroadIdentifier),
    )

  const setApiContent = (serviceDetail: ServiceDetail) => {
    setselectedServiceDetail(serviceDetail)
    setSelectedGetOpenApiInput(
      xroadIdentifierToOpenApiInput(serviceDetail.xroadIdentifier),
    )
  }

  const cataloguePath: string = Router.asPath.substring(
    0,
    Router.asPath.lastIndexOf('/'),
  )
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  const navList: NavigationItem[] = organizationPage?.menuLinks.map(
    ({ primaryLink, childrenLinks }) => ({
      title: primaryLink?.text,
      href: primaryLink?.url,
      active:
        primaryLink?.url === cataloguePath ||
        childrenLinks.some((link) => link.url === cataloguePath),
      items: childrenLinks.map(({ text, url }) => ({
        title: text,
        href: url,
        active: url === cataloguePath,
      })),
    }),
  )

  return (
    <OrganizationWrapper
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      pageTitle={service.title ?? ''}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      organizationPage={organizationPage}
      showReadSpeaker={false}
      breadcrumbItems={[
        {
          title: 'Ísland.is',
          href: linkResolver('homepage').href,
        },
        {
          title: organizationPage?.title ?? '',
          href: linkResolver('organizationpage', [organizationPage?.slug ?? ''])
            .href,
        },
        {
          title: n('linkServicesText'),
          href: linkResolver('apicataloguepage').href,
        },
      ]}
      navigationData={{
        title: n('navigationTitle', 'Efnisyfirlit'),
        items: navList,
      }}
      showSecondaryMenu={false}
      mainContent={
        !service ? (
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
        )
      }
    >
      <Box paddingBottom={3}>
        <SubpageLayout
          main={null}
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
      </Box>
    </OrganizationWrapper>
  )
}

ServiceDetails.getProps = async ({ apolloClient, locale, query }) => {
  const serviceId = String(query.slug)

  const [
    {
      data: { getOrganizationPage },
    },
    linkStrings,
    filterContent,
    openApiContent,
    { data },
  ] = await Promise.all([
    apolloClient.query<Query, QueryGetOrganizationPageArgs>({
      query: GET_ORGANIZATION_PAGE_QUERY,
      variables: {
        input: {
          slug: locale === 'en' ? 'digital-iceland' : 'stafraent-island',
          lang: locale as ContentLanguage,
          subpageSlugs: [locale === 'en' ? 'webservices' : 'vefthjonustur'],
        },
      },
    }),
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
      .then((res) =>
        res.data.getNamespace?.fields
          ? JSON.parse(res.data.getNamespace.fields)
          : {},
      ),
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
      .then((res) =>
        res.data.getNamespace?.fields
          ? JSON.parse(res.data.getNamespace.fields)
          : {},
      ),
    apolloClient
      .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'OpenApiView',
            lang: locale as ContentLanguage,
          },
        },
      })
      .then((res) =>
        res.data.getNamespace?.fields
          ? JSON.parse(res.data.getNamespace.fields)
          : {},
      ),
    apolloClient.query<Query, QueryGetApiServiceByIdArgs>({
      query: GET_API_SERVICE_QUERY,
      variables: {
        input: {
          id: serviceId,
        },
      },
    }),
  ])

  const service = data?.getApiServiceById

  if (!service) {
    throw new CustomNextError(404, 'Service not found')
  }

  return {
    organizationPage: getOrganizationPage,
    serviceId: serviceId,
    strings: linkStrings,
    filterContent: filterContent,
    openApiContent: openApiContent,
    service: service,
    ...getThemeConfig(
      getOrganizationPage?.theme,
      getOrganizationPage?.organization,
    ),
  }
}

export default withMainLayout(ServiceDetails)
