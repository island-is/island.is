import { ApolloProvider } from '@apollo/client'
import { initializeClient } from '@island.is/form-system/graphql'
import environment from '../environments/environment'
import { defaultLanguage } from '@island.is/shared/constants'
import { LocaleProvider } from '@island.is/localization'
import { AuthProvider } from '@island.is/auth/react'
import { BASE_PATH } from '../lib/routes'
import { Router } from '../components/Router/Router'

export const App = () => (
  <ApolloProvider client={initializeClient(environment.baseApiUrl)}>
    <LocaleProvider locale={defaultLanguage} messages={{}}>
      <AuthProvider basePath={BASE_PATH}>
        <Router />
      </AuthProvider>
    </LocaleProvider>
  </ApolloProvider>
)

export default App
