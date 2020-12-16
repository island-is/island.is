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
import { SubpageMainContent, ServiceInformation } from '../../components'
import { SubpageLayout } from '../Layouts/Layouts'
import SidebarLayout from '../Layouts/SidebarLayout'
import { Box, LoadingIcon, Text } from '@island.is/island-ui/core'
import { useNamespace } from '../../hooks'

const { publicRuntimeConfig } = getConfig()

interface ServiceDetailsProps {
  strings: GetNamespaceQuery['getNamespace']
  loading?: boolean
  service: ApiService
}

const ServiceDetails: Screen<ServiceDetailsProps> = ({
  strings,
  loading = false,
  service = null,
}) => {
  const n = useNamespace(strings)

  const { disableApiCatalog: disablePage } = publicRuntimeConfig

  if (disablePage === 'true') {
    throw new CustomNextError(404, 'Not found')
  }

  const showService = () => {
    if (service) {
      return <ServiceInformation strings={strings} service={service} />
    }

    return (
      <Box>
        <Text variant="h3" as="h3">
          {n('serviceNotFound')}
        </Text>
      </Box>
    )
  }

  return (
    <SubpageLayout
      main={
        <SidebarLayout
          sidebarContent={<>Navigation menu will be displayed here</>}
        >
          <SubpageMainContent
            main={
              loading ? (
                <LoadingIcon animate color="blue400" size={32} />
              ) : (
                showService()
              )
            }
          />
        </SidebarLayout>
      }
      details={<>The open API document will be displayed here</>}
    />
  )
}

ServiceDetails.getInitialProps = async ({ apolloClient, locale, query }) => {
  const serviceId = String(query.slug)

  const [filterContent, { data, loading }] = await Promise.all([
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
    loading,
  }
}

export default withMainLayout(ServiceDetails)
