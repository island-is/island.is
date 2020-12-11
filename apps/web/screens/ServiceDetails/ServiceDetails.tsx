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
import {
  SubpageDetailsContent,
  SubpageMainContent,
  ServiceInformation,
} from '../../components'
import { useQuery } from '@apollo/client'
import { SubpageLayout } from '../Layouts/Layouts'
import SidebarLayout from '../Layouts/SidebarLayout'
import { LoadingIcon } from '@island.is/island-ui/core'

const { publicRuntimeConfig } = getConfig()

interface ServiceDetailsProps {
  //service: ApiService
  serviceId: string
  strings: GetNamespaceQuery['getNamespace']
}

const ServiceDetails: Screen<ServiceDetailsProps> = ({
  /*service,*/ serviceId,
  strings,
}) => {
  const { disableApiCatalog: disablePage } = publicRuntimeConfig

  if (disablePage === 'true') {
    throw new CustomNextError(404, 'Not found')
  }

  const { data, loading, error } = useQuery<Query, QueryGetApiServiceByIdArgs>(
    GET_API_SERVICE_QUERY,
    {
      variables: {
        input: {
          id: serviceId,
        },
      },
    },
  )

  return (
    <SubpageLayout
      main={
        <SidebarLayout
          sidebarContent={
            <>Navigation menu kemur hér</>
          }
        >
          <SubpageMainContent
            main={
              loading ? (
                <LoadingIcon animate color="blue400" size={32} />
              ) : (
                <ServiceInformation
                  strings={strings}
                  service={data.getApiServiceById}
                />
              )
            }
          />
        </SidebarLayout>
      }
      details={
            <>Hér kemur open API spekkinn</>
        }
    />
  )
}

ServiceDetails.getInitialProps = async ({ apolloClient, locale, query }) => {
  const serviceId = String(query.slug)

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
    serviceId: serviceId,
    strings: filterContent,
  }
}

export default withMainLayout(ServiceDetails)
