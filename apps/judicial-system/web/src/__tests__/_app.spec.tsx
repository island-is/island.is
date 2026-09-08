import type { PropsWithChildren } from 'react'
import type { Router } from 'next/router'
import { render, screen } from '@testing-library/react'

import JudicialSystemApplication from '@island.is/judicial-system-web/pages/_app'

// Keep the real ErrorBoundary and swap the data-fetching providers and chrome
// for pass-throughs so the app shell renders without a network or a session.
jest.mock('@island.is/judicial-system-web/src/components', () => {
  const passthrough = ({ children }: PropsWithChildren) => children
  const nothing = () => null

  return {
    ErrorBoundary: jest.requireActual(
      '@island.is/judicial-system-web/src/components/ErrorBoundary/ErrorBoundary',
    ).default,
    FeatureProvider: passthrough,
    FormProvider: passthrough,
    LawyerRegistryProvider: passthrough,
    UserProvider: passthrough,
    ViewportProvider: passthrough,
    Header: nothing,
    ServiceInterruptionBanner: nothing,
  }
})

jest.mock('@island.is/localization', () => ({
  LocaleProvider: ({ children }: PropsWithChildren) => children,
  GET_TRANSLATIONS: {},
}))

jest.mock('@island.is/judicial-system-web/graphql/client', () => {
  const { ApolloClient, InMemoryCache } = jest.requireActual('@apollo/client')

  return { default: new ApolloClient({ cache: new InMemoryCache() }) }
})

jest.mock(
  '@island.is/judicial-system-web/environments/runtimeEnvironment',
  () => ({ getPublicRuntimeEnv: () => ({}) }),
)

jest.mock('@island.is/user-monitoring', () => ({
  userMonitoring: { initDdLogs: jest.fn() },
}))

const FailingPage = () => {
  throw new Error('page render failed')
}

const HealthyPage = () => <p>healthy page</p>

const renderApp = (
  Component: typeof FailingPage | typeof HealthyPage,
  asPath: string,
) => (
  <JudicialSystemApplication
    Component={Component}
    pageProps={{}}
    router={{ asPath } as Router}
    translations={{}}
  />
)

describe('JudicialSystemApplication', () => {
  let consoleError: jest.SpyInstance

  beforeEach(() => {
    consoleError = jest.spyOn(console, 'error').mockImplementation()
  })

  afterEach(() => {
    consoleError.mockRestore()
  })

  test('should recover from a page render error when navigating to a healthy page', () => {
    const { rerender } = render(renderApp(FailingPage, '/failing'))

    expect(screen.getByText('Eitthvað fór úrskeiðis')).toBeInTheDocument()

    // Client-side navigation: same app instance, new route and page component
    rerender(renderApp(HealthyPage, '/healthy'))

    expect(screen.getByText('healthy page')).toBeInTheDocument()
    expect(screen.queryByText('Eitthvað fór úrskeiðis')).not.toBeInTheDocument()
  })
})
