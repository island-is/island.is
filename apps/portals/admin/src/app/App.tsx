import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client'

import { client } from '../graphql'
import { LocaleProvider } from '@island.is/localization'
import { defaultLanguage } from '@island.is/shared/constants'
import { Authenticator } from '@island.is/auth/react'
import { FeatureFlagProvider } from '@island.is/react/feature-flags'
import { UserProfileLocale } from '@island.is/shared/components'

import environment from '../environments/environment'
import Layout from '../components/Layout/Layout'

export function App() {
  return (
    <ApolloProvider client={client}>
      <LocaleProvider locale={defaultLanguage} messages={{}}>
        {/*<ApplicationErrorBoundary>*/}
        <Router basename="/stjornbord">
          <Authenticator>
            <FeatureFlagProvider sdkKey={environment.featureFlagSdkKey}>
              <UserProfileLocale />
              <Layout>
                <h1>Hello world</h1>
              </Layout>
            </FeatureFlagProvider>
          </Authenticator>
        </Router>
        {/*</ApplicationErrorBoundary>*/}
      </LocaleProvider>
    </ApolloProvider>
  )
}

export default App
