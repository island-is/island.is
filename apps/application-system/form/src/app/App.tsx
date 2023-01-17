import { ApolloProvider } from '@apollo/client'
import { BrowserRouter } from 'react-router-dom'
import { CompatRouter, CompatRoute, Routes } from 'react-router-dom-v5-compat'

import { initializeClient } from '@island.is/application/graphql'
import { LocaleProvider } from '@island.is/localization'
import { ErrorShell, HeaderInfoProvider } from '@island.is/application/ui-shell'
import { defaultLanguage } from '@island.is/shared/constants'
import { Authenticator } from '@island.is/auth/react'

import { Application } from '../routes/Application'
import { Applications } from '../routes/Applications'
import { AssignApplication } from '../routes/AssignApplication'
import { Layout } from '../components/Layout/Layout'
import { environment } from '../environments'
import { FeatureFlagProvider } from '@island.is/react/feature-flags'
import { UserProfileLocale } from '@island.is/shared/components'

export const App = () => (
  <ApolloProvider client={initializeClient(environment.baseApiUrl)}>
    <LocaleProvider locale={defaultLanguage} messages={{}}>
      <BrowserRouter basename="/umsoknir">
        <CompatRouter>
          <Authenticator>
            <FeatureFlagProvider sdkKey={environment.featureFlagSdkKey}>
              <HeaderInfoProvider>
                <UserProfileLocale />
                <Layout>
                  <Routes>
                    <CompatRoute
                      exact
                      path="/tengjast-umsokn"
                      component={AssignApplication}
                    />

                    <CompatRoute exact path="/:slug" component={Applications} />
                    <CompatRoute
                      exact
                      path="/:slug/:id"
                      component={Application}
                    />

                    <CompatRoute exact path="*">
                      <ErrorShell />
                    </CompatRoute>
                  </Routes>
                </Layout>
              </HeaderInfoProvider>
            </FeatureFlagProvider>
          </Authenticator>
        </CompatRouter>
      </BrowserRouter>
    </LocaleProvider>
  </ApolloProvider>
)

export default App
