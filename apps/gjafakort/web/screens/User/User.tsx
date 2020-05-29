import React from 'react'
import gql from 'graphql-tag'
import { useLazyQuery } from 'react-apollo'

import { Application } from '../../graphql/schema'

const ApplicationQuery = gql`
  query ApplicationQuery($ssn: String!) {
    application(ssn: $ssn) {
      id
    }
  }
`

function User() {
  const [getApplication, { data, loading }] = useLazyQuery(ApplicationQuery, {
    variables: { ssn: '1' },
  })

  const application = (data || {}).application as Application
  return (
    <div>
      User page {application && application.id}
      <button onClick={() => getApplication()}>
        Click me!
      </button>
    </div>
  )
}

export default User
