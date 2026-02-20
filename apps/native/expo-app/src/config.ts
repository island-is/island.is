import * as Application from 'expo-application'
import {
  environmentStore,
  useEnvironmentStore,
} from './stores/environment-store'

export type EnvironmentId = 'prod' | 'staging' | 'dev' | 'local' | 'mock'

export const bundleId = Application.applicationId ?? 'is.island.app'
export const isTestingApp =
  bundleId.endsWith('.staging') || bundleId.endsWith('.dev')

export const config = {
  bundleId,
  isTestingApp,
  idsClientId: '@island.is/app',
  idsScopes: [
    'openid',
    'profile',
    'offline_access',
    '@island.is/applications:read',
    '@island.is/documents',
    '@island.is/user-profile:read',
    '@island.is/user-profile:write',
    '@island.is/internal',
    '@island.is/me:details',
    '@island.is/licenses',
    '@island.is/vehicles',
    '@island.is/assets',
    '@island.is/finance:overview',
    '@island.is/finance/salary',
    '@island.is/finance/schedule:read',
    '@island.is/licenses:barcode',
    '@island.is/auth/passkeys',
    '@island.is/health/healthcare',
    '@island.is/health/payments',
    '@island.is/health/rights-status',
    '@island.is/health/medicines',
    '@island.is/health/vaccinations',
    '@island.is/health/organ-donation',
    '@island.is/licenses:barcode',
    '@island.is/auth/passkeys',
  ],
  cognitoUrl: 'https://cognito.shared.devland.is/login',
  cognitoClientId: 'bre6r7d5e7imkcgbt7et1kqlc',
  environmentsUrl: 'https://switcher.dev01.devland.is/environments',
}

export function useConfig() {
  const { environment } = useEnvironmentStore()
  return {
    ...config,
    ...environment,
  }
}

export function getConfig() {
  return {
    ...config,
    ...environmentStore.getState().environment,
  }
}
