import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client'

import { client } from '../graphql'
import { LocaleProvider } from '@island.is/localization'
import { defaultLanguage } from '@island.is/shared/constants'
import { Authenticator } from '@island.is/auth/react'
import { FeatureFlagProvider } from '@island.is/react/feature-flags'
import { UserProfileLocale } from '@island.is/shared/components'
import { ModulesProvider } from '@island.is/portals/core'
import { modules } from '../lib/modules'
import environment from '../environments/environment'
import Layout from '../components/Layout/Layout'
import { ApplicationErrorBoundary } from '@island.is/portals/core'

export const App = () => {
  return (
    <ApolloProvider client={client}>
      <LocaleProvider locale={defaultLanguage} messages={{}}>
        <ApplicationErrorBoundary imgSrc="./assets/images/hourglass.svg">
          <Router basename="/stjornbord">
            <Authenticator>
              <FeatureFlagProvider sdkKey={environment.featureFlagSdkKey}>
                <ModulesProvider modules={modules}>
                  <UserProfileLocale />
                  <Layout>
                    <h1>Hello world</h1>
                  </Layout>
                </ModulesProvider>
              </FeatureFlagProvider>
            </Authenticator>
          </Router>
        </ApplicationErrorBoundary>
      </LocaleProvider>
    </ApolloProvider>
  )
}
