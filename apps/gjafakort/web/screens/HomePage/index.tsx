import React from 'react'
import gql from 'graphql-tag'

import { Application } from '../../graphql/schema'
import { withApollo } from '../../graphql'
import { useI18n } from '../../i18n'
import { Input, GridContainer } from '@island.is/gjafakort-ui'

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
    <GridContainer>
      <h1>
        {t('intro.welcome')} {application.id}
      </h1>
      <div style={{ paddingTop: 50, paddingBottom: 50 }}>
        <Input label="Nafn tengiliðar" placeholder="test" />
      </div>
      <Input label="Nafn tengiliðar" placeholder="test" hasError />
      <Input
        label="Nafn tengiliðar"
        placeholder="test"
        hasError
        errorMessage="obbosí"
      />
    </GridContainer>
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
