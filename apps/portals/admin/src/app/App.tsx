import { RouterProvider } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client'

import { LocaleProvider } from '@island.is/localization'
import { defaultLanguage } from '@island.is/shared/constants'
import { ApplicationErrorBoundary } from '@island.is/portals/core'
import { createRouterTree } from '../lib/router'
import { client } from '../graphql'
import { getAuthSettings } from '@island.is/auth/react'

export const App = () => {
  const { redirectPathSilent, redirectPath } = getAuthSettings()
  const router = createRouterTree({
    redirectPathSilent,
    redirectPath,
  })

  return (
    <ApolloProvider client={client}>
      <LocaleProvider locale={defaultLanguage} messages={{}}>
        <ApplicationErrorBoundary>
          <RouterProvider router={router} />
        </ApplicationErrorBoundary>
      </LocaleProvider>
    </ApolloProvider>
  )
}
