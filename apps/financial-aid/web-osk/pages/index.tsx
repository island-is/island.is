import React, { useContext, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import {
  GetApplicationQuery,
  GetCurrentUserQuery,
} from '@island.is/financial-aid-web/osk/graphql/sharedGql'
import { Application } from '@island.is/financial-aid/shared'

interface ApplicationData {
  applications: Application[]
}

const Index = () => {
  // const { data, error, loading } = useQuery<ApplicationData>(
  //   GetApplicationQuery,
  //   {
  //     fetchPolicy: 'no-cache',
  //     errorPolicy: 'all',
  //   },
  // )

  useEffect(() => {
    document.title = 'Umsókn um fjárhagsaðstoð'
  }, [])

  const { data, error, loading } = useQuery(GetCurrentUserQuery, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  console.log(data)
  console.log(error)

  return (
    <div className="">
      {/* HELOO {loading ? 'loading...' : data?.applications[0].name} */}
    </div>
  )
}

export default Index
