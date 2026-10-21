import { PortalModule } from '@island.is/portals/core'
import { lazy } from 'react'
import { m } from '@island.is/portals/my-pages/core'
import { SocialBenefitsPaths } from './lib/paths'
import { socialInsuranceRoutes } from './lib/routes/socialInsuranceRoutes'
import { socialInsuranceLegacyRedirects } from './lib/routes/socialInsuranceLegacyRedirects'
import { unemploymentBenefitsRoutes } from './lib/routes/unemploymentBenefitRoutes'
import { activationAllowanceRoutes } from './lib/routes/activationAllowanceRoutes'

const SocialBenefitsOverview = lazy(() =>
  import('./screens/SocialBenefitsOverview/SocialBenefitsOverview'),
)

export const socialBenefitsModule: PortalModule = {
  name: 'Framfærsla',
  enabled: ({ isCompany }) => !isCompany,
  routes: ({ userInfo }) => [
    {
      name: m.socialInsuranceMaintenance,
      path: SocialBenefitsPaths.SocialBenefitsRoot,
      enabled: true,
      element: <SocialBenefitsOverview />,
    },
    ...socialInsuranceRoutes(userInfo),
    ...socialInsuranceLegacyRedirects(userInfo),
    ...unemploymentBenefitsRoutes(userInfo),
    ...activationAllowanceRoutes(userInfo),
  ],
}
