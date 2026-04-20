import { ApiScope } from '@island.is/auth/scopes'
import { PortalModule } from '@island.is/portals/core'
import { m } from '@island.is/portals/my-pages/core'
import { Navigate } from 'react-router-dom'
import { MileageRegistrationPaths } from './lib/paths'

export const mileageRegistrationModule: PortalModule = {
  name: m.vehicleMileage,
  routes: ({ userInfo }) => [
    {
      name: m.vehicleMileage,
      path: MileageRegistrationPaths.MileageRegistration,
      enabled: userInfo.scopes.includes(ApiScope.vehicles),
      element: (
        <Navigate
          to={MileageRegistrationPaths.MileageRegistrationRedirect}
          replace
        />
      ),
    },
  ],
}
