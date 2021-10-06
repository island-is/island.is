import React from 'react'
import { ApolloProvider } from '@apollo/client'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

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
import { FeatureFlagProvider } from '@island.is/feature-flags'

export const App = () => (
  <ApolloProvider client={initializeClient(environment.baseApiUrl)}>
    <LocaleProvider locale={defaultLanguage} messages={{}}>
      <Router basename="/umsoknir">
        <Authenticator>
          <FeatureFlagProvider sdkKey={environment.featureFlagSdkKey}>
            <HeaderInfoProvider>
              <Layout>
                <Switch>
                  <Route
                    exact
                    path="/tengjast-umsokn"
                    component={AssignApplication}
                  />

                  <Route exact path="/:slug" component={Applications} />
                  <Route exact path="/:slug/:id" component={Application} />

                  <Route path="*">
                    <ErrorShell />
                  </Route>
                </Switch>
              </Layout>
            </HeaderInfoProvider>
          </FeatureFlagProvider>
        </Authenticator>
      </Router>
    </LocaleProvider>
  </ApolloProvider>
)

export default App
