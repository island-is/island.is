import React from 'react'
import { useQuery } from 'react-apollo'
import gql from 'graphql-tag'

import { ContentLoader } from '@island.is/gjafakort-web/components'

import { ApplicationTable } from './components'

const GetApplicationsQuery = gql`
  query GetApplicationsQuery {
    applications {
      id
      name
      email
      state
      companySSN
      serviceCategory
      generalEmail
      companyDisplayName
      companyName
      exhibition
      operatingPermitForRestaurant
      operatingPermitForVehicles
      operationsTrouble
      phoneNumber
      validLicenses
      validPermit
      webpage
      logs {
        id
        state
        title
        data
        authorSSN
      }
    }
  }
`

function Admin() {
  const { data, loading } = useQuery(GetApplicationsQuery)
  const { applications } = data || {}

  if (loading && !data) {
    return <ContentLoader />
  }

  return (
    <div>
      <h1>Admin page</h1>
      <ApplicationTable applications={applications} />
    </div>
  )
}

export default Admin
