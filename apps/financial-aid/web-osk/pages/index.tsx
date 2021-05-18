import React, { useContext, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { GetApplicationQuery } from '@island.is/financial-aid-web/osk/graphql/sharedGql'
import { Application } from '@island.is/financial-aid/types'

interface ApplicationData {
  applications: Application[]
}

const Index = () => {
  const { data, error, loading } = useQuery<ApplicationData>(
    GetApplicationQuery,
    {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  )

  return (
    <div className="">
      HELOO {loading ? 'loading...' : data?.applications[0].name}
    </div>
  )
}

export default Index
