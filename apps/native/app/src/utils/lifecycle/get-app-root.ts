import { Layout } from 'react-native-navigation'
import { checkIsAuthenticated } from '../../stores/auth-store'
import { ComponentRegistry, StackRegistry } from '../component-registry'
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
        id: StackRegistry.LoginStack,
        children: [
          {
            component: {
              id: ComponentRegistry.LoginScreen,
              name: ComponentRegistry.LoginScreen,
            },
          },
          ...(isAuthenticated ? onboardingScreens : []),
        ],
      },
    }
  }

  return getMainRoot()
}
