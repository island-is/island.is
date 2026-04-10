import { PortalRoute } from '@island.is/portals/core'
import { ApiScope } from '@island.is/auth/scopes'
import { lazy } from 'react'
import { BffUser } from '@island.is/shared/types'
import { m, sharedMessages } from '../messages'
import { UnemploymentBenefitsPaths } from '../paths'
import Status from '../../screens/unemployment-benefits/Status/Status'
import { UnemploymentBenefitsRoot } from '../../screens/unemployment-benefits/UnemploymentBenefitsRoot'

export const unemploymentBenefitsRoutes = (
  userInfo: BffUser,
): PortalRoute[] => [
  {
    name: m.maintenance,
    path: UnemploymentBenefitsPaths.Root,
    enabled: true,
    element: <UnemploymentBenefitsRoot />,
  },
  {
    name: sharedMessages.myStatus,
    path: UnemploymentBenefitsPaths.Status,
    enabled: userInfo.scopes.includes(ApiScope.socialInsuranceAdministration),
    dynamic: true,
    element: <Status />,
  },
]
