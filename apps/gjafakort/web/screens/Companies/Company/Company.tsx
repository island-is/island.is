import React from 'react'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'

import { Application } from '../../../graphql/schema'

const ApplicationQuery = gql`
  query ApplicationQuery($ssn: String!) {
    application(ssn: $ssn) {
      id
    }
  }
`

function Company() {
  const { data, loading } = useQuery(ApplicationQuery, {
    variables: { ssn: '1' },
  })

  const application = (data || {}).application as Application
  if (loading) {
    return <div>Loading...</div>
  }

  return <div>Company page, owned by {application && application.id}</div>
}

export default Company
