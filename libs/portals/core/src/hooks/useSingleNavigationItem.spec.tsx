import { BrowserRouter } from 'react-router-dom'
import { ReactNode, FC } from 'react'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { renderHook } from '@testing-library/react'
import { IntlProvider } from 'react-intl'
import { MockedAuthProvider } from '@island.is/auth/react'
import { defaultLanguage } from '@island.is/shared/constants'
import { testCases } from '../../test/useSingleNavigationItem-test-cases'
import {
  PortalModule,
  PortalNavigationItem,
  PortalRoute,
} from '../types/portalCore'
import { FeatureFlagClient } from '@island.is/react/feature-flags'
import { createMockUser } from '@island.is/auth/react'
import { useSingleNavigationItem } from './useSingleNavigationItem'
import { prepareRouterData } from '../utils/router/prepareRouterData'
import { PortalContext, PortalMeta } from '../components/PortalProvider'

const user = { profile: { name: 'Peter' } }
const userInfo = createMockUser(user)

const MockedPortalProvider: FC<
  React.PropsWithChildren<{
    meta: PortalMeta
    modules: PortalModule[]
    routes: PortalRoute[]
  }>
> = ({ modules, meta, routes, children }) => (
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
          <MockedAuthProvider user={user}>
            <BrowserRouter>
              <MockedPortalProvider
                meta={{ portalType: 'admin', basePath: '/' }}
                modules={filteredModules}
                routes={filteredRoutes}
              >
                {children}
              </MockedPortalProvider>
            </BrowserRouter>
          </MockedAuthProvider>
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
