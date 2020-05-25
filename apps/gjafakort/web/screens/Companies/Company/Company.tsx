import React from 'react'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'

import { Application } from '../../../graphql/schema'

const ApplicationQuery = gql`
  query Application {
    application {
      id
    }
  }
`

function Company() {
  const { data, loading } = useQuery(ApplicationQuery)

  const application = (data || {}).application as Application
  if (loading) {
    return <div>Loading...</div>
  }

  return <div>Company page, owned by {application.id}</div>
}

export default Company
