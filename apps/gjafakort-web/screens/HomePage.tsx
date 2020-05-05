import React from 'react'
import gql from 'graphql-tag'
import {
  GetApplicationQuery,
  GetApplicationQueryVariables,
} from '../graphql/schema'
import { Screen } from './types'
import { withApollo } from '../graphql'

interface HomePageProps {
  application: GetApplicationQuery['getApplication']
}

const QUERY = gql`
  query GetApplication {
    getApplication {
      id
    }
  }
`

const HomePage: Screen<HomePageProps> = ({ application }) => (
  <div>
    <h1>You have visited the Home Page with application {application.id}</h1>
  </div>
)

HomePage.getInitialProps = async ({ apolloClient }) => {
  const {
    data: { getApplication: application },
  } = await apolloClient.query<
    GetApplicationQuery,
    GetApplicationQueryVariables
  >({
    query: QUERY,
  })

  return { application }
}

export default withApollo(HomePage)
