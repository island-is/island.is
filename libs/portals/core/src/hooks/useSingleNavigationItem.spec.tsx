import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { renderHook } from '@testing-library/react-hooks'
import { ReactNode } from 'react'
import { IntlProvider } from 'react-intl'
import { BrowserRouter as Router } from 'react-router-dom'

import { MockedAuthenticator } from '@island.is/auth/react'
import {
  PortalModule,
  PortalNavigationItem,
  PortalProvider,
  useSingleNavigationItem,
} from '@island.is/portals/core'
import { defaultLanguage } from '@island.is/shared/constants'

import { testCases } from '../../test/useSingleNavigationItem-test-cases'

describe('useSingleNavigationItem hook', () => {
  describe.each(Object.keys(testCases))('%s', (testCaseName) => {
    const { modules, navigationTrees, expected } = testCases[testCaseName]

    const testModules: PortalModule[] = modules.map((module) => ({
      name: module.name,
      widgets: () => [],
      enabled: module.enabled,
      routes: module.routes,
    }))

    const wrapper = ({ children }: { children?: ReactNode }) => (
      <ApolloProvider client={new ApolloClient({ cache: new InMemoryCache() })}>
        <IntlProvider
          locale={defaultLanguage}
          // Ignoring error because we don't need translations for tests
          onError={() => {}}
        >
          <MockedAuthenticator user={{ profile: { name: 'Peter' } }}>
            <Router>
              <PortalProvider
                meta={{ portalType: 'admin', basePath: '/' }}
                modules={testModules}
              >
                {children}
              </PortalProvider>
            </Router>
          </MockedAuthenticator>
        </IntlProvider>
      </ApolloProvider>
    )

    it('should pass', async () => {
      // Arrange & Act
      const { result, waitForNextUpdate } = renderHook(
        (navigationTrees: PortalNavigationItem[]) =>
          useSingleNavigationItem(...navigationTrees),
        {
          initialProps: navigationTrees,
          wrapper,
        },
      )

      // We need to wait for the wrapper to finish loading routes as it causes state update
      await waitForNextUpdate()

      // Assert
      if (expected) {
        expect(result.current).toMatchObject(expected)
      } else {
        expect(result.current).toBeNull()
      }
    })
  })
})
