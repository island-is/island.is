import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client'

import { client } from '../graphql'
import { LocaleProvider } from '@island.is/localization'
import { defaultLanguage } from '@island.is/shared/constants'
import { Authenticator } from '@island.is/auth/react'
import { FeatureFlagProvider } from '@island.is/react/feature-flags'
import { UserProfileLocale } from '@island.is/shared/components'
import { AppProvider, Modules, ModulesProvider } from '@island.is/portals/core'
import { modules } from '../lib/modules'
import environment from '../environments/environment'
import Layout from '../components/Layout/Layout'
import { ApplicationErrorBoundary } from '@island.is/portals/core'
import { AdminPortalPaths } from '../lib/paths'
import { adminMasterNavigation } from '@island.is/portals/admin/core'

export const App = () => {
  return (
    <ApolloProvider client={client}>
      <AppProvider
        masterNavigation={adminMasterNavigation}
        basePath={AdminPortalPaths.Base}
      >
        <LocaleProvider locale={defaultLanguage} messages={{}}>
          <ApplicationErrorBoundary imgSrc="./assets/images/hourglass.svg">
            <Router basename={AdminPortalPaths.Base}>
              <Authenticator>
                <FeatureFlagProvider sdkKey={environment.featureFlagSdkKey}>
                  <ModulesProvider modules={modules}>
                    <UserProfileLocale />
                    <Layout>
                      <Switch>
                        <Route exact path={AdminPortalPaths.Root}>
                          <h1>Dashboard</h1>
                        </Route>
                        <Route>
                          <Modules />
                        </Route>
                      </Switch>
                    </Layout>
                  </ModulesProvider>
                </FeatureFlagProvider>
              </Authenticator>
            </Router>
          </ApplicationErrorBoundary>
        </LocaleProvider>
      </AppProvider>
    </ApolloProvider>
  )
}
