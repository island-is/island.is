import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client'

import { client } from '../graphql'
import { LocaleProvider } from '@island.is/localization'
import { defaultLanguage } from '@island.is/shared/constants'
import { Authenticator } from '@island.is/auth/react'
import { FeatureFlagProvider } from '@island.is/react/feature-flags'
import { UserProfileLocale } from '@island.is/shared/components'
import { modules, ModulesProvider } from '../lib/modules'
import environment from '../environments/environment'
import Layout from '../components/Layout/Layout'

export const App = () => {
  return (
    <ApolloProvider client={client}>
      <ModulesProvider modules={modules}>
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
      </ModulesProvider>
    </ApolloProvider>
  )
}

export default App
