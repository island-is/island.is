import { lazy } from 'react'

import { ApiScope } from '@island.is/auth/scopes'
import { PortalModule } from '@island.is/portals/core'
import { Features } from '@island.is/react/feature-flags'
import { m } from '@island.is/portals/my-pages/core'
import { Navigate } from 'react-router-dom'

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

    const hasAccess = userInfo.scopes.includes(ApiScope.internal)

    if (useNewRoute) {
      return [
        {
          name: m.consent,
          path: ConsentPaths.ConsentNew,
          enabled: hasAccess,
          notAvailableForActors: true,
          element: <Consent />,
        },
        {
          name: m.consent,
          path: ConsentPaths.Consent,
          enabled: hasAccess,
          navHide: true,
          notAvailableForActors: true,
          element: <Navigate to={ConsentPaths.ConsentNew} replace />,
        },
      ]
    }

    return [
      {
        name: m.consent,
        path: ConsentPaths.Consent,
        enabled: hasAccess,
        notAvailableForActors: true,
        element: <Consent />,
      },
    ]
  },
}
