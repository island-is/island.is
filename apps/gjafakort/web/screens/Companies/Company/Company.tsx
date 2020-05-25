import React from 'react'
import gql from 'graphql-tag'

import { Application } from '../../../graphql/schema'
import { withApollo } from '../../../graphql'

interface PropTypes {
  application: Application
}

const ApplicationQuery = gql`
  query Application {
    application {
      id
    }
  }
`

function Company({ application }) {
  return <div>Company page, owned by {application.id}</div>
}

Company.getInitialProps = async ({ apolloClient }) => {
  const {
    data: { application },
  } = await apolloClient.query({
    query: ApplicationQuery,
  })

  return { application }
}

export default withApollo(Company)
