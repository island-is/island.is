import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { renderHook } from '@testing-library/react-hooks'
import { ReactNode } from 'react'
import { IntlProvider } from 'react-intl'
import { BrowserRouter } from 'react-router-dom'

import { MockedAuthenticator } from '@island.is/auth/react'
import { defaultLanguage } from '@island.is/shared/constants'

import { testCases } from '../../test/useSingleNavigationItem-test-cases'
import { PortalProvider } from '../components/PortalProvider'
import { PortalModule, PortalNavigationItem } from '../types/portalCore'
import { useSingleNavigationItem } from './useSingleNavigationItem'

describe('useSingleNavigationItem hook', () => {
  describe.each(Object.keys(testCases))('%s', (testCaseName) => {
    const { modules, navigationTrees, expected } = testCases[testCaseName]

    const testModules: PortalModule[] = modules.map((module) => ({
      name: module.name,
      enabled: module.enabled,
      routes: module.routes,
    }))

    const wrapper = ({ children }: { children?: ReactNode }) => (
      <ApolloProvider client={new ApolloClient({ cache: new InMemoryCache() })}>
        <IntlProvider
          locale={defaultLanguage}
          onError={() => {
            // Ignoring error because we don't need translations for tests
          }}
        >
          <MockedAuthenticator user={{ profile: { name: 'Peter' } }}>
            <BrowserRouter>
              <PortalProvider
                meta={{ portalType: 'admin', basePath: '/' }}
                modules={testModules}
              >
                {children}
              </PortalProvider>
            </BrowserRouter>
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
