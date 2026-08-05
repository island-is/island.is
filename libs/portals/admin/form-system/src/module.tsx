import { lazy } from 'react'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { PortalModule } from '@island.is/portals/core'
import { FormSystemPaths } from './lib/paths'
import { formsLoader } from './screens/Forms/Forms.loader'
import { formLoader } from './screens/Form/Form.loader'
import { m } from '@island.is/form-system/ui'
import fetch from 'cross-fetch'
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import type { ServerError } from '@apollo/client/link/utils'

const Form = lazy(() => import('./screens/Form/Form'))
const Forms = lazy(() => import('./screens/Forms/Forms'))

const allowedScopes: string[] = [
  AdminPortalScope.formSystem,
  AdminPortalScope.formSystemAdmin,
]

const httpLink = new HttpLink({
  uri: ({ operationName }) => `/stjornbord/bff/api/graphql?op=${operationName}`,
  fetch,
  credentials: 'include',
})

const errorLink = onError(({ networkError }) => {
  const statusCode = (networkError as ServerError | undefined)?.statusCode
  if (statusCode === 401 || statusCode === 403) {
    // Only affects umsoknarsmidur because we only use this client in this module
    window.location.reload()
  }
})

const formSystemApolloClient = new ApolloClient({
  link: ApolloLink.from([errorLink, httpLink]),
  cache: new InMemoryCache(),
})

const FormSystemApollo = ({ children }: { children: React.ReactNode }) => (
  <ApolloProvider client={formSystemApolloClient}>{children}</ApolloProvider>
)

export const formSystemModule: PortalModule = {
  name: m.rootName,
  layout: 'full',
  enabled: ({ userInfo }) =>
    userInfo.scopes.some((scope) => allowedScopes.includes(scope)),
  routes: (props) => {
    return [
      {
        name: m.rootName,
        path: FormSystemPaths.FormSystemRoot,
        element: (
          <FormSystemApollo>
            <Forms />
          </FormSystemApollo>
        ),
        loader: formsLoader(props),
      },
      {
        name: m.rootName,
        path: FormSystemPaths.Form,
        element: (
          <FormSystemApollo>
            <Form />
          </FormSystemApollo>
        ),
        loader: formLoader(props),
      },
    ]
  },
}
