import { ApolloProvider } from '@apollo/client'
import { client } from './client'
import { LocaleProvider } from '@island.is/localization'
import { defaultLanguage } from '@island.is/shared/constants'
import { BffProvider, createMockedInitialState } from '@island.is/react-spa/bff'
import { isMockMode } from '../mocks'
import { formSystemScopes } from '@island.is/auth/scopes'
import { BASE_PATH } from '../lib/routes'
import { Router } from '../components/Router/Router'

const mockedInitialState = isMockMode
  ? createMockedInitialState({
    scopes: formSystemScopes,
  })
  : undefined

export const App = () => (
  <ApolloProvider client={client}>
    <LocaleProvider locale={defaultLanguage} messages={{}}>
      <BffProvider
        applicationBasePath={BASE_PATH}
        mockedInitialState={mockedInitialState}
      >
        <Router />
      </BffProvider>
    </LocaleProvider>
  </ApolloProvider>
)

export default App
