import React from 'react'
import { ServiceDetail as ServiceDetails } from '../../components'
import {
  Query,
  QueryGetApiServiceByIdArgs,
  QueryGetNamespaceArgs,
} from '@island.is/api/schema'
import { GridContainer, LoadingIcon } from '@island.is/island-ui/core'
import * as styles from './ServiceDetail.treat'
import cn from 'classnames'
import { useQuery } from 'react-apollo'
import { GET_API_SERVICE_QUERY, GET_NAMESPACE_QUERY } from '../Queries'
import { Screen, GetNamespaceQuery } from '../../types'
import initApollo from '../../graphql/client'

interface ServiceDetailProps {
  serviceId: string
  filterContent: GetNamespaceQuery['getNamespace']
}

export const ServiceDetail: Screen<ServiceDetailProps> = ({
  serviceId,
  filterContent,
}) => {
  // prettier-ignore
  const { data, loading, error } = useQuery<Query, QueryGetApiServiceByIdArgs>(GET_API_SERVICE_QUERY, {
    variables: {
      input: {
        id: serviceId,
      },
    },
  })

  return (
    <GridContainer>
      {loading && (
        <div className={cn(styles.messageContainer)}>
          <LoadingIcon animate color="blue400" size={32} />
        </div>
      )}

      {error && (
        <div className={cn(styles.messageContainer)}>Þjónusta fannst ekki</div>
      )}

      {data?.getApiServiceById?.name && (
        <ServiceDetails
          service={data.getApiServiceById}
          strings={filterContent}
        />
      )}
    </GridContainer>
  )
}

ServiceDetail.getInitialProps = async (ctx) => {
  if (!ctx.locale) {
    ctx.locale = 'is-IS'
  }
  const client = initApollo({})

  const filterContent = await client
    .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
      query: GET_NAMESPACE_QUERY,
      variables: {
        input: {
          namespace: 'ApiCatalogFilter',
          lang: ctx.locale,
        },
      },
    })
    .then((res) => JSON.parse(res.data.getNamespace.fields))

  const id = ctx.asPath.slice(ctx.asPath.indexOf('/', 1) + 1)

  return {
    serviceId: id,
    filterContent,
  }
}
