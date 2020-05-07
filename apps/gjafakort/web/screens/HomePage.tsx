import React from 'react'
import gql from 'graphql-tag'
import {
  GetApplicationQuery,
  GetApplicationQueryVariables,
} from '../graphql/schema'
import { Screen } from './types'
import { withApollo } from '../graphql'
import { useI18n } from '../i18n'

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

export const HomePage: Screen<HomePageProps> = ({ application }) => {
  const { t } = useI18n()
  return (
    <div>
      <h1>
        {t('intro.welcome')} {application.id}
      </h1>
    </div>
  )
}

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
