import { BrowserRouter } from 'react-router-dom'
import { ReactNode, FC } from 'react'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { renderHook } from '@testing-library/react-hooks'
import { IntlProvider } from 'react-intl'
import { MockedAuthenticator } from '@island.is/auth/react'
import { defaultLanguage } from '@island.is/shared/constants'

import { testCases } from '../../test/useSingleNavigationItem-test-cases'
import {
  PortalModule,
  PortalNavigationItem,
  PortalRoute,
} from '../types/portalCore'
import { useSingleNavigationItem } from './useSingleNavigationItem'

import { PortalContext, PortalMeta } from '../components/PortalProvider'
import { prepareRouterData } from '@island.is/portals/core'
import { createMockUser } from '../../../../auth/react/src/lib/createMockUser'
import { FeatureFlagClient } from '@island.is/react/feature-flags'

const userInfo = createMockUser({ profile: { name: 'Peter' } })

const MockedPortalProvider: FC<{
  meta: PortalMeta
  modules: PortalModule[]
  routes: PortalRoute[]
}> = ({ modules, meta, routes, children }) => (
  <PortalContext.Provider
    value={{
      meta,
      activeModule: undefined,
      modules,
      routes,
    }}
  >
    {children}
  </PortalContext.Provider>
)

describe('useSingleNavigationItem hook', () => {
  beforeEach(() => {})

  describe.each(Object.keys(testCases))('%s', (testCaseName) => {
    const { modules, navigationTrees, expected } = testCases[testCaseName]
    const testModules: PortalModule[] = modules.map((module) => ({
      name: module.name,
      enabled: module.enabled,
      routes: module.routes,
    }))

    let filteredModules: PortalModule[]
    let filteredRoutes: PortalRoute[]

    beforeAll(async () => {
      const routerData = await prepareRouterData({
        userInfo,
        featureFlagClient: {} as FeatureFlagClient,
        modules: testModules,
      })

      filteredModules = routerData.modules
      filteredRoutes = routerData.routes
    })

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
              <MockedPortalProvider
                meta={{ portalType: 'admin', basePath: '/' }}
                modules={filteredModules}
                routes={filteredRoutes}
              >
                {children}
              </MockedPortalProvider>
            </BrowserRouter>
          </MockedAuthenticator>
        </IntlProvider>
      </ApolloProvider>
    )

    it('should pass', async () => {
      // Arrange & Act
      const { result } = renderHook(
        (navigationTrees: PortalNavigationItem[]) =>
          useSingleNavigationItem(...navigationTrees),
        {
          initialProps: navigationTrees,
          wrapper,
        },
      )

      // Assert
      if (expected) {
        expect(result.current).toMatchObject(expected)
      } else {
        expect(result.current).toBeNull()
      }
    })
  })
})
