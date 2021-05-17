import { Layout } from 'react-native-navigation'
import { checkIsAuthenticated } from '../../stores/auth-store'
import { ComponentRegistry } from '../component-registry'
import { getMainRoot } from '../get-main-root'
import { getOnboardingScreens } from '../onboarding'

/**
 * Select the appropriate app root
 * @returns Layout
 */
export async function getAppRoot(): Promise<Layout> {
  // Check if user is authenticated
  const isAuthenticated = await checkIsAuthenticated()
  const onboardingScreens = await getOnboardingScreens()
  const isOnboarding = isAuthenticated && onboardingScreens.length > 0

  // Show login screen if not authenticated
  // And if not onboarded yet, show those screens
  if (!isAuthenticated || isOnboarding) {
    return {
      stack: {
        id: 'LOGIN_STACK',
        children: [
          {
            component: {
              name: ComponentRegistry.LoginScreen,
              id: 'LOGIN_SCREEN',
            },
          },
        ].concat(isAuthenticated ? onboardingScreens : []),
      },
    }
  }

  return getMainRoot()
}
