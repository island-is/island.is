import { PortalRoute } from '@island.is/portals/core'
import { BffUser } from '@island.is/shared/types'
import { m } from '@island.is/portals/my-pages/core'
import { UnemploymentBenefitsPaths } from '../paths'
import Status from '../../screens/unemployment-benefits/Status/Status'
import MyData from '../../screens/unemployment-benefits/MyData/MyData'
import Payments from '../../screens/unemployment-benefits/Payments/Payments'
import { UnemploymentBenefitsRoot } from '../../screens/unemployment-benefits/UnemploymentBenefitsRoot'

export const unemploymentBenefitsRoutes = (
  userInfo: BffUser,
): PortalRoute[] => [
  {
    name: m.socialInsuranceMaintenance,
    key: 'UnemploymentBenefits',
    path: UnemploymentBenefitsPaths.Root,
    enabled: true,
    element: <UnemploymentBenefitsRoot />,
  },
  {
    name: m.myStatus,
    key: 'UnemploymentBenefits',
    path: UnemploymentBenefitsPaths.Status,
    enabled: true,
    dynamic: true,
    element: <Status />,
  },
  {
    name: m.myIncome,
    key: 'UnemploymentBenefits',
    path: UnemploymentBenefitsPaths.Income,
    enabled: true,
    dynamic: true,
    element: <Payments />,
  },
  {
    name: m.myData,
    key: 'UnemploymentBenefits',
    path: UnemploymentBenefitsPaths.MyData,
    enabled: true,
    dynamic: true,
    element: <MyData />,
  },
]
