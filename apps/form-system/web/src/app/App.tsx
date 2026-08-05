import { ApolloProvider } from '@apollo/client'
import { formSystemScopes } from '@island.is/auth/scopes'
import { LocaleProvider } from '@island.is/localization'
import { ApplicationErrorBoundary } from '@island.is/portals/core'
import { BffProvider, createMockedInitialState } from '@island.is/react-spa/bff'
import { LoadingScreen } from '@island.is/react/components'
import { FeatureFlagProvider } from '@island.is/react/feature-flags'
import { defaultLanguage } from '@island.is/shared/constants'
import { useEffect, useState } from 'react'
import { Router } from '../components/Router/Router'
import { BASE_PATH } from '../lib/routes'
import { isMockMode } from '../mocks'
import { client } from './client'

const mockedInitialState = isMockMode
  ? createMockedInitialState({
      scopes: formSystemScopes,
    })
  : undefined

const FORM_SLUG_PATH = /^\/form\/[^/]+\/?$/

const shouldAddSelectAccountPrompt = () => {
  const url = new URL(window.location.href)

  return (
    FORM_SLUG_PATH.test(url.pathname) &&
    url.searchParams.get('prompt') !== 'select_account'
  )
}

const FormSystemBffProvider = () => (
  <BffProvider
    applicationBasePath={BASE_PATH}
    mockedInitialState={mockedInitialState}
  >
    <ApplicationErrorBoundary>
      <FeatureFlagProvider>
        <Router />
      </FeatureFlagProvider>
    </ApplicationErrorBoundary>
  </BffProvider>
)

const SelectAccountPromptRedirect = () => {
  const [isCheckingLogin, setIsCheckingLogin] = useState(!isMockMode)

  useEffect(() => {
    if (isMockMode) {
      return
    }

    const checkLogin = async () => {
      try {
        const response = await fetch('/bff/user?refresh=true', {
          credentials: 'include',
        })

        if (response.ok || response.status >= 500) {
          setIsCheckingLogin(false)
          return
        }

        if (shouldAddSelectAccountPrompt()) {
          const url = new URL(window.location.href)
          url.searchParams.set('prompt', 'select_account')
          window.location.replace(url.toString())
          return
        }

        setIsCheckingLogin(false)
      } catch {
        setIsCheckingLogin(false)
      }
    }

    checkLogin()
  }, [])

  if (isCheckingLogin) {
    return <LoadingScreen ariaLabel="Er að vinna í innskráningu" />
  }

  return <FormSystemBffProvider />
}

export const App = () => (
  <ApolloProvider client={client}>
    <LocaleProvider locale={defaultLanguage} messages={{}}>
      <SelectAccountPromptRedirect />
    </LocaleProvider>
  </ApolloProvider>
)
