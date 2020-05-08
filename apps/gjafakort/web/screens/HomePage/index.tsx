import React from 'react'
import gql from 'graphql-tag'

import { Application } from '../../graphql/schema'
import { Screen } from '../types'
import { withApollo } from '../../graphql'
import { useI18n } from '../../i18n'

interface PropTypes {
  application: Application
}

const GetApplicationQuery = gql`
  query GetApplication {
    getApplication {
      id
    }
  }
`

function HomePage({ application }: PropTypes) {
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
  } = await apolloClient.query({
    query: GetApplicationQuery,
  })

  return { application }
}

export default withApollo(HomePage)
