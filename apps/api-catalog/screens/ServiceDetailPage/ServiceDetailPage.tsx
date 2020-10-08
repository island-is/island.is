import React from 'react'
import { ServiceSection, Layout, ServiceDetail } from '../../components'
import { useQuery } from 'react-apollo'
import { GET_API_SERVICE_QUERY } from '../Queries'
import { Query, QueryGetApiServiceByIdArgs } from '@island.is/api/schema'
import { NextPage } from 'next'

export interface ServiceDetailPageProps {
  id: string
}

export const ServiceDetailPage: NextPage<ServiceDetailPageProps> = ({ id }) => {
  const { data, loading, error } = useQuery<Query, QueryGetApiServiceByIdArgs>(
    GET_API_SERVICE_QUERY,
    {
      variables: {
        input: {
          id: id,
        },
      },
    },
  )

  if (error) {
    return <span>{JSON.stringify(error, null, 2)}</span>
  }
  if (loading) {
    return <span>Loading..</span>
  }

  return (
    <div>
      {console.log(data.getApiServiceById)}
      <ServiceDetail service={data.getApiServiceById} />
    </div>
  )
}

ServiceDetailPage.getInitialProps = async (
  ctx,
): Promise<ServiceDetailPageProps> => {
  const { query } = ctx
  return { id: query.service.toString() }
}
