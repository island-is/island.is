import { PortalModule } from '@island.is/portals/core'
import { lazy } from 'react'
import { m } from './lib/messages'
import { SocialBenefitsPaths } from './lib/paths'
import { socialInsuranceRoutes } from './lib/routes/socialInsuranceRoutes'
import { socialInsuranceLegacyRedirects } from './lib/routes/socialInsuranceLegacyRedirects'
import { unemploymentBenefitsRoutes } from './lib/routes/unemploymentBenefitRoutes'

const SocialBenefitsOverview = lazy(() =>
  import('./screens/SocialBenefitsOverview/SocialBenefitsOverview'),
)

export const socialBenefitsModule: PortalModule = {
  name: 'Framfærsla',
  enabled: ({ isCompany }) => !isCompany,
  routes: ({ userInfo }) => [
    {
      name: m.maintenance,
      path: SocialBenefitsPaths.SocialBenefitsRoot,
      enabled: true,
      element: <SocialBenefitsOverview />,
    },
    ...socialInsuranceRoutes(userInfo),
    ...socialInsuranceLegacyRedirects(userInfo),
    ...unemploymentBenefitsRoutes(userInfo),
  ],
}
