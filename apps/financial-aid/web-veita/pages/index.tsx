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

  return <div className="">Hello World!</div>
}

export default Index
