import { lazy } from 'react'

import { ApiScope } from '@island.is/auth/scopes'
import { PortalModule } from '@island.is/portals/core'
import { Features } from '@island.is/react/feature-flags'
import { m } from '@island.is/portals/my-pages/core'

import { ConsentPaths } from './lib/paths'

const Consent = lazy(() => import('./screens/Consent/Consent'))

export const consentModule: PortalModule = {
  name: m.consent,
  featureFlag: Features.servicePortalConsentModule,
  enabled({ userInfo }) {
    return userInfo.scopes.includes(ApiScope.internal)
  },
  async routes({ userInfo, featureFlagClient }) {
    const useNewRoute = await featureFlagClient.getValue(
      Features.useNewDelegationSystem,
      false,
      {
        id: userInfo.profile.nationalId,
        attributes: {},
      },
    )
    return [
      {
        name: m.consent,
        path: useNewRoute ? ConsentPaths.ConsentNew : ConsentPaths.Consent,
        enabled: userInfo.scopes.includes(ApiScope.internal),
        notAvailableForActors: true,
        element: <Consent />,
      },
    ]
  },
}
