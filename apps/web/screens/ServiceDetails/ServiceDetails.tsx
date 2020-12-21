import React from 'react'
import { Screen } from '@island.is/web/types'
import { withMainLayout } from '@island.is/web/layouts/main'
import getConfig from 'next/config'
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
import { Box, Breadcrumbs, Link, Text } from '@island.is/island-ui/core'
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

  return (
    <SubpageLayout
      main={
        <SidebarLayout sidebarContent={<></>}>
          <SubpageMainContent
            main={
              <Box>
                <Box marginBottom={2}>
                  <Breadcrumbs>
                    <Link href="/">Ísland.is</Link>
                    <a href="/throun">{n('linkTextThroun')}</a>
                    <a href="/throun/vefthjonustur/vorulisti">
                      {n('linkTextVefthjonustur')}
                    </a>
                    <span>{n('linkTextLast')}</span>
                  </Breadcrumbs>
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
    serviceDetails,
    filterContent,
    openApiContent,
    { data },
  ] = await Promise.all([
    apolloClient
      .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'ServiceDetails',
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
    strings: serviceDetails,
    filterContent: filterContent,
    openApiContent: openApiContent,
    service: data?.getApiServiceById,
  }
}

export default withMainLayout(ServiceDetails)
