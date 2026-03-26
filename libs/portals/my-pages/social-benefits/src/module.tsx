import { PortalModule } from '@island.is/portals/core'
import { m } from './lib/messages'
import {
  SocialBenefitsPaths,
  SocialInsuranceMaintenancePaths,
} from './lib/paths'
import { Navigate } from 'react-router-dom'
import { socialInsuranceRoutes } from './lib/routes/socialInsuranceRoutes'
import { socialInsuranceLegacyRedirects } from './lib/routes/socialInsuranceLegacyRedirects'

export const socialBenefitsModule: PortalModule = {
  name: 'Framfærsla',
  enabled: ({ isCompany }) => !isCompany,
  routes: ({ userInfo }) => [
    // Root redirect: /framfaersla → /framfaersla/almannatryggingar/greidsluaetlun
    {
      name: m.maintenance,
      path: SocialBenefitsPaths.SocialBenefitsRoot,
      enabled: true,
      element: (
        <Navigate
          to={SocialInsuranceMaintenancePaths.SocialInsurancePaymentPlan}
          replace
        />
      ),
    },
    ...socialInsuranceRoutes(userInfo),
    ...socialInsuranceLegacyRedirects(userInfo),
  ],
}
