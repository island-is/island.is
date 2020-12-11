import React from 'react'
import { Screen } from '@island.is/web/types'
import { withMainLayout } from '@island.is/web/layouts/main'
import getConfig from 'next/config'
import { CustomNextError } from '@island.is/web/units/errors'

import { GetNamespaceQuery } from '@island.is/web/graphql/schema'
import {
  Query,
  QueryGetApiServiceByIdArgs,
  QueryGetNamespaceArgs,
} from '@island.is/api/schema'
import { GET_NAMESPACE_QUERY } from '../queries'
import { GET_API_SERVICE_QUERY } from '../queries/ApiCatalogue'
import { ApiService } from '@island.is/api/schema'
import {
  ServiceView,
  SubpageDetailsContent,
  SubpageMainContent,
} from '../../components'
import { ApolloClient, NormalizedCacheObject, useQuery } from '@apollo/client'
import { SubpageLayout } from '../Layouts/Layouts'
import SidebarLayout from '../Layouts/SidebarLayout'

const { publicRuntimeConfig } = getConfig()


interface ServiceDetailsProps {
  service: ApiService
  strings: GetNamespaceQuery['getNamespace']
}

const ServiceDetails: Screen<ServiceDetailsProps> = ({ service, strings }) => {
  const { disableApiCatalog: disablePage } = publicRuntimeConfig

  if (disablePage === 'true') {
    throw new CustomNextError(404, 'Not found')
  }

  // const { data, loading, error } = useQuery<Query, QueryGetApiServiceByIdArgs>(GET_API_SERVICE_QUERY, {
  //   variables: {
  //     input: {
  //       id: serviceId,
  //     },
  //   },
  // })

  return (
    <SubpageLayout
      main={
        <SidebarLayout sidebarContent={<div>Navigation menu kemur hér</div>}>
          <SubpageMainContent
            main={<ServiceView strings={strings} service={service} />}
          />
        </SidebarLayout>
      }
      details={
        <SubpageDetailsContent
          header={<h1>OpenAPI skjölun</h1>}
          content={
            <SidebarLayout
              sidebarContent={
                <></> // Hér kemur filterinn
              }
            >
              <div>Hér kemur open API spekkinn</div>
            </SidebarLayout>
          }
        />
      }
    />
  )
}

ServiceDetails.getInitialProps = async ({ apolloClient, locale, query }) => {
  const serviceId = String(query.slug)
  const { data, loading, error } = await apolloClient.query<
    Query,
    QueryGetApiServiceByIdArgs
  >({
    query: GET_API_SERVICE_QUERY,
    variables: {
      input: {
        id: serviceId,
      },
    },
  })
  const service: ApiService = data.getApiServiceById
    ? data.getApiServiceById
    : null

  const [filterContent] = await Promise.all([
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
  ])

  return {
    service: service,
    strings: filterContent,
  }
}

export default withMainLayout(ServiceDetails)
