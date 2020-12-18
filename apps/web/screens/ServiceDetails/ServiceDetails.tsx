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
import { Box, Text } from '@island.is/island-ui/core'
import { useNamespace } from '../../hooks'
import { useScript } from '../../hooks/useScript'

const { publicRuntimeConfig } = getConfig()

interface ServiceDetailsProps {
  strings: GetNamespaceQuery['getNamespace']
  service: ApiService
}

const ServiceDetails: Screen<ServiceDetailsProps> = ({
  strings,
  service = null,
}) => {
  useScript(
    'https://cdn.jsdelivr.net/npm/redoc@next/bundles/redoc.standalone.js',
    true,
    'redoc',
  )

  const n = useNamespace(strings)

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
              !service ? (
                <Box>
                  <Text variant="h3" as="h3">
                    {n('serviceNotFound')}
                  </Text>
                </Box>
              ) : (
                <ServiceInformation strings={strings} service={service} />
              )
            }
          />
        </SidebarLayout>
      }
      details={
        !service ? <></> : <OpenApiView strings={strings} service={service} />
      }
    />
  )
}

ServiceDetails.getInitialProps = async ({ apolloClient, locale, query }) => {
  const serviceId = String(query.slug)

  const [filterContent, { data }] = await Promise.all([
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
    strings: filterContent,
    service: data?.getApiServiceById,
  }
}

export default withMainLayout(ServiceDetails)
