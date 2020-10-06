import React from 'react'
import { ServiceSection, Layout } from '../../components'
import { useQuery } from 'react-apollo'
import { GET_API_SERVICE_QUERY } from '../Queries'
import { Query, QueryGetApiServiceByIdArgs } from '@island.is/api/schema'
import { NextPage } from 'next'

export interface ServiceDetailProps {
  id: string
}

const ServiceDetail: NextPage<ServiceDetailProps> = ({ id }) => {
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
      <div>{JSON.stringify(data.getApiServiceById, null, 2)}</div>
    </div>
  )
}

ServiceDetail.getInitialProps = async (ctx): Promise<ServiceDetailProps> => {
  const { query } = ctx
  return { id: query.service[0] }
}

export default ServiceDetail
