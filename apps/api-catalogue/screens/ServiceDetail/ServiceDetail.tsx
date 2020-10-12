import React, { useState } from 'react'
import { Layout, ServiceDetail as ServiceDetails } from '../../components'
import { GET_API_SERVICE_QUERY } from '../Queries'
import {
  ApiService,
  Query,
  QueryGetApiServiceByIdArgs,
} from '@island.is/api/schema'
import initApollo from '../../graphql/client'
import { GridContainer } from '@island.is/island-ui/core'
import ContentfulApi from '../../services/contentful'
import { Page } from '../../services/contentful.types'
import * as styles from './ServiceDetail.treat'
import cn from 'classnames'

export interface ServiceDetailPageProps {
  service: ApiService
  filterStrings: Page
}

export function ServiceDetail({
  service,
  filterStrings,
}: ServiceDetailPageProps) {
  return (
    <GridContainer>
      {service?.name == null ? (
        <div className={cn(styles.errorContainer)}>Þjónusta fannst ekki</div>
      ) : (
        <ServiceDetails service={service} strings={filterStrings.strings} />
      )}
    </GridContainer>
  )
}

ServiceDetail.getInitialProps = async (
  ctx,
): Promise<ServiceDetailPageProps> => {
  const { query } = ctx
  const id = query.service.toString()
  const client = new ContentfulApi()
  let locale = 'is-IS'

  const pathLocale = ctx.pathname.split('/')[1]
  if (pathLocale === 'en') {
    locale = 'en-GB'
  }
  const filterStrings = await client.fetchPageBySlug('service-filter', locale)

  const apolloClient = initApollo({})
  const [
    {
      data: { getApiServiceById },
    },
  ] = await Promise.all([
    apolloClient.query<Query, QueryGetApiServiceByIdArgs>({
      query: GET_API_SERVICE_QUERY,
      variables: {
        input: {
          id: id,
        },
      },
    }),
  ])

  return { service: getApiServiceById, filterStrings: filterStrings }
}
