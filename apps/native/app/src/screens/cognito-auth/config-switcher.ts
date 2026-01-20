import { config } from '../../config'

const identityServer = {
  clientId: '@island.is/app',
  scopes:
    'openid profile offline_access @island.is/applications:read @island.is/documents @island.is/user-profile:read @island.is/internal @island.is/me:details',
}

export const configs = [
  {
    name: 'Production',
    ids: {
      issuer: 'https://innskra.island.is/',
      ...identityServer,
    },
    apiUrl: 'https://island.is/api',
    baseUrl: 'https://island.is',
    configCat: 'YcfYCOwBTUeI04mWOWpPdA/qDKG1RMTMkeqM0ifHFlxmQ',
  },
  {
    name: 'Staging',
    ids: {
      issuer: 'https://identity-server.staging01.devland.is/',
      ...identityServer,
    },
    apiUrl: 'https://beta.staging01.devland.is/api',
    baseUrl: 'https://beta.staging01.devland.is',
    configCat: 'YcfYCOwBTUeI04mWOWpPdA/7kWZdAnrz0acVfr_paEl5Q',
    datadog: 'pubdb17b5a1eb2e3bc1c7f7ad1595c8cfc7',
  },
  {
    name: 'Development',
    ids: {
      issuer: 'https://identity-server.dev01.devland.is/',
      ...identityServer,
    },
    apiUrl: 'https://beta.dev01.devland.is/api',
    baseUrl: 'https://beta.dev01.devland.is',
    configCat: 'YcfYCOwBTUeI04mWOWpPdA/2mYtDGA4oEKdCJt2lnpXEw',
    datadog: 'pubdb17b5a1eb2e3bc1c7f7ad1595c8cfc7',
  },
]

export function cognitoAuthUrl() {
  const url = `https://cognito.shared.devland.is/login`
  const params = {
    approval_prompt: 'prompt',
    client_id: 'bre6r7d5e7imkcgbt7et1kqlc',
    redirect_uri: `${config.bundleId}://cognito`,
    response_type: 'token',
    scope: 'openid',
    state: 'state',
  }
  return `${url}?${new URLSearchParams(params)}`
}
