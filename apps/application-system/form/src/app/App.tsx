import { ApolloProvider } from '@apollo/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

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
        <Authenticator>
          <FeatureFlagProvider sdkKey={environment.featureFlagSdkKey}>
            <HeaderInfoProvider>
              <UserProfileLocale />
              <Layout>
                <Routes>
                  <Route
                    path="/tengjast-umsokn"
                    element={<AssignApplication />}
                  />
                  <Route path="/:slug" element={<Applications />} />
                  <Route path="/:slug/:id" element={<Application />} />
                  <Route path="*" element={<ErrorShell />} />
                </Routes>
              </Layout>
            </HeaderInfoProvider>
          </FeatureFlagProvider>
        </Authenticator>
      </BrowserRouter>
    </LocaleProvider>
  </ApolloProvider>
)

export default App
