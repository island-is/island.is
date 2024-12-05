import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { BffProvider, createMockedInitialState } from '@island.is/react-spa/bff'
import { FeatureFlagClient } from '@island.is/react/feature-flags'
import { defaultLanguage } from '@island.is/shared/constants'
import { renderHook } from '@testing-library/react'
import { FC, ReactNode } from 'react'
import { IntlProvider } from 'react-intl'
import { BrowserRouter } from 'react-router-dom'
import { testCases } from '../../test/useSingleNavigationItem-test-cases'
import { PortalContext, PortalMeta } from '../components/PortalProvider'
import {
  PortalModule,
  PortalNavigationItem,
  PortalRoute,
} from '../types/portalCore'
import { prepareRouterData } from '../utils/router/prepareRouterData'
import { useSingleNavigationItem } from './useSingleNavigationItem'

const mockedInitialState = createMockedInitialState()

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
        userInfo: mockedInitialState.userInfo,
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
          <BffProvider
            applicationBasePath="/minarsidur"
            bffGlobalPrefix="/minarsidur/bff"
            mockedInitialState={mockedInitialState}
          >
            <BrowserRouter>
              <MockedPortalProvider
                meta={{
                  portalType: 'admin',
                  basePath: '/',
                  portalTitle: 'Mínar síður - Ísland.is',
                }}
                modules={filteredModules}
                routes={filteredRoutes}
              >
                {children}
              </MockedPortalProvider>
            </BrowserRouter>
          </BffProvider>
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
