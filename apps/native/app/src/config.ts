import { Platform } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import {
  EnvironmentConfig,
  environmentStore,
  useEnvironmentStore,
} from './stores/environment-store'

type EnvironmentId = 'prod' | 'staging' | 'dev' | 'local' | 'mock'

export const environments: Record<EnvironmentId, EnvironmentConfig> = {
  prod: {
    id: 'prod',
    label: 'Production',
    idsIssuer: 'https://innskra.island.is/',
    apiUrl: 'https://island.is/api',
    configCat: 'YcfYCOwBTUeI04mWOWpPdA/qDKG1RMTMkeqM0ifHFlxmQ',
    datadog: 'pubdb17b5a1eb2e3bc1c7f7ad1595c8cfc7',
  },
  staging: {
    id: 'staging',
    label: 'Staging',
    idsIssuer: 'https://identity-server.staging01.devland.is/',
    apiUrl: 'https://beta.staging01.devland.is/api',
    configCat: 'YcfYCOwBTUeI04mWOWpPdA/7kWZdAnrz0acVfr_paEl5Q',
    datadog: 'pubdb17b5a1eb2e3bc1c7f7ad1595c8cfc7',
  },
  dev: {
    id: 'dev',
    label: 'Development',
    idsIssuer: 'https://identity-server.dev01.devland.is/',
    apiUrl: 'https://beta.dev01.devland.is/api',
    configCat: 'YcfYCOwBTUeI04mWOWpPdA/2mYtDGA4oEKdCJt2lnpXEw',
    datadog: null,
  },
  local: {
    id: 'local',
    label: 'Local',
    idsIssuer: 'https://identity-server.dev01.devland.is/',
    apiUrl: 'http://localhost:4444/api',
    configCat: 'YcfYCOwBTUeI04mWOWpPdA/2mYtDGA4oEKdCJt2lnpXEw',
    datadog: null,
  },
  mock: {
    id: 'mock',
    label: 'Mock',
    idsIssuer: 'https://identity-server.dev01.devland.is/',
    apiUrl: 'http://localhost:4444/api',
    configCat: 'YcfYCOwBTUeI04mWOWpPdA/2mYtDGA4oEKdCJt2lnpXEw',
    datadog: null,
  },
}

export const bundleId = DeviceInfo.getBundleId()

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
  codepush: Platform.select({
    ios: '8And8KYL9BWRsUAhEBFFUxbVfVTdSM4QBQsr6',
    android: '4sXtRa8Q7CWLTrTxKjvcH7g8WJYIDMCENhvYz',
  }),
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
