import { PortalRoute } from '@island.is/portals/core'
import { ApiScope } from '@island.is/auth/scopes'
import { lazy } from 'react'
import { Navigate } from 'react-router-dom'
import { BffUser } from '@island.is/shared/types'
import { m, sharedMessages } from '../messages'
import { UnemploymentBenefitsPaths } from '../paths'
import Status from '../../screens/unemployment-benefits/Status/Status'

export const unemploymentBenefitsRoutes = (
  userInfo: BffUser,
): PortalRoute[] => [
  // Section redirect: /framfaersla/almannatryggingar → /framfaersla/almannatryggingar/greidsluaetlun
  {
    name: m.maintenance,
    path: UnemploymentBenefitsPaths.Root,
    enabled: true, // TODO ADD SCOPE !
    //key: 'SocialInsurance', // TODO Create feature flag!
    element: (
      // TODO Redirect to status for now, until its decided how the overview looks
      <Navigate to={UnemploymentBenefitsPaths.Status} replace />
    ),
  },
  {
    name: sharedMessages.myStatus,
    path: UnemploymentBenefitsPaths.Status,
    enabled: userInfo.scopes.includes(ApiScope.socialInsuranceAdministration),
    //key: 'SocialInsurance',
    element: <Status />,
  },
]
