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
  } else if (!loading && !data) {
    return <p>Unauthorized</p>
  }

  return (
    <div>
      <div>Number of applications {applications.length}</div>
      <br />
      <div>
        Number of applications pending{' '}
        {
          applications.filter((application) => application.state === 'pending')
            .length
        }
      </div>
      <div>
        Number of applications approved{' '}
        {
          applications.filter((application) => application.state === 'approved')
            .length
        }
      </div>
      <br />
      <ApplicationTable applications={applications} />
    </div>
  )
}

export default Admin
