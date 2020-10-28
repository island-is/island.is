import React from 'react'
import { ServiceDetail as ServiceDetails } from '../../components'
import { Query, QueryGetApiServiceByIdArgs } from '@island.is/api/schema'
import { GridContainer, LoadingIcon } from '@island.is/island-ui/core'
import { Page } from '../../services/contentful.types'
import * as styles from './ServiceDetail.treat'
import cn from 'classnames'
import { useQuery } from 'react-apollo'
import { GET_API_SERVICE_QUERY } from '../Queries'

export interface ServiceDetailProps {
  serviceId: string
  filterStrings: Page
}

export function ServiceDetail({
  serviceId,
  filterStrings,
}: ServiceDetailProps) {
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
          strings={filterStrings.strings}
        />
      )}
    </GridContainer>
  )
}
